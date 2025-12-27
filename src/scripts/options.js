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
      { name: "Content End Background", color: "#162456", variableName: "--content-end-bg" }
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
    category: "Form & Inputs",
    variables: [
      { name: "Add Form Background Start", color: "oklch(70.7% 0.165 254.624)", variableName: "--add-form-bg-start" },
      { name: "Add Form Background End", color: "#162456", variableName: "--add-form-bg-end" },
      { name: "Add Form scrollbar", color: "#8ec5ff", variableName: "--add-form-scrollbar" },
      { name: "Error Color", color: "#ff6467", variableName: "--error-color" },
      { name: "Input Number Border", color: "white", variableName: "--input-number-border" }
    ]
  },
  {
    category: "Icons & Misc",
    variables: [
      { name: "Trash Icon", color: "oklch(80.8% 0.114 19.571)", variableName: "--trash-icon" },
      { name: "Profile Delete Icon", color: "oklch(88.2% 0.059 254.128)", variableName: "--profile-delete-icon" },
      { name: "Checkbox Inactive", color: "white", variableName: "--checkbox-inactive" },
      { name: "Checkbox Active", color: "#162456", variableName: "--checkbox-active" }
    ]
  }
];
let root = document.documentElement;
function changeVarColor (cssVarName,selectedInput){
  console.log(cssVarName);
  console.log("the input: " + selectedInput.value);
  root.style.setProperty(cssVarName,selectedInput.value);
}

let optionsInnerContainer = document.getElementById("optionsInnerContainer");
function createOptions(){
  optionsInnerContainer.innerHTML = "";
  if(activeMenu == 'App colors'){
    cssVariablesByCategory.forEach((varCategory)=>{
      let option = document.createElement("div");
      option.innerHTML += `<h3 class="mb-2">- ${varCategory.category}</h3>`;
      varCategory.variables.forEach((variable)=>{
        let optionContent = document.createElement("div");
        optionContent.classList.add("variablesContainer");
        optionContent.innerHTML = `
        <div class="varContainer">
          <div class="nameAndColor">
              <p>${variable.name}: </p>
              <div class="min-w-4 h-4 ml-2 mr-1 border-2 border-black bg-[var(${variable.variableName})]"></div>
              <input onblur="changeVarColor('${variable.variableName}',this)" class="formInput min-w-[200px]" type="text" value="${variable.color}">
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
                  <div class="w-full grid grid-cols-2 gap-2 sm:text-lg">
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
                  <div class="flex gap-20 mt-6">
                    <p>delete all data</p>
                    <button onclick="deleteAllData()" class="p-1 bg-[var(--add-form-bg-end)] rounded-md cursor-pointer">
                      <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="var(--trash-icon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                    `;
                 optionsInnerContainer.appendChild(accountOptions);   
  }else if(activeMenu == 'App info'){
    let appInfo = document.createElement("div");
    appInfo.innerHTML = `
                        <div>
                        <h3 class="text-lg mb-2">App info</h3>
                        <div class="flex items-center gap-2">
                         <div>
                            <svg width="16px" height="16px" fill="var(--acc-level)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 45.311 45.311" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M22.675,0.02c-0.006,0-0.014,0.001-0.02,0.001c-0.007,0-0.013-0.001-0.02-0.001C10.135,0.02,0,10.154,0,22.656 c0,12.5,10.135,22.635,22.635,22.635c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c12.5,0,22.635-10.135,22.635-22.635 C45.311,10.154,35.176,0.02,22.675,0.02z M22.675,38.811c-0.006,0-0.014-0.001-0.02-0.001c-0.007,0-0.013,0.001-0.02,0.001 c-2.046,0-3.705-1.658-3.705-3.705c0-2.045,1.659-3.703,3.705-3.703c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0 c2.045,0,3.706,1.658,3.706,3.703C26.381,37.152,24.723,38.811,22.675,38.811z M27.988,10.578 c-0.242,3.697-1.932,14.692-1.932,14.692c0,1.854-1.519,3.356-3.373,3.356c-0.01,0-0.02,0-0.029,0c-0.009,0-0.02,0-0.029,0 c-1.853,0-3.372-1.504-3.372-3.356c0,0-1.689-10.995-1.931-14.692C17.202,8.727,18.62,5.29,22.626,5.29 c0.01,0,0.02,0.001,0.029,0.001c0.009,0,0.019-0.001,0.029-0.001C26.689,5.29,28.109,8.727,27.988,10.578z"></path> </g> </g></svg>
                         </div>
                         <p>This app uses local storage to store data</p>
                        </div>
                        <h3 class="text-lg mt-4 mb-2">Made of</h3>
                        <p>this app is made of pure js</p>
                        <p class="mt-4">Version: 1.0.0</p>
                    </div>
    `;
    optionsInnerContainer.appendChild(appInfo);
  }
}
function deleteAllData(){
  let checkedFirstTask = localStorage.getItem('checked_first_task') || false;
  if(localStorage.getItem("user_level")){
    localStorage.removeItem("checked_first_task");
    localStorage.removeItem("user_title");
    localStorage.removeItem("user_total_xp");
    localStorage.removeItem('user_level');
    localStorage.removeItem("remain_xp");
    localStorage.removeItem('myTasks');
    localStorage.removeItem('completed_tasks');
    window.location.reload();
  }else if(checkedFirstTask){
    localStorage.removeItem("checked_first_task");
    window.location.reload();
  }
}