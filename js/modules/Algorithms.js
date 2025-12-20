export class Algorithms {
    // Fungsi pembantu buat bandingin data A vs B
    static compare(a, b, key, order) {
        let valA = a[key], valB = b[key];
        
        // Kalau string, pake localeCompare biar urutan abjadnya bener (A dulu baru B)
        if (typeof valA === 'string') {
            const comparison = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
            return order === 'asc' ? comparison > 0 : comparison < 0;
        }
        
        // Kalau angka (IPK), parse dulu jadi float biar aman
        if (key === 'ipk') { valA = parseFloat(valA); valB = parseFloat(valB); }
        return order === 'asc' ? valA > valB : valA < valB;
    }

    // --- BUBBLE SORT ---
    // Algoritma klasik, nuker-nuker tetangga kalo urutannya salah
    static bubbleSort(data, key, order) {
        let arr = [...data]; // Copy array biar data asli gak keganggu
        let n = arr.length;
        let swapped;
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                if (this.compare(arr[i], arr[i + 1], key, order)) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; // Swap ES6 style
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
        return arr;
    }

    // --- SHELL SORT ---
    // Versi upgrade dari Insertion Sort, pake gap biar nukernya bisa loncat jauh
    static shellSort(data, key, order) {
        let arr = [...data];
        let n = arr.length;
        for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
            for (let i = gap; i < n; i++) {
                let temp = arr[i];
                let j;
                if (order === 'asc') {
                    for (j = i; j >= gap && this.isGreater(arr[j - gap][key], temp[key], key); j -= gap) arr[j] = arr[j - gap];
                } else {
                    for (j = i; j >= gap && this.isSmaller(arr[j - gap][key], temp[key], key); j -= gap) arr[j] = arr[j - gap];
                }
                arr[j] = temp;
            }
        }
        return arr;
    }

    // Helper buat shell sort
    static isGreater(valA, valB, key) {
        if (typeof valA === 'string') return valA.localeCompare(valB, undefined, { sensitivity: 'base' }) > 0;
        if (key === 'ipk') { valA = parseFloat(valA); valB = parseFloat(valB); }
        return valA > valB;
    }
    static isSmaller(valA, valB, key) {
        if (typeof valA === 'string') return valA.localeCompare(valB, undefined, { sensitivity: 'base' }) < 0;
        if (key === 'ipk') { valA = parseFloat(valA); valB = parseFloat(valB); }
        return valA < valB;
    }

    // --- LINEAR SEARCH ---
    // Cari satu-satu dari awal sampe akhir (Pake fungsi bawaan JS filter biar simpel)
    static linearSearch(data, key, query) {
        return data.filter(item => item[key].toString().toLowerCase().includes(query.toLowerCase()));
    }

    // --- SEQUENTIAL SEARCH ---
    // Sama aja kayak Linear Search, tapi ini versi manual loop-nya
    static sequentialSearch(data, key, query) {
        let results = [];
        const q = query.toLowerCase();
        for (let i = 0; i < data.length; i++) {
            const val = data[i][key].toString().toLowerCase();
            if (val.includes(q)) {
                results.push(data[i]);
            }
        }
        return results;
    }

    // --- BINARY SEARCH ---
    // Cari dengan bagi dua terus menerus. SYARAT: DATA HARUS DIURUTKAN DULU!
    static binarySearch(data, key, query) {
        // 1. Sort Data ALPHABETICALLY (Abjad) First! Biar binary seach jalan bener
        let sorted = [...data].sort((a, b) => {
            let valA = a[key], valB = b[key];
            if (typeof valA === 'string') { 
                return valA.localeCompare(valB, undefined, { sensitivity: 'base' });
            }
            if (key === 'ipk') { valA = parseFloat(valA); valB = parseFloat(valB); }
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });

        let low = 0, high = sorted.length - 1, results = [];
        query = query.toLowerCase();
        
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            let midVal = sorted[mid][key].toString().toLowerCase();
            
            // Cek apakah ada yang cocok (pakai includes biar parsial match tetep dapet)
             if (midVal.includes(query)) { 
                results.push(sorted[mid]); 
                
                // Kalo ketemu, cek tetangga kiri-kanannya juga siapa tau ada yang namanya mirip/sama
                let left = mid - 1;
                while(left >= 0 && sorted[left][key].toString().toLowerCase().includes(query)) {
                    results.push(sorted[left]);
                    left--;
                }
                let right = mid + 1;
                while(right < sorted.length && sorted[right][key].toString().toLowerCase().includes(query)) {
                    results.push(sorted[right]);
                    right++;
                }
                return results; 
            } 
            
            // Geser batas pencarian
            if (midVal < query) low = mid + 1;
            else high = mid - 1;
        }
        return results;
    }
}