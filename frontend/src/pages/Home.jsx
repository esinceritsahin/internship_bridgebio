import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkCard from '../components/LinkCard';
import {
  API_URL,
  EMPTY_LINK_FORM,
  getSession,
  clearSession,
  shortenUrl,
  normalizeUrl,
} from '../interfaces';
import '../styles/main.css';

export default function Home({ user, username }) {
  const navigate = useNavigate();

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_LINK_FORM);

  /* ── Oturum yoksa login'e yönlendir ── */
  const logout = () => {
    clearSession();
    navigate('/login');
  };

  /* ── Linkleri yükle ── */
  const loadLinks = async () => {
    const { token } = getSession();
    if (!token) { logout(); return; }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/links`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) { logout(); return; }
      if (!res.ok) { setError(data.message || 'Linkler getirilemedi.'); return; }
      setLinks(data.links || []);
    } catch {
      setError('Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user === null) { navigate('/login'); return; }
    if (user) loadLinks();
  }, [user]);

  /* ── Form değişimi ── */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  /* ── Link Ekle ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { token } = getSession();
    if (!token) { logout(); return; }

    if (!form.url.trim()) { setError('URL alanı zorunludur.'); return; }

    const cleanUrl = normalizeUrl(form.url);
    if (!cleanUrl) { setError('Geçerli bir URL giriniz.'); return; }

    const newLink = {
      url: cleanUrl,
      title: form.title.trim() || shortenUrl(cleanUrl),
      note: form.note.trim() || null,
    };

    try {
      setAdding(true);
      const res = await fetch(`${API_URL}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLink),
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) { logout(); return; }
      if (!res.ok) { setError(data.message || 'Link eklenemedi.'); return; }
      setForm(EMPTY_LINK_FORM);
      setLinks([data.link, ...links]);
    } catch {
      setError('Sunucuya bağlanılamadı.');
    } finally {
      setAdding(false);
    }
  };

  /* ── Link Güncelle ── */
  const handleUpdate = async (id, updated) => {
    const { token } = getSession();
    if (!token) { logout(); return false; }

    try {
      const res = await fetch(`${API_URL}/links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });
      if (res.status === 401 || res.status === 403) { logout(); return false; }
      if (!res.ok) return false;

      const data = await res.json();
      setLinks(links.map((l) => (l.id === id ? data.link : l)));
      return true;
    } catch {
      return false;
    }
  };

  /* ── Link Sil ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Bu linki silmek istiyor musun?')) return;

    const { token } = getSession();
    if (!token) { logout(); return; }

    try {
      const res = await fetch(`${API_URL}/links/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      if (!res.ok) { setError('Link silinemedi.'); return; }
      setLinks(links.filter((l) => l.id !== id));
    } catch {
      setError('Sunucuya bağlanılamadı.');
    }
  };

  /* ── Yükleniyor ── */
  if (user === undefined) {
    return (
      <main className="page-loading page-wrapper">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="home-page page-wrapper">
      <div className="container">

        {/* Hoşgeldin Başlığı */}
        <section className="home-hero">
          <p className="home-hero__greeting">
            Merhaba, <strong>{username || 'Kullanıcı'}</strong>
          </p>
          {username && (
            <p className="home-hero__public-link">
              🔗{' '}
              <a href={`/u/${username}`}>
                bridgebio-frontend.onrender.com/u/{username}
              </a>
            </p>
          )}
        </section>

        {/* Link Ekle Formu */}
        <section className="add-link-card">
          <h2 className="add-link-card__title">Yeni Link Ekle</h2>

          {error && (
            <div className="auth-message auth-message--error">{error}</div>
          )}

          <form className="add-link-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Link Adresi</label>
                <input
                  className="form-input"
                  type="text"
                  name="url"
                  placeholder="https://example.com"
                  value={form.url}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Başlık</label>
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  placeholder="Başlık girin"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Not (Opsiyonel)</label>
                <input
                  className="form-input"
                  type="text"
                  name="note"
                  placeholder="Kısa bir not..."
                  value={form.note}
                  onChange={handleChange}
                />
              </div>
              <button className="add-link-btn" type="submit" disabled={adding}>
                {adding ? 'Ekleniyor...' : 'Link Ekle'}
              </button>
            </div>
          </form>
        </section>

        {/* Link Listesi */}
        <section className="links-section">
          <div className="links-section__header">
            <h2 className="section-title">
              Linklerim{' '}
              {links.length > 0 && (
                <span className="links-count">({links.length})</span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="page-loading">
              <div className="spinner"></div>
              <p>Linkler yükleniyor...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="empty-state">
              <p>Henüz link eklemediniz.</p>
            </div>
          ) : (
            <div className="links-grid">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
