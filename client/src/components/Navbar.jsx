import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-medi">MEDI</span>
        <span className="logo-guide">GUIDE</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/features">Features</Link>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-link">
          Login
        </Link>

        <Link to="/register" className="register-button">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;