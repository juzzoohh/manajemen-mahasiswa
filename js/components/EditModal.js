// --- HELPER COMPONENT: MODAL EDIT ---
// Ini popup yang muncul kalau tombol edit diklik.
// Pake tag <dialog> HTML5 biar native dan aksesibel.
export const renderEditModal = () => {
    return `
    <dialog id="editModal" class="glass p-8 rounded-[30px] w-full max-w-md shadow-2xl overflow-hidden">
        <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl font-bold flex items-center gap-3" style="color: var(--text-main);"><i class="fa-solid fa-pen-to-square text-emerald-500"></i> Edit Data</h3>
            <button id="btn-close-modal" class="w-10 h-10 rounded-full bg-slate-500/10 hover:bg-red-500 text-slate-400 hover:text-white transition flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="form-edit" class="space-y-5">
            <!-- Hidden input buat nyimpen NIM lama, karena NIM itu primary key jadi acuan update -->
            <input type="hidden" id="edit-old-nim">
            
            <div><label class="text-xs font-bold uppercase ml-2 mb-1 block" style="color: var(--text-muted);">Nama Lengkap</label><input type="text" id="edit-nama" required class="input-modern w-full p-4 rounded-2xl font-bold"></div>
            
            <!-- NIM didisable alias gak boleh diubah -->
            <div><label class="text-xs font-bold uppercase ml-2 mb-1 block" style="color: var(--text-muted);">NIM (Tidak bisa diubah)</label><input type="text" id="edit-nim" readonly class="input-modern w-full p-4 rounded-2xl opacity-50 cursor-not-allowed font-mono"></div>
            
            <div>
                <label class="text-xs font-bold uppercase ml-2 mb-1 block" style="color: var(--text-muted);">Jurusan</label>
                <select id="edit-jurusan" class="input-modern w-full p-4 rounded-2xl cursor-pointer">
                    <option>Teknik Informatika</option>
                    <option>Sistem Informasi</option>
                    <option>Teknik Elektro</option>
                    <option>Teknik Industri</option>
                    <option>Teknik Sipil</option>
                    <option>Akuntansi</option>
                    <option>Manajemen</option>
                    <option>Hukum</option>
                    <option>Psikologi</option>
                    <option>Kedokteran</option>
                    <option>Ilmu Komunikasi</option>
                    <option>Sastra Inggris</option>
                    <option>Desain Komunikasi Visual</option>
                    <option>Hukum</option>
                    <option>Matematika</option>
                    <option>Biologi</option>
                </select>
            </div>
            <div><label class="text-xs font-bold uppercase ml-2 mb-1 block" style="color: var(--text-muted);">IPK</label><input type="number" step="0.01" min="0" max="4.00" id="edit-ipk" required class="input-modern w-full p-4 rounded-2xl font-bold"></div>
            <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition">Simpan Perubahan</button>
        </form>
    </dialog>
    `;
};