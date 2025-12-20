// --- HELPER COMPONENT: FOOTER ---
// Bagian bawah website (copyright & sosmed)
export const renderFooter = () => {
    // Ganti URL "#" dengan link profil asli Anda nanti
    return `
    <footer class="w-full border-t border-emerald-500/10 bg-emerald-950/30 backdrop-blur-md mt-auto relative z-30">
        <div class="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div class="text-xs font-medium text-slate-500 text-center md:text-left">
                &copy; 2025 <span class="text-emerald-500 font-bold tracking-wide">Academic Central</span>. 
                <span class="hidden sm:inline text-slate-600">|</span> 
                <span class="text-slate-600">Built with Vanilla JS Modular</span>
            </div>

            <!-- Link Sosmed -->
            <div class="flex items-center gap-6">
                
                <a href="https://instagram.com/sanrozii" target="_blank" class="group flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-all duration-300">
                    <i class="fa-brands fa-instagram text-lg group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-transform"></i>
                    <span class="text-[10px] font-bold uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-0 group-hover:w-auto overflow-hidden">Instagram</span>
                </a>

                <a href="https://linkedin.com/in/muhamad-ichsan-fachrulrozi-50216731b" target="_blank" class="group flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-all duration-300">
                    <i class="fa-brands fa-linkedin text-lg group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-transform"></i>
                    <span class="text-[10px] font-bold uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-0 group-hover:w-auto overflow-hidden">LinkedIn</span>
                </a>

                <a href="https://github.com/juzzoohh" target="_blank" class="group flex items-center gap-2 text-slate-500 hover:text-white transition-all duration-300">
                    <i class="fa-brands fa-github text-lg group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-transform"></i>
                    <span class="text-[10px] font-bold uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-0 group-hover:w-auto overflow-hidden">GitHub</span>
                </a>

            </div>
        </div>
    </footer>
    `;
};