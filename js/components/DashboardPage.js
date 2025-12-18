export const renderDashboardPage = () => {
    return `
    <section id="view-dashboard" class="hidden min-h-screen w-full">
        <div class="container mx-auto pt-32 px-6 pb-32 max-w-7xl">
            
            <input type="file" id="json-upload" accept=".json" class="hidden">

            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                
                <div class="glass p-6 rounded-[24px] flex items-center gap-4 relative overflow-hidden md:col-span-1">
                    <div class="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center text-2xl">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <div>
                        <h3 class="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Total Data</h3>
                        <p id="stat-total" class="text-2xl font-black" style="color: var(--text-main);">0</p>
                    </div>
                </div>
                
                <div class="glass p-6 rounded-[24px] flex items-center gap-4 relative overflow-hidden md:col-span-1">
                    <div class="w-12 h-12 rounded-xl bg-lime-500/10 text-lime-500 flex items-center justify-center text-2xl">
                        <i class="fa-solid fa-stopwatch"></i>
                    </div>
                    <div>
                        <h3 class="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Time</h3>
                        <p id="stat-time" class="text-2xl font-black text-lime-500 font-mono">0.00 ms</p>
                    </div>
                </div>

                <div class="glass p-1 rounded-[24px] flex items-center justify-center relative overflow-hidden group cursor-pointer import-trigger hover:bg-cyan-500/10 transition md:col-span-1">
                    <div class="flex flex-col items-center justify-center p-4 text-center z-10">
                        <i class="fa-solid fa-file-import text-xl text-cyan-500 mb-1 group-hover:scale-110 transition"></i>
                        <h3 class="font-bold text-xs text-cyan-50">Import JSON</h3>
                        <p class="text-[8px] text-cyan-400/70">Upload Database</p>
                    </div>
                </div>
                
                <div class="glass p-1 rounded-[24px] flex items-center justify-center relative overflow-hidden group cursor-pointer export-json-trigger hover:bg-blue-500/10 transition md:col-span-1">
                    <div class="flex flex-col items-center justify-center p-4 text-center z-10">
                        <i class="fa-solid fa-file-export text-xl text-blue-500 mb-1 group-hover:scale-110 transition"></i>
                        <h3 class="font-bold text-xs text-blue-50">Export JSON</h3>
                        <p class="text-[8px] text-blue-400/70">Backup (JSON)</p>
                    </div>
                </div>

                <div class="glass p-1 rounded-[24px] flex items-center justify-center relative overflow-hidden group cursor-pointer export-pdf-trigger hover:bg-red-500/10 transition md:col-span-1">
                    <div class="flex flex-col items-center justify-center p-4 text-center z-10">
                        <i class="fa-solid fa-file-pdf text-xl text-red-500 mb-1 group-hover:scale-110 transition"></i>
                        <h3 class="font-bold text-xs text-red-500">Export PDF</h3>
                        <p class="text-[8px] text-red-400/70">Laporan (A-Z)</p>
                    </div>
                </div>

            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div class="lg:col-span-4 space-y-6">
                    <div class="glass p-8 rounded-[30px] border border-emerald-500/10">
                        <h2 class="text-lg font-bold mb-6 flex items-center gap-3" style="color: var(--text-main);">
                            <i class="fa-solid fa-arrow-down-a-z text-blue-500 bg-blue-500/10 p-2 rounded-lg"></i> Sorting Lab
                        </h2>
                        <div class="space-y-5">
                            <div class="grid grid-cols-2 gap-4">
                                <select id="sort-key" class="input-modern w-full p-3 rounded-xl text-sm font-bold"><option value="nama">Nama</option><option value="nim">NIM</option><option value="ipk">IPK</option></select>
                                <select id="sort-order" class="input-modern w-full p-3 rounded-xl text-sm font-bold"><option value="asc">Ascending</option><option value="desc">Descending</option></select>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <button id="btn-bubble" class="hover-scale bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white py-3 rounded-xl text-xs font-bold transition border border-blue-500/20">Bubble Sort</button>
                                <button id="btn-shell" class="hover-scale bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white py-3 rounded-xl text-xs font-bold transition border border-purple-500/20">Shell Sort</button>
                            </div>
                        </div>
                    </div>

                    <div class="glass p-8 rounded-[30px] border border-emerald-500/10">
                        <h2 class="text-lg font-bold mb-6 flex items-center gap-3" style="color: var(--text-main);">
                            <i class="fa-solid fa-magnifying-glass text-emerald-500 bg-emerald-500/10 p-2 rounded-lg"></i> Searching Lab
                        </h2>
                        <div class="space-y-5">
                            <input type="text" id="search-input" placeholder="Cari data..." class="input-modern w-full p-4 rounded-xl font-bold text-sm">
                            <div class="grid grid-cols-2 gap-4">
                                <select id="search-algo" class="input-modern w-full p-3 rounded-xl text-xs font-bold cursor-pointer">
                                    <option value="linear">Linear Search</option>
                                    <option value="sequential">Sequential Search</option>
                                    <option value="binary">Binary Search</option>
                                </select>
                                <select id="search-column" class="input-modern w-full p-3 rounded-xl text-xs font-bold cursor-pointer">
                                    <option value="nama">Nama</option>
                                    <option value="nim">NIM</option>
                                </select>
                            </div>
                            <button id="btn-search" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition">Mulai Pencarian</button>
                        </div>
                    </div>

                    <div class="glass p-6 rounded-[30px] border border-emerald-500/10">
                        <h2 class="text-lg font-bold mb-6 flex items-center gap-3" style="color: var(--text-main);">
                            <i class="fa-solid fa-keyboard text-purple-500 bg-purple-500/10 p-2 rounded-lg"></i> Tambah Data
                        </h2>
                        <form id="form-add" class="flex flex-col gap-4">
                            <div class="group relative">
                                <input type="text" id="add-nama" placeholder="Nama Lengkap (Min. 2 kata)" required class="input-modern p-3 rounded-xl text-sm font-semibold w-full">
                            </div>
                            <div class="flex gap-3">
                                <input type="text" id="add-nim" placeholder="NIM" required pattern="[0-9]{10,15}" title="Hanya angka, 10-15 digit" inputmode="numeric" class="input-modern p-3 rounded-xl text-sm w-2/3 font-mono">
                                <input type="number" step="0.01" min="0" max="4.00" id="add-ipk" placeholder="IPK" required class="input-modern p-3 rounded-xl text-sm w-1/3 font-semibold">
                            </div>
                            <select id="add-jurusan" class="input-modern p-3 rounded-xl text-sm font-semibold cursor-pointer">
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
                            <button type="submit" class="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl text-xs font-bold transition hover:shadow-lg"><i class="fa-solid fa-plus mr-1"></i> Tambah Data</button>
                        </form>
                    </div>
                </div>

                <div class="lg:col-span-8 glass rounded-[30px] overflow-hidden flex flex-col min-h-[800px] border border-emerald-500/10 shadow-2xl">
                    <div class="p-8 border-b border-emerald-900/20 bg-emerald-900/20 backdrop-blur-sm flex justify-between items-center sticky top-0 z-20">
                        <div><h2 class="font-bold text-2xl" style="color: var(--text-main);">Database Mahasiswa</h2><p class="text-xs text-emerald-400/60 mt-1 font-mono">Real-time Data View</p></div>
                        <button class="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition flex items-center gap-2 reset-table-trigger"><i class="fa-solid fa-rotate-right"></i> Reset View</button>
                    </div>
                    <div class="overflow-x-auto flex-1 custom-scrollbar">
                        <table class="w-full text-left text-sm">
                            <thead class="text-emerald-400/60 text-xs uppercase font-black tracking-wider sticky top-0 z-10 backdrop-blur-md" style="background: var(--glass-bg);">
                                <tr><th class="px-8 py-5">Mahasiswa</th><th class="px-6 py-5">NIM</th><th class="px-6 py-5">IPK</th><th class="px-6 py-5 text-center">Aksi</th></tr>
                            </thead>
                            <tbody id="table-body" class="divide-y divide-emerald-900/20"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
};