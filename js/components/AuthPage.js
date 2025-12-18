export const renderAuthPage = () => {
    return `
    <section id="view-auth" class="min-h-screen w-full hidden flex items-center justify-center p-4 relative z-40">
        <div class="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] top-0 left-0"></div>
        
        <div class="glass w-full max-w-md p-10 rounded-[30px] shadow-2xl relative overflow-hidden">
            <div class="text-center mb-8">
                <div class="inline-flex p-4 rounded-3xl bg-emerald-900/10 border border-emerald-900/50 mb-6 shadow-xl">
                    <i class="fa-solid fa-cube text-4xl text-emerald-500"></i>
                </div>
                <h1 class="text-3xl font-extrabold mb-2" style="color: var(--text-main);">Selamat Datang</h1>
                <p class="text-sm" style="color: var(--text-muted);">Sistem Manajemen Mahasiswa</p>
            </div>

            <form id="form-login" class="space-y-4">
                <div class="group">
                    <div class="hover-scale"><input type="text" id="login-user" placeholder="Username" required pattern="[a-zA-Z0-9]+" title="Hanya huruf dan angka, tanpa spasi" class="input-modern w-full p-4 rounded-2xl font-semibold"></div>
                    <p class="text-[10px] mt-1 opacity-60 pl-2" style="color: var(--text-muted);">*Hanya huruf & angka (admin)</p>
                </div>
                <div class="group relative">
                    <div class="hover-scale"><input type="password" id="login-pass" placeholder="Password" required pattern=".{5,}" title="Minimal 5 karakter" class="input-modern w-full p-4 rounded-2xl pr-12 font-semibold"></div>
                    <p class="text-[10px] mt-1 opacity-60 pl-2" style="color: var(--text-muted);">*Minimal 5 karakter (admin123)</p>
                </div>
                <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg hover-scale tracking-wide shadow-emerald-500/20 mt-4">MASUK</button>
            </form>
            
            <div class="mt-6 text-center text-xs" style="color: var(--text-muted);">
                <p>Default: admin / admin123</p>
            </div>
        </div>
    </section>
    `;
};