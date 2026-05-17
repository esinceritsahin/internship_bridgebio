import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL, shortenUrl } from '../interfaces';
import '../styles/main.css';

export default function PublicProfile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPublicProfile() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/links/public/${username}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Sayfa bulunamadı.');
          return;
        }

        setProfile(data.user);
        setLinks(data.links || []);
      } catch {
        setError('Sunucuya bağlanılamadı.');
      } finally {
        setLoading(false);
      }
    }

    loadPublicProfile();
  }, [username]);

  if (loading) {
    return (
      <main className="page-loading page-wrapper">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-page page-wrapper">
        <div className="container">
          <section className="home-hero">
            <h1 className="home-hero__title">Sayfa bulunamadı</h1>
            <p className="home-hero__text">{error}</p>
            <Link to="/" className="auth-submit-btn">Ana sayfaya dön</Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="home-page page-wrapper">
      <div className="container">
        <section className="home-hero">
          <h1 className="home-hero__title">@{profile.username}</h1>
        </section>

        <section className="links-section">
          <div className="links-section__header">
            <h2 className="links-section__title">Linkler</h2>
          </div>

          {links.length === 0 ? (
            <div className="empty-state">
              <p>Bu kullanıcının henüz linki yok.</p>
            </div>
          ) : (
            <div className="links-grid">
              {links.map((link) => (
                <article className="link-card" key={link.id}>
                  <div className="link-card__content">
                    <h3 className="link-card__title">{link.title}</h3>
                    <p className="link-card__url">{shortenUrl(link.url)}</p>
                    {link.note && (
                      <p className="link-card__note">{link.note}</p>
                    )}
                  </div>
                  <a
                    className="link-card__open-btn"
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Linke Git
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
