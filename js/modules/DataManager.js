import { Mahasiswa } from './Person.js';

// MODULE: DATA MANAGER
// Class ini yang ngurusin semua lalu lintas data: Simpen, Hapus, Load, Export.
export class DataManager {
    constructor() {
        this.STORAGE_KEY = 'db_mahasiswa_final_fix'; // Key buat localStorage
        this.data = []; // Tempat nampung data sementara di RAM
    }

    // --- INIT ---
    // Dipanggil pas awal buka web
    async init() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            // Kalau ada data di LocalStorage, pake itu
            const rawData = JSON.parse(stored);
            this.data = rawData.map(d => new Mahasiswa(d.nama, d.nim, d.jurusan, d.ipk));
        } else {
            // Kalau kosong, load dari file dummy database.json
            await this.loadFromJSON();
        }
        return this.data;
    }

    // Load data dummy awal
    async loadFromJSON() {
        try {
            const response = await fetch('./database.json');
            if (!response.ok) throw new Error("Gagal koneksi ke database fisik");
            
            const rawData = await response.json();
            this.data = rawData.map(d => new Mahasiswa(d.nama, d.nim, d.jurusan, d.ipk));
            this.save(); // Langsung simpen ke storage biar next visit udah ada
        } catch (error) {
            console.error("Database Error:", error);
            this.data = [];
        }
    }

    // Simpen state sekarang ke LocalStorage browser
    save() {
        const dataToSave = this.data.map(mhs => mhs.toJSON());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    }

    // Simulasi delay biar berasa kayak lagi connect ke server beneran
    async fakeDelay() {
        const ms = 400 + Math.random() * 600;
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- EXPORT KE JSON ---
    // Download database jadi file .json
    exportToJSON() {
        if(this.data.length === 0) throw new Error("Tidak ada data untuk diexport!");
        
        const rawData = this.data.map(mhs => mhs.toJSON());
        const dataStr = JSON.stringify(rawData, null, 4);
        
        // Bikin virtual blob file & link download
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_mahasiswa_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // --- EXPORT KE PDF (DENGAN SORTING NAMA A-Z) ---
    exportToPDF() {
        if (this.data.length === 0) throw new Error("Tidak ada data untuk diexport ke PDF!");

        // 1. Urutin dulu datanya A-Z sesuai nama (Request Dosen biasanya gini)
        const sortedData = [...this.data].sort((a, b) => {
            if (a.nama < b.nama) return -1;
            if (a.nama > b.nama) return 1;
            return 0;
        });

        // 2. Format data biar pas sama tabel PDF
        const finalData = sortedData.map(mhs => [
            mhs.nama,
            mhs.nim,
            mhs.jurusan,
            mhs.ipk.toFixed(2)
        ]);

        // 3. Pake library jsPDF buat generate PDFnya
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // 4. Header dan Judul PDF
        doc.setFontSize(18);
        doc.text("Laporan Data Mahasiswa", 14, 22);
        doc.setFontSize(10);
        doc.text(`Total Data: ${this.data.length}`, 14, 28);
        doc.text(`Waktu Laporan: ${new Date().toLocaleString('id-ID')}`, 14, 34);

        // 5. Render Tabel ke PDF
        doc.autoTable({
            startY: 40,
            head: [['NAMA LENGKAP', 'NIM', 'JURUSAN', 'IPK']],
            body: finalData,
            theme: 'striped',
            headStyles: { 
                fillColor: [16, 185, 129], // Warna Emerald Hijau biar senada sama Web
                textColor: 255 
            },
            styles: { fontSize: 8, cellPadding: 2 }
        });

        // 6. Trigger Download
        doc.save(`Laporan_Mahasiswa_Sorted_AZ.pdf`);
    }

    // --- IMPORT DATA ---
    // Upload file JSON buat replace/nambah data
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    if(!Array.isArray(json)) throw new Error("Format JSON salah (Harus Array)");
                    // Replace data lama dengan yang baru diupload
                    this.data = json.map(d => new Mahasiswa(d.nama, d.nim, d.jurusan, d.ipk));
                    this.save();
                    resolve(this.data.length);
                } catch (err) {
                    reject("File corrupt atau bukan format Database Mahasiswa!");
                }
            };
            
            reader.readAsText(file);
        });
    }

    // --- CRUD OPERATIONS ---
    // Method buat nambah data baru
    async add(rawMhs) {
        await this.fakeDelay();
        // Cek duplikat NIM
        if (this.data.some(d => d.nim === rawMhs.nim)) throw new Error("NIM sudah terdaftar!");
        
        const newMhs = new Mahasiswa(rawMhs.nama, rawMhs.nim, rawMhs.jurusan, rawMhs.ipk);
        this.data.unshift(newMhs); // Tambah di paling atas
        this.save();
    }

    // Method buat update data
    async update(oldNim, newData) {
        await this.fakeDelay();
        const index = this.data.findIndex(d => d.nim === oldNim);
        if (index !== -1) {
            // replace object lama dengan yang baru (tetep pertahanin NIM lama kalau misal gak diedit)
            this.data[index] = new Mahasiswa(newData.nama, oldNim, newData.jurusan, newData.ipk);
            this.save();
            return true;
        }
        return false;
    }

    // Method buat hapus data
    async delete(nim) {
        await this.fakeDelay();
        this.data = this.data.filter(d => d.nim !== nim); // Filter out NIM yang mau dihapus
        this.save();
    }

    // Reset total ke kondisi awal (dari database.json)
    async resetToDefault() {
        await this.fakeDelay();
        localStorage.removeItem(this.STORAGE_KEY);
        await this.loadFromJSON();
    }
}