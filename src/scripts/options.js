// option display functions
function openMobileOptionBtn(){
  let mobileOptionBtn = document.getElementById("mobileOptionBtn");
  let mobileOptionBtnContainer = document.getElementById("mobileOptionBtnContainer");
  mobileOptionBtnContainer.classList.toggle("h-0");
  mobileOptionBtnContainer.classList.toggle("h-[24px]");
  mobileOptionBtn.classList.toggle("scale-y-0");
  mobileOptionBtn.classList.toggle("scale-y-100");
}
function toggleOptionsDisplay(){
  let optionsContainer = document.getElementById("optionsContainer");
  let optionsOutside = document.getElementById("optionsOutside");
  if(optionsOutside.classList.contains("hidden")){
    optionsOutside.classList.remove("hidden");
    optionsOutside.classList.add("block");
    optionsContainer.classList.remove("hidden");
    optionsContainer.classList.add("block");
    setTimeout(() => {
      optionsOutside.classList.remove("opacity-0");
      optionsOutside.classList.add("opacity-100");
      optionsContainer.classList.remove("opacity-0");
      optionsContainer.classList.add("opacity-100");
      optionsContainer.classList.remove("-translate-y-10");
      optionsContainer.classList.add("-translate-y-0");
    }, 1);
  }else {
    optionsOutside.classList.add("opacity-0");
    optionsOutside.classList.remove("opacity-100");
    optionsContainer.classList.add("opacity-0");
    optionsContainer.classList.remove("opacity-100");
    optionsContainer.classList.add("-translate-y-10");
    optionsContainer.classList.remove("-translate-y-0");
    setTimeout(() => {
      optionsOutside.classList.add("hidden");
      optionsOutside.classList.remove("block");
      optionsContainer.classList.add("hidden");
      optionsContainer.classList.remove("block");
    }, 300);
  }
}
let activeMenu = 'App colors';
function selectOptionMenu(clickedMenu = activeMenu){
  let optionsCategoryContainer = document.getElementById("optionsCategoryContainer");
  let categories = [...optionsCategoryContainer.querySelectorAll(".optionCategory")];
  let selectedMenu = categories.find(category=> category.innerText == clickedMenu);
  categories.forEach((category)=>{
    if(category.classList.contains("border-white")){
      category.classList.remove("border-white");
      category.classList.remove("opacity-100");
      category.classList.add("border-transparent");
      category.classList.add("opacity-70");
    }
  })
  if(selectedMenu) {
    selectedMenu.classList.remove("border-transparent");
    selectedMenu.classList.remove("opacity-70");
    selectedMenu.classList.add("border-white");
    selectedMenu.classList.add("opacity-100");
    activeMenu = clickedMenu;
    createOptions();
  }
}

//titles
let user_titles = JSON.parse(localStorage.getItem("userTitles")) || [
    {level:1, title:'Novice'},
    {level:5, title:'Apprentice'},
    {level:10, title:'Adept'},
    {level:20, title:'Expert'},
    {level:35, title:'Master'},
    {level:50, title:'Grandmaster'},
    {level:70, title:'Challenger'},
];
let user_stats = JSON.parse(localStorage.getItem("user_stats")) || [];
// color options
const cssVariablesByCategory = [
  {
    category: "Layout & Background",
    variables: [
      { name: "Header Background", color: "#162456", variableName: "--header-bg" },
      { name: "footer border", color: "#ffffff", variableName: "--footer-border" },
      { name: "Theme Color", color: "#1D1340", variableName: "--theme-color" },
      { name: "Theme Color Light", color: "#7f8ee3", variableName: "--theme-color-light" },
      { name: "Content Start Background", color: "oklch(70.7% 0.165 254.624)", variableName: "--content-start-bg" },
      { name: "Content End Background", color: "#162456", variableName: "--content-end-bg" },
      { name: "Content text", color: "white", variableName: "--content-text" }
    ]
  },
  {
    category: "XP System",
    variables: [
      { name: "XP Bar Background", color: "#1D1340", variableName: "--xp-bar-bg" },
      { name: "XP Bar Remaining Background", color: "#426387", variableName: "--xp-bar-remaining-bg" },
      { name: "XP Particles", color: "oklch(88.2% 0.059 254.128)", variableName: "--xp-particles" },
      { name: "Accent Level", color: "oklch(93.2% 0.032 255.585)", variableName: "--acc-level" }
    ]
  },
  {
    category: "Tasks & UI",
    variables: [
      { name: "Task Border", color: "oklch(80.9% 0.105 251.813)", variableName: "--task-border" },
      { name: "Task Shadow", color: "oklch(70.7% 0.165 254.624)", variableName: "--task-shadow" },
      { name: "Border Color", color: "oklch(70.7% 0.165 254.624)", variableName: "--border-color" },
      { name: "Accept Task Background", color: "#155dfc", variableName: "--accept-task-bg" },
      { name: "Accept Task Hover Background", color: "#1447e6", variableName: "--accept-task-hover-bg" }
    ]
  },
  {
    category: "Priority Colors",
    variables: [
      { name: "Priority 1", color: "oklch(80.8% 0.114 19.571)", variableName: "--prio1" },
      { name: "Priority 2", color: "#ffb869", variableName: "--prio2" },
      { name: "Priority 3", color: "#7bf1a8", variableName: "--prio3" },
      { name: "Priority 4", color: "#d1d5dc", variableName: "--prio4" },
      { name: "Priority Container Background", color: "#162456", variableName: "--priority-container-bg" }
    ]
  },
  {
    category: "stats",
    variables: [
      { name: "stats icon bg", color: "oklch(93.2% 0.032 255.585)", variableName: "--stats-Icon-bg" },
      { name: "stats Icon bg shadow", color: "#162456", variableName: "--stats-Icon-bg-shadow" },
      { name: "stats icon line", color: "#162456", variableName: "--stats-Icon-line" },
      { name: "stats icon line shadow", color: "#162456", variableName: "--stats-Icon-line-shadow" },
      { name: "stats icon dots", color: "#162456", variableName: "--stats-Icon-dot" },
      { name: "stats icon dots shadow", color: "#162456", variableName: "--stats-Icon-dot-shadow" },
      { name: "add stats form background", color: "#1D1340", variableName: "--stats-form-bg" }
    ]
  },
  {
    category: "Form & Inputs",
    variables: [
      { name: "Add Form Background Start", color: "oklch(70.7% 0.165 254.624)", variableName: "--add-form-bg-start" },
      { name: "Add Form Background End", color: "#162456", variableName: "--add-form-bg-end" },
      { name: "Add Form scrollbar", color: "#8ec5ff", variableName: "--add-form-scrollbar" },
      { name: "Error Color", color: "#ff6467", variableName: "--error-color" },
      { name: "Input Number Border", color: "white", variableName: "--input-number-border" },
      { name: "Title Input Border", color: "#e5e7eb", variableName: "--title-input" }
    ]
  },
  {
    category: "Icons & Misc",
    variables: [
      { name: "Trash Icon", color: "oklch(80.8% 0.114 19.571)", variableName: "--trash-icon" },
      { name: "Profile Delete Icon", color: "oklch(88.2% 0.059 254.128)", variableName: "--profile-delete-icon" },
      { name: "Checkbox Inactive", color: "white", variableName: "--checkbox-inactive" },
      { name: "Checkbox Active", color: "#162456", variableName: "--checkbox-active" },
      { name: "Static Checkbox", color: "#162456", variableName: "--checkbox-active" },
    ]
  }
];
let changedColors = JSON.parse(localStorage.getItem("changedColors")) || [];
let root = document.documentElement;
// if the changed color has value it will initialize this function a for each object it has, the foreach loop is in app.js on DOMContentLoaded
function changeVarColorsOnLoad (cssVarName,savedColorValue){
  console.log(cssVarName + ": " + savedColorValue);
  root.style.setProperty(cssVarName,savedColorValue);
}
function changeVarColor (cssVarName,selectedInput){
  console.log("the input: " + selectedInput.value);
  root.style.setProperty(cssVarName,selectedInput.value);
  changedColors.push({varName: cssVarName, colorValue: selectedInput.value});
  console.log(changedColors);
  localStorage.setItem("changedColors",JSON.stringify(changedColors));
}

//change options tab
let optionsInnerContainer = document.getElementById("optionsInnerContainer");
function createOptions(){
  optionsInnerContainer.innerHTML = "";
  if(activeMenu == 'App colors'){
    let resetColorsBtn = document.createElement("template");
    resetColorsBtn.innerHTML = `
    <div class="w-full flex items-center gap-2">
        <p>reset to default colors:</p>
        <button class="resetColorBtn ml-2 px-3 py-1 bg-blue-950 text-white rounded cursor-pointer">
            Reset
        </button>
    </div>
    `;
    optionsInnerContainer.appendChild(resetColorsBtn.content);
    cssVariablesByCategory.forEach((varCategory)=>{
      let option = document.createElement("div");
      option.innerHTML += `<h3 class="mb-2">- ${varCategory.category}</h3>`;
      varCategory.variables.forEach((variable)=>{
        let optionContent = document.createElement("div");
        optionContent.classList.add("variablesContainer");
        const inputId = `input-${variable.variableName.replace(/[^a-zA-Z0-9]/g, '-')}`;
        optionContent.innerHTML = `
        <div class="varContainer">
          <div class="nameAndColor">
              <p>${variable.name}: </p>
              <div class="min-w-4 h-4 ml-2 mr-1 border-2 border-black bg-[var(${variable.variableName})]"></div>
              <input id="${inputId}" class="formInput min-w-[200px]" type="text" value="${variable.color}" data-var-name="${variable.variableName}">
              <button class="apply-btn ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer" data-input-id="${inputId}">
                Apply
              </button>
          </div>
        </div>`;
        option.appendChild(optionContent);
      })
      optionsInnerContainer.appendChild(option);
    })
  }else if(activeMenu == 'Account'){
    let state_totalXp = localStorage.getItem("user_total_xp") || 0;
    let state_level = localStorage.getItem("user_level") || 0;
    let state_completed_task_amount = JSON.parse(localStorage.getItem('completed_tasks')) || 0;
    if(state_completed_task_amount != 0){
      state_completed_task_amount = state_completed_task_amount.length
    }
    let state_title = localStorage.getItem("user_title") || 'New';
    let accountOptions = document.createElement("div");
    accountOptions.innerHTML = `
                  <div class="w-full grid grid-cols-2 gap-2 sm:text-lg -translate-y-2 pl-2">
                    <div class="flex gap-1">
                        <p>Level:</p>
                        <p>${state_level}</p>
                    </div>
                    <div class="flex gap-1">
                        <p>Task Completed:</p>
                        <p>${state_completed_task_amount}</p>
                    </div>
                    <div class="flex gap-1">
                        <p>Total XP:</p>
                        <p>${state_totalXp}</p>
                    </div>
                    <div class="flex gap-1">
                        <p>Title:</p>
                        <p>${state_title}</p>
                    </div>
                  </div>
                    `;
     let acountStats = document.createElement("div");
     acountStats.className = "w-full grid grid-cols-2 gap-2 sm:text-lg -translate-y-2 pl-2";
     user_stats.forEach((stat)=>{
      acountStats.innerHTML += `
        <div class="flex gap-1">
            <p>${stat.statName}: </p>
            <p>${stat.statLevel}</p>
        </div>
      `;
     });
    optionsInnerContainer.innerHTML += `<h2 class="font-semibold text-lg sm:text-xl">General Info</h2>`;
    optionsInnerContainer.appendChild(accountOptions);
    optionsInnerContainer.innerHTML += `<h2 class="font-semibold text-lg sm:text-xl">Stats</h2>`;
    optionsInnerContainer.appendChild(acountStats);
    optionsInnerContainer.innerHTML += `
      <div class="flex gap-20">
        <p>delete all data</p>
        <button onclick="deleteAllData()" class="p-1 bg-[var(--add-form-bg-end)] rounded-md cursor-pointer">
          <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="var(--trash-icon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      `;   
  }else if(activeMenu == 'App info'){
    let appInfo = document.createElement("div");
    appInfo.innerHTML = `
                        <div>
                        <h3 class="text-lg mb-2">App info</h3>
                        <div class="flex items-center gap-2">
                         <div>
                            <svg width="16px" height="16px" fill="var(--acc-level)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 45.311 45.311" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M22.675,0.02c-0.006,0-0.014,0.001-0.02,0.001c-0.007,0-0.013-0.001-0.02-0.001C10.135,0.02,0,10.154,0,22.656 c0,12.5,10.135,22.635,22.635,22.635c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c12.5,0,22.635-10.135,22.635-22.635 C45.311,10.154,35.176,0.02,22.675,0.02z M22.675,38.811c-0.006,0-0.014-0.001-0.02-0.001c-0.007,0-0.013,0.001-0.02,0.001 c-2.046,0-3.705-1.658-3.705-3.705c0-2.045,1.659-3.703,3.705-3.703c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0 c2.045,0,3.706,1.658,3.706,3.703C26.381,37.152,24.723,38.811,22.675,38.811z M27.988,10.578 c-0.242,3.697-1.932,14.692-1.932,14.692c0,1.854-1.519,3.356-3.373,3.356c-0.01,0-0.02,0-0.029,0c-0.009,0-0.02,0-0.029,0 c-1.853,0-3.372-1.504-3.372-3.356c0,0-1.689-10.995-1.931-14.692C17.202,8.727,18.62,5.29,22.626,5.29 c0.01,0,0.02,0.001,0.029,0.001c0.009,0,0.019-0.001,0.029-0.001C26.689,5.29,28.109,8.727,27.988,10.578z"></path> </g> </g></svg>
                         </div>
                         <p>This app uses local storage to store data and indexDB to store image</p>
                        </div>
                        <h3 class="text-lg mt-4 mb-2">Made of</h3>
                        <p>HTML5, CSS3, Tailwind CSS, Vanilla JavaScript</p>
                        <p class="mt-4">Version: 1.5.3</p>
                    </div>
    `;
    optionsInnerContainer.appendChild(appInfo);
  }else if(activeMenu == 'System Titles'){
    let resetSystemTitlesBtn = document.createElement("template");
    resetSystemTitlesBtn.innerHTML = `
    <div class="w-full flex items-center gap-2">
        <p>reset to default titles:</p>
        <button data-target-level="reset" data-target-id="reset" class="apply-title px-3 py-1 bg-blue-950 text-white rounded cursor-pointer">
            Reset
        </button>
    </div>
    `;
    optionsInnerContainer.appendChild(resetSystemTitlesBtn.content);
    let titles_container = document.createElement("div");
    titles_container.innerHTML += `<h2 class="mb-2">System Titles: </h2>`;
    user_titles.forEach((user_title)=>{
      let title_option = document.createElement("template");
      const titleInputId = `${Math.floor(Math.random()*(11 - user_title.level)*10)}`;
      title_option.innerHTML = `  
        <div class="flex gap-2 items-center mt-2">
            <div class="flex gap-2 items-center">
                <h3>level: </h3>
                <input class="formInput border-b-2 border-[var(--title-input)] w-10" type="number" id="${titleInputId}_level" value="${user_title.level}">
                <div>=></div>
            </div>
            <div class="flex gap-2 items-center">
                <h3>title: </h3>
                <input class="formInput border-b-2 border-[var(--title-input)] w-fit" type="text" id="${titleInputId}_title" value="${user_title.title}">
            </div>
            <button data-target-level="${user_title.level}" data-input-id="${titleInputId}" class="apply-title w-8 h-8 rounded-full relative cursor-pointer transition-all duration-300 active:scale-90 staticCheckIcon">
              <div class="w-4 h-4 rounded-full absolute top-1 right-1 bg-white pointer-events-none z-0"></div>
            </button>
        </div>
      `;
      titles_container.appendChild(title_option.content);
    });
    titles_container.innerHTML += `<h2 class="mt-4">Add New Titles: </h2>`;
    let newTitle_option = document.createElement("template");
    newTitle_option.innerHTML = `  
      <div class="flex gap-2 items-center mt-1">
          <div class="flex gap-2 items-center">
              <h3>level: </h3>
              <input class="formInput border-b-2 border-[var(--title-input)] w-10" type="number" id="new_level" value="100">
              <div>=></div>
          </div>
          <div class="flex gap-2 items-center">
              <h3>title: </h3>
              <input class="formInput border-b-2 border-[var(--title-input)] w-fit" type="text" id="new_title" value="new">
          </div>
          <button data-target-level="new" data-input-id="new" class="apply-title w-5 h-5 flex justify-center translate-x-2 rounded-full bg-[var(--static-checkbox)] text-[var(--content-text)] cursor-pointer transition-all duration-300 active:scale-90">
            <span class="-translate-y-1">+</span>
          </button>
      </div>
    `;
    titles_container.appendChild(newTitle_option.content);
    optionsInnerContainer.appendChild(titles_container);
    insertStaticCheckIcons();
  }
}
// options btn with event delegation
optionsInnerContainer.addEventListener('click', function(e) {
  // console.log(e.target);
  if (e.target.classList.contains('apply-btn')) {
    const inputId = e.target.getAttribute('data-input-id');
    const inputElement = document.getElementById(inputId);
    const varName = inputElement.getAttribute('data-var-name');
    changeVarColor(varName, inputElement);
  }else if(e.target.classList.contains('resetColorBtn')){
    changeToDefaultColors();
  }else if(e.target.classList.contains('apply-title')){
    const inputId = e.target.getAttribute('data-input-id');
    const targetLevel = e.target.getAttribute('data-target-level');
    let titleInput;
    let levelInput;
    if(targetLevel != 'reset'){
      titleInput = document.getElementById(`${inputId}_title`).value;
      levelInput = document.getElementById(`${inputId}_level`).value;
    }
    changeUserTitles(targetLevel , levelInput, titleInput);
  }
});
function changeUserTitles(targetLevel, inputLevel = 'reset', inputTitle='reset'){
  console.log("target_level: "+ targetLevel+" =>"+"level: "+inputLevel + " | " + "title: "+inputTitle);
  if(targetLevel == 'reset'){
    if(JSON.parse(localStorage.getItem("userTitles"))){
      localStorage.removeItem("userTitles");
    }
    user_titles = [
      {level:1, title:'Novice'},
      {level:5, title:'Apprentice'},
      {level:10, title:'Adept'},
      {level:20, title:'Expert'},
      {level:35, title:'Master'},
      {level:50, title:'Grandmaster'},
      {level:70, title:'Challenger'},
    ];
    return createOptions();
  }else if (targetLevel == 'new'){
    let existingTitle = user_titles.findIndex((currentTitle)=>currentTitle.title == inputTitle || currentTitle.level == parseInt(inputLevel));
    if(existingTitle == -1){
      user_titles.push({level:parseInt(inputLevel), title: inputTitle});
      localStorage.setItem("userTitles",JSON.stringify(user_titles));
      optionsInnerContainer.classList.toggle("opacity-0");
      setTimeout(() => {
        optionsInnerContainer.classList.toggle("opacity-0");
      }, 310);
      return createOptions();
    }else {
      return alert("title exists with that level or name");
    }
  }
  user_titles =  user_titles.map(item => {
    if (item.level == parseInt(targetLevel)) {
      return { level: parseInt(inputLevel), title: inputTitle };
    }
    return item;
  });
  localStorage.setItem("userTitles", JSON.stringify(user_titles));
  console.log(user_titles);
}
function changeToDefaultColors(){
  if(changedColors.length !=0 ){
    changedColors = cssVariablesByCategory;
    changedColors.forEach((colorV)=>{
      console.log(colorV);
      colorV.variables.forEach((varies)=>{
        changeVarColorsOnLoad(varies.variableName, varies.color);
      });
    });
    localStorage.removeItem("changedColors");
    changedColors = [];
  }
  // if(localStorage.getItem("changedColors")){
  //   localStorage.removeItem("changedColors");
  //   window.location.reload();
  // }
}

async function deleteAllData(){
  let checkedFirstTask = localStorage.getItem('checked_first_task') || false;
  // if(localStorage.getItem("user_level") || checkedFirstTask || user_stats.length !=0 || myTasks.length !=0)
  if(confirm('Are you sure you want to delete all data?')){
    localStorage.removeItem("checked_first_task");
    localStorage.removeItem("user_title");
    localStorage.removeItem("user_total_xp");
    localStorage.removeItem('user_level');
    localStorage.removeItem("remain_xp");
    localStorage.removeItem('myTasks');
    localStorage.removeItem('completed_tasks');
    localStorage.removeItem('taskNumber');
    localStorage.removeItem('taskNumberSoFar');
    localStorage.removeItem('appNotif');
    localStorage.removeItem('user_stats');
    localStorage.removeItem("taskDates");
    await clearObjectStore('RewardApp', 'rewardImages');
    await clearObjectStore('SelectedRewardImagesDB', 'selectedImages');
    window.location.reload();
  }
}
// Function to clear all data from a specific object store
async function clearObjectStore(dbName, storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);
        
        request.onerror = () => reject(request.error);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            const clearRequest = objectStore.clear();
            
            clearRequest.onsuccess = () => {
                console.log(`All data cleared from "${storeName}" in "${dbName}"`);
                db.close();
                resolve(true);
            };
            
            clearRequest.onerror = () => {
                console.error(`Error clearing data from "${storeName}":`, clearRequest.error);
                db.close();
                reject(clearRequest.error);
            };
        };
    });
}

// Example usage:
// await clearObjectStore('RewardApp', 'rewardImages');
// await clearObjectStore('SelectedRewardImagesDB', 'selectedImages');