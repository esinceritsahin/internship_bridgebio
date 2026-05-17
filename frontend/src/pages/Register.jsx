import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../interfaces';
import '../styles/main.css';

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessages = () => { setError(''); setSuccess(''); };

  const register = async (e) => {
    e.preventDefault();
    clearMessages();

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password) {
      setError('Kullanıcı adı ve şifre giriniz.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Kayıt başarısız.');
        return;
      }

      setSuccess('Kayıt başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/login'), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page page-wrapper">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">🌉</div>
          <h1 className="auth-card__title">Kayıt Ol</h1>
        </div>

        {error && (
          <div className="auth-message auth-message--error">{error}</div>
        )}
        {success && (
          <div className="auth-message auth-message--success">{success}</div>
        )}

        <form className="auth-form" onSubmit={register}>
          <div className="form-group">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              className="form-input"
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => { setUsername(e.target.value); clearMessages(); }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              className="form-input"
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearMessages(); }}
            />
          </div>

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="auth-switch">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </main>
  );
}
