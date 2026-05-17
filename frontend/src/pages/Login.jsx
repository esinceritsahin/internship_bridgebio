import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../interfaces';
import '../styles/main.css';

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Kullanıcı adı ve şifre zorunludur.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Giriş başarısız.');
        return;
      }

      localStorage.setItem('bridgebio_token', data.token);
      localStorage.setItem('bridgebio_user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload();
    } catch {
      setError('Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page page-wrapper">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">🌉</div>
          <h1 className="auth-card__title">Giriş Yap</h1>
        </div>

        {error && (
          <div className="auth-message auth-message--error">{error}</div>
        )}

        <form className="auth-form" onSubmit={login}>
          <div className="form-group">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              className="form-input"
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              className="form-input"
              type="password"
              placeholder="Şifreni gir"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />
          </div>

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="auth-switch">
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </div>
    </main>
  );
}
