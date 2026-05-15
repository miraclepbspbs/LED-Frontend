import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          🔆 小灯控制
        </Link>
        <Link 
          to="/pid" 
          className={`nav-link ${location.pathname === '/pid' ? 'active' : ''}`}
        >
          ⚙️ PID参数
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
