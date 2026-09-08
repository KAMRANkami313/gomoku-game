import { useState } from 'react'
import './styles/app.css'

function App() {
  const [ready] = useState(true)

  return (
    <main className="app">
      <h1 className="app__title">Gomoku</h1>
      <p className="app__subtitle">Five-in-a-Row vs a strategic AI</p>
      <p className="app__status">
        {ready ? 'Batch 1 complete — setup OK.' : 'Loading…'}
      </p>
    </main>
  )
}

export default App