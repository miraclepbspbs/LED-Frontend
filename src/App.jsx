import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './Navigation'
import LightControl from './LightControl'
import PidControl from './PidControl'
import './style.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LightControl />} />
            <Route path="/pid" element={<PidControl />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
