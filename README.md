# 🎓 Academic Central - Manajemen Mahasiswa

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/built%20with-Vanilla%20JS%20Modular-yellow)

> **Single Page Application (SPA)** pengelola data mahasiswa yang dibangun menggunakan **Vanilla JavaScript (ES6 Modules)**. Proyek ini mendemonstrasikan implementasi struktur modular modern, manipulasi DOM tanpa framework, serta visualisasi benchmark algoritma Sorting & Searching.

---

## 📸 Tampilan Antarmuka (Preview)

![Dashboard Preview](./assets/Dashboard.png)

---

## ✨ Fitur Unggulan

### 1. 🏗️ Arsitektur Modular (ES6 Modules)
Meskipun tanpa Framework (React/Vue), aplikasi ini dibangun dengan **Component-Based Architecture**.
- **Terpisah:** Logika Bisnis, Manipulasi UI, dan Manajemen Data dipisah ke dalam modul berbeda.
- **Clean Code:** Menggunakan `import` dan `export` untuk manajemen dependensi yang rapi.
- **Component Injection:** Navbar, Modal, dan Halaman di-inject secara dinamis menggunakan JavaScript.

### 2. ⚡ Algoritma & Benchmarking
Fitur "Algorithm Lab" memungkinkan pengguna membandingkan kecepatan eksekusi secara real-time (dalam milidetik/ms):
- **Sorting:** Bubble Sort vs Shell Sort (Ascending/Descending).
- **Searching:** Linear Search vs Binary Search.
- **Big Data Simulation:** Generator data dummy (500+ data) untuk stress-test algoritma.

### 3. 🎨 UI/UX Modern (Glassmorphism)
- **Tema:** Dark Emerald dengan efek kaca (glassmorphism) dan backdrop blur.
- **Responsive:** Tampilan menyesuaikan desktop dan mobile.
- **Interaktif:** Animasi halus menggunakan **GSAP** (GreenSock) untuk transisi halaman dan elemen.

### 4. 💾 Persistensi Data
- **LocalStorage:** Data tersimpan di browser, tidak hilang saat di-refresh.
- **CRUD:** Create, Read, Update, dan Delete data mahasiswa sepenuhnya berfungsi.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
| :--- | :--- |
| **Core** | HTML5, CSS3, JavaScript (ES6+) |
| **Architecture** | MVC Pattern (Model-View-Controller) adaptation, ES Modules |
| **Styling** | Tailwind CSS (CDN) |
| **Icons** | FontAwesome 6 |
| **Animation** | GSAP (GreenSock Animation Platform) |

---

## 📂 Struktur Proyek

Struktur folder dirancang agar *scalable* dan mudah dipelihara (Maintainable):

```text
/project-root
│
├── assets/
│   └── Dashboard.png        # Aset statis (gambar preview/dokumentasi)
│
├── css/
│   └── style.css            # Styling utama (Layout, Colors, Glassmorphism)
│
├── js/
│   ├── components/          # Komponen UI (Modular HTML Strings)
│   │   ├── AuthPage.js      # Halaman Login/Register
│   │   ├── DashboardPage.js # Halaman Utama Dashboard
│   │   ├── EditModal.js     # Pop-up form edit data
│   │   ├── Footer.js        # Bagian kaki website
│   │   ├── LandingPage.js   # Halaman depan sebelum login
│   │   └── Navbar.js        # Navigasi utama
│   │
│   ├── modules/             # Business Logic (Otak dari aplikasi)
│   │   ├── Algorithms.js    # Logika Sorting (Bubble/Shell) & Searching
│   │   ├── DataManager.js   # CRUD Logic & manajemen LocalStorage/JSON
│   │   ├── Person.js        # Class/Model definition (Schema Data)
│   │   └── UIManager.js     # Jembatan antara Logic dan manipulasi DOM
│   │
│   ├── main.js              # Entry Point (Inisialisasi & Event Listeners)
│   └── utils.js             # Fungsi pembantu (Helper functions)
│
├── database.json            # Mock Data / Sumber data awal
├── index.html               # Entry Point HTML (Skeleton)
└── README.md                # Dokumentasi Proyek
````

-----

## 🚀 Cara Menjalankan (Installation)

Karena proyek ini menggunakan **ES6 Modules (`type="module"`)**, Anda **TIDAK BISA** membukanya hanya dengan double-click file `index.html` (karena kebijakan CORS browser).

Anda harus menjalankannya menggunakan **Local Server**.

### Prasyarat

  - Browser Modern (Chrome/Edge/Firefox).
  - Code Editor (VS Code direkomendasikan).

### Langkah-langkah

1.  **Clone Repositori ini**

    ```bash
    git clone [https://github.com/username-anda/portal-akademik-js.git](https://github.com/username-anda/academic-central-js.git)
    ```

2.  **Buka di VS Code**

    ```bash
    cd academic-central-js
    code .
    ```

3.  **Jalankan dengan Live Server**

      - Install Ekstensi **"Live Server"** oleh Ritwick Dey di VS Code.
      - Klik kanan pada `index.html`.
      - Pilih **"Open with Live Server"**.

4.  **Login Default**

      - Username: `admin`
      - Password: `admin123`

-----

## 🧠 Pembelajaran (Learning Outcomes)

Melalui proyek ini, saya mendalami konsep:

  - **JavaScript Modern:** Memahami `import/export`, `async/await`, dan `class` secara mendalam.
  - **Algorithm Complexity:** Memahami secara visual mengapa Shell Sort ($O(n \log n)$) jauh lebih cepat daripada Bubble Sort ($O(n^2)$) pada data yang besar.
  - **DOM Manipulation:** Membangun SPA manual memberi pemahaman kuat tentang bagaimana framework bekerja di balik layar ("Under the hood").

-----

## 🤝 Kontribusi

Pull requests dipersilakan. Untuk perubahan besar, harap buka issue terlebih dahulu untuk mendiskusikan apa yang ingin Anda ubah.

-----

## 📞 Kontak

Dibuat oleh **[Juzzoohh]**

[LinkeIn](https://www.google.com/search?q=https://linkedin.com/in/muhamad-ichsan-fachrulrozi-50216731b)
[Instagram](https://www.google.com/search?q=https://instagram.com/sanrozii)
