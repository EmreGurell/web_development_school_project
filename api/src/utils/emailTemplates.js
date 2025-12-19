/**
 * Profesyonel HTML email template'leri
 */

exports.getPatientWelcomeEmailTemplate = ({ name, surname, email, password, frontendUrl }) => {
    const logoUrl = `${frontendUrl}/logo.png`;
    
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medicare Sağlık Sistemi - Hoş Geldiniz</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .logo {
            max-width: 80px;
            height: auto;
            margin-bottom: 15px;
            background-color: white;
            border-radius: 12px;
            padding: 8px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .credentials-box {
            background-color: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 25px;
            margin: 30px 0;
            border-radius: 6px;
        }
        .credentials-box h2 {
            color: #2d3748;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        .credentials-box h2::before {
            content: "🔑";
            margin-right: 10px;
            font-size: 20px;
        }
        .credential-item {
            margin-bottom: 15px;
            padding: 12px;
            background-color: #ffffff;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .credential-label {
            font-size: 13px;
            color: #718096;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .credential-value {
            font-size: 16px;
            color: #2d3748;
            font-weight: 600;
            font-family: 'Courier New', monospace;
            word-break: break-all;
        }
        .warning-box {
            background-color: #fff5f5;
            border-left: 4px solid #f56565;
            padding: 20px;
            margin: 30px 0;
            border-radius: 6px;
        }
        .warning-box p {
            color: #c53030;
            font-size: 15px;
            font-weight: 500;
            margin: 0;
            display: flex;
            align-items: flex-start;
        }
        .warning-box p::before {
            content: "⚠️";
            margin-right: 10px;
            font-size: 18px;
        }
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 35px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.35);
        }
        .links-section {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
        }
        .links-title {
            font-size: 15px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        }
        .link-item {
            margin-bottom: 12px;
            padding: 12px;
            background-color: #f7fafc;
            border-radius: 6px;
        }
        .link-item a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            font-size: 15px;
        }
        .link-item a:hover {
            text-decoration: underline;
        }
        .footer {
            background-color: #2d3748;
            color: #cbd5e0;
            padding: 30px 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
        }
        .footer p {
            margin: 8px 0;
        }
        .footer a {
            color: #90cdf4;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .header {
                padding: 30px 15px;
            }
            .header h1 {
                font-size: 24px;
            }
            .credentials-box {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <img src="${logoUrl}" alt="Medicare Logo" class="logo" onerror="this.style.display='none'">
            <h1>MEDICARE</h1>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Merhaba ${name} ${surname},
            </div>
            
            <div class="message">
                Sağlık sistemi hesabınız doktorunuz tarafından başarıyla oluşturuldu. 
                Artık sağlık verilerinizi görüntüleyebilir, ölçümlerinizi takip edebilir ve 
                risk raporlarınıza erişebilirsiniz.
            </div>
            
            <!-- Giriş Bilgileri -->
            <div class="credentials-box">
                <h2>Giriş Bilgileriniz</h2>
                <div class="credential-item">
                    <div class="credential-label">E-posta Adresiniz</div>
                    <div class="credential-value">${email}</div>
                </div>
                <div class="credential-item">
                    <div class="credential-label">Geçici Şifreniz</div>
                    <div class="credential-value">${password}</div>
                </div>
            </div>
            
            <!-- Güvenlik Uyarısı -->
            <div class="warning-box">
                <p>
                    Güvenliğiniz için lütfen ilk girişinizde mutlaka şifrenizi değiştirin.
                </p>
            </div>
            
            <!-- Buton -->
            <div class="button-container">
                <a href="${frontendUrl}/login" class="button">Hesabıma Giriş Yap</a>
            </div>
            
            <!-- Linkler -->
            <div class="links-section">
                <div class="links-title">Hızlı Erişim</div>
                <div class="link-item">
                    <a href="${frontendUrl}/login">🔐 Giriş Yap</a>
                </div>
                <div class="link-item">
                    <a href="${frontendUrl}/reset-password">🔒 Şifremi Değiştir</a>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>Medicare Sağlık Yönetim Sistemi</strong></p>
            <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
            <p>
                Sorularınız için: 
                <a href="mailto:destek@medicare.com">destek@medicare.com</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px; color: #718096;">
                © ${new Date().getFullYear()} Medicare. Tüm hakları saklıdır.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
};

// Plain text versiyonu (email client'lar HTML desteklemiyorsa)
exports.getPatientWelcomeEmailText = ({ name, surname, email, password, frontendUrl }) => {
    return `
Merhaba ${name} ${surname},

Sağlık sistemi hesabınız doktorunuz tarafından başarıyla oluşturuldu.

GİRİŞ BİLGİLERİNİZ:
-------------------
E-posta: ${email}
Geçici Şifre: ${password}

⚠️ ÖNEMLİ: Güvenliğiniz için lütfen ilk girişinizde mutlaka şifrenizi değiştirin.

HIZLI ERİŞİM:
-------------
Giriş Yap: ${frontendUrl}/login
Şifre Değiştir: ${frontendUrl}/reset-password

Sağlıklı günler dileriz!

Medicare Sağlık Yönetim Sistemi
© ${new Date().getFullYear()} Medicare. Tüm hakları saklıdır.
    `.trim();
};

