export class UIManager {
    constructor(db) {
        this.db = db;
        this.tableBody = document.getElementById('table-body');
        this.timeDisplay = document.getElementById('stat-time');
        
        // Binding method agar 'this' tetap mengacu ke Class
        this.renderTable = this.renderTable.bind(this);
    }

    renderTable(data, execTime = null) {
        this.tableBody.innerHTML = '';
        
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
            this.tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-10 opacity-50 font-mono text-xs">Data tidak ditemukan / Database kosong</td></tr>`;
            return;
        }

        // Limit View (Virtual Scroll Simple)
        const viewData = data.slice(0, 50); 
        
        viewData.forEach(mhs => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-emerald-500/5 transition group border-b border-emerald-500/5 last:border-none';
            
            const ipkColor = mhs.ipk >= 3.5 ? 'text-emerald-400 font-bold' : mhs.ipk >= 3.0 ? 'text-amber-400 font-bold' : 'text-red-400 font-bold';
            
            row.innerHTML = `
                <td class="px-8 py-5">
                    <div class="font-bold text-slate-200 text-base group-hover:text-emerald-400 transition">${mhs.nama}</div>
                    <div class="text-xs text-slate-500 mt-1 font-mono">${mhs.jurusan}</div>
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
    }

    refreshDashboard() {
        // Ambil data terbaru dari memory dan render ulang
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
            <span class="font-bold text-slate-200 text-sm">${msg}</span>
        `;
        
        t.appendChild(div);

        // Animasi Toast Masuk (Slide in)
        gsap.to(div, {x: 0, duration: 0.4, ease: "power2.out"});

        // Hapus otomatis setelah 3 detik
        setTimeout(() => {
            gsap.to(div, {x: 200, opacity: 0, duration: 0.4, onComplete: () => div.remove()});
        }, 3000);
    }
}