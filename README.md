# Eva E-Ticaret Yönetim Paneli

Bu proje, Eva tarafından verilen Frontend Developer pozisyonu için hazırlanmış bir ödev uygulamasıdır. Uygulama; kullanıcı girişi, dashboard üzerinde grafik ve tablo gösterimi, API entegrasyonları ve yetkilendirme (authentication) işlemlerini içermektedir.

## Proje Hakkında

**Eva E-Ticaret Yönetim Paneli**, kullanıcıların e-ticaret verilerini gerçek zamanlı olarak analiz edebileceği dinamik bir web uygulamasıdır. Uygulamada temel olarak şu işlevler yer almaktadır:

- **Authentication:**  
  Kullanıcı, login formu üzerinden email ve şifresini girerek `/oauth/token` endpoint’ine istek yapar. Başarılı girişte dönen Access Token, sonraki API çağrılarında (örneğin, `/user/user-information` ve `/user/logout`) kullanılır.

- **Kullanıcı Bilgileri:**  
  Giriş yapan kullanıcı için `/user/user-information` endpoint’ine gönderilen istek sayesinde, mağaza bilgileri (sellerId, marketplace) elde edilir.

- **Dashboard:**  
  Dashboard sayfasında;  
  - **SalesChart:** Günlük satış verilerini Highcharts ile sütun grafik olarak gösterir. Grafikte profit, FBA Sales, FBM Sales, shipping gibi değerler dinamik olarak sunulur.  
  - **SalesTable:** Grafikten seçilen tarihlere göre detaylı SKU satış verilerini ve iade oranlarını listeleyerek, karşılaştırmalı analiz imkanı sağlar. Tablo, sayfalama desteği ile kullanıcının erişimine sunulur.

- **API Entegrasyonu:**  
  Projede, Swagger dokümantasyonuna uygun olarak aşağıdaki endpoint’ler kullanılmaktadır:
  - `/oauth/token` – Giriş işlemi için.
  - `/user/user-information` – Kullanıcı bilgilerini çekmek için.
  - `/data/daily-sales-overview` – Günlük satış özet verilerini getirmek için.
  - `/data/daily-sales-sku-list` – Detaylı SKU satış verileri için.
  - `/data/get-sku-refund-rate` – SKU’ların iade oranlarını getirmek için.
  - `/user/logout` – Kullanıcı çıkış işlemi için.

## Kullanılan Teknolojiler

- **React** – Kullanıcı arayüzü geliştirme.
- **Redux Toolkit & RTK Query** – Global state yönetimi ve API istekleri.
- **Vite** – Hızlı geliştirme ve üretim build aracı.
- **Highcharts** – Grafik gösterimi.
- **Tailwind CSS** – Stil ve responsive tasarım.
- **Formik & Yup** – Form doğrulama.

## Proje Yapısı

├── src │ ├── app │ │ ├── store.ts // Redux store konfigürasyonu │ │ └── routes // Dinamik route yönetimi (AppRoutes.tsx) │ ├── features │ │ ├── auth // Authentication modülü │ │ │ ├── api // authApi.ts: API istekleri ve RTK Query tanımlamaları │ │ │ ├── components // LoginForm.tsx gibi bileşenler │ │ │ ├── pages // AuthPage.tsx │ │ │ └── model // authSlice.ts │ │ └── dashboard // Dashboard modülü │ │ ├── api // dashboardApi.ts: Dashboard verisi API çağrıları │ │ ├── components // SalesChart.tsx, SalesTable.tsx gibi bileşenler │ │ ├── pages // DashboardPage.tsx │ │ ├── routes // Dashboard route’ları (Routes.tsx) │ │ ├── slice // dashboardSlice.ts │ │ └── types // dashboardTypes.ts │ ├── global.css // Genel stil dosyası │ └── main.tsx // Uygulama başlangıç dosyası (Vite) ├── create-module.js // Yeni modül oluşturma aracı (CLI script) └── README.md // Bu dosya

markdown
Kopyala

## Kurulum

1. **Repository'yi Klonlayın:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
Bağımlılıkları Yükleyin:

bash
Kopyala
npm install
veya

bash
Kopyala
yarn install
Ortam Değişkenleri:

Projede API çağrıları için VITE_API_URL gibi ortam değişkenleri kullanılmaktadır. Proje kök dizininde bir .env dosyası oluşturun ve aşağıdaki örneğe göre düzenleyin:

env
Kopyala
VITE_API_URL=https://iapitest.eva.guru
Çalıştırma
Geliştirme Ortamı:

bash
Kopyala
npm run dev
veya

bash
Kopyala
yarn dev
Uygulama, Vite tarafından hızlıca derlenip tarayıcıda açılacaktır.

Üretim Build:

bash
Kopyala
npm run build
veya

bash
Kopyala
yarn build
Kullanıcı Akışı
Giriş Yapma:
Login formunda email ve şifre girilir; başarılı girişte alınan token, localStorage ve Redux store’a kaydedilir. Ardından /user/user-information isteği ile mağaza bilgileri alınır.

Dashboard:
Giriş yaptıktan sonra kullanıcı, SalesChart bileşeni ile günlük satış verilerini görür ve grafikten seçtiği tarihe göre SalesTable bileşeninde detaylı SKU verilerini inceleyebilir.

Çıkış Yapma:
Kullanıcı logout butonuna tıklayarak /user/logout endpoint’ine istek gönderir; başarılı ise token ve diğer oturum bilgileri temizlenir, kullanıcı login sayfasına yönlendirilir.

Proje Tanıtımı
Eva E-Ticaret Yönetim Paneli, modern web teknolojileri kullanılarak geliştirilmiş, kullanıcı deneyimini ön planda tutan bir uygulamadır.

Güvenlik: Giriş sonrası alınan token, API isteklerinde Bearer token olarak kullanılır ve ProtectedRoute bileşeni ile yetkisiz erişimler engellenir.
Dinamik Dashboard: Kullanıcılar, satış verilerini grafik ve tablo üzerinde interaktif olarak analiz edebilir.
Modüler Yapı: Proje, özellik bazlı (auth, dashboard vb.) modüller halinde organize edilmiş olup, yeni özellik eklemeyi kolaylaştırır.
