// 1. Class Induk (Parent Class)
// Ini blueprint dasar manusia, punya properti nama.
export class Person {
    constructor(nama) {
        // Proteksi biar class ini gak bisa dipanggil langsung (harus lewat anak)
        if (this.constructor === Person) {
            throw new Error("Abstract class tidak bisa diinstansiasi langsung");
        }
        this._nama = nama; // Enkapsulasi: pake underscore _ buat nandain ini privat
    }

    // Getter buat ngambil nama
    get nama() {
        return this._nama;
    }

    // Polimorfisme: Method ini bakal ditimpa (override) sama class Mahasiswa
    getRole() {
        return "General Person";
    }
}

// 2. Class Anak (Child Class) - PEWARISAN (INHERITANCE)
// Class Mahasiswa "mewarisi" sifat-sifat dari Person
export class Mahasiswa extends Person {
    constructor(nama, nim, jurusan, ipk) {
        super(nama); // Panggil parent constructor (Person) buat set nama
        this._nim = nim;
        this._jurusan = jurusan;
        this._ipk = parseFloat(ipk); // Pastikan IPK jadi angka
    }

    // Getter untuk properti-properti mahasiswa
    get nim() { return this._nim; }
    get jurusan() { return this._jurusan; }
    get ipk() { return this._ipk; }

    // POLIMORFISME (Overriding method induk)
    // Di sini ubah return value getRole sesuai konteks mahasiswa
    getRole() {
        return "Mahasiswa Aktif";
    }

    // Helper buat convert object class jadi JSON biasa 
    // (Penting buat disimpen di LocalStorage)
    toJSON() {
        return {
            nama: this.nama,
            nim: this.nim,
            jurusan: this.jurusan,
            ipk: this.ipk
        };
    }
}