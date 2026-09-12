// the initiation of inventory db is in rewardsImgs.js
class SelectedImagesDB {
    constructor() {
        this.dbName = 'SelectedRewardImagesDB';
        this.storeName = 'selectedImages';
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { 
                        keyPath: 'id'  // Use the original image ID as key
                    });
                    objectStore.createIndex('selectedTimestamp', 'selectedTimestamp', { unique: false });
                    objectStore.createIndex('originalId', 'id', { unique: true });
                }
            };
        });
    }
    
    // Add a selected image to this database
    async addSelectedImage(imageObject) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            
            // Add selection metadata
            const selectedImage = {
                ...imageObject,  // Keep all original image data
                selectedTimestamp: Date.now(),  // When it was selected
                selectedId: Date.now() + '_' + Math.random().toString(36).substr(2, 5)  // Unique selection ID
            };
            
            const request = objectStore.put(selectedImage); // Use put to add/update
            
            request.onsuccess = () => resolve(selectedImage);
            request.onerror = () => reject(request.error);
        });
    }
    
    // Remove an image from selected database
    async removeSelectedImage(imageId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(imageId);
            
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
    
    // Get all selected images
    async getAllSelectedImages() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    // Check if an image is already selected
    async isImageSelected(imageId) {
        const selectedImages = await this.getAllSelectedImages();
        return selectedImages.some(img => img.id === imageId);
    }
    
    // Toggle selection (add if not selected, remove if selected)
    async toggleSelectImage(imageObject) {
        const isSelected = await this.isImageSelected(imageObject.id);
        
        if (isSelected) {
            await this.removeSelectedImage(imageObject.id);
            return { action: 'removed', imageId: imageObject.id };
        } else {
            const selected = await this.addSelectedImage(imageObject);
            return { action: 'added', image: selected };
        }
    }
    
    // Clear all selected images
    async clearAllSelected() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();
            
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
}

// Create instance of the new database
const selectedImagesDB = new SelectedImagesDB();

// Initiation of both databases is in rewardsImgs.js

// ========== FUNCTIONS TO MANAGE SELECTED IMAGES ==========

// Function to select an image from rewardsImages
async function selectRewardImage(imageId) {
    // Find the image in rewardsImages
    const imageToSelect = rewardsImages.find(img => img.id === imageId);
    
    if (!imageToSelect) {
        console.error('Image not found with ID:', imageId);
        return null;
    }
    
    try {
        const result = await selectedImagesDB.toggleSelectImage(imageToSelect);
        
        if (result.action === 'added') {
            console.log('Image selected successfully:', result.image);
            showNotification('Image added to selected rewards!');
        } else {
            console.log('Image removed from selection:', result.imageId);
            showNotification('Image removed from selected rewards!');
        }
        
        // Refresh the display of selected images
        // await loadSelectedImagesForDisplay();
        
        return result;
    } catch (error) {
        console.error('Error selecting image:', error);
        showNotification('Error selecting image', 'error');
        return null;
    }
}

// Function to get all selected images
async function getAllSelectedRewardImages() {
    try {
        const selectedImages = await selectedImagesDB.getAllSelectedImages();
        console.log('Selected images:', selectedImages);
        return selectedImages;
    } catch (error) {
        console.error('Error getting selected images:', error);
        return [];
    }
}

// Function to load and display selected images (for UI)
async function loadSelectedImagesForDisplay() {
    const selectedImages = await selectedImagesDB.getAllSelectedImages();
    
    // If you have a container to display selected images
    const inventory = document.getElementById('inventory');
    if (inventory) {
        if (selectedImages.length == 0) {
            for(i=0;i<=1;i++){
                inventory.innerHTML += `
                    <div class="w-20 h-20 p-1 border-2 border-gray-700 rounded-md cursor-pointer">
                        <div class="w-full h-full border-2 border-dashed border-gray-700 text-gray-700 text-2xl rounded-md flex justify-center items-center"><span>+</span></div>
                    </div>
                `;
            }
        }else {
            console.log('Loaded existing rewards images from IndexedDB:', rewardsImages);
            selectedImages.forEach(item =>{
                inventory.innerHTML += `
                <div class="w-20 h-20 border-2 border-gray-700 rounded-md cursor-pointer">
                    <img class="w-full h-full rounded-md" src="${item.img}" alt="${item.fileName}">
                </div>
                `;
            });
            for(i=0;i<=1;i++){
                inventory.innerHTML += `
                    <div class="w-20 h-20 p-1 border-2 border-gray-700 rounded-md cursor-pointer">
                        <div class="w-full h-full border-2 border-dashed border-gray-700 text-gray-700 text-2xl rounded-md flex justify-center items-center"><span>+</span></div>
                    </div>
                `;
            }
        }
    }
    
    return selectedImages;
}

// Function to remove a specific selected image
async function removeSelectedImage(imageId) {
    try {
        await selectedImagesDB.removeSelectedImage(imageId);
        console.log('Selected image removed:', imageId);
        await loadSelectedImagesForDisplay(); // Refresh display
        showNotification('Image removed from selection');
        return true;
    } catch (error) {
        console.error('Error removing selected image:', error);
        return false;
    }
}

// Function to clear all selected images
async function clearAllSelectedImages() {
    if (confirm('Are you sure you want to clear all selected images?')) {
        try {
            await selectedImagesDB.clearAllSelected();
            await loadSelectedImagesForDisplay();
            showNotification('All selected images cleared');
            return true;
        } catch (error) {
            console.error('Error clearing selected images:', error);
            return false;
        }
    }
    return false;
}

// Helper function for notifications
function showNotification(message, type = 'success') {
    // You can customize this to use your existing notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Example using alert (replace with your preferred notification method)
    // alert(message);
    
    // Or use a toast notification if you have one
    // toast(message, type);
}

// ========== EXAMPLE: CREATE A GALLERY TO SELECT IMAGES ==========
// Function to display all rewards images with checkboxes/selection UI
async function displayRewardsGallery() {
    const galleryContainer = document.getElementById('rewardsGallery');
    if (!galleryContainer) return;
    
    const selectedImages = await selectedImagesDB.getAllSelectedImages();
    const selectedIds = new Set(selectedImages.map(img => img.id));
    
    if (rewardsImages.length === 0) {
        galleryContainer.innerHTML = '<p>No reward images available</p>';
        return;
    }
    
    galleryContainer.innerHTML = rewardsImages.map(img => `
        <div class="reward-image-card" data-id="${img.id}">
            <img src="${img.img}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px;">
            <div class="image-info">
                <p>${img.fileName || 'Reward Image'}</p>
                <label class="selection-checkbox">
                    <input type="checkbox" 
                           ${selectedIds.has(img.id) ? 'checked' : ''} 
                           onchange="selectRewardImage('${img.id}')">
                    Select for special rewards
                </label>
            </div>
        </div>
    `).join('');
}

// Call this when you want to show the gallery
async function showRewardsSelectionGallery() {
    await displayRewardsGallery();
}

// handle inventory btn
async function handleInventory() {
    if (temporaryImageObject) {
        rewardsImages.push(temporaryImageObject);
        
        try {
            await rewardImageDB.saveAllImages(rewardsImages);
            console.log('Image saved successfully!');
            
            temporaryImageObject = null;
            document.getElementById('formRewardImg').src = "src/images/magical_lamp.jpg";
            
            // Clear the file input
            const fileInput = document.getElementById('rewardImgInput');
            if (fileInput) {
                fileInput.value = '';
            }
            
            // Refresh the gallery if it's visible
            const galleryContainer = document.getElementById('rewardsGallery');
            if (galleryContainer && galleryContainer.style.display !== 'none') {
                await displayRewardsGallery();
            }
            
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
            alert('Error saving image to database');
        }
    } else {
        console.log('No temporary image to save');
    }
}


let addToInventory = false;
// this is for reward form
function toggleAddToInventory(choice){
  let inventory_yes_choice = document.getElementById("inventory_yes_choice");
  let inventory_no_choice = document.getElementById("inventory_no_choice");
  if(choice == 'yes'){
    addToInventory = true;
    inventory_yes_choice.classList.remove("text-[var(--content-text)]");
    inventory_yes_choice.classList.add("bg-[var(--reward-btn-bg)]");
    inventory_yes_choice.classList.add("text-[var(--stat-form-bg)]");
    inventory_no_choice.classList.remove("bg-[var(--reward-btn-bg)]");
    inventory_no_choice.classList.remove("text-[var(--stat-form-bg)]");
    if(!inventory_no_choice.classList.contains("text-[var(--content-text)]")){
      inventory_no_choice.classList.add("text-[var(--content-text)]")
    }
  }else {
    addToInventory = false
    inventory_no_choice.classList.remove("text-[var(--content-text)]")
    inventory_no_choice.classList.add("bg-[var(--reward-btn-bg)]");
    inventory_no_choice.classList.add("text-[var(--stat-form-bg)]");
    inventory_yes_choice.classList.remove("bg-[var(--reward-btn-bg)]");
    inventory_yes_choice.classList.remove("text-[var(--stat-form-bg)]");
    if(!inventory_yes_choice.classList.contains("text-[var(--content-text)]")){
      inventory_yes_choice.classList.add("text-[var(--content-text)]")
    }
  }
}
// this is the inventory display
function toggleInventoryDisplay(){
    let inventoryOutside = document.getElementById("inventoryOutside");
    let inventoryContainer = document.getElementById("inventoryContainer");
    let inventory = document.getElementById("inventory");
    if(inventoryContainer.classList.contains("hidden")){
        inventoryContainer.classList.toggle("hidden");
        inventoryOutside.classList.toggle("hidden");
        setTimeout(() => {
            inventoryContainer.classList.toggle("scale-y-0");
            inventoryContainer.classList.toggle("scale-y-100");
            inventoryOutside.classList.toggle("opacity-0");
            inventoryOutside.classList.toggle("opacity-30");
        }, 1);
        loadSelectedImagesForDisplay();
    }else {
        inventoryContainer.classList.toggle("scale-y-0");
        inventoryContainer.classList.toggle("scale-y-100");
        inventoryOutside.classList.toggle("opacity-0");
        inventoryOutside.classList.toggle("opacity-30");
        setTimeout(() => {
            inventoryContainer.classList.toggle("hidden");
            inventoryOutside.classList.toggle("hidden");
            inventory.innerHTML = "";
        }, 310);
    }
}