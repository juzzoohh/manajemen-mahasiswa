import { Mahasiswa } from './Person.js';

export class DataManager {
    constructor() {
        this.STORAGE_KEY = 'db_mahasiswa_final_fix'; 
        this.data = [];
    }

    // --- INIT: LOAD DARI FILE JSON ---
    async init() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            // Jika sudah ada cache di browser, pakai itu
            const rawData = JSON.parse(stored);
            // Convert JSON polos menjadi Object Mahasiswa (OOP)
            this.data = rawData.map(d => new Mahasiswa(d.nama, d.nim, d.jurusan, d.ipk));
        } else {
            // Jika belum ada, ambil dari file fisik
            await this.loadFromJSON();
        }
        return this.data;
    }

    async loadFromJSON() {
        try {
            const response = await fetch('./database.json');
            if (!response.ok) throw new Error("Gagal koneksi ke database fisik");
            
            const rawData = await response.json();
            // Convert ke Object Mahasiswa (OOP)
            this.data = rawData.map(d => new Mahasiswa(d.nama, d.nim, d.jurusan, d.ipk));
            
            this.save();
        } catch (error) {
            console.error("Database Error:", error);
            this.data = [];
        }
    }

    save() {
        // Simpan ke browser agar perubahan tidak hilang saat refresh
        const dataToSave = this.data.map(mhs => mhs.toJSON());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    }

    // --- FAKE DELAY (Biar terlihat seperti loading server) ---
    async fakeDelay() {
        const ms = 400 + Math.random() * 600; // Delay 0.4 - 1 detik
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- CRUD ---
    async add(rawMhs) {
        await this.fakeDelay(); // Efek loading
        if (this.data.some(d => d.nim === rawMhs.nim)) throw new Error("NIM sudah terdaftar!");

        // Buat Object Mahasiswa baru (OOP)
        const newMhs = new Mahasiswa(rawMhs.nama, rawMhs.nim, rawMhs.jurusan, rawMhs.ipk);
        
        this.data.unshift(newMhs);
        this.save();
    }

    async update(oldNim, newData) {
        await this.fakeDelay(); // Efek loading
        const index = this.data.findIndex(d => d.nim === oldNim);
        
        if (index !== -1) {
            // Re-create object (OOP)
            this.data[index] = new Mahasiswa(newData.nama, oldNim, newData.jurusan, newData.ipk);
            this.save();
            return true;
        }
        return false;
    }

    async delete(nim) {
        await this.fakeDelay(); // Efek loading
        this.data = this.data.filter(d => d.nim !== nim);
        this.save();
    }

    async resetToDefault() {
        await this.fakeDelay();
        localStorage.removeItem(this.STORAGE_KEY);
        await this.loadFromJSON();
    }
}