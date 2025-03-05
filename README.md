
# Eva E-Ticaret Yönetim Paneli

Bu proje, Eva tarafından Frontend Developer pozisyonu için hazırlanmış bir ödev uygulamasıdır. Uygulama; kullanıcı girişi, dashboard üzerinde grafik ve tablo gösterimi, API entegrasyonları ve yetkilendirme (authentication) işlemlerini içermektedir.

## Proje Hakkında

**Eva E-Ticaret Yönetim Paneli**, kullanıcıların e-ticaret verilerini gerçek zamanlı olarak analiz edebileceği dinamik bir web uygulamasıdır. Uygulamada temel olarak şu işlevler yer almaktadır:

- **Authentication:**  
  Kullanıcı, login formu aracılığıyla email ve şifresini girerek `/oauth/token` endpoint’ine istek yapar. Başarılı girişte alınan Access Token, sonraki API çağrılarında kullanılır.

- **Kullanıcı Bilgileri:**  
  Giriş yapan kullanıcı için `/user/user-information` endpoint’ine gönderilen istek ile mağaza bilgileri (sellerId, marketplace) elde edilir.

- **Dashboard:**  
  Dashboard sayfasında:
  - **SalesChart:** Günlük satış verilerini Highcharts ile sütun grafik olarak gösterir. Grafikte profit, FBA Sales, FBM Sales ve shipping gibi değerler dinamik olarak sunulur.
  - **SalesTable:** Grafikten seçilen tarihlere göre detaylı SKU satış verilerini ve iade oranlarını listeleyerek karşılaştırmalı analiz imkanı sağlar. Tablo, sayfalama desteğiyle kullanıcıya sunulur.

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


Bu projenin ne yaptığı ve kimin için olduğu hakkında kısa bir açıklama

## Kurulum

1. **Repository'yi Klonlayın:**
   ```bash
   git clone https://github.com/bburak2014/eva.git
   cd eva

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install



Projede API çağrıları için VITE_API_URL gibi ortam değişkenleri kullanılmaktadır. Proje kök dizininde bir .env dosyası oluşturun ve aşağıdaki örneğe göre düzenleyin:

**env:**
VITE_API_URL=https://iapitest.eva.guru

3. **Projeyi Çalıştırın:**
   ```bash
   npm run dev

3. **Build Alma:**
   ```bash
   npm run build


## Proje Tanıtımı

Eva E-Ticaret Yönetim Paneli, modern web teknolojileri kullanılarak geliştirilmiş, kullanıcı deneyimini ön planda tutan dinamik bir uygulamadır. Projede:

**Güvenlik:**
Giriş sonrası alınan token, API isteklerinde Bearer token olarak kullanılır. ProtectedRoute bileşeni ile yetkisiz erişimler engellenir.

**Dinamik Dashboard:**
Kullanıcılar, satış verilerini grafik ve tablo üzerinden interaktif olarak analiz edebilir.

**Modüler Yapı:**
Özellik bazlı modüller (auth, dashboard vb.) sayesinde yeni özellik eklemek ve kodun bakımını yapmak kolaydır.

## Kullanıcı Akışı
**Giriş Yapma:**
Login formunda email ve şifre girilir; başarılı girişte alınan token localStorage ve Redux store’a kaydedilir. Ardından, /user/user-information isteği ile mağaza bilgileri çekilir.

**Dashboard:**
Giriş yaptıktan sonra kullanıcı, SalesChart bileşeni ile günlük satış verilerini görüntüler. Grafikten seçilen tarihe göre SalesTable bileşeni detaylı SKU verilerini ve iade oranlarını listeler.

**Çıkış Yapma:**
Kullanıcı logout butonuna tıklayarak /user/logout endpoint’ine istek gönderir; başarılı ise token ve diğer oturum bilgileri temizlenir, kullanıcı login sayfasına yönlendirilir.

**Create Module Aracı**
Projeye yeni bir modül eklemek için create-module.js adındaki CLI script’i kullanabilirsiniz. Bu araç, belirli bir modül adı girilerek ilgili klasör yapısını ve temel dosyaları otomatik olarak oluşturur. Örnek kullanım:

```bash
npm run create:module -- myModule --protected


api/ – API istekleri için.
components/ – Bileşenler için.
pages/ – Sayfa bileşenleri için.
routes/ – Modüle ait route tanımlamaları (ProtectedRoute kullanımı opsiyoneldir).
slice/ – Redux slice dosyası.
types/ – Modüle ait tip tanımlamaları.
--protected parametresi verilirse, oluşturulan route dosyası ProtectedRoute bileşeni ile sarılarak, sadece yetkilendirilmiş kullanıcıların erişimine uygun şekilde yapılandırılır.



## Proje Yapısı

src/
├── app/
│   ├── store.ts           // Redux store konfigürasyonu
│   └── routes/            // Dinamik route yönetimi (AppRoutes.tsx)
├── features/
│   ├── auth/              // Authentication modülü
│   │   ├── api/           // authApi.ts: API istekleri ve RTK Query tanımlamaları
│   │   ├── components/    // LoginForm.tsx gibi bileşenler
│   │   ├── pages/         // AuthPage.tsx
│   │   └── model/         // authSlice.ts
│   └── dashboard/         // Dashboard modülü
│       ├── api/           // dashboardApi.ts: Dashboard verisi API çağrıları
│       ├── components/    // SalesChart.tsx, SalesTable.tsx gibi bileşenler
│       ├── pages/         // DashboardPage.tsx
│       ├── routes/        // Dashboard route’ları (Routes.tsx)
│       ├── slice/         // dashboardSlice.ts
│       └── types/         // dashboardTypes.ts
├── global.css             // Genel stil dosyası
└── main.tsx               // Uygulama başlangıç dosyası (Vite)
create-module.js          // Yeni modül oluşturma aracı (CLI script)
README.md                 // Bu dosya
