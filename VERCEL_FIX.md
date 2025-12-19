# Vercel Build Hatası Çözümü

Vercel build sırasında `react-simple-maps` ile React 19 arasındaki peer dependency hatası alıyorsunuz.

## ✅ Kod Tarafında Yapılanlar

1. `.npmrc` dosyası eklendi (`legacy-peer-deps=true`)
2. `vercel.json` dosyasına `installCommand` eklendi
3. `package.json`'a `overrides` eklendi

## 🔧 Vercel Dashboard'da Yapılması Gerekenler

Vercel bazen `vercel.json`'daki ayarları görmezden gelebilir. Aşağıdaki adımları izleyin:

1. **Vercel Dashboard'a gidin**: https://vercel.com/dashboard
2. **Projenizi seçin**
3. **Settings** sekmesine tıklayın
4. **General** → **Build & Development Settings** bölümüne gidin
5. **Install Command** alanını bulun
6. Şu komutu yazın: `npm install --legacy-peer-deps`
7. **Save** butonuna tıklayın
8. Yeni bir **Redeploy** yapın

## Alternatif Çözüm: React 18'e Düşürmek

Eğer React 19'un özelliklerine ihtiyacınız yoksa, React'i 18.2.0'a düşürebilirsiniz:

```bash
npm install react@18.2.0 react-dom@18.2.0
```

Bu, en stabil çözüm olacaktır çünkü `react-simple-maps` React 18'i destekliyor.

