import { DataManager } from './modules/DataManager.js';
import { Algorithms } from './modules/Algorithms.js';
import { UIManager } from './modules/UIManager.js';
import { switchView } from './utils.js';

// COMPONENTS
import { renderNavbar } from './components/Navbar.js';
import { renderEditModal } from './components/EditModal.js';
import { renderFooter } from './components/Footer.js';
import { renderAuthPage } from './components/AuthPage.js';
import { renderDashboardPage } from './components/DashboardPage.js';

// RENDER APP
function renderApp() {
    document.getElementById('app-navbar').innerHTML = renderNavbar();
    document.getElementById('app-modal').innerHTML = renderEditModal();
    document.getElementById('app-footer').innerHTML = renderFooter();
    document.getElementById('app-root').innerHTML = `
        ${renderAuthPage()}
        ${renderDashboardPage()}
    `;
}
renderApp();

// INIT
const db = new DataManager();
const ui = new UIManager(db);

document.addEventListener('DOMContentLoaded', async () => {
    await db.init();

    // --- THEME SETUP ---
    const btnTheme = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    const applyTheme = (t) => {
        if(t === 'light') {
            document.body.classList.add('light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.body.classList.remove('light');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
        localStorage.setItem('theme', t);
    };
    applyTheme(savedTheme);

    if(btnTheme) {
        btnTheme.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light');
            applyTheme(isLight ? 'dark' : 'light');
        });
    }

    // --- IPK FORMATTER (REVERTED TO MANUAL) ---
    // User requested to revert to manual input to improve usability and reduce errors.
    // Validation will be handled on submit.

    if (!localStorage.getItem('isLoggedIn')) {
        switchView('view-auth');
    } else {
        switchView('view-dashboard');
        ui.refreshDashboard();
    }

    // --- EVENT LISTENERS ---

    // 1. HANDLER EXPORT JSON
    const btnExportJson = document.querySelector('.export-json-trigger');
    if(btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            try {
                db.exportToJSON(); // Panggil fungsi JSON
                ui.showToast('Database berhasil diexport (JSON)!', 'blue');
            } catch(e) {
                ui.showToast(e.message, 'red');
            }
        });
    }

    // 2. HANDLER EXPORT PDF
    const btnExportPdf = document.querySelector('.export-pdf-trigger');
    if(btnExportPdf) {
        btnExportPdf.addEventListener('click', () => {
            try {
                db.exportToPDF(); // Panggil fungsi PDF
                ui.showToast('Laporan berhasil dicetak (PDF)!', 'green');
            } catch(e) {
                ui.showToast(e.message, 'red');
            }
        });
    }

    // 3. HANDLER IMPORT
    const btnImport = document.querySelector('.import-trigger');
    const fileInput = document.getElementById('json-upload'); 

    if(btnImport && fileInput) {
        btnImport.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if(!file) return;

            document.body.style.cursor = 'wait';
            try {
                const count = await db.importData(file);
                ui.refreshDashboard();
                ui.showToast(`Berhasil import ${count} data!`, 'green');
            } catch(err) {
                ui.showToast(err, 'red');
            } finally {
                document.body.style.cursor = 'default';
                fileInput.value = ''; 
            }
        });
    }
    
    // LOGIN
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

    const btnLogout = document.getElementById('btn-logout');
    if(btnLogout) btnLogout.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        switchView('view-auth');
        ui.showToast('Berhasil Logout', 'green');
    });

    // SORTING
    const handleSort = async (algo) => { 
        const key = document.getElementById('sort-key').value;
        const order = document.getElementById('sort-order').value;
        
        // Show Loading
        ui.toggleLoading(true, 'Mengurutkan Data...');
        
        await new Promise(r => setTimeout(r, 600));

        const start = performance.now();
        let sortedData = (algo === 'bubble') 
            ? Algorithms.bubbleSort(db.data, key, order) 
            : Algorithms.shellSort(db.data, key, order);
        const end = performance.now();
        ui.renderTable(sortedData, end - start);
        
        ui.toggleLoading(false);
    };
    document.getElementById('btn-bubble').addEventListener('click', () => handleSort('bubble'));
    document.getElementById('btn-shell').addEventListener('click', () => handleSort('shell'));

    // SEARCH
    document.getElementById('btn-search').addEventListener('click', async () => {
        const query = document.getElementById('search-input').value;
        const algo = document.getElementById('search-algo').value;
        const col = document.getElementById('search-column').value;

        if(!query) { ui.refreshDashboard(); return; }
        
        // --- VALIDATION REFINED ---
        if(query.length < 4) {
            ui.showToast('Minimal kata kunci 4 karakter!', 'red');
            return;
        }

        if(col === 'nim') {
            if(!/^[0-9]+$/.test(query)) {
                ui.showToast('Untuk kategori NIM, input harus berupa angka!', 'red');
                return;
            }
        }
        // ---------------------------

        // SHOW LOADING
        ui.toggleLoading(true, 'Mencari Data...');
        await new Promise(r => setTimeout(r, 600)); // UX Delay

        const start = performance.now();
        
        let result = [];
        if (algo === 'linear') {
            result = Algorithms.linearSearch(db.data, col, query);
        } else if (algo === 'sequential') {
            result = Algorithms.sequentialSearch(db.data, col, query);
        } else {
            result = Algorithms.binarySearch(db.data, col, query);
        }

        const end = performance.now();
        ui.renderTable(result, end - start);

        ui.toggleLoading(false);
    });

    // RESET TABLE VIEW
    const btnReset = document.querySelector('.reset-table-trigger');
    if(btnReset) btnReset.addEventListener('click', () => ui.refreshDashboard());

    // CRUD Listeners
    document.getElementById('form-add').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nama = document.getElementById('add-nama').value;
        const nim = document.getElementById('add-nim').value;
        const jurusan = document.getElementById('add-jurusan').value;
        const ipk = document.getElementById('add-ipk').value;

        // --- VALIDATION ---
        // 1. Check NIM
        if (!/^[0-9]+$/.test(nim)) { 
            ui.showToast('NIM harus angka!', 'red'); 
            return; 
        }
        
        // 2. Check Name (letters, spaces, dots)
        if (!/^[a-zA-Z\s\.]+$/.test(nama)) { 
            ui.showToast('Nama hanya boleh mengandung huruf, spasi, dan titik!', 'red'); 
            return; 
        }
        
        // 3. Check Name has at least 2 words
        const words = nama.trim().split(/\s+/).filter(word => word.length > 0);
        if(words.length < 2) {
            ui.showToast('Masukkan Nama Lengkap (Minimal 2 kata: Nama Depan dan Nama Belakang)!', 'red');
            return;
        }
        
        // 4. Check IPK range
        if (parseFloat(ipk) < 0 || parseFloat(ipk) > 4.00) { 
            ui.showToast('IPK tidak valid (Max 4.00)!', 'red'); 
            return; 
        }

        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        
        // Show Global Loader
        ui.toggleLoading(true, 'Menyimpan Data...');

        try {
            await new Promise(r => setTimeout(r, 800)); // Simulate network delay
            await db.add({ nama, nim, jurusan, ipk });
            ui.showToast('Data berhasil disimpan ke Server', 'green');
            ui.refreshDashboard();
            e.target.reset();
        } catch(err) { ui.showToast(err.message, 'red'); } 
        finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            ui.toggleLoading(false);
        }
    });

    document.getElementById('form-edit').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const namaBaru = document.getElementById('edit-nama').value;
        const oldNim = document.getElementById('edit-old-nim').value;
        const jurusanBaru = document.getElementById('edit-jurusan').value;
        const ipkBaru = parseFloat(document.getElementById('edit-ipk').value);

        // --- VALIDATION (SAMA SEPERTI ADD) ---
        // 1. Check Name (letters, spaces, dots)
        if (!/^[a-zA-Z\s\.]+$/.test(namaBaru)) { 
            ui.showToast('Nama hanya boleh mengandung huruf, spasi, dan titik!', 'red'); 
            return; 
        }
        
        // 2. Check Name has at least 2 words
        const words = namaBaru.trim().split(/\s+/).filter(word => word.length > 0);
        if(words.length < 2) {
            alert('Masukkan Nama Lengkap (Minimal 2 kata)!');
            ui.showToast('Masukkan Nama Lengkap (Minimal 2 kata)!', 'red');
            return;
        }

        // 3. Check IPK range
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

        if(await db.update(oldNim, newData)) {
            ui.showToast('Data Berhasil Diupdate', 'green');
            ui.refreshDashboard();
            document.getElementById('editModal').close();
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