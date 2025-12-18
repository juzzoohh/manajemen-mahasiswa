export class Algorithms {
    static compare(a, b, key, order) {
        let valA = a[key], valB = b[key];
        
        if (typeof valA === 'string') {
            // Use localeCompare for correct alphabetical sorting
            const comparison = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
            return order === 'asc' ? comparison > 0 : comparison < 0;
        }
        
        if (key === 'ipk') { valA = parseFloat(valA); valB = parseFloat(valB); }
        return order === 'asc' ? valA > valB : valA < valB;
    }

    static bubbleSort(data, key, order) {
        let arr = [...data];
        let n = arr.length;
        let swapped;
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                if (this.compare(arr[i], arr[i + 1], key, order)) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
        return arr;
    }

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

    // Linear Search (Pakai Filter Bawaan JS)
    static linearSearch(data, key, query) {
        return data.filter(item => item[key].toString().toLowerCase().includes(query.toLowerCase()));
    }

    // Sequential Search (Manual Loop)
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

    // Binary Search (Fixed Sorting & Logic)
    static binarySearch(data, key, query) {
        // 1. Sort Data ALPHABETICALLY (Abjad) First!
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
            
            // Check for match (starts with or exact match usually better for binary, but includes is requested)
             if (midVal.includes(query)) { 
                results.push(sorted[mid]); 
                
                // Scan surroundings for duplicates/other matches
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
            
            if (midVal < query) low = mid + 1;
            else high = mid - 1;
        }
        return results;
    }
}