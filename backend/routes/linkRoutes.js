const express = require('express');
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/* ── Herkese Açık Profil ── */
router.get('/public/:username', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', username)
      .maybeSingle();

    if (userError) {
      console.log(userError);
      return res.status(500).json({ message: 'Kullanıcı aranırken hata oluştu.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, title, url, note, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (linksError) {
      console.log(linksError);
      return res.status(500).json({ message: 'Linkler getirilemedi.' });
    }

    return res.json({ user: { username: user.username }, links });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

/* ── Tüm Linkleri Getir (auth) ── */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Linkler getirilemedi.' });
    }

    return res.json({ links });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

/* ── Link Ekle (auth) ── */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, url, note } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL zorunludur.' });
    }

    const { data: link, error } = await supabase
      .from('links')
      .insert({
        user_id: req.user.id,
        title: title || url,
        url,
        note: note || null,
      })
      .select('*')
      .single();

    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Link eklenemedi.' });
    }

    return res.status(201).json({ message: 'Link eklendi.', link });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

/* ── Link Güncelle (auth) ── */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, note } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL zorunludur.' });
    }

    const { data: link, error } = await supabase
      .from('links')
      .update({
        title: title || url,
        url,
        note: note || null,
      })
      .eq('id', id)
      .eq('user_id', req.user.id) // sadece kendi linki güncellenebilir
      .select('*')
      .single();

    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Link güncellenemedi.' });
    }

    if (!link) {
      return res.status(404).json({ message: 'Link bulunamadı.' });
    }

    return res.json({ message: 'Link güncellendi.', link });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

/* ── Link Sil (auth) ── */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Link silinemedi.' });
    }

    return res.json({ message: 'Link silindi.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

module.exports = router;
