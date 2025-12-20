import { DataManager } from './modules/DataManager.js';
import { Algorithms } from './modules/Algorithms.js';
import { UIManager } from './modules/UIManager.js';
import { switchView } from './utils.js';

// --- KOMPONEN UI ---
// Kita import komponen-komponen UI yang udah dipisah biar kodingannya rapi
import { renderNavbar } from './components/Navbar.js';
import { renderEditModal } from './components/EditModal.js';
import { renderFooter } from './components/Footer.js';
import { renderAuthPage } from './components/AuthPage.js';
import { renderDashboardPage } from './components/DashboardPage.js';

// --- RENDER APLIKASI ---
// Fungsi ini buat ngerakit semua komponen UI ke dalam HTML
function renderApp() {
    document.getElementById('app-navbar').innerHTML = renderNavbar();
    document.getElementById('app-modal').innerHTML = renderEditModal();
    document.getElementById('app-footer').innerHTML = renderFooter();
    
    // Render halaman auth dan dashboard sekaligus, nanti tinggal switchView buat nampilin salah satu
    document.getElementById('app-root').innerHTML = `
        ${renderAuthPage()}
        ${renderDashboardPage()}
    `;
}
renderApp();

// --- INIT GLOBAL OBJECTS ---
const db = new DataManager(); // Urusan data
const ui = new UIManager(db); // Urusan tampilan

// Pas website udah loading semua, baru kita jalanin script utama
document.addEventListener('DOMContentLoaded', async () => {
    await db.init(); // Load data dari LocalStorage atau file default

    // --- SETUP TEMA (DARK/LIGHT MODE) ---
    // Cek tombol toggle tema dan iconnya
    const btnTheme = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Ambil preferensi tema user dari storage, defaultnya 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Fungsi buat terapin tema ke body
    const applyTheme = (t) => {
        if(t === 'light') {
            document.body.classList.add('light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.body.classList.remove('light');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
        localStorage.setItem('theme', t); // Simpen biar direload tetep sama
    };
    applyTheme(savedTheme);

    // Event listener buat tombol ganti tema
    if(btnTheme) {
        btnTheme.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light');
            applyTheme(isLight ? 'dark' : 'light');
        });
    }

    // --- IPK FORMATTER  ---

    // --- CEK LOGIN ---
    // Kalau belum login, lempar ke halaman auth. Kalau udah, langsung dashboard.
    if (!localStorage.getItem('isLoggedIn')) {
        switchView('view-auth');
    } else {
        switchView('view-dashboard');
        ui.refreshDashboard();
    }

    // --- EVENT LISTENERS ---

    // 1. HANDLER EXPORT JSON
    // Buat download database jadi file JSON
    const btnExportJson = document.querySelector('.export-json-trigger');
    if(btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            try {
                db.exportToJSON(); 
                ui.showToast('Database berhasil diexport (JSON)!', 'blue');
            } catch(e) {
                ui.showToast(e.message, 'red');
            }
        });
    }

    // 2. HANDLER EXPORT PDF
    // Buat cetak laporan mahasiswa jadi PDF table
    const btnExportPdf = document.querySelector('.export-pdf-trigger');
    if(btnExportPdf) {
        btnExportPdf.addEventListener('click', () => {
            try {
                db.exportToPDF();
                ui.showToast('Laporan berhasil dicetak (PDF)!', 'green');
            } catch(e) {
                ui.showToast(e.message, 'red');
            }
        });
    }

    // 3. HANDLER IMPORT
    // Buat upload file JSON database buat restore data
    const btnImport = document.querySelector('.import-trigger');
    const fileInput = document.getElementById('json-upload'); 

    if(btnImport && fileInput) {
        btnImport.addEventListener('click', () => fileInput.click()); // Trigger input file pas tombol diklik

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if(!file) return;

            document.body.style.cursor = 'wait'; // Ubah kursor jadi loading
            try {
                const count = await db.importData(file);
                ui.refreshDashboard(); // Refresh tampilan data baru
                ui.showToast(`Berhasil import ${count} data!`, 'green');
            } catch(err) {
                ui.showToast(err, 'red');
            } finally {
                document.body.style.cursor = 'default';
                fileInput.value = ''; // Reset input file biar bisa pilih file yg sama lagi
            }
        });
    }
    
    // --- LOGIN SYSTEM ---
    // Simple aja, hardcoded admin/admin123 sesuai request
    document.getElementById('form-login').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('login-user').value;
        const p = document.getElementById('login-pass').value;
        if (u === 'admin' && p === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            switchView('view-dashboard');
            ui.refreshDashboard();
        } else {
            ui.showToast('Username/Password salah!', 'red');
        }
    });

    // --- LOGOUT ---
    const btnLogout = document.getElementById('btn-logout');
    if(btnLogout) btnLogout.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        switchView('view-auth');
        ui.showToast('Berhasil Logout', 'green');
    });

    // --- FITUR SORTING (PENGURUTAN) ---
    // Bisa urut berdasarkan Nama, NIM, atau IPK. Bisa Ascending atau Descending.
    const handleSort = async (algo) => { 
        const key = document.getElementById('sort-key').value;
        const order = document.getElementById('sort-order').value;
        
        // Show Loading biar user tau sistem lagi kerja
        ui.toggleLoading(true, 'Mengurutkan Data...');
        
        // Delay dikit (600ms) biar animasinya keliatan
        await new Promise(r => setTimeout(r, 600));

        const start = performance.now(); // Mulai timer
        
        // Pilih algoritma: Bubble Sort atau Shell Sort
        let sortedData = (algo === 'bubble') 
            ? Algorithms.bubbleSort(db.data, key, order) 
            : Algorithms.shellSort(db.data, key, order);
            
        const end = performance.now(); // Stop timer
        
        // Render tabel dengan data yang udah urut + tampilin durasi eksekusinya
        ui.renderTable(sortedData, end - start);
        
        ui.toggleLoading(false);
    };
    
    // Binding tombol sort ke funsi handleSort
    document.getElementById('btn-bubble').addEventListener('click', () => handleSort('bubble'));
    document.getElementById('btn-shell').addEventListener('click', () => handleSort('shell'));

    // --- SEARCH SYSTEM ---
    document.getElementById('btn-search').addEventListener('click', async () => {
        const query = document.getElementById('search-input').value;
        const algo = document.getElementById('search-algo').value;
        const col = document.getElementById('search-column').value;

        // --- VALIDASI INPUT SEARCH ---
        // Pastikan input gak kosong
        if (!query) {
            ui.showToast('Data tidak boleh kosong!', 'red');
            return;
        }

        // Validasi khusus kolom Nama (min 4 chars)
        if (col === 'nama') {
            if (query.length < 4) {
                ui.showToast('Data harus string minimal 4 karakter', 'red');
                return;
            }
        } 
        // Validasi khusus kolom NIM (harus angka & min 4 digit)
        else if (col === 'nim') {
            if (!/^[0-9]+$/.test(query) || query.length < 4) {
                ui.showToast('Data harus integer minimal 4 angka', 'red');
                return;
            }
        }
        // ---------------------------

        // SHOW LOADING
        ui.toggleLoading(true, 'Mencari Data...');
        await new Promise(r => setTimeout(r, 600)); // UX Delay biar loadingnya kerasa

        const start = performance.now();
        
        // Pilih Algoritma Searching
        let result = [];
        if (algo === 'linear') {
            result = Algorithms.linearSearch(db.data, col, query);
        } else if (algo === 'sequential') {
            result = Algorithms.sequentialSearch(db.data, col, query);
        } else {
            // Binary Search butuh data yang terurut dulu, tapi ini udah dihandle di dalem logic binarySearch biasanya atau kita anggap user tau
            result = Algorithms.binarySearch(db.data, col, query);
        }

        const end = performance.now();
        ui.renderTable(result, end - start);

        ui.toggleLoading(false);
    });

    // RESET TABLE VIEW
    const btnReset = document.querySelector('.reset-table-trigger');
    if(btnReset) btnReset.addEventListener('click', () => ui.refreshDashboard());

    // --- CRUD: CREATE (TAMBAH DATA) ---
    document.getElementById('form-add').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nama = document.getElementById('add-nama').value;
        const nim = document.getElementById('add-nim').value;
        const jurusan = document.getElementById('add-jurusan').value;
        const ipk = document.getElementById('add-ipk').value;

        // --- VALIDASI DATA ---
        // 1. Cek NIM harus angka
        if (!/^[0-9]+$/.test(nim)) { 
            ui.showToast('NIM harus angka!', 'red'); 
            return; 
        }
        
        // 2. Cek Nama (cuma boleh huruf, spasi, titik)
        if (!/^[a-zA-Z\s\.]+$/.test(nama)) { 
            ui.showToast('Nama hanya boleh mengandung huruf, spasi, dan titik!', 'red'); 
            return; 
        }
        
        // 3. Cek Nama minimal 2 kata (Depan Belakang)
        const words = nama.trim().split(/\s+/).filter(word => word.length > 0);
        if(words.length < 2) {
            ui.showToast('Masukkan Nama Lengkap (Minimal 2 kata: Nama Depan dan Nama Belakang)!', 'red');
            return;
        }
        
        // 4. Cek Range IPK (0.00 - 4.00)
        if (parseFloat(ipk) < 0 || parseFloat(ipk) > 4.00) { 
            ui.showToast('IPK tidak valid (Max 4.00)!', 'red'); 
            return; 
        }

        // Disable tombol biar gak di-spam klik
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        
        // Show Global Loader
        ui.toggleLoading(true, 'Menyimpan Data...');

        try {
            await new Promise(r => setTimeout(r, 800)); // Delay pura-pura (Simulasi network)
            await db.add({ nama, nim, jurusan, ipk });
            ui.showToast('Data berhasil disimpan ke Server', 'green');
            ui.refreshDashboard(); // Update tabel
            e.target.reset(); // Reset form
        } catch(err) { ui.showToast(err.message, 'red'); } 
        finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            ui.toggleLoading(false); // Sembunyiin loader
        }
    });

    // --- CRUD: UPDATE (EDIT DATA) ---
    document.getElementById('form-edit').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const namaBaru = document.getElementById('edit-nama').value;
        const oldNim = document.getElementById('edit-old-nim').value; // NIM lama buat identifier
        const jurusanBaru = document.getElementById('edit-jurusan').value;
        const ipkBaru = parseFloat(document.getElementById('edit-ipk').value);

        // --- VALIDASI (SAMA KAYA ADD) ---
        // 1. Cek Nama
        if (!/^[a-zA-Z\s\.]+$/.test(namaBaru)) { 
            ui.showToast('Nama hanya boleh mengandung huruf, spasi, dan titik!', 'red'); 
            return; 
        }
        
        // 2. Cek Nama min 2 kata
        const words = namaBaru.trim().split(/\s+/).filter(word => word.length > 0);
        if(words.length < 2) {
            ui.showToast('Masukkan Nama Lengkap (Minimal 2 kata)!', 'red');
            return;
        }

        // 3. Cek IPK
        if (ipkBaru < 0 || ipkBaru > 4.00) { 
            ui.showToast('IPK tidak valid (Max 4.00)!', 'red'); 
            return; 
        }
        // -------------------------------------

        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.disabled = true;
        
        ui.toggleLoading(true, 'Mengupdate Data...');

        const newData = {
            nama: namaBaru,
            jurusan: jurusanBaru,
            ipk: ipkBaru
        };
        
        await new Promise(r => setTimeout(r, 800)); 

        // Update via DataManager
        if(await db.update(oldNim, newData)) {
            ui.showToast('Data Berhasil Diupdate', 'green');
            ui.refreshDashboard();
            document.getElementById('editModal').close(); // Tutup modal edit
        } else {
            ui.showToast('Gagal update data', 'red');
        }
        btn.innerText = originalText;
        btn.disabled = false;
        ui.toggleLoading(false);
    });

    const btnCloseModal = document.getElementById('btn-close-modal');
    if(btnCloseModal) btnCloseModal.addEventListener('click', () => document.getElementById('editModal').close());
});