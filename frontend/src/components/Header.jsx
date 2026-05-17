import { Link, useNavigate } from 'react-router-dom';
import { clearSession } from '../interfaces';

export default function Header({ user, setUser, setUsername }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setUsername('');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <Link to="/" className="header__logo">
            <div className="header__logo-icon">🌉</div>
            <span className="header__logo-name">
              Bridge<span>Bio</span>
            </span>
          </Link>

          <nav className="header__nav">
            {user && (
              <button className="header__logout-btn" onClick={handleLogout}>
                Çıkış
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
