import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicProfile from './pages/PublicProfile';

import './styles/main.css';

export default function App() {
  const [user, setUser] = useState(undefined);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('bridgebio_token');
    const storedUser = localStorage.getItem('bridgebio_user');

    if (!token || !storedUser) {
      setUser(null);
      setUsername('');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUsername(parsedUser.username || '');
    } catch {
      localStorage.removeItem('bridgebio_token');
      localStorage.removeItem('bridgebio_user');
      setUser(null);
      setUsername('');
    }
  }, []);

  return (
    <BrowserRouter>
      <Header
        user={user}
        setUser={setUser}
        setUsername={setUsername}
      />

      <Routes>
        <Route path="/" element={<Home user={user} username={username} />} />
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
