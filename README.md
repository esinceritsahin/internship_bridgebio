# BridgeBio - Web Geliştirme Javascript Projesi

Bu proje, "Web Geliştirme Javascript Projesi" eğitim programı çerçevesinde, modern web dünyası standartlarına uygun olarak geliştirilmiş tam kapsamlı bir Link Yönetim (CRUD) uygulamasıdır. Kullanıcıların kendi linklerini ekleyebildiği, listeleyebildiği, düzenleyebildiği ve silebildiği dinamik bir altyapıya sahiptir.

## 📸 Proje Ekran Görüntüsü
![BridgeBio Ekran Görüntüsü](./screenshot.png)

## 🛠️ Kullanılan Teknolojiler & İsterler Tablosu
Proje, belirtilen ödev yönergesine **%100 uyumlu** olarak hazırlanmıştır:

- **Seçilen Modern Javascript Kütüphanesi:** **ReactJS** kullanılarak SPA (Single Page Application) yapısında geliştirildi.
- **Tasarım & Stil:** Hazır kütüphaneler (Tailwind/Bootstrap vb.) yerine, tasarım hakimiyetini göstermek amacıyla tamamen özelleştirilmiş **Pure CSS** (`main.css`) kullanılarak modern bir arayüz kodlandı.
- **Dosya Ağacı Yapısı:** İstenilen standartlara uygun olarak `frontend/src/` dizini altında `components/`, `pages/` ve `interfaces/` klasörleri özenle kurgulandı.
- **Yayınlama (Deployment):** Netlify muadili olan ve modern projelerde sıkça tercih edilen **Render** kullanılarak proje başarıyla canlı ortama taşındı.

## ⚙️ Temel İşlevler (CRUD Operasyonları)
Eğitimde işlenen "TODO App" mantığı baz alınarak çok daha gelişmiş ve işlevsel bir arayüzle aşağıdaki tüm işlemler eksiksiz tamamlanmıştır:
1. **Ekle İşlemi (Create):** Kullanıcılar URL, Başlık ve Opsiyonel Not girerek sisteme yeni link kartları ekleyebilir.
2. **Listeleme İşlemi (Read):** Eklenen tüm linkler, anında React State (durum) yönetimi ile ekranda modern kartlar halinde listelenir.
3. **Güncelleme İşlemi (Update):** "Düzenle" butonuna tıklandığında link kartı otomatik bir forma dönüşür ve değişiklikler anında kaydedilerek arayüze yansıtılır.
4. **Silme İşlemi (Delete):** Kullanıcılar istemedikleri bağlantıları tek tuşla (onay penceresi eşliğinde) silebilir.

## 📂 Proje Yapısı (Özet)
```text
frontend/src/
├── components/   # Tekrar kullanılabilir arayüz parçaları (Header, Footer, LinkCard)
├── pages/        # Uygulamanın tam ekran sayfaları (Home, Login, Register, vb.)
├── interfaces/   # Veri yapıları, dışa aktarılan sabitler ve ortak fonksiyonlar
├── styles/       # Tüm uygulamanın stil dosyası (main.css)
└── App.jsx       # Ana yönlendirme (React Router) yapısı
```

*Bu proje, Javascript temelleri, ReactJS konseptleri (useState, useEffect, props) ve API iletişimi kullanılarak sıfırdan inşa edilmiştir.*
