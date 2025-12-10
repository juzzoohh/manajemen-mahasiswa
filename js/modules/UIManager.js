export class UIManager {
    constructor(db) {
        this.db = db;
        this.tableBody = document.getElementById('table-body');
        this.timeDisplay = document.getElementById('stat-time');
        
        this.renderTable = this.renderTable.bind(this);
    }

    renderTable(data, execTime = null) {
        this.tableBody.innerHTML = '';
        document.getElementById('stat-total').innerText = this.db.data.length;
        
        if (execTime !== null) {
            let color = execTime < 10 ? 'text-lime-500' : (execTime < 100 ? 'text-amber-500' : 'text-red-500');
            this.timeDisplay.innerHTML = `<span class="${color}">${execTime.toFixed(4)} ms</span>`;
        } else {
            this.timeDisplay.innerHTML = '<span class="text-slate-500">0.00 ms</span>';
        }

        if (!data || data.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-10 opacity-50">Data tidak ditemukan</td></tr>`;
            return;
        }

        const viewData = data.slice(0, 50); 
        viewData.forEach(mhs => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-emerald-500/10 transition group';
            const ipkColor = mhs.ipk >= 3.5 ? 'text-emerald-400' : mhs.ipk >= 3.0 ? 'text-amber-400' : 'text-red-400';
            
            row.innerHTML = `
                <td class="px-6 py-4 font-bold text-white">${mhs.nama} <br><span class="text-[10px] text-slate-400 font-normal">${mhs.jurusan}</span></td>
                <td class="px-6 py-4 font-mono text-emerald-500">${mhs.nim}</td>
                <td class="px-6 py-4 font-bold ${ipkColor}">${parseFloat(mhs.ipk).toFixed(2)}</td>
                <td class="px-6 py-4 text-center flex items-center justify-center gap-2">
                    <button class="btn-edit w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition flex items-center justify-center"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-delete w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            
            // Event Delegation untuk tombol dalam tabel
            row.querySelector('.btn-delete').addEventListener('click', () => {
                if(confirm(`Hapus ${mhs.nama}?`)) {
                    this.db.delete(mhs.nim);
                    this.refreshDashboard(); // Akan memanggil renderTable lagi
                }
            });
            
            row.querySelector('.btn-edit').addEventListener('click', () => {
                this.openEditModal(mhs);
            });
            
            this.tableBody.appendChild(row);
        });
    }

    refreshDashboard() {
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
        gsap.fromTo(modal, {opacity:0, scale:0.9}, {opacity:1, scale:1, duration:0.3});
    }

    showToast(msg, color) {
        const t = document.getElementById('toast-container');
        const div = document.createElement('div');
        div.className = `glass px-6 py-3 mb-2 rounded-xl border-l-4 border-${color}-500 text-${color}-500 font-bold shadow-lg animate-bounce`;
        div.innerText = msg;
        t.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
}