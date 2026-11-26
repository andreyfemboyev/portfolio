"""Render a film from actual klab CLI results against its synthetic fixture."""
import json, os, pathlib, subprocess, tempfile, textwrap
from PIL import Image, ImageDraw, ImageFont
ROOT=pathlib.Path("kernel-source").resolve()
CLI=ROOT/"target/release/klab"
OUT=pathlib.Path("public/media").resolve()
OUT.mkdir(parents=True,exist_ok=True)
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
def font(n): return ImageFont.truetype(FONT,n)
def run(args,cwd):
    p=subprocess.run([str(CLI),"--json",*map(str,args)],cwd=cwd,capture_output=True,text=True,check=True)
    return json.loads(p.stdout),p.stdout,p.stderr
with tempfile.TemporaryDirectory() as tmp:
    work=pathlib.Path(tmp)
    root=ROOT/"fixtures/kbuild"
    base=["build","--root",root,"--profile",root/"profile.json"]
    stages=[("01 / IMPORT",["workspace","import",root]),("02 / PLAN",base+["--dry-run"]),("03 / BUILD",base+["--trust"]),("04 / INSPECT",["elf","inspect",work/"out/vmlinux"]),("05 / ABI",["abi","compare",ROOT/"fixtures/synthetic/base.symvers",ROOT/"fixtures/synthetic/candidate.symvers"])]
    screens=[]
    transcript=["KERNEL//LAB — actual CLI run on synthetic fixture","Source commit: "+subprocess.check_output(["git","-C",str(ROOT),"rev-parse","HEAD"],text=True).strip()]
    for title,args in stages:
        data,stdout,stderr=run(args,work)
        transcript.extend(["$ klab --json "+" ".join(map(str,args)),stdout,stderr])
        if title.startswith("03"): assert data["build"]["success"]
        if title.startswith("04"): assert isinstance(data["sections"],list)
        if title.startswith("05"): assert data["state"]=="potentially_incompatible"
        def clean(x): return str(x).replace(str(ROOT),".").replace(str(work),"./work")
        if title.startswith("03"):
            data={"success":data["build"]["success"],"artifacts":data["build"]["artifacts"]}
        if title.startswith("04"):
            data={k:v for k,v in data.items() if k not in ("sections","symbols")}
            data["sections_count"]=len(json.loads(stdout)["sections"])
        cmd=clean("klab --json "+" ".join(map(str,args)))
        lines=clean(json.dumps(data,indent=2)).splitlines()
        screens.append((title,cmd,lines))
    (OUT/"kernel-labs-transcript.txt").write_text("\n".join(transcript))
    frames=work/"frames"; frames.mkdir()
    total=24*30
    for i in range(total):
        t=i/24
        im=Image.new("RGB",(1280,720),"#0c1110")
        d=ImageDraw.Draw(im)
        for x in range(0,1280,40): d.line((x,0,x,720),fill="#14201b")
        for y in range(0,720,40): d.line((0,y,1280,y),fill="#14201b")
        accent="#b7f779"; muted="#8caa9c"; white="#ecf4ec"
        d.text((54,35),"KERNEL//LAB   /   FIELD NOTES",font=font(21),fill=accent)
        d.text((970,35),"v0.1.0-alpha",font=font(20),fill=muted)
        d.line((54,76,1226,76),fill="#365044",width=2)
        if t<3 or t>=28:
            d.text((54,210),"KERNEL//LAB",font=font(100),fill=white)
            d.text((60,340),"BUILD BENEATH ANDROID.",font=font(38),fill=accent)
            d.text((60,425),"Offline-first kernel engineering workbench",font=font(25),fill=muted)
            d.text((60,470),"Rust CLI / Tauri desktop / MIT",font=font(25),fill=muted)
        else:
            idx=min(4,int((t-3)/5)); local=(t-3)%5
            title,cmd,lines=screens[idx]
            d.text((54,102),title,font=font(42),fill=white)
            d.rounded_rectangle((54,172,1226,625),radius=12,fill="#101a16",outline="#365044",width=2)
            d.text((76,190),"●  ●  ●   REAL CLI OUTPUT / SYNTHETIC FIXTURE",font=font(17),fill=accent)
            wrapped=textwrap.wrap("$ "+cmd,86)
            y=231
            for line in wrapped:
                d.text((76,y),line,font=font(21),fill=white); y+=28
            y+=12
            flat=[piece for line in lines for piece in (textwrap.wrap(line,96,replace_whitespace=False,drop_whitespace=False) or [""])]
            visible=min(len(flat),max(1,int(local*11)))
            limit=max(1,(590-y)//23)
            for line in flat[max(0,visible-limit):visible]:
                d.text((76,y),line,font=font(19),fill=accent if "true" in line or "potentially_incompatible" in line else muted);y+=23
        d.text((54,651),"REAL TEST FIXTURE / NOT A FULL ANDROID BUILD",font=font(17),fill=muted)
        d.rectangle((54,690,1226,695),fill="#25372d")
        d.rectangle((54,690,54+int(1172*(i+1)/total),695),fill=accent)
        im.save(frames/f"{i:04d}.png")
    subprocess.run(["ffmpeg","-y","-framerate","24","-i",str(frames/"%04d.png"),"-c:v","libx264","-pix_fmt","yuv420p","-crf","22","-movflags","+faststart","-an",str(OUT/"kernel-labs.mp4")],check=True)
