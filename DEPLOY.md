# Deployment Guide

Bu proje Vercel ve benzeri platformlara deploy edilmek için hazırlanmıştır.

## Frontend (Next.js) - Vercel Deployment

### Adımlar:

1. **GitHub'a push edin:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Vercel'e bağlayın:**
   - [Vercel](https://vercel.com) hesabı oluşturun
   - "New Project" ile GitHub repository'nizi bağlayın
   - Root directory: `.` (proje root'u)
   - Framework: Next.js (otomatik algılanır)

3. **Environment Variables ekleyin:**
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/
   ```

4. **Build ve Deploy:**
   - Vercel otomatik olarak build edecek
   - Her push'ta otomatik deploy olur

## Backend (Express API) - Deployment Seçenekleri

### Seçenek 1: Vercel Serverless Functions (Önerilen)

Vercel, Express uygulamalarını serverless functions olarak çalıştırabilir.

1. **api/ klasörünü Vercel'e ayrı proje olarak deploy edin:**
   - Root directory: `api`
   - Framework: Other
   - Build command: (boş bırakın)
   - Output directory: (boş bırakın)

2. **Environment Variables:**
   ```
   MONGO_DB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   FRONTEND_URL=https://your-frontend-domain.com
   PORT=5000
   NODE_ENV=production
   ```

### Seçenek 2: Railway.app (Önerilen - Daha Kolay)

1. [Railway.app](https://railway.app) hesabı oluşturun
2. "New Project" -> "Deploy from GitHub repo"
3. Repository'yi seçin ve root directory olarak `api` klasörünü belirtin
4. Environment variables'ları ekleyin
5. Deploy otomatik başlar

### Seçenek 3: Render.com

1. [Render.com](https://render.com) hesabı oluşturun
2. "New Web Service" -> GitHub repo seçin
3. Root directory: `api`
4. Build command: `npm install`
5. Start command: `node src/server.js`
6. Environment variables ekleyin

## MongoDB

### MongoDB Atlas (Ücretsiz Tier)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Free tier cluster oluşturun
3. Database Access -> kullanıcı oluşturun
4. Network Access -> IP adresinizi ekleyin (0.0.0.0/0 = tüm IP'ler)
5. Connection string'i alın ve `MONGO_DB_URI` olarak ekleyin

## Environment Variables Özeti

### Frontend (.env veya Vercel):
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/
```

### Backend (.env veya Platform):
```
MONGO_DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/healthcare
JWT_SECRET=your-super-secret-key-change-this
FRONTEND_URL=https://your-frontend-domain.com
PORT=5000
NODE_ENV=production
```

## Önemli Notlar

1. **CORS:** Backend'deki CORS ayarları otomatik olarak `FRONTEND_URL` environment variable'ından alınır.

2. **Console Logs:** Production'da console.log'lar otomatik olarak devre dışı bırakılır (sadece development'ta çalışır).

3. **Error Handling:** Production'da hata mesajları kullanıcıya gösterilirken detaylar gizlenir.

4. **Build:** 
   - Frontend: `npm run build`
   - Backend: Platform'a bağlı (Railway/Render otomatik build eder)

## Test

Deploy sonrası:
- Frontend: `https://your-frontend-domain.com`
- Backend Health Check: `https://your-api-domain.com/health`

