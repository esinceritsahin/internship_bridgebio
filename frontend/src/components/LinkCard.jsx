import { useState } from 'react';
import { shortenUrl } from '../interfaces';

/**
 * Tek bir linki gösteren kart bileşeni.
 * Düzenleme ve silme işlemlerini üst bileşene iletir.
 */
export default function LinkCard({ link, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: link.title,
    url: link.url,
    note: link.note || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSave = async () => {
    if (!form.url.trim()) {
      setError('URL zorunludur.');
      return;
    }

    setSaving(true);
    const success = await onUpdate(link.id, {
      title: form.title.trim() || shortenUrl(form.url),
      url: form.url.trim(),
      note: form.note.trim() || null,
    });
    setSaving(false);

    if (success) setEditing(false);
    else setError('Güncelleme başarısız.');
  };

  return (
    <article className="link-card">
      {editing ? (
        /* ── Düzenleme Modu ── */
        <div className="link-card__edit-form">
          {error && (
            <div className="auth-message auth-message--error">{error}</div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Başlık</label>
              <input
                className="form-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Başlık"
              />
            </div>
            <div className="form-group">
              <label className="form-label">URL</label>
              <input
                className="form-input"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Not</label>
            <input
              className="form-input"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Opsiyonel not"
            />
          </div>

          <div className="link-card__actions">
            <button
              className="link-card__save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              className="link-card__cancel-btn"
              onClick={() => {
                setEditing(false);
                setError('');
                setForm({
                  title: link.title,
                  url: link.url,
                  note: link.note || '',
                });
              }}
            >
              İptal
            </button>
          </div>
        </div>
      ) : (
        /* ── Görüntüleme Modu ── */
        <>
          <div className="link-card__content">
            <h3 className="link-card__title">{link.title}</h3>
            <p className="link-card__url">{shortenUrl(link.url)}</p>
            {link.note && (
              <p className="link-card__note">{link.note}</p>
            )}
          </div>

          <div className="link-card__actions">
            <a
              className="link-card__open-btn"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              Git
            </a>
            <button
              className="link-card__edit-btn"
              onClick={() => setEditing(true)}
            >
              Düzenle
            </button>
            <button
              className="link-card__delete-btn"
              onClick={() => onDelete(link.id)}
            >
              Sil
            </button>
          </div>
        </>
      )}
    </article>
  );
}
