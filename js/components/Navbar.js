export const renderNavbar = () => {
    return `
    <nav id="main-navbar" class="hidden fixed top-0 left-0 w-full h-20 border-b border-emerald-500/20 backdrop-blur-lg bg-emerald-950/70 z-50 flex items-center transition-all duration-300 shadow-[0_4px_30px_rgba(16,185,129,0.1)]">
        <div class="container mx-auto px-4 flex justify-between items-center w-full">
            <div class="flex items-center gap-3 cursor-pointer group logo-trigger">
                <div class="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-400/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition duration-300 backdrop-blur-sm">
                    <i class="fa-solid fa-cube text-xl text-emerald-400"></i>
                </div>
                <div>
                    <h1 class="font-bold text-lg text-slate-100 leading-none">
                        Portal<span class="text-emerald-400">Akademik</span>
                    </h1>
                    <span class="text-[10px] font-bold tracking-[0.2em] text-emerald-300/60 uppercase">Manajemen Mahasiswa</span>
                </div>
            </div>

            <button id="btn-logout" class="px-5 py-2 rounded-xl bg-emerald-900/30 hover:bg-red-500/90 text-emerald-400 hover:text-white transition-all duration-300 flex items-center gap-2 font-bold text-xs border border-emerald-500/20 group backdrop-blur-sm">
                <i class="fa-solid fa-power-off group-hover:rotate-90 transition-transform"></i> 
                <span class="hidden sm:block">Logout</span>
            </button>
        </div>
    </nav>
    `;
};