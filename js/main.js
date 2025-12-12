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

    // SEARCH
    document.getElementById('btn-search').addEventListener('click', () => {
        const query = document.getElementById('search-input').value;
        const algo = document.getElementById('search-algo').value;
        const col = document.getElementById('search-column').value;
        if(!query) { ui.refreshDashboard(); return; }
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
        } catch(err) { ui.showToast(err.message, 'red'); } 
        finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            document.body.style.cursor = 'default';
        }
    });

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

    const btnCloseModal = document.getElementById('btn-close-modal');
    if(btnCloseModal) btnCloseModal.addEventListener('click', () => document.getElementById('editModal').close());
});