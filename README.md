# Healthcare Platform - Sağlık Platformu

Modern sağlık yönetim platformu - SDG 3 Sağlık & Kaliteli Yaşam odaklı

## 🚀 Teknolojiler

### Frontend
- **Next.js 16** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - Data visualization
- **Shadcn UI** - UI components
- **React Simple Maps** - Türkiye haritası görselleştirme

### Backend
- **Node.js & Express** - RESTful API
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **OpenAI API** - AI risk analysis
- **Nodemailer** - Email service

## 📁 Proje Yapısı

```
├── src/                    # Frontend (Next.js)
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities
├── api/                   # Backend (Express)
│   └── src/
│       ├── controllers/  # Route controllers
│       ├── models/       # MongoDB models
│       ├── routes/       # API routes
│       └── server.js     # Express server
└── public/               # Static files
```

## 🔧 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB (local veya Atlas)
- npm veya yarn

### Local Development

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/KULLANICI_ADI/REPO_ADI.git
cd web_proje
```

2. **Frontend dependencies:**
```bash
npm install
```

3. **Backend dependencies:**
```bash
cd api
npm install
cd ..
```

4. **Environment variables:**

Frontend için `.env.local` oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/
```

Backend için `api/.env` oluşturun:
```env
MONGO_DB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

5. **MongoDB'yi başlatın:**
```bash
# MongoDB local ise
mongod

# Veya MongoDB Atlas kullanın
```

6. **Backend'i başlatın:**
```bash
cd api
npm start
```

7. **Frontend'i başlatın:**
```bash
npm run dev
```

8. **Tarayıcıda açın:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📊 Özellikler

- ✅ Kullanıcı authentication (JWT)
- ✅ Hasta dashboard'u
- ✅ Ölçüm kayıtları (tansiyon, kan şekeri, nabız, vb.)
- ✅ Tanı kayıtları
- ✅ AI destekli risk analizi
- ✅ Türkiye haritası üzerinde istatistikler
- ✅ Responsive design
- ✅ Dark mode desteği

## 🧪 Test Verisi Oluşturma

Dummy data oluşturmak için:

```bash
cd api
node src/scripts/createUserAndSeedData.js
```

**Test Hesabı:**
- Email: `test@hasta.com`
- Şifre: `12345678`

## 📝 Deployment

Detaylı deployment kılavuzu için `GITHUB_DEPLOY.md` dosyasına bakın.

### Hızlı Özet:
1. Frontend → Vercel
2. Backend → Railway.app (önerilen) veya Render.com
3. Database → MongoDB Atlas

## 🔐 Güvenlik

- Passwords bcrypt ile hash'lenir
- JWT token authentication
- CORS yapılandırması
- Environment variables ile secret yönetimi

## 📄 Lisans

Bu proje eğitim amaçlıdır.

## 👥 Katkıda Bulunanlar

- Proje geliştirme ekibi

## 📞 İletişim

Sorularınız için issue açabilirsiniz.
