// Global variables
let rewardsImages = []; // This will hold ALL images from IndexedDB (persistent)
let temporaryImageObject = null; // This holds the newly selected image temporarily
let nextImageId = Date.now(); // Base for unique IDs
let rewardImgId;
// Your existing IndexedDB setup (assuming you have one)
// If not, here's a complete setup
class RewardImagesDB {
    constructor() {
        this.dbName = 'RewardApp';
        this.storeName = 'rewardImages';
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
                        keyPath: 'id'  // 'id' is the unique key
                    });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }
    
    async saveAllImages(imagesArray) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            
            // Clear existing data first (optional - depends on your needs)
            const clearRequest = objectStore.clear();
            
            clearRequest.onsuccess = () => {
                let completed = 0;
                const errors = [];
                
                if (imagesArray.length === 0) {
                    resolve({ success: true, errors: [] });
                    return;
                }
                
                imagesArray.forEach(image => {
                    const request = objectStore.put(image); // Use put to add/update
                    request.onsuccess = () => {
                        completed++;
                        if (completed === imagesArray.length) {
                            resolve({ success: true, errors });
                        }
                    };
                    request.onerror = () => {
                        errors.push({ image: image.id, error: request.error });
                        completed++;
                        if (completed === imagesArray.length) {
                            resolve({ success: false, errors });
                        }
                    };
                });
            };
            
            clearRequest.onerror = () => reject(clearRequest.error);
        });
    }
    
    async getAllImages() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async addSingleImage(imageObject) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.add(imageObject);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Create database instance
const rewardImageDB = new RewardImagesDB();

// Function to load all images from IndexedDB on page load
async function loadImagesFromIndexedDB() {
    try {
        if (!rewardImageDB.db) {
            await rewardImageDB.init();
        }
        
        const images = await rewardImageDB.getAllImages();
        rewardsImages = images; // Load all existing images into the array
        
        console.log("all Reward Images",rewardsImages); 
        // Optional: Display the last uploaded image
        // if (images.length > 0) {
        //     document.getElementById('formRewardImg').src = images[images.length - 1].img;
        // } else {
        //     document.getElementById('formRewardImg').src = "src/images/magical_lamp.jpg";
        // }
        
        return images;
    } catch (error) {
        console.error('Error loading from IndexedDB:', error);
        rewardsImages = [];
        return [];
    }
}
// here is form's reward display functions
function toggleRewardForm(){
  let rewardFromOutside = document.getElementById("rewardFromOutside");
  let rewardForm = document.getElementById("rewardForm");
  let rewardName = document.getElementById("rewardName");
  let rewardNameInput = document.getElementById("rewardNameInput");
  // close and open of reward form
  if(rewardFromOutside.classList.contains("hidden")){
    rewardFromOutside.classList.remove("hidden");
    rewardFromOutside.classList.add("block");
    rewardForm.classList.remove("hidden");
    rewardForm.classList.add("block");
    setTimeout(() => {
      rewardFromOutside.classList.remove("opacity-0");
      rewardFromOutside.classList.add("opacity-30");
      rewardForm.classList.remove("scale-x-0");
      rewardForm.classList.add("scale-x-100");
    }, 1);
  }else {
    rewardFromOutside.classList.remove("opacity-30");
    rewardFromOutside.classList.add("opacity-0");
    rewardForm.classList.remove("scale-x-100");
    rewardForm.classList.add("scale-x-0");
    if(rewardNameInput.value != ''){
        rewardName.innerHTML = rewardNameInput.value;
        console.log("reward name", rewardNameInput.value);
    }else if(temporaryImageObject){
        rewardName.innerHTML = temporaryImageObject.fileName;
    }else{
        rewardName.innerHTML = '';
    }
    setTimeout(() => {
      rewardFromOutside.classList.remove("block");
      rewardFromOutside.classList.add("hidden");
      rewardForm.classList.remove("block");
      rewardForm.classList.add("hidden");
    }, 301);
  }
}
// Handle image selection - ONLY stores temporarily, does NOT save to IndexDB yet
document.getElementById('rewardImgInput').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {    
        // Display immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            // Update image display
            document.getElementById('formRewardImg').src = e.target.result;
            
            // Generate unique ID for the temporary image
            const uniqueId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Store temporarily - NOT in rewardsImages array yet
            temporaryImageObject = {
                id: uniqueId,
                img: e.target.result,  // Store as base64
                originalFile: file,
                fileName: file.name,
                fileSize: file.size,
                timestamp: Date.now(),
            };
            
            console.log('Image temporarily stored (not saved to DB yet):', temporaryImageObject);
            console.log('Current rewardsImages array (from DB):', rewardsImages);
        };
        
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error('Error handling image:', error);
        alert('Error handling image');
    }
});

// Handle Done button click - saves the temporary image to array and IndexDB, then resets display
async function handleRewardButton() {
    // Check if there's a temporary image waiting to be saved
    if (temporaryImageObject) {
        // Push the temporary image to the rewardsImages array
        
        temporaryImageObject.fileName = document.getElementById("rewardNameInput").value;
        temporaryImageObject.inventoryState = addToInventory;
        rewardsImages.push(temporaryImageObject);
        
        // Save the entire rewardsImages array to IndexedDB
        try {
            await rewardImageDB.saveAllImages(rewardsImages);
            console.log('Image saved successfully!');
            console.log('Updated rewardsImages array:', rewardsImages);
            // Before clearing the image id will be added to task object
            // Clear the temporary image (it's now saved)
            temporaryImageObject = null;
            toggleAddToInventory('no');
            document.getElementById("rewardNameInput").value ='';
            // RESET THE IMAGE DISPLAY BACK TO ORIGINAL
            document.getElementById('formRewardImg').src = "src/images/magical_lamp.jpg";
            
            // Clear the file input so the same image can be selected again if needed
            const fileInput = document.getElementById('rewardImgInput');
            if (fileInput) {
                fileInput.value = ''; // Reset the file input
            }
            
            // Optional: Show success message
            // alert('Image saved successfully!');
            
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
            alert('Error saving image to database');
        }
    } else {
        console.log('No temporary image to save');
        // Optional: alert('No new image selected');
    }
    
    // If you have other form data to save, handle it here
    // await saveOtherFormData();
}

// Optional: Function to save all rewards images at once (if you need it)
async function saveAllRewardsImages() {
    try {
        await rewardImageDB.saveAllImages(rewardsImages);
        console.log('All rewards images saved to IndexedDB');
        return true;
    } catch (error) {
        console.error('Error saving rewards images:', error);
        return false;
    }
}

// Optional: Function to delete a specific image by ID
async function deleteImageById(id) {
    try {
        // Remove from array
        rewardsImages = rewardsImages.filter(img => img.id !== id);
        
        // Update IndexedDB with the new array
        await rewardImageDB.saveAllImages(rewardsImages);
        
        console.log(`Image with ID ${id} deleted successfully`);
        
        // Update display if needed
        if (rewardsImages.length > 0) {
            document.getElementById('formRewardImg').src = rewardsImages[rewardsImages.length - 1].img;
        } else {
            document.getElementById('formRewardImg').src = "src/images/magical_lamp.jpg";
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}

// Function to get all saved images (useful for displaying gallery)
function getAllSavedImages() {
    return rewardsImages;
}

// Function to get a specific image by ID
function getImageById(id) {
    return rewardsImages.find(img => img.id === id);
}

// Initialize database and load images when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize IndexedDB
    await rewardImageDB.init();
    // Initialize the new selected images DB
    await selectedImagesDB.init();

    // Optional: Load selected images for display
    // await loadSelectedImagesForDisplay();
    // Load existing images from IndexedDB
    await loadImagesFromIndexedDB();
    
    // Optional: Check if there are unsaved images in sessionStorage
    const unsavedImage = sessionStorage.getItem('unsavedImage');
    if (unsavedImage) {
        temporaryImageObject = JSON.parse(unsavedImage);
        if (temporaryImageObject && temporaryImageObject.img) {
            document.getElementById('formRewardImg').src = temporaryImageObject.img;
        }
        sessionStorage.removeItem('unsavedImage');
    }
    
    // Save temporary image to sessionStorage before page refresh/unload
    // window.addEventListener('beforeunload', () => {
    //     if (temporaryImageObject) {
    //         sessionStorage.setItem('unsavedImage', JSON.stringify(temporaryImageObject));
    //     }
    // });
});

// Connect the Done button in your HTML
// Make sure your Done button has an id or you can attach event listener
// For example: <button id="doneBtn">Done</button>
// document.addEventListener('DOMContentLoaded', () => {
//     const doneButton = document.getElementById('yourDoneButtonId'); // Replace with your actual button ID
//     if (doneButton) {
//         doneButton.addEventListener('click', handleDoneButton);
//     }
// });