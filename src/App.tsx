import './App.css'

const gh = 'https://github.com/andreyfemboyev'
const demo = import.meta.env.BASE_URL + 'media/antios.mp4'
const raftDemo = import.meta.env.BASE_URL + 'media/raftdb.mp4'
const raftTranscript = import.meta.env.BASE_URL + 'media/raftdb-transcript.txt'
const art = 'https://raw.githubusercontent.com/andreyfemboyev/antiOS-Linux/main/screenshots/identity.png'

function App() {
  return (
    <div className="shell" id="top">
      <a className="skip" href="#works">Skip to projects</a>
      <header className="nav">
        <a className="brand" href="#top"><span className="mark" aria-hidden="true">◈</span> andreyfemboyev</a>
        <nav aria-label="Main navigation"><a href="#works">Works</a><a href="#about">About</a><a href={gh}>GitHub ↗</a></nav>
      </header>
      <main>
        <section className="hero">
          <div className="meta"><span>INDEPENDENT DEVELOPMENT</span><span>INDEX / 2026</span></div>
          <h1>Software<br/>beyond <em>utility.</em></h1>
          <div className="hero-bottom"><p>Distributed systems, persistent storage and computational art. Building software to understand its inner workings — and to explore what it can become.</p><a className="button" href="#works">Explore selected works <span>↓</span></a></div>
        </section>
        <section id="works" aria-labelledby="works-title">
          <div className="section-heading"><span>01 — INDEX</span><h2 id="works-title">Selected works</h2><span>04 PROJECTS</span></div>
          <article className="feature art" id="antios">
            <figure><video controls playsInline preload="metadata" poster={art} aria-label="antiOS native simulation demonstration"><source src={demo} type="video/mp4"/><a href={demo}>Download the antiOS demo</a></video><figcaption>FILM 01 / NATIVE SIMULATION — 18 SEC / SILENT</figcaption></figure>
            <div className="feature-copy"><div className="meta"><span>01 / COMPUTATIONAL ART</span><span>RUST</span></div><h3>antiOS</h3><p className="subtitle">An operating system without a purpose.</p><p>Seven digital organisms, six evolving states, synthesized sound and interactive gestures. An autonomous installation and a tool for making generative prints, not a conventional operating system.</p>
            <div className="links"><a className="button" href={gh+'/antiOS-Windows/releases'}>Windows ↓</a><a className="button" href={gh+'/antiOS-Linux/releases'}>Linux ↓</a><a href={gh+'/antiOS-Linux'}>Source ↗</a><a href={demo} download="antios.mp4">MP4 ↓</a></div></div>
          </article>
          <article className="feature database" id="raftdb">
            <div className="feature-copy"><div className="meta"><span>02 / DISTRIBUTED SYSTEMS</span><span>PYTHON</span></div><h3>RaftDB<br/>Extended</h3><p className="subtitle">Consensus meets persistent storage.</p><p>Experimental distributed SQL with Raft, a custom SQL engine, segmented journals, snapshots and recovery. A dependency-free core for learning and research.</p><div className="links"><a className="button" href={gh+'/raftfb_extended'}>Source ↗</a><a href={gh+'/raftfb_extended/blob/main/ARCHITECTURE.md'}>Architecture ↗</a><a href={gh+'/raftfb_extended/tree/main/benchmarks'}>Benchmarks ↗</a><a href={raftDemo} download="raftdb.mp4">MP4 ↓</a><a href={raftTranscript}>Run transcript ↗</a></div></div>
            <figure className="schematic"><svg viewBox="0 0 520 300" role="img" aria-labelledby="diagram-title"><title id="diagram-title">SQL client sends requests to a Raft leader, which replicates its log to two followers</title><g fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M260 63V102M260 162V190H100V219M260 190H420V219" /><rect x="180" y="20" width="160" height="43"/><rect x="170" y="102" width="180" height="60"/><rect x="25" y="219" width="150" height="50"/><rect x="345" y="219" width="150" height="50"/></g><g fill="currentColor" fontSize="13" textAnchor="middle" fontFamily="monospace"><text x="260" y="46">SQL CLIENT</text><text x="260" y="128">RAFT LEADER</text><text x="260" y="146" fontSize="10">LOCAL STATE + LOG</text><text x="100" y="241">FOLLOWER 01</text><text x="100" y="257" fontSize="10">LOCAL STORAGE</text><text x="420" y="241">FOLLOWER 02</text><text x="420" y="257" fontSize="10">LOCAL STORAGE</text></g></svg><figcaption>FIG. 02 / SIMPLIFIED REPLICATION MODEL</figcaption></figure>
          </article>
          <figure className="raft-film">
            <div><div className="meta"><span>FILM 02 / LOCAL CLUSTER EXPERIMENT</span><span>24 SEC / SILENT</span></div><h3>Leader failover</h3><p>Three real replicas. Commit a row, stop the leader, elect a replacement and verify that the query still returns the same rows. This film presents captured command results, not a production availability guarantee.</p><a href={raftTranscript}>Read the actual run transcript ↗</a></div>
            <video controls playsInline preload="metadata" poster={import.meta.env.BASE_URL + 'media/raftdb-cover.svg'} aria-label="RaftDB real local cluster failover demonstration"><source src={raftDemo} type="video/mp4"/><a href={raftDemo}>Download RaftDB demo</a></video>
          </figure>
          <div className="minor-grid">
            <article><div className="meta"><span>03 / STORAGE</span><span>PYTHON</span></div><div className="record" aria-label="Record layout: header, key and value"><span>HEADER<br/><small>21 B</small></span><span>KEY</span><span>VALUE</span></div><h3>Bitcask DB</h3><p>Embedded append-only key-value storage with CRC32, recovery and compaction. Built with the Python standard library.</p><a href={gh+'/bitcask-db'}>Explore source ↗</a></article>
            <article><div className="meta"><span>04 / CONSENSUS</span><span>PYTHON</span></div><div className="record log" aria-label="Replicated log illustration"><span>01</span><span>02</span><span>03</span><span>04</span></div><h3>RaftDB</h3><p>The original, simpler distributed relational database: leader election, durable logs and a replicated SQL state machine.</p><a href={gh+'/raftdb'}>Explore source ↗</a></article>
          </div>
          <p className="note">Database projects are experimental. Consult each repository for limitations, supported environments and verification methods.</p>
        </section>
        <section id="about" className="about" aria-labelledby="about-title"><div className="section-heading"><span>02 — NOTES</span><h2 id="about-title">About</h2><span>OPEN SOURCE</span></div><div className="about-grid"><p className="statement">Understand systems by building them. Treat software as an expressive medium, not only a tool.</p><div><p>I explore the intersection of systems engineering and digital art through independent projects. The source, technical decisions and limitations are available on GitHub.</p><div className="tags"><span>Rust</span><span>Python</span><span>WGSL</span><span>Linux</span><span>Distributed systems</span><span>Creative coding</span></div><a href={gh}>View GitHub profile ↗</a></div></div></section>
      </main>
      <footer><span>ANDREYFEMBOYEV / PROJECT INDEX</span><a href="#top">Back to top ↑</a><a href={gh+'?tab=repositories'}>All repositories ↗</a></footer>
    </div>
  )
}
export default App
