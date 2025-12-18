// 1. Class Induk (Parent Class)
export class Person {
    constructor(nama) {
        if (this.constructor === Person) {
            throw new Error("Abstract class tidak bisa diinstansiasi langsung");
        }
        this._nama = nama; // Enkapsulasi (konvensi _ untuk private/protected)
    }

    // Getter
    get nama() {
        return this._nama;
    }

    // Polimorfisme: Method ini akan di-override oleh anak
    getRole() {
        return "General Person";
    }
}

// 2. Class Anak (Child Class) - PEWARISAN (INHERITANCE)
export class Mahasiswa extends Person {
    constructor(nama, nim, jurusan, ipk) {
        super(nama); // Panggil konstruktor induk
        this._nim = nim;
        this._jurusan = jurusan;
        this._ipk = parseFloat(ipk);
    }

    get nim() { return this._nim; }
    get jurusan() { return this._jurusan; }
    get ipk() { return this._ipk; }

    // POLIMORFISME (Overriding method induk)
    getRole() {
        return "Mahasiswa Aktif";
    }

    // Konversi object class ke JSON biasa (untuk disimpan)
    toJSON() {
        return {
            nama: this.nama,
            nim: this.nim,
            jurusan: this.jurusan,
            ipk: this.ipk
        };
    }
}