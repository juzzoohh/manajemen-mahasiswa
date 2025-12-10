export class Algorithms {
    static compare(a, b, key, order) {
        let valA = a[key], valB = b[key];
        if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
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
                const isCondition = order === 'asc' 
                    ? (a, b) => this.isGreater(a, b, key) 
                    : (a, b) => this.isSmaller(a, b, key);

                for (j = i; j >= gap && isCondition(arr[j - gap][key], temp[key]); j -= gap) {
                    arr[j] = arr[j - gap];
                }
                arr[j] = temp;
            }
        }
        return arr;
    }

    static isGreater(valA, valB, key) {
        if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
        if (key === 'ipk') { valA = parseFloat(valA); valB = parseFloat(valB); }
        return valA > valB;
    }
    
    static isSmaller(valA, valB, key) {
        if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
        if (key === 'ipk') { valA = parseFloat(valA); valB = parseFloat(valB); }
        return valA < valB;
    }

    static linearSearch(data, key, query) {
        return data.filter(item => item[key].toString().toLowerCase().includes(query.toLowerCase()));
    }

    static binarySearch(data, key, query) {
        let sorted = [...data].sort((a, b) => (a[key] > b[key] ? 1 : -1));
        let low = 0, high = sorted.length - 1, results = [];
        query = query.toLowerCase();
        
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            let midVal = sorted[mid][key].toString().toLowerCase();
            if (midVal === query) { results.push(sorted[mid]); return results; } 
            if (midVal < query) low = mid + 1;
            else high = mid - 1;
        }
        return results;
    }
}