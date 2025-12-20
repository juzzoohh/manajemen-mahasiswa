// Fungsi buat ganti tampilan antar halaman (misal dari login ke dashboard)
export const switchView = (viewName) => {
    // Daftar semua view yang ada
    const views = ['view-auth', 'view-dashboard'];
    
    // Sembunyiin semua view dulu
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    // Default: Sembunyikan Navbar (karena di halaman login gak butuh navbar)
    const navbar = document.getElementById('main-navbar');
    if(navbar) navbar.classList.add('hidden');

    // Tampilkan Section Target yang diminta
    const target = document.getElementById(viewName);
    if(target) {
        target.classList.remove('hidden');
        // Kasih animasi dikit biar smooth munculnya (pake GSAP)
        gsap.fromTo(target, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.4, clearProps: "all"});
    }

    // Kalau masuk ke dashboard, munculin navbarnya juga dengan animasi
    if(viewName === 'view-dashboard' && navbar) {
        navbar.classList.remove('hidden');
        gsap.fromTo(navbar, {y: -50, opacity: 0}, {y: 0, opacity: 1, duration: 0.5, delay: 0.1, clearProps: "all"});
    }
};