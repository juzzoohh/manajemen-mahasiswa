export const renderAuthPage = () => {
    return `
    <section id="view-auth" class="min-h-screen w-full hidden flex items-center justify-center p-4 relative z-40">
        <div class="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] top-0 left-0"></div>
        
        <div class="glass w-full max-w-md p-10 rounded-[30px] shadow-2xl relative overflow-hidden">
            <div class="text-center mb-8">
                <div class="inline-flex p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-900/50 mb-6 shadow-xl">
                    <i class="fa-solid fa-cube text-4xl text-emerald-500"></i>
                </div>
                <h1 class="text-3xl font-extrabold mb-2 text-white">Selamat Datang</h1>
                <p class="text-sm text-emerald-400/60">Sistem Manajemen Mahasiswa</p>
            </div>

            <form id="form-login" class="space-y-5">
                <div class="hover-scale"><input type="text" id="login-user" placeholder="Username" required class="input-modern w-full p-4 rounded-2xl font-semibold"></div>
                <div class="relative hover-scale">
                    <input type="password" id="login-pass" placeholder="Password" required class="input-modern w-full p-4 rounded-2xl pr-12 font-semibold">
                </div>
                <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg hover-scale tracking-wide shadow-emerald-500/20">MASUK</button>
            </form>
            
            <div class="mt-6 text-center text-xs text-slate-500">
                <p>Default: admin / admin123</p>
            </div>
        </div>
    </section>
    `;
};