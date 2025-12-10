export const renderDashboardPage = () => {
    return `
    <section id="view-dashboard" class="hidden min-h-screen w-full">
        <div class="container mx-auto pt-24 px-6 pb-32 max-w-7xl">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                <div class="glass p-6 rounded-[24px] flex items-center gap-6 relative overflow-hidden">
                    <div class="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center text-3xl">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <div>
                        <h3 class="text-xs font-bold uppercase text-slate-500 tracking-widest mb-1">Total Data</h3>
                        <p id="stat-total" class="text-4xl font-black text-emerald-50 leading-none">0</p>
                    </div>
                </div>
                
                <div class="glass p-6 rounded-[24px] flex items-center gap-6 relative overflow-hidden">
                    <div class="w-16 h-16 rounded-2xl bg-lime-500/10 text-lime-500 flex items-center justify-center text-3xl">
                        <i class="fa-solid fa-stopwatch"></i>
                    </div>
                    <div>
                        <h3 class="text-xs font-bold uppercase text-slate-500 tracking-widest mb-1">Execution Time</h3>
                        <p id="stat-time" class="text-3xl font-black text-lime-500 font-mono leading-none">0.00 ms</p>
                    </div>
                </div>

            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div class="lg:col-span-4 space-y-6">
                    
                    <div class="glass p-8 rounded-[30px] relative overflow-hidden border border-emerald-500/10">
                        <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                        <h2 class="text-lg font-bold text-emerald-50 mb-6 flex items-center gap-3">
                            <i class="fa-solid fa-arrow-down-a-z text-blue-500 bg-blue-500/10 p-2 rounded-lg"></i> Sorting Lab
                        </h2>
                        <div class="space-y-5">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold uppercase text-slate-500 mb-2 block tracking-wider">Key</label>
                                    <select id="sort-key" class="input-modern w-full p-3 rounded-xl text-sm font-bold cursor-pointer transition focus:scale-[1.02]">
                                        <option value="nama">Nama</option>
                                        <option value="nim">NIM</option>
                                        <option value="ipk">IPK</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold uppercase text-slate-500 mb-2 block tracking-wider">Order</label>
                                    <select id="sort-order" class="input-modern w-full p-3 rounded-xl text-sm font-bold cursor-pointer transition focus:scale-[1.02]">
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <button id="btn-bubble" class="hover-scale bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white py-3 rounded-xl text-xs font-bold transition border border-blue-500/20 shadow-lg shadow-blue-500/5">Bubble Sort</button>
                                <button id="btn-shell" class="hover-scale bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white py-3 rounded-xl text-xs font-bold transition border border-purple-500/20 shadow-lg shadow-purple-500/5">Shell Sort</button>
                            </div>
                        </div>
                    </div>

                    <div class="glass p-8 rounded-[30px] relative overflow-hidden border border-emerald-500/10">
                        <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-500"></div>
                        <h2 class="text-lg font-bold text-emerald-50 mb-6 flex items-center gap-3">
                            <i class="fa-solid fa-magnifying-glass text-emerald-500 bg-emerald-500/10 p-2 rounded-lg"></i> Searching Lab
                        </h2>
                        <div class="space-y-5">
                            <input type="text" id="search-input" placeholder="Ketik kata kunci..." class="input-modern w-full p-4 rounded-xl font-bold text-sm focus:border-emerald-500 transition">
                            <div class="grid grid-cols-2 gap-4">
                                <select id="search-algo" class="input-modern w-full p-3 rounded-xl text-xs font-bold cursor-pointer">
                                    <option value="linear">Linear Search</option>
                                    <option value="binary">Binary Search</option>
                                </select>
                                <select id="search-column" class="input-modern w-full p-3 rounded-xl text-xs font-bold cursor-pointer">
                                    <option value="nama">Nama</option>
                                    <option value="nim">NIM</option>
                                </select>
                            </div>
                            <button id="btn-search" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition active:scale-95">
                                Mulai Pencarian
                            </button>
                        </div>
                    </div>

                    <div class="glass p-6 rounded-[30px] border border-emerald-500/10">
                        <h3 class="text-xs font-bold uppercase mb-4 text-slate-500 tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-keyboard"></i> Input Manual
                        </h3>
                        <form id="form-add" class="flex flex-col gap-4">
                            <input type="text" id="add-nama" placeholder="Nama Lengkap" required class="input-modern p-3 rounded-xl text-sm font-semibold">
                            <div class="flex gap-3">
                                <input type="text" id="add-nim" placeholder="NIM" required class="input-modern p-3 rounded-xl text-sm w-2/3 font-mono">
                                <input type="number" step="0.01" id="add-ipk" placeholder="IPK" required class="input-modern p-3 rounded-xl text-sm w-1/3 font-semibold">
                            </div>
                            <select id="add-jurusan" class="input-modern p-3 rounded-xl text-sm font-semibold cursor-pointer">
                                <option>Teknik Informatika</option>
                                <option>Sistem Informasi</option>
                                <option>Teknik Elektro</option>
                                <option>Akuntansi</option>
                            </select>
                            <button type="submit" class="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl text-xs font-bold transition hover:shadow-lg">
                                <i class="fa-solid fa-plus mr-1"></i> Tambah Data
                            </button>
                        </form>
                    </div>
                </div>

                <div class="lg:col-span-8 glass rounded-[30px] overflow-hidden flex flex-col min-h-[800px] border border-emerald-500/10 shadow-2xl">
                    <div class="p-8 border-b border-emerald-900/20 bg-emerald-900/20 backdrop-blur-sm flex justify-between items-center sticky top-0 z-20">
                        <div>
                            <h2 class="font-bold text-emerald-50 text-2xl">Database Mahasiswa</h2>
                            <p class="text-xs text-emerald-400/60 mt-1 font-mono">Real-time Data View</p>
                        </div>
                        <button class="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition flex items-center gap-2 reset-table-trigger">
                            <i class="fa-solid fa-rotate-right"></i> Reset View
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto flex-1 custom-scrollbar">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-emerald-950/80 text-emerald-400/60 text-xs uppercase font-black tracking-wider sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th class="px-8 py-5">Mahasiswa</th>
                                    <th class="px-6 py-5">NIM</th>
                                    <th class="px-6 py-5">IPK</th>
                                    <th class="px-6 py-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="table-body" class="divide-y divide-emerald-900/20">
                                </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </section>
    `;
};