export class UIManager {
    constructor(db) {
        this.db = db;
        this.tableBody = document.getElementById('table-body');
        this.timeDisplay = document.getElementById('stat-time');
        
        // PAGINATION STATE
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.paramData = null; // Store current data context (filtered/sorted)

        // Binding method agar 'this' tetap mengacu ke Class
        this.renderTable = this.renderTable.bind(this);
    }

    renderTable(data, execTime = null) {
        this.paramData = data; // Keep reference to current dataset
        this.tableBody.innerHTML = '';
        
        // Validasi Halaman (Reset ke 1 jika data berubah drastis)
        const totalPages = Math.ceil(data.length / this.itemsPerPage);
        if (this.currentPage > totalPages) this.currentPage = 1;
        if (this.currentPage < 1) this.currentPage = 1;

        // Update Stats Total Data
        const totalEl = document.getElementById('stat-total');
        if(totalEl) totalEl.innerText = this.db.data.length;
        
        // Update Time Stats
        if (execTime !== null) {
            let color = execTime < 10 ? 'text-lime-500' : (execTime < 100 ? 'text-amber-500' : 'text-red-500');
            this.timeDisplay.innerHTML = `<span class="${color}">${execTime.toFixed(4)} ms</span>`;
        } else {
            this.timeDisplay.innerHTML = '<span class="text-slate-500">0.00 ms</span>';
        }

        // Handle Empty State
        if (!data || data.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-10 opacity-50 font-mono text-xs" style="color: var(--text-muted);">Data tidak ditemukan / Database kosong</td></tr>`;
            this.renderPaginationControls(0);
            return;
        }

        // --- PAGINATION LOGIC ---
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const viewData = data.slice(start, end); 
        // ------------------------
        
        viewData.forEach(mhs => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-emerald-500/5 transition group border-b border-emerald-500/5 last:border-none';
            
            const ipkColor = mhs.ipk >= 3.5 ? 'text-emerald-400 font-bold' : mhs.ipk >= 3.0 ? 'text-amber-400 font-bold' : 'text-red-400 font-bold';
            
            row.innerHTML = `
                <td class="px-8 py-5">
                    <div class="font-bold text-base group-hover:text-emerald-400 transition" style="color: var(--text-main);">${mhs.nama}</div>
                    <div class="text-xs mt-1 font-mono" style="color: var(--text-muted);">${mhs.jurusan}</div>
                </td>
                <td class="px-6 py-5 font-mono text-emerald-600 group-hover:text-emerald-500 font-bold text-sm tracking-wide">${mhs.nim}</td>
                <td class="px-6 py-5 ${ipkColor}">${parseFloat(mhs.ipk).toFixed(2)}</td>
                <td class="px-6 py-5 text-center flex items-center justify-center gap-3">
                    <button class="btn-edit w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete w-9 h-9 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center shadow-lg shadow-red-500/10 group-hover:scale-110">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            
            // --- LOGIKA HAPUS (YANG DIPERBAIKI) ---
            const btnDelete = row.querySelector('.btn-delete');
            btnDelete.addEventListener('click', async () => {
                if(confirm(`Yakin ingin menghapus ${mhs.nama}?`)) {
                    
                    // Efek UI: Ubah cursor jadi loading
                    document.body.style.cursor = 'wait';
                    btnDelete.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; // Spinner icon
                    
                    try {
                        // KUNCI PERBAIKAN: Tambahkan 'await'
                        // Kita tunggu db.delete selesai (termasuk delay palsunya)
                        await this.db.delete(mhs.nim); 
                        
                        // Setelah selesai hapus, baru refresh tampilan
                        this.refreshDashboard();
                        this.showToast('Data berhasil dihapus', 'green');
                        
                    } catch (error) {
                        this.showToast('Gagal menghapus data', 'red');
                    } finally {
                        document.body.style.cursor = 'default';
                    }
                }
            });
            
            // Logika Edit
            row.querySelector('.btn-edit').addEventListener('click', () => {
                this.openEditModal(mhs);
            });
            
            this.tableBody.appendChild(row);
        });

        this.renderPaginationControls(totalPages);
    }

    renderPaginationControls(totalPages) {
        let container = document.getElementById('pagination-container');
        if (!container) {
             // Create container if not exists (append after table)
             const tableWrapper = document.querySelector('.overflow-x-auto');
             container = document.createElement('div');
             container.id = 'pagination-container';
             container.className = 'p-4 flex justify-between items-center bg-emerald-900/10 border-t border-emerald-500/10';
             tableWrapper.parentNode.appendChild(container);
        }

        if (totalPages <= 1) {
            container.innerHTML = '';
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        container.innerHTML = `
            <div class="text-xs font-bold opacity-60 ml-2" style="color: var(--text-muted);">
                Page ${this.currentPage} of ${totalPages}
            </div>
            <div class="flex gap-2">
                <button id="btn-prev" class="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white transition text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed">
                    <i class="fa-solid fa-chevron-left"></i> Prev
                </button>
                <button id="btn-next" class="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white transition text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed">
                    Next <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        `;

        const btnPrev = container.querySelector('#btn-prev');
        const btnNext = container.querySelector('#btn-next');

        btnPrev.disabled = this.currentPage === 1;
        btnNext.disabled = this.currentPage === totalPages;

        btnPrev.onclick = () => {
            if(this.currentPage > 1) {
                this.currentPage--;
                this.renderTable(this.paramData); // Re-render with current data
            }
        };

        btnNext.onclick = () => {
            if(this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTable(this.paramData);
            }
        };
    }

    refreshDashboard() {
        // Ambil data terbaru dari memory dan render ulang
        // Reset to page 1 for fresh view usually, or keep page? Let's keep page logic in renderTable
        this.renderTable(this.db.data);
    }

    openEditModal(mhs) {
        document.getElementById('edit-old-nim').value = mhs.nim;
        document.getElementById('edit-nama').value = mhs.nama;
        document.getElementById('edit-nim').value = mhs.nim;
        document.getElementById('edit-jurusan').value = mhs.jurusan;
        document.getElementById('edit-ipk').value = mhs.ipk;
        
        const modal = document.getElementById('editModal');
        modal.showModal();
        
        // Animasi Modal Masuk
        gsap.fromTo(modal, {opacity:0, scale:0.95}, {opacity:1, scale:1, duration:0.3, ease: "back.out(1.2)"});
    }

    showToast(msg, color) {
        const t = document.getElementById('toast-container');
        const div = document.createElement('div');
        
        // Styling Toast Glassmorphism
        const borderColor = color === 'red' ? 'border-red-500' : (color === 'blue' ? 'border-blue-500' : 'border-emerald-500');
        const textColor = color === 'red' ? 'text-red-400' : (color === 'blue' ? 'text-blue-400' : 'text-emerald-400');
        const icon = color === 'red' ? 'fa-circle-xmark' : (color === 'blue' ? 'fa-circle-info' : 'fa-circle-check');

        div.className = `glass px-6 py-4 mb-3 rounded-2xl border-l-4 ${borderColor} flex items-center gap-3 shadow-2xl min-w-[300px] transform translate-x-[100%]`;
        div.innerHTML = `
            <i class="fa-solid ${icon} ${textColor} text-xl"></i>
            <span class="font-bold text-sm toast-text">${msg}</span>
        `;
        
        
        t.appendChild(div);

        // Animasi Toast Masuk (Slide in)
        gsap.to(div, {x: 0, duration: 0.4, ease: "power2.out"});

        // Hapus otomatis setelah 3 detik
        setTimeout(() => {
            gsap.to(div, {x: 200, opacity: 0, duration: 0.4, onComplete: () => div.remove()});
        }, 3000);
    }

    toggleLoading(show, msg = 'Memproses...') {
        let overlay = document.getElementById('loading-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center hidden opacity-0 transition-opacity duration-300';
            overlay.innerHTML = `
                <div class="glass p-8 rounded-3xl flex flex-col items-center gap-4 shadow-2xl scale-90 transition-transform duration-300 transform">
                    <i class="fa-solid fa-circle-notch fa-spin text-4xl text-emerald-500"></i>
                    <h3 class="font-bold text-lg tracking-wide" id="loading-text" style="color: var(--text-main);">Memproses...</h3>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        const textEl = document.getElementById('loading-text');
        if (show) {
            if(textEl) textEl.innerText = msg;
            overlay.classList.remove('hidden');
            // Little delay to allow display block to apply before opacity transition
            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0');
                overlay.querySelector('div').classList.remove('scale-90');
                overlay.querySelector('div').classList.add('scale-100');
            });
        } else {
            overlay.classList.add('opacity-0');
            overlay.querySelector('div').classList.add('scale-90');
            overlay.querySelector('div').classList.remove('scale-100');
            
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
        }
    }
}