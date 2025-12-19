# GitHub ve Vercel Deployment Kılavuzu

Bu kılavuz projenizi GitHub'a pushlayıp Vercel'e deploy etmek için gerekli adımları içerir.

## ⚠️ ÖNEMLİ NOTLAR

**Backend ve Frontend'i ayrı deploy etmeniz önerilir:**
- **Frontend (Next.js)**: Vercel'e deploy
- **Backend (Express API)**: Railway.app veya Render.com'a deploy (ücretsiz ve daha kolay)

### Neden Ayrı?
- Vercel Express uygulamalarını serverless functions olarak çalıştırır, bu bazı limitasyonlara sahip olabilir
- Railway/Render Express uygulamaları için daha uygun
- Ayrı deploy daha esnek ve bakımı kolay

---

## 📦 GitHub'a Push Adımları

### 1. Git Repository Oluşturma

```bash
# Eğer git repository yoksa
git init
git add .
git commit -m "Initial commit: Healthcare platform with backend and frontend"
```

### 2. GitHub'da Repository Oluşturma

1. [GitHub](https://github.com) hesabınıza giriş yapın
2. "New repository" butonuna tıklayın
3. Repository adını girin (örn: `healthcare-platform`)
4. Public veya Private seçin
5. "Create repository" butonuna tıklayın

### 3. Local Repository'yi GitHub'a Bağlama

```bash
# GitHub'dan aldığınız repository URL'ini kullanın
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git branch -M main
git push -u origin main
```

---

## 🚀 Frontend'i Vercel'e Deploy Etme

### 1. Vercel Hesabı ve Proje Oluşturma

1. [Vercel](https://vercel.com) hesabı oluşturun (GitHub ile giriş yapabilirsiniz)
2. Dashboard'dan "Add New Project" seçin
3. GitHub repository'nizi seçin
4. Project Settings:
   - **Framework Preset**: Next.js (otomatik algılanır)
   - **Root Directory**: `.` (proje root'u)
   - **Build Command**: `npm run build` (otomatik)
   - **Output Directory**: `.next` (otomatik)

### 2. Environment Variables Ekleme

Vercel dashboard'da Settings > Environment Variables'a gidin ve şunları ekleyin:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/
```

⚠️ **ÖNEMLİ**: Backend URL'ini backend'i deploy ettikten sonra güncellemelisiniz!

### 3. Deploy

"Deploy" butonuna tıklayın. Vercel otomatik olarak:
- Dependencies'leri yükleyecek
- Next.js build yapacak
- Production'a deploy edecek

---

## 🔧 Backend'i Deploy Etme (Railway.app - ÖNERİLEN)

### 1. Railway Hesabı Oluşturma

1. [Railway.app](https://railway.app) hesabı oluşturun (GitHub ile giriş yapabilirsiniz)
2. "New Project" > "Deploy from GitHub repo" seçin
3. GitHub repository'nizi seçin

### 2. Project Ayarları

1. Repository seçildikten sonra, "Configure Service" tıklayın
2. **Root Directory**: `api` klasörünü seçin
3. **Build Command**: Boş bırakın (otomatik algılanır)
4. **Start Command**: `node src/server.js`

### 3. Environment Variables

Railway dashboard'da "Variables" sekmesine gidin ve ekleyin:

```
MONGO_DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/healthcare
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://your-frontend-vercel-url.vercel.app
NODE_ENV=production
PORT=5000
```

### 4. Domain ve URL

Railway otomatik olarak bir domain verir (örn: `your-app.railway.app`)
Bu URL'yi kopyalayın ve Vercel'deki `NEXT_PUBLIC_API_URL` environment variable'ını güncelleyin.

---

## 🗄️ MongoDB Atlas Kurulumu

### 1. MongoDB Atlas Hesabı

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun (ücretsiz)
2. "Build a Database" seçin
3. Free tier (M0) seçin
4. Region seçin (örn: Europe - Frankfurt)

### 2. Database Access

1. "Database Access" menüsüne gidin
2. "Add New Database User" tıklayın
3. Username ve Password belirleyin
4. Database User Privileges: "Atlas admin" seçin
5. "Add User" tıklayın

### 3. Network Access

1. "Network Access" menüsüne gidin
2. "Add IP Address" tıklayın
3. "Allow Access from Anywhere" seçin (0.0.0.0/0) veya Railway IP'lerini ekleyin
4. "Confirm" tıklayın

### 4. Connection String

1. "Database" menüsüne dönün
2. "Connect" butonuna tıklayın
3. "Connect your application" seçin
4. Connection string'i kopyalayın
5. `<password>` kısmını kendi şifrenizle değiştirin
6. Bu string'i Railway environment variable'ına `MONGO_DB_URI` olarak ekleyin

Örnek:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthcare?retryWrites=true&w=majority
```

---

## 🔄 Deployment Sonrası

### 1. Backend URL'ini Güncelleme

Backend deploy edildikten sonra:
1. Railway'den backend URL'ini alın
2. Vercel dashboard'a gidin
3. Settings > Environment Variables
4. `NEXT_PUBLIC_API_URL` değerini backend URL'i ile güncelleyin
5. "Redeploy" yapın

### 2. CORS Ayarları

Backend'deki CORS ayarları otomatik olarak `FRONTEND_URL` environment variable'ından alınacak.

### 3. Test Etme

1. Frontend URL'ine gidin
2. Login sayfasını test edin
3. Backend API'lerinin çalıştığını kontrol edin

---

## 🎯 Hızlı Özet

1. ✅ GitHub'a push yapın
2. ✅ Vercel'de frontend deploy edin (geçici API URL ile)
3. ✅ Railway'de backend deploy edin
4. ✅ MongoDB Atlas kurulumu yapın
5. ✅ Backend URL'ini Vercel'e ekleyin/güncelleyin
6. ✅ Redeploy yapın
7. ✅ Test edin

---

## 🆘 Sorun Giderme

### Backend bağlantı hatası
- MongoDB Atlas'ta IP whitelist kontrolü yapın
- Railway environment variables'ları kontrol edin
- Backend loglarını Railway dashboard'dan kontrol edin

### Frontend build hatası
- Vercel build loglarını kontrol edin
- Environment variables'ları kontrol edin
- `npm run build` komutunu local'de test edin

### CORS hatası
- Backend'deki `FRONTEND_URL` environment variable'ını kontrol edin
- Frontend URL'inin doğru olduğundan emin olun

---

## 📝 Alternatif: Backend'i Vercel'e Deploy Etme

Eğer backend'i de Vercel'e deploy etmek isterseniz:

1. Vercel'de **ayrı bir proje** oluşturun
2. Root directory: `api`
3. Framework: Other
4. Build command: (boş)
5. Output directory: (boş)

Ancak bu yöntem serverless functions limitasyonlarına sahip olabilir, bu yüzden Railway önerilir.

