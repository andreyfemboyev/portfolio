import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Repo = {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
}

const username = 'andreyfemboyev'

function App() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([
    "Welcome to andreyfemboyev.dev — type 'help' to explore.",
  ])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
      .then((response) => response.ok ? response.json() : [])
      .then((data: Repo[]) => setRepos(data.filter((repo) => !repo.name.endsWith('.github.io')).slice(0, 6)))
      .finally(() => setLoading(false))
  }, [])

  const runCommand = (event: FormEvent) => {
    event.preventDefault()
    const command = input.trim().toLowerCase()
    if (!command) return

    if (command === 'clear') {
      setHistory([])
    } else {
      const response: Record<string, string> = {
        help: 'Commands: about · projects · skills · github · clear',
        about: 'Curious builder. I create software and experiments, learn in public, and ship on GitHub.',
        projects: 'Showing my latest public repositories below.',
        skills: 'Always learning: JavaScript / TypeScript / React / Git / Linux',
        github: `Opening github.com/${username}…`,
      }

      setHistory((current) => [
        ...current,
        `<span class="prompt-mini">~/${username}</span> $ ${input}`,
        command === 'github'
          ? response.github
          : response[command] ?? `command not found: ${input}. Try 'help'.`,
      ])

      if (command === 'github') {
        window.open(`https://github.com/${username}`, '_blank', 'noopener,noreferrer')
      }
    }
    setInput('')
  }

  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Home">
          <span className="brand-dot" /> /{username}
        </a>
        <div className="nav-links">
          <a href="#projects">projects</a>
          <a href="#about">about</a>
          <a className="github-link" href={`https://github.com/${username}`} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </nav>

      <section className="hero-section" id="top">
        <div className="terminal" onClick={() => inputRef.current?.focus()}>
          <div className="terminal-bar">
            <div className="window-buttons" aria-hidden="true"><i /><i /><i /></div>
            <span>guest@portfolio: ~</span>
            <span className="bar-status">● online</span>
          </div>

          <div className="terminal-body">
            <div className="identity">
              <img src={`https://avatars.githubusercontent.com/${username}`} alt={`${username}'s GitHub avatar`} />
              <div>
                <p className="eyebrow"><span>~/</span>{username}</p>
                <h1>Building things<br /><em>one commit</em> at a time<span className="cursor">_</span></h1>
              </div>
            </div>

            <div className="console-output" aria-live="polite">
              {history.map((line, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </div>

            <form className="command-line" onSubmit={runCommand}>
              <label htmlFor="command"><span>~/{username}</span> $</label>
              <input
                ref={inputRef}
                id="command"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="type 'help'"
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </div>
        </div>
      </section>

      <section className="projects-section" id="projects">
        <header className="section-header">
          <div><span>01</span><h2>Latest projects</h2></div>
          <a href={`https://github.com/${username}?tab=repositories`} target="_blank" rel="noreferrer">View all ↗</a>
        </header>

        {loading ? (
          <div className="repo-grid"><p className="loading">Fetching repositories…</p></div>
        ) : repos.length ? (
          <div className="repo-grid">
            {repos.map((repo, index) => (
              <a className="repo-card" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name}>
                <div className="repo-top"><span>{String(index + 1).padStart(2, '0')}</span><b>↗</b></div>
                <h3>{repo.name}</h3>
                <p>{repo.description || 'No description provided.'}</p>
                <footer>
                  {repo.language && <span><i />{repo.language}</span>}
                  <span>★ {repo.stargazers_count}</span>
                </footer>
              </a>
            ))}
          </div>
        ) : (
          <p className="empty-state">No public repositories found yet. The next commit could be the first.</p>
        )}
      </section>

      <section className="about-section" id="about">
        <header className="section-header">
          <div><span>02</span><h2>About / stack</h2></div>
        </header>
        <div className="about-grid">
          <p className="about-copy">I like turning ideas into useful software, understanding how systems work, and sharing the process through code.</p>
          <div className="stack-list">
            {['JavaScript', 'TypeScript', 'React', 'Git', 'Linux'].map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {username}</span>
        <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">github.com/{username} ↗</a>
      </footer>
    </main>
  )
}

export default App
