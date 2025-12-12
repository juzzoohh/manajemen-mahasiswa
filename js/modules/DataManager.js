import { Mahasiswa } from './Person.js';

export class DataManager {
    constructor() {
        this.STORAGE_KEY = 'db_mahasiswa_final_fix'; 
        this.data = [];
    }

    // --- INIT ---
    async init() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            const rawData = JSON.parse(stored);
            this.data = rawData.map(d => new Mahasiswa(d.nama, d.nim, d.jurusan, d.ipk));
        } else {
            await this.loadFromJSON();
        }
        return this.data;
    }

    async loadFromJSON() {
        try {
            const response = await fetch('./database.json');
            if (!response.ok) throw new Error("Gagal koneksi ke database fisik");
            const rawData = await response.json();
            this.data = rawData.map(d => new Mahasiswa(d.nama, d.nim, d.jurusan, d.ipk));
            this.save();
        } catch (error) {
            console.error("Database Error:", error);
            this.data = [];
        }
    }

    save() {
        const dataToSave = this.data.map(mhs => mhs.toJSON());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    }

    async fakeDelay() {
        const ms = 400 + Math.random() * 600;
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- FITUR BARU: EXPORT ---
    exportData() {
        if(this.data.length === 0) throw new Error("Tidak ada data untuk diexport!");
        
        // Convert data OOP ke JSON string
        const rawData = this.data.map(mhs => mhs.toJSON());
        const dataStr = JSON.stringify(rawData, null, 4);
        
        // Bikin File Virtual
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        // Auto Click Download
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_mahasiswa_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- FITUR BARU: IMPORT ---
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    
                    // Validasi sederhana: Cek apakah array
                    if(!Array.isArray(json)) throw new Error("Format JSON salah (Harus Array)");

                    // Convert ke OOP Mahasiswa
                    this.data = json.map(d => new Mahasiswa(d.nama, d.nim, d.jurusan, d.ipk));
                    
                    this.save(); // Simpan ke browser
                    resolve(this.data.length); // Sukses
                } catch (err) {
                    reject("File corrupt atau bukan format Database Mahasiswa!");
                }
            };
            
            reader.readAsText(file);
        });
    }

    // --- CRUD ---
    async add(rawMhs) {
        await this.fakeDelay();
        if (this.data.some(d => d.nim === rawMhs.nim)) throw new Error("NIM sudah terdaftar!");
        const newMhs = new Mahasiswa(rawMhs.nama, rawMhs.nim, rawMhs.jurusan, rawMhs.ipk);
        this.data.unshift(newMhs);
        this.save();
    }

    async update(oldNim, newData) {
        await this.fakeDelay();
        const index = this.data.findIndex(d => d.nim === oldNim);
        if (index !== -1) {
            this.data[index] = new Mahasiswa(newData.nama, oldNim, newData.jurusan, newData.ipk);
            this.save();
            return true;
        }
        return false;
    }

    async delete(nim) {
        await this.fakeDelay();
        this.data = this.data.filter(d => d.nim !== nim);
        this.save();
    }

    async resetToDefault() {
        await this.fakeDelay();
        localStorage.removeItem(this.STORAGE_KEY);
        await this.loadFromJSON();
    }
}