const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı ve şifre zorunludur.' });
    }

    const cleanUsername = username.trim().toLowerCase();



    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (existingError) {
      return res.status(500).json({ message: 'Kullanıcı kontrol edilirken hata oluştu.' });
    }

    if (existingUser) {
      return res.status(409).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username: cleanUsername,
        password_hash: passwordHash,
      })
      .select('id, username')
      .single();

    if (insertError) {
      console.log(insertError);
      return res.status(500).json({ message: 'Kullanıcı oluşturulamadı.' });
    }

    return res.status(201).json({
      message: 'Kayıt başarılı.',
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı ve şifre zorunludur.' });
    }

    const cleanUsername = username.trim().toLowerCase();

    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, password_hash')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.json({
      message: 'Giriş başarılı.',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

module.exports = router;