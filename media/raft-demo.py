"""Record actual local cluster observations; no simulated results."""
import json
import pathlib
import subprocess
import sys
import tempfile
import time
import urllib.request

root = pathlib.Path.cwd()
db = root / "database"
out = root / "demos"
out.mkdir(exist_ok=True)
nodes = ("n1", "n2", "n3")
processes = {}
slides = []

def run(*args):
    return subprocess.check_output([sys.executable, "-m", "raftdb", *args],
                                   cwd=db, text=True, timeout=20).strip()

def statuses():
    result = {}
    for i, node in enumerate(nodes):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{8091+i}/status", timeout=0.8) as response:
                result[node] = json.load(response)
        except OSError:
            continue
    return result

def wait_leader(exclude=None):
    deadline = time.monotonic() + 25
    while time.monotonic() < deadline:
        states = statuses()
        leaders = [n for n, s in states.items() if s.get("role") == "leader" and n != exclude]
        if len(leaders) == 1 and len(states) >= 2:
            return leaders[0], states
        time.sleep(0.25)
    raise RuntimeError("No leader elected")

def compact(states):
    return "\n".join(f"{n}: {s['role']}  term={s['term']}  commit={s['commit_index']}"
                     for n, s in states.items())

def slide(title, body):
    slides.append(f"RAFTDB EXTENDED / LIVE LOCAL RUN\n\n{title}\n\n{body}")

with tempfile.TemporaryDirectory() as data:
    try:
        for n in nodes:
            processes[n] = subprocess.Popen(
                [sys.executable, "-m", "raftdb", "serve", "--node", n,
                 "--data", str(pathlib.Path(data) / n)], cwd=db,
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        leader, states = wait_leader()
        slide("01 / ELECT A LEADER", compact(states))
        run("sql", "CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT)")
        run("sql", "INSERT INTO tasks VALUES (1, 'durable data')")
        before = run("sql", "SELECT * FROM tasks ORDER BY id")
        slide("02 / COMMIT AND QUERY", "SELECT * FROM tasks ORDER BY id\n\n" + before)
        processes[leader].terminate()
        processes[leader].wait(timeout=10)
        new, states = wait_leader(leader)
        slide("03 / STOP THE LEADER", f"Stopped: {leader}\nNew leader: {new}\n\n" + compact(states))
        after = run("sql", "SELECT * FROM tasks ORDER BY id")
        assert json.loads(before)["rows"] == json.loads(after)["rows"], (before, after)
        slide("04 / QUERY AFTER FAILOVER", after + "\n\nVerified: returned rows match.")
    finally:
        for proc in processes.values():
            if proc.poll() is None:
                proc.terminate()
        for proc in processes.values():
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait()

(out / "raftdb-transcript.txt").write_text("\n\n" + "\n\n".join(slides), encoding="utf-8")
with tempfile.TemporaryDirectory() as temp:
    temp = pathlib.Path(temp)
    for i, content in enumerate(slides):
        (temp / f"slide-{i}.txt").write_text(content, encoding="utf-8")
        subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i",
                        "color=c=0x101510:s=1280x720:r=24:d=6",
                        "-vf", f"drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf:textfile={temp}/slide-{i}.txt:expansion=none:fontcolor=0xd5eb9b:fontsize=24:line_spacing=9:x=65:y=55",
                        "-c:v", "libx264", "-pix_fmt", "yuv420p", str(temp / f"slide-{i}.mp4")], check=True)
    (temp / "concat.txt").write_text("".join(f"file 'slide-{i}.mp4'\n" for i in range(len(slides))))
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(temp / "concat.txt"),
                    "-c", "copy", "-movflags", "+faststart", str(out / "raftdb.mp4")], check=True)
