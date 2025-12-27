const ChallengesContainer = document.getElementById("ChallengesContainer");
const container = document.getElementById("xp-bar");

const numParticles = 20; // number of particles
for (let i = 0; i < numParticles; i++) {
  const particle = document.createElement("div");
  particle.className = "w-4 h-0.5 rounded-full absolute -left-4 bg-[var(--xp-particles)] particle z-0";
  
  // Random vertical position (within the container height)
  const top = Math.random() * 100; // percentage
  particle.style.top = `${top}%`;

  // Random delay before each animation starts
  const delay = Math.random() * 5; // seconds
  particle.style.animationDelay = `${delay}s`;

  // Optional: slightly randomize speed
  const duration = 3 + Math.random() * 4; // between 3–7s
  particle.style.animationDuration = `${duration}s`;

  container.appendChild(particle);
}
let appNotification = document.getElementById("app_notification");
if(!localStorage.getItem("appNotif")){
  appNotification.classList.remove("sm:hidden");
  appNotification.classList.add("sm:block");
}
function hideAppNotification(){
  localStorage.setItem("appNotif", true);
  appNotification.classList.remove("sm:block");
  appNotification.classList.add("sm:hidden");
}

//change profile picture
// Create instance of the class
const imageDB = new ImageDB('ProfileApp', 'profilePictures');

// Handle file input
document.getElementById('profilePic_input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        // Save to IndexedDB (NO SIZE LIMIT!)
        await imageDB.saveImage('userProfile', file);
        
        // Display immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('profilePic').src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        console.log('Image saved successfully! Size:', file.size, 'bytes');
        
    } catch (error) {
        console.error('Error saving image:', error);
        alert('Error saving image');
    }
});
// handle delete profile picture
document.getElementById('deleteProfileBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to remove your profile picture?')) {
        try {
            await imageDB.deleteImage('userProfile');     
            // Reset to default image
            document.getElementById('profilePic').src = 'src/images/testImg.jfif';
            // Clear file input
            document.getElementById('profilePic_input').value = '';
            console.log('Profile picture deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting profile picture');
        }
    }
});
// Load profile picture on page load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const imageData = await imageDB.loadImage('userProfile');
        if (imageData) {
            document.getElementById('profilePic').src = imageData;
        }
    } catch (error) {
        console.log('No saved image found or error loading:', error);
    }
});

// task dates contaniner
const taskDates_container = document.getElementById('taskDates_container');
const taskDatesMobile_container = document.getElementById('taskDatesMobile_container');
let taskDates =['index', 'Today', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' , 'Saturday'];
taskDates.forEach((taskDate)=>{
  taskDates_container.innerHTML += `<li onclick="chosenDate('${taskDate}')" class="taskDate">${taskDate}</li>`;
  taskDatesMobile_container.innerHTML += `<span># ${taskDate}</span>`
})
function toggleMobileDatesContainer(){
  taskDatesMobile_container.classList.toggle("p-2");
  taskDatesMobile_container.classList.toggle("pb-20");
  taskDatesMobile_container.classList.toggle("h-0");
  taskDatesMobile_container.classList.toggle("h-80");
}
function chosenDate(theDate){
  const taskDateElements = document.querySelectorAll(".taskDate");
  taskDateElements.forEach(el =>{
    if(el.innerText == theDate){
      el.classList.add("bg-white/30");
    }else {
      if(el.classList.contains("bg-white/30")){
        el.classList.remove("bg-white/30");
      }
    }
  })
  let theDateLowerCase = theDate.toLowerCase();
  if(theDate != 'index'){
    let tasksOnDate = tasks.filter(task=>{
      return task.dueDate == theDateLowerCase;
    })
    createTasks(tasksOnDate);
  }else {
    createTasks(tasks);
  }
}
chosenDate('index');

function openTaskDesc(taskId,openDescBtn){
  let TheTaskContainer = document.getElementById(`task${taskId}_container`);
  let taskDescHeight = document.getElementById(`task${taskId}_desc`).clientHeight;
  if(parseInt(TheTaskContainer.style.maxHeight) == 52){
    TheTaskContainer.style.maxHeight = `${60 + taskDescHeight}px`;
    setTimeout(() => {
      openDescBtn.classList.add("rotate-180");
    }, 200);
  }else {
    TheTaskContainer.style.maxHeight = `52px`;
    setTimeout(() => {
      openDescBtn.classList.remove("rotate-180");
    }, 300);
  }
}
function openSubTaskDesc(taskId,openDescBtn){
  let TheTaskContainer = document.getElementById(`task${taskId}_container`);
  let taskDescHeight = document.getElementById(`task${taskId}_desc`).clientHeight;
  if(parseInt(TheTaskContainer.style.maxHeight) == 52){
    TheTaskContainer.style.maxHeight = `${60 + taskDescHeight}px`;
    setTimeout(() => {
      openDescBtn.classList.add("rotate-180");
    }, 200);
  }else {
    TheTaskContainer.style.maxHeight = `52px`;
    setTimeout(() => {
      openDescBtn.classList.remove("rotate-180");
    }, 300);
  }
}

// task and user's info are in task.js
function completeTask(xpAmount = 0, taskId) {
  if(!localStorage.getItem("user_total_xp")){
    localStorage.setItem("user_total_xp", 0 + xpAmount);
  }else {
    let currentTotalXp = parseInt(localStorage.getItem("user_total_xp"));
    localStorage.setItem("user_total_xp", currentTotalXp + xpAmount);
  }
  // remove the task object from tasks array
  console.log("task id:", taskId);
  if(tasks.length >1 && !taskId.includes("sub")){
    let index = tasks.findIndex(clickedTask => clickedTask.task_id == taskId);
    console.log("task index: " + index);
    if(index != undefined && index != -1){
      completedTasks.push(tasks.splice(index, 1)[0]);
      console.log('first complete condition: '+completedTasks);
    }
  }else if(tasks.length == 1 && taskId !=1 && !taskId.includes("sub")){
    completedTasks.push(tasks[0]);
    tasks = [];
    console.log("second complete condition: "+completedTasks);
  }else if(taskId == 1){
    completedTasks.push({taskTitle: 'Create Your First Task', taskDesc: 'Create yor first task and start your journey!', taskXP: 1000, taskPriority: 1, subTasks: [], createdAt: null, dueDate: null, task_id: 1});
    localStorage.setItem('checked_first_task', true);
    checked_first_task = localStorage.getItem('checked_first_task');
    console.log("final complete condition: "+ completedTasks);
  }else if(taskId.includes("sub")){
    let taskIndex = tasks.findIndex(clickedTask => clickedTask.task_id == parseInt(taskId));
    let subIndex = tasks[taskIndex].subTasks.findIndex(clickedTask => clickedTask.id == taskId);
    console.log("task index: "+ taskIndex);
    console.log("subtask index: " + subIndex);
    if(subIndex != undefined){
      tasks[taskIndex].subTasks[subIndex].completed = true;
      console.log('subtask completetion condition: '+ tasks[taskIndex].subTasks);
    }
  }

  // getting other values
  const xpBar = document.getElementById("xp-bar");
  const levelNumber = document.getElementById("levelNumber");
  const xpAmount_p = document.getElementById("xpAmount_p");
  // Current xp
  let currentXP = parseInt(xpAmount_p.innerText);
  let currentLevel = parseInt(levelNumber.innerText);
  // Total XP including the new amount
  let targetTotalXP = currentXP + xpAmount;
  // How many levels we gain?
  let levelsGained = Math.floor(targetTotalXP / 1000);
  // Remaining XP after leveling
  let finalXP = targetTotalXP % 1000;

  // close task
  document.getElementById(`task${taskId}_container`).classList.remove("border-transparent");
  document.getElementById(`task${taskId}_container`).classList.add("border-[var(--task-border)]");
  document.getElementById(`task${taskId}_container`).classList.add("taskShadowWithoutHover");
  setTimeout(() => {
    document.getElementById(`task${taskId}_container`).classList.add("scale-y-0");
    document.getElementById(`taskClass${taskId}`).classList.add('closed');
  }, 1300);
  setTimeout(() => {
    document.getElementById(`task${taskId}`).classList.add("hidden");
  }, 1800);
  // if(parseInt(levelNumber.innerText) == 0){
  //   xpBar.style.width = '0%'; I dont remember why I have added this but was too scared to remove it either
  // }
  // -------- XP COUNT UP ANIMATION --------
  function animateXP(start, end) {
    let amount = end - start;
    function step() {

      if (start >= 1000){
        start = 0;
        xpBar.style.width = `0%`;
        currentLevel++;
        setTimeout(() => {
          createNewTitle(currentLevel);        
        }, 100);
        levelNumber.innerText = currentLevel;
        targetTotalXP -= 1000;
        if(targetTotalXP<1000){
          function smallStep(){
            start += 10;
            xpBar.style.width = `${start/10}%`;
            if(start >= targetTotalXP){
              xpAmount_p.innerText = targetTotalXP;
              xpBar.style.width = `${targetTotalXP/10}%`;
                localStorage.setItem('user_level',levelNumber.innerText);
                user_level = localStorage.getItem('user_level') || 0;
                localStorage.setItem("remain_xp", targetTotalXP);
                localStorage.setItem('myTasks', JSON.stringify(tasks));
                localStorage.setItem('completed_tasks', JSON.stringify(completedTasks));
              return 
            }
            xpAmount_p.innerText = start;
            requestAnimationFrame(smallStep);
          }
          smallStep();
        }else{
          step();
        }
      }else {
        // Auto-speed scaling
        let dynamicStep = Math.max(1, Math.floor(amount / 100));
        xpBar.style.width = `${start/10}%`;
        start += dynamicStep;
        if(start >= end && end < 1000){
          start = end;
          xpAmount_p.innerText = start;
          xpBar.style.width = `${start/10}%`;
            localStorage.setItem('user_level',levelNumber.innerText);
            localStorage.setItem("remain_xp", targetTotalXP);
            localStorage.setItem('myTasks', JSON.stringify(tasks));
            localStorage.setItem('completed_tasks', JSON.stringify(completedTasks));
          return 
        }
        xpBar.style.width = `${start/10}%`;
        xpAmount_p.innerText = start;
        requestAnimationFrame(step);
      }
    }
    step();
  }

  // Animate toward 1000 if leveling
  if (levelsGained > 0) {
    animateXP(currentXP, 1000);
  } else {
    // No level up, just animate normally
    animateXP(currentXP, finalXP);
  }

  // dont let the task to activate again
  let taskPreventionLayer = document.getElementById(`task${taskId}_preventionLayer`)
  taskPreventionLayer.classList.remove("hidden");
  taskPreventionLayer.classList.add("block");
}
function deleteTask(taskId){
  if(taskId == 1){
    console.log(taskId);
    localStorage.setItem('checked_first_task', true);
  }
  document.getElementById(`task${taskId}_container`).classList.remove("border-transparent");
  document.getElementById(`task${taskId}_container`).classList.add("border-[var(--task-border)]");
  document.getElementById(`task${taskId}_container`).classList.add("taskShadowWithoutHover");
  document.getElementById(`task${taskId}_container`).classList.add("scale-y-0");
  document.getElementById(`taskClass${taskId}`).classList.add('closed');
  setTimeout(() => {
    document.getElementById(`task${taskId}`).classList.add("hidden");
  }, 500);
}
function createNewTitle(levelNum){
  console.log()
  if(levelNum !=0){
    found_title = user_titles.findLast(title => title.level <= levelNum);
    if(user_title != found_title.title){
      user_title = found_title.title;
      localStorage.setItem("user_title", user_title);
      let titleContainer = document.getElementById("titleContainer");
      let oldTitle = document.querySelector(".oldTitle");
      let NewTitle = document.createElement("div");
      NewTitle.className = "absolute top-[22px] left-0 transition-all duration-300 oldTitle";
      NewTitle.innerText = user_title;
      titleContainer.appendChild(NewTitle);
      oldTitle.classList.remove("top-0");
      oldTitle.classList.add("-top-[20px]");
      setTimeout(() => {
        NewTitle.classList.remove("top-[22px]");
        NewTitle.classList.add("top-0");  
      }, 100);
      setTimeout(() => {
        oldTitle.remove();
      }, 1000);
    }
  }
}

// add_task form functions
let addFormStatus = false;
function showAddForm(){
  addFormStatus = !addFormStatus;
  const addForm = document.getElementById("addForm");
  const addFormOutside = document.getElementById("addFormOutside");
  const mobileMenu = document.getElementById("mobileMenu");
  // hide mobile menu
  mobileMenu.classList.toggle("h-[50px]");
  mobileMenu.classList.toggle("h-0");
  mobileMenu.classList.toggle("pt-2");
  mobileMenu.classList.toggle("pb-1");
  mobileMenu.classList.toggle("px-3");
  mobileMenu.classList.toggle("border-[var(--footer-border)]");
  mobileMenu.classList.toggle("border-transparent");

  // show add task form
  if(addForm.classList.contains("hidden")){
    setTimeout(() => {
      addForm.classList.toggle("overflow-hidden");
    }, 350);
  }else {
    addForm.classList.toggle("overflow-hidden");
  }
  addFormOutside.classList.toggle("hidden");
  addFormOutside.classList.toggle("block");
  addForm.classList.toggle("sm:w-0");
  addForm.classList.toggle("h-0");
  if(addFormStatus){
    addForm.classList.add("h-[278.4px]");
  }
  if(addForm.classList.contains("h-fit")){
    addForm.classList.remove("h-fit")
  }
  setTimeout(() => {
    if(addForm.classList.contains("h-[278.4px]")){
      addForm.classList.toggle("h-[278.4px]");
      addForm.classList.toggle("h-fit");
    }
    }, 310);
  addForm.classList.toggle("sm:h-fit");
  addForm.classList.toggle("sm:rounded-full");
  addForm.classList.toggle("sm:w-4/5");
  addForm.classList.toggle("sm:rounded-lg");
}

// add sub tasks functions
let subTasksContainerHeight = 0;
let subtaskNum = 0;
let subTasksContainer = document.getElementById("subTasksContainer");
let subTasksArray = [];
function addSubTaskInput() {
  if(window.innerWidth < 465){
    subTasksContainerHeight += 76;
  }else {
    subTasksContainerHeight += 40;
  }
  subtaskNum += 1;
  subTasksContainer.style.height = `${subTasksContainerHeight}px`;
  if(parseInt(subTasksContainer.style.height) > 224){
    subTasksContainer.classList.add("overflow-y-auto")
  }

  const wrapper = document.createElement("div");
  wrapper.className = "w-full first:mt-0 mt-4 sm:mt-2 opacity-0 transition-all duration-300 grid grid-cols-2 gap-y-1 gap-x-4 min-[465px]:flex flex-row min-[465px]:gap-4 subTasksInput";
  wrapper.id = `task${taskNumber}_subTask${subtaskNum}`;
  wrapper.innerHTML = `
    <div class="w-full min-[465px]:w-fit max-[465px]:col-span-2 flex justify-between">
      <input id="subtask${subtaskNum}_title" class="appearance-none outline-0 text-[var(--content-text)] placeholder:text-[var(--content-text)]/80 bg-transparent w-full min-[465px]:w-32" placeholder="Task Title" type="text">
      <div onclick="addSubTask(${subtaskNum})" class="w-6 h-6 min-w-6 min-h-6 min-[465px]:hidden flex items-center justify-center text-xl border-2 border-[var(--content-text)] hover:bg-[var(--add-form-bg-end)] transition-all duration-300 max-[465px]:-translate-x-2 rounded-full cursor-pointer active:scale-90"><span class="-translate-y-[3px]">+</span></div>
    </div>
    <div class="flex gap-2">
      <input id="subtask${subtaskNum}_firstNum" class="formInput formNumberInput" placeholder="0" type="number">
      <p class="line-clamp-none whitespace-nowrap">/</p>
      <input id="subtask${subtaskNum}_secondNum" class="formInput formNumberInput" placeholder="100" type="number">
    </div>
    <div class="flex gap-2">
      <label for="">xp: </label>
      <input class="formNumberInput min-w-20 outline-0" placeholder="0 / 1000" type="number" name="xpAmount" id="subTask${subtaskNum}_xp_amount">
    </div>
    <div onclick="addSubTask(${subtaskNum})" class="w-6 h-6 min-w-6 min-h-6 max-[465px]:hidden flex items-center justify-center text-xl border-2 border-[var(--content-text)] hover:bg-[var(--add-form-bg-end)] transition-all duration-300 rounded-full cursor-pointer active:scale-90"><span class="-translate-y-[3px]">+</span></div>
  `;

  subTasksContainer.appendChild(wrapper);
  subTasksArray.push(wrapper);
  const allSubTasks = document.querySelectorAll(".subTasksInput");
  allSubTasks.forEach(subT =>{
    if(!subTasksArray.includes(subT)){
      subTasksArray.push(subT);
    }
  })
  setTimeout(() => {
    wrapper.classList.remove("opacity-0");
    wrapper.classList.add("opacity-100");
  }, 1);
}

let addedSubTasksArray = [];
function addSubTask(subtaskNumber) {
  // get all subtasks input and add it to subtask array
  const allSubTasks = document.querySelectorAll(".subTasksInput");
  allSubTasks.forEach(subT =>{
    if(!subTasksArray.includes(subT)){
      subTasksArray.push(subT);
    }
  })
  // get the subtask that user wants to add
  const addedSubTask ={title: document.getElementById(`subtask${subtaskNumber}_title`).value, firstNum: document.getElementById(`subtask${subtaskNumber}_firstNum`).value, secondNum: document.getElementById(`subtask${subtaskNumber}_secondNum`).value, xp: document.getElementById(`subTask${subtaskNumber}_xp_amount`).value,completed: false,id: `${taskNumber}_sub${subtaskNumber}`};
  // we get the subtask title for later use in error
  const subTaskTitle = document.getElementById(`subtask${subtaskNumber}_title`);
  // change the subtask that user wants to add into a div element
  if(addedSubTask.title.length >0){
    const wrapper = document.createElement("div");
    wrapper.className = "w-full opacity-0 transition-all duration-300 flex justify-between gap-2 subTasksInput";
    wrapper.id = `task${taskNumber}_subTask${subtaskNumber}`;
    wrapper.innerHTML = `
      <p>${addedSubTask['title']}</p>
      <div class="flex gap-1">
          <span>${addedSubTask['firstNum']}</span>
          <span>${addedSubTask['secondNum']=="" ? '': '/'}</span>
          <span>${addedSubTask['secondNum']}</span>
      </div>
      <p>${addedSubTask['xp']}${addedSubTask['xp'] ?'xp' : ''}</p>
    `;
    addedSubTasksArray.push(addedSubTask);
    subTasksArray.splice(subtaskNumber-1,1,wrapper);
    subTasksContainer.innerHTML = "";
    subTasksArray.forEach(subT => {
      subTasksContainer.appendChild(subT);
    })
    setTimeout(() => {
      wrapper.classList.remove("opacity-0");
      wrapper.classList.add("opacity-100");
    }, 1);
  }else {
    //if sub task title was empty
    subTaskTitle.classList.add("shakingAnimation");
    setTimeout(() => {
      subTaskTitle.classList.remove("shakingAnimation");      
    }, 1000);
  }
}
// show xp input in add_task form 
function showXp(){
  let xpInput = document.getElementById("xpInput");
  xpInput.classList.toggle("hidden");
  xpInput.classList.toggle("flex");

  setTimeout(() => {
    xpInput.classList.toggle("opacity-0");
    xpInput.classList.toggle("opacity-100");
  }, 1);
}

// priority functions in add_task form
function openPriorityContainer (){
  let priority_container = document.getElementById("priority_container");
  priority_container.classList.toggle("w-[183px]");
  priority_container.classList.toggle("w-0");
}

let priority = 4;
function addPriority(priorityNumber){
  let chosenPriority = document.getElementById("chosen_priority");
  let priority_container = document.getElementById("priority_container");
  priority = priorityNumber;
  // let priorityIcon = document.createElement("template");
chosenPriority.innerHTML = `
<div id="taskPriority" class="flex items-center p-0.5 rounded-md border border-[var(--theme-color-light)] bg-[var(--priority-container-bg)] cursor-pointer">
        <span>
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio1)"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio${priorityNumber})"></path> </g></svg>
        </span>
</div>
`;
  priority_container.classList.toggle("w-[183px]");
  priority_container.classList.toggle("w-0");
}
let addFormDates = ['Today', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' , 'Saturday','Custom date'];
let dateOptions = [...document.querySelectorAll(".addFormDateValue")]
dateOptions.forEach((dateValue,index)=>{
  dateValue.addEventListener("click",() => changeTaskDate(addFormDates[index]))
})
let mobileCalenderOptions = [...document.querySelectorAll(".mobileCalenderValue")]
mobileCalenderOptions.forEach((dateValue,index)=>{
  dateValue.addEventListener("click",() => changeTaskDate(addFormDates[index]))
})
function toggleDueDateDisplay(){
  if(window.innerWidth > 640){
    let Duodate_options_container = document.getElementById("Duodate_options_container");
    Duodate_options_container.classList.toggle("hidden");
    Duodate_options_container.classList.toggle("block");
  }else {
    let mobileCalender = document.getElementById("mobileCalender");
    mobileCalender.classList.toggle("h-0");
    mobileCalender.classList.toggle("h-[280px]");
  }
}
function changeTaskDate(chosenDate){
  let taskDateInput = document.getElementById("custom_date_input");
  let taskDatePlaceholder = document.getElementById("custom_date_placeholder");
  let chosenDueDate = document.getElementById("chosenDueDate");
  if(chosenDate == 'Custom date'){
    taskDateInput.classList.remove("hidden");
    taskDateInput.classList.add("block");
    setTimeout(() => {
      taskDateInput.classList.remove("scale-x-0");
      taskDateInput.classList.add("scale-x-100");    
    }, 1);
    setTimeout(() => {
      taskDatePlaceholder.classList.remove("opacity-0");
      taskDatePlaceholder.classList.add("opacity-80");
    }, 500);
    setTimeout(() => {
      taskDatePlaceholder.classList.remove("duration-500");
      taskDatePlaceholder.classList.add("duration-75");
    }, 600);
    chosenDueDate.innerText = chosenDate;
    toggleDueDateDisplay();
  }else {
    if(taskDateInput.classList.contains("scale-x-100")){
      taskDateInput.classList.remove("scale-x-100");
      taskDateInput.classList.add("scale-x-0");
      taskDatePlaceholder.classList.remove("duration-75");
      taskDatePlaceholder.classList.add("duration-500");
      setTimeout(() => {
        taskDatePlaceholder.classList.remove("opacity-80");
        taskDatePlaceholder.classList.add("opacity-0");  
      }, 10);
      setTimeout(() => {
        taskDateInput.classList.remove("block");
        taskDateInput.classList.add("hidden");
      }, 550);
    }
    chosenDueDate.innerText = chosenDate;
    toggleDueDateDisplay();
  }
}
function hidePlaceholder(){
  let customPlaceholder = document.getElementById("custom_date_placeholder");
  let customDateInput = document.getElementById("custom_date_input").value;
  if(customDateInput.length != 0){
    customPlaceholder.classList.remove("opacity-80");
    customPlaceholder.classList.add("opacity-0");
  }else {
    customPlaceholder.classList.remove("opacity-0");
    customPlaceholder.classList.add("opacity-80");
  }
}

// add the task
function addTask(){
  // Get values
  const xpAmount = document.getElementById("add_task_xp_amount").value;
  const taskTitle = document.getElementById("taskTitle");
  const taskDesc = document.getElementById("taskDesc").value;
  let taskDate;
  if(document.getElementById("chosenDueDate").innerText.toLowerCase() == 'custom date'){
    taskDate = document.getElementById("custom_date_input").value.toLowerCase();
  }else {
    taskDate = document.getElementById("chosenDueDate").innerText.toLowerCase();
  }
  if(taskTitle.value == ''){
    taskTitle.classList.add("shakingAnimation");
    setTimeout(() => {
      taskTitle.classList.remove("shakingAnimation");      
    }, 1000);
   return console.log("task needs a title");
  }
  // Create task
  let newTask = {
    taskTitle: taskTitle.value,
    taskDesc: taskDesc,
    taskXP: xpAmount || 0,
    taskPriority: priority,
    subTasks: [...addedSubTasksArray],
    createdAt: new Date().toISOString(),
    dueDate: taskDate || 'today',
    task_id: taskNumber,
  };
  tasks.push(newTask)
  // Reset form
  console.log(tasks);
  createNewTask(newTask);
  localStorage.setItem('myTasks', JSON.stringify(tasks));
  localStorage.setItem('user_level',document.getElementById('levelNumber').innerText);
  resetTaskForm();
  subTasksArray = [];
  taskNumber++;
}

function resetTaskForm() {
  document.getElementById("add_task_xp_amount").value = '';
  document.getElementById("taskTitle").value = '';
  document.getElementById("taskDesc").value = '';
  document.getElementById("custom_date_input").value = '';
  document.getElementById("chosenDueDate").innerText = 'Today';
  subtaskNum = 0;
  if(subTasksArray.length > 0){
    subTasksArray.forEach((subT,index) =>{
      document.getElementById(`task${taskNumber}_subTask${index+1}`).remove();
    })
  }
  if(parseInt(subTasksContainer.style.height) > 0){
      subTasksContainerHeight = 0;
      subTasksContainer.style.height = `0px`;
  }
  addedSubTasksArray = [];
  if(document.getElementById("taskPriority")){
    document.getElementById("taskPriority").remove();
  }
  priority = 4;
  
}
