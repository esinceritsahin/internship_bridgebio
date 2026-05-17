// ─────────────────────────────────────────────
//  BridgeBio – Interfaces (veri yapıları & sabitler)
// ─────────────────────────────────────────────

/**
 * API Taban URL
 */
export const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * LocalStorage anahtar sabitleri
 */
export const STORAGE_KEYS = {
  TOKEN: 'bridgebio_token',
  USER: 'bridgebio_user',
};

/**
 * Boş link formu — yeni link eklerken başlangıç değerleri
 * @typedef {Object} LinkForm
 * @property {string} url
 * @property {string} title
 * @property {string} note
 */
export const EMPTY_LINK_FORM = {
  url: '',
  title: '',
  note: '',
};

/**
 * Kullanıcı oturumunu localStorage'dan okur.
 * @returns {{ token: string|null, user: Object|null }}
 */
export function getSession() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  try {
    return { token, user: raw ? JSON.parse(raw) : null };
  } catch {
    return { token: null, user: null };
  }
}

/**
 * Oturumu localStorage'dan temizler.
 */
export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * URL'nin sadece hostname kısmını döndürür.
 * @param {string} url
 * @returns {string}
 */
export function shortenUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * URL'ye otomatik https:// ekler ve geçerliliğini doğrular.
 * Geçersizse null döner.
 * @param {string} raw
 * @returns {string|null}
 */
export function normalizeUrl(raw) {
  let url = raw.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}
