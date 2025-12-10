import { DataManager } from './modules/DataManager.js';
import { Algorithms } from './modules/Algorithms.js';
import { UIManager } from './modules/UIManager.js';
import { switchView } from './utils.js';

// IMPORT KOMPONEN UI 
import { renderNavbar } from './components/Navbar.js';
import { renderEditModal } from './components/EditModal.js';
import { renderFooter } from './components/Footer.js';
import { renderAuthPage } from './components/AuthPage.js';
import { renderDashboardPage } from './components/DashboardPage.js';

// --- 1. FUNGSI RENDER APP ---
function renderApp() {
    document.getElementById('app-navbar').innerHTML = renderNavbar();
    document.getElementById('app-modal').innerHTML = renderEditModal();
    document.getElementById('app-footer').innerHTML = renderFooter();

    // Inject Halaman Utama 
    const root = document.getElementById('app-root');
    root.innerHTML = `
        ${renderAuthPage()}
        ${renderDashboardPage()}
    `;
}

renderApp();

// --- 2. INISIALISASI LOGIC ---
const db = new DataManager();
const ui = new UIManager(db);

document.addEventListener('DOMContentLoaded', async () => {
    await db.init();

    // LOGIKA LOGIN 
    if (!localStorage.getItem('isLoggedIn')) {
        // Belum Login -> Langsung ke Auth
        switchView('view-auth');
    } else {
        // Sudah Login -> Langsung ke Dashboard
        switchView('view-dashboard');
        ui.refreshDashboard();
    }

    // ===============================================
    // EVENT LISTENERS
    // ===============================================

    // 1. LOGIN
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

    // 2. LOGOUT
    const btnLogout = document.getElementById('btn-logout');
    if(btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            switchView('view-auth');
            ui.showToast('Berhasil Logout', 'green');
        });
    }

    // 3. LOGO CLICK
    const logoTrigger = document.querySelector('.logo-trigger');
    if(logoTrigger) logoTrigger.addEventListener('click', () => window.location.reload());

    // 4. RESET DATA (KEMBALI KE 1000 DATA JSON)
    const btnResetJson = document.querySelector('.reset-json-trigger');
    if(btnResetJson) {
        btnResetJson.addEventListener('click', async () => {
            if(confirm("Reset database ke kondisi awal (File Server)? Perubahan manual akan hilang.")) {
                document.body.style.cursor = 'wait';
                await db.resetToDefault();
                ui.refreshDashboard();
                document.body.style.cursor = 'default';
                ui.showToast('Database direfresh dari Server', 'blue');
            }
        });
    }

    // 5. SORTING
    const handleSort = (algo) => {
        const key = document.getElementById('sort-key').value;
        const order = document.getElementById('sort-order').value;
        const start = performance.now();
        let sortedData = (algo === 'bubble') 
            ? Algorithms.bubbleSort(db.data, key, order) 
            : Algorithms.shellSort(db.data, key, order);
        const end = performance.now();
        ui.renderTable(sortedData, end - start);
    };

    document.getElementById('btn-bubble').addEventListener('click', () => handleSort('bubble'));
    document.getElementById('btn-shell').addEventListener('click', () => handleSort('shell'));

    // 6. SEARCHING
    document.getElementById('btn-search').addEventListener('click', () => {
        const query = document.getElementById('search-input').value;
        const algo = document.getElementById('search-algo').value;
        const col = document.getElementById('search-column').value;
        if(!query) { ui.refreshDashboard(); return; }
        const start = performance.now();
        let result = (algo === 'linear') 
            ? Algorithms.linearSearch(db.data, col, query) 
            : Algorithms.binarySearch(db.data, col, query);
        const end = performance.now();
        ui.renderTable(result, end - start);
    });

    // 7. ADD DATA
    document.getElementById('form-add').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('add-nama').value;
        const nim = document.getElementById('add-nim').value;
        const jurusan = document.getElementById('add-jurusan').value;
        const ipk = document.getElementById('add-ipk').value;

        // Validasi Regex
        if (!/^[0-9]+$/.test(nim)) { ui.showToast('NIM harus angka!', 'red'); return; }
        if (!/^[a-zA-Z\s\.]+$/.test(nama)) { ui.showToast('Nama harus huruf!', 'red'); return; }
        if (parseFloat(ipk) < 0 || parseFloat(ipk) > 4.00) { ui.showToast('IPK tidak valid!', 'red'); return; }

        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Menyimpan...';
        btn.disabled = true;
        document.body.style.cursor = 'wait';

        try {
            await db.add({ nama, nim, jurusan, ipk });
            ui.showToast('Data berhasil disimpan ke Server', 'green');
            ui.refreshDashboard();
            e.target.reset();
        } catch(err) { 
            ui.showToast(err.message, 'red'); 
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            document.body.style.cursor = 'default';
        }
    });

    // 8. EDIT DATA
    document.getElementById('form-edit').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Updating...";
        btn.disabled = true;
        document.body.style.cursor = 'wait';

        const oldNim = document.getElementById('edit-old-nim').value;
        const newData = {
            nama: document.getElementById('edit-nama').value,
            jurusan: document.getElementById('edit-jurusan').value,
            ipk: parseFloat(document.getElementById('edit-ipk').value)
        };
        
        if(await db.update(oldNim, newData)) {
            ui.showToast('Data Berhasil Diupdate', 'green');
            ui.refreshDashboard();
            document.getElementById('editModal').close();
        } else {
            ui.showToast('Gagal update data', 'red');
        }
        btn.innerText = originalText;
        btn.disabled = false;
        document.body.style.cursor = 'default';
    });

    // 9. OTHERS
    const btnReset = document.querySelector('.reset-table-trigger');
    if(btnReset) btnReset.addEventListener('click', () => ui.refreshDashboard());

    const btnCloseModal = document.getElementById('btn-close-modal');
    if(btnCloseModal) btnCloseModal.addEventListener('click', () => document.getElementById('editModal').close());
});