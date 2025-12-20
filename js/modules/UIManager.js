// MODULE: UI MANAGER
// Class khusus buat ngurusin tampilan: Render Tabel, Notifikasi (Toast), Modal Update, dll.
export class UIManager {
    constructor(db) {
        this.db = db;
        this.tableBody = document.getElementById('table-body');
        this.timeDisplay = document.getElementById('stat-time');
        
        // STATE HALAMAN (PAGINATION)
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.paramData = null; // Nyimpen data yang lagi aktif (habis difilter/sort) biar pas pindah halaman datanya gak ilang
        
        // Binding method agar 'this' tetap mengacu ke Class pas dipanggil di event listener
        this.renderTable = this.renderTable.bind(this);
    }

    // --- RENDER TABEL ---
    // Fungsi ini yang bikin baris-baris tabel di HTML
    renderTable(data, execTime = null) {
        this.paramData = data; // Simpen referensi data sekarang
        this.tableBody.innerHTML = '';
        
        // Validasi Halaman: Kalau data dikit, reset ke halaman 1
        const totalPages = Math.ceil(data.length / this.itemsPerPage);
        if (this.currentPage > totalPages) this.currentPage = 1;
        if (this.currentPage < 1) this.currentPage = 1;

        // Update Counter Total Data di UI
        const totalEl = document.getElementById('stat-total');
        if(totalEl) totalEl.innerText = this.db.data.length;
        
        // Update Time Stats (Waktu Eksekusi Algoritma)
        if (execTime !== null) {
            // Warnain merah kalau lemot (> 100ms), ijo kalau cepet
            let color = execTime < 10 ? 'text-lime-500' : (execTime < 100 ? 'text-amber-500' : 'text-red-500');
            this.timeDisplay.innerHTML = `<span class="${color}">${execTime.toFixed(4)} ms</span>`;
        } else {
            this.timeDisplay.innerHTML = '<span class="text-slate-500">0.00 ms</span>';
        }

        // Kalau Data Kosong
        if (!data || data.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-10 opacity-50 font-mono text-xs" style="color: var(--text-muted);">Data tidak ditemukan / Database kosong</td></tr>`;
            this.renderPaginationControls(0);
            return;
        }

        // --- LOGIKA PAGINATION ---
        // Potong data sesuai halaman yang dipilih
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const viewData = data.slice(start, end); 
        // ------------------------
        
        // Loop data yang udah dipotong dan bikin baris tabelnya
        viewData.forEach(mhs => {
             const row = document.createElement('tr');
            row.className = 'hover:bg-emerald-500/5 transition group border-b border-emerald-500/5 last:border-none';
            
            // Pewarnaan IPK: >3.5 Ijo, >3.0 Kuning, <3.0 Merah
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
            
            // --- EVENT HANDLER TOMBOL DELETE ---
            const btnDelete = row.querySelector('.btn-delete');
            btnDelete.addEventListener('click', async () => {
                if(confirm(`Yakin ingin menghapus ${mhs.nama}?`)) {
                    
                    // Efek UI: Ubah cursor jadi loading dan button jadi spinner
                    document.body.style.cursor = 'wait';
                    btnDelete.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; 
                    
                    try {
                        // Hapus dari database (await karena ada delay simulasi)
                        await this.db.delete(mhs.nim); 
                        
                        // Refresh tabel dng data baru
                        this.refreshDashboard();
                        this.showToast('Data berhasil dihapus', 'green');
                        
                    } catch (error) {
                        this.showToast('Gagal menghapus data', 'red');
                    } finally {
                        document.body.style.cursor = 'default';
                    }
                }
            });
            
            // Event Handler Tombol Edit
            row.querySelector('.btn-edit').addEventListener('click', () => {
                this.openEditModal(mhs);
            });
            
            this.tableBody.appendChild(row);
        });

        this.renderPaginationControls(totalPages);
    }

    // --- KONTROL PAGINATION (PREV/NEXT) ---
    renderPaginationControls(totalPages) {
        let container = document.getElementById('pagination-container');
        if (!container) {
             // Kalau belum ada container pagination, bikin baru di bawah tabel
             const tableWrapper = document.querySelector('.overflow-x-auto');
             container = document.createElement('div');
             container.id = 'pagination-container';
             container.className = 'p-4 flex justify-between items-center bg-emerald-900/10 border-t border-emerald-500/10';
             tableWrapper.parentNode.appendChild(container);
        }

        // Kalau cuma 1 halaman, sembunyiin paginationnya
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

        btnPrev.disabled = this.currentPage === 1; // Disable Prev kalau di halaman 1
        btnNext.disabled = this.currentPage === totalPages; // Disable Next kalau di halaman terakhir

        // Logic Klik Prev/Next
        btnPrev.onclick = () => {
            if(this.currentPage > 1) {
                this.currentPage--;
                this.renderTable(this.paramData); // Render ulang
            }
        };

        btnNext.onclick = () => {
            if(this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTable(this.paramData);
            }
        };
    }

    // Helper buat refresh tampilan data terbaru
    refreshDashboard() {
        this.renderTable(this.db.data);
    }

    // --- MODAL EDIT ---
    openEditModal(mhs) {
        // Isi form dengan data mahasiswa yang mau diedit
        document.getElementById('edit-old-nim').value = mhs.nim;
        document.getElementById('edit-nama').value = mhs.nama;
        document.getElementById('edit-nim').value = mhs.nim;
        document.getElementById('edit-jurusan').value = mhs.jurusan;
        document.getElementById('edit-ipk').value = mhs.ipk;
        
        const modal = document.getElementById('editModal');
        modal.showModal(); // Fungsi native HTML Dialog element
        
        // Animasi Modal Masuk (GSAP)
        gsap.fromTo(modal, {opacity:0, scale:0.95}, {opacity:1, scale:1, duration:0.3, ease: "back.out(1.2)"});
    }

    // --- TOAST NOTIFICATION ---
    // Notifikasi melayang di pojok
    showToast(msg, color) {
        const t = document.getElementById('toast-container');
        const div = document.createElement('div');
        
        // Styling Toast sesuai warna (Green/Red/Blue)
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

    // --- LOADING OVERLAY ---
    // Layar hitam transparan + spinner pas lagi proses berat
    toggleLoading(show, msg = 'Memproses...') {
        let overlay = document.getElementById('loading-overlay');
        
        // Kalau elemen overlay belum ada, bikin dulu
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
            // Animasi masuk
            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0');
                overlay.querySelector('div').classList.remove('scale-90');
                overlay.querySelector('div').classList.add('scale-100');
            });
        } else {
            // Animasi keluar
            overlay.classList.add('opacity-0');
            overlay.querySelector('div').classList.add('scale-90');
            overlay.querySelector('div').classList.remove('scale-100');
            
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
        }
    }
}