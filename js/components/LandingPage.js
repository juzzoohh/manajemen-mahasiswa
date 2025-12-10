export const renderLandingPage = () => {
    return `
    <section id="view-landing" class="h-screen w-full flex flex-col justify-center items-center relative z-50">
        <div class="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] top-0 left-0 animate-pulse-slow"></div>
        <div class="absolute w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] bottom-0 right-0 animate-pulse-slow"></div>

        <div class="glass p-1 rounded-3xl mb-8 intro-el opacity-0 transform translate-y-10">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4">
                <i class="fa-solid fa-cube text-4xl text-white animate-float"></i>
            </div>
        </div>
        <div class="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200 mb-4 opacity-0 intro-el transform translate-y-10 text-center">PORTAL AKADEMIK</div>
        <div class="text-lg md:text-xl font-mono text-emerald-400 opacity-0 intro-el tracking-[0.3em] uppercase text-center">Data Structure & Algorithm</div>
        
        <div class="mt-16 w-64 h-1 bg-slate-800 rounded-full overflow-hidden intro-el opacity-0">
            <div class="h-full bg-emerald-500 w-1/3 rounded-full" style="animation: loading 2s ease-in-out infinite;"></div>
        </div>
    </section>
    `;
};