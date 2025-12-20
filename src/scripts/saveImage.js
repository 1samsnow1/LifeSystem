class ImageDB {
    constructor(dbName = 'ImageStorage', storeName = 'images') {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }
    
    // Initialize database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve();
            };
            
            request.onerror = (e) => {
                reject(e.target.error);
            };
        });
    }
    
    // Save image (no size limit!)
    async saveImage(key, file) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                const tx = this.db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                
                // Store as ArrayBuffer for better performance
                const request = store.put(e.target.result, key);
                
                request.onsuccess = () => resolve(e.target.result);
                request.onerror = (err) => reject(err);
            };
            
            // Read as Data URL for easy display
            reader.readAsDataURL(file);
        });
    }
    
    // Load image
    async loadImage(key) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, 'readonly');
            const store = tx.objectStore(this.storeName);
            const request = store.get(key);
            
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (err) => reject(err);
        });
    }
    
    // Delete image
    async deleteImage(key) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            const request = store.delete(key);
            
            request.onsuccess = () => resolve();
            request.onerror = (err) => reject(err);
        });
    }
}