if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
// install PWA section
let deferredPrompt;
const installBtn = document.getElementById("installBtn");
// add install prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
  installBtn.classList.add("block");
});

// button function
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;

  if (result.outcome === "accepted") {
    console.log("User installed the app");
  }

  deferredPrompt = null;
  installBtn.classList.add("hidden");
});
//check if user installed and hide the btn
window.addEventListener("appinstalled", () => {
  console.log("App installed");
  installBtn.classList.add("hidden");
});

//rest of the app
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
            document.getElementById('profilePic').src = 'src/images/LifeSystemPNGVDesktop.png';
            // Clear file input
            document.getElementById('profilePic_input').value = '';
            console.log('Profile picture deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting profile picture');
        }
    }
});
// handle on page load
window.addEventListener('DOMContentLoaded', async () => {
  // handle changed colors
    if(changedColors){
      changedColors.forEach((colorV)=>{
        changeVarColorsOnLoad(colorV.varName, colorV.colorValue);
      })
    }
  //handle saved img
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
let taskDates = JSON.parse(localStorage.getItem("taskDates")) ||['Index', 'Today', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' , 'Saturday'];
function insertTaskDates(){
  taskDates_container.innerHTML = "";
  taskDates.forEach((taskDate)=>{
    taskDates_container.innerHTML += `<li onclick="chosenDate('${taskDate}')" class="taskDate">${taskDate}</li>`;
    taskDatesMobile_container.innerHTML += `<span onclick="chosenDate('${taskDate}')"># ${taskDate}</span>`;
  });
}
insertTaskDates();
function deleteTaskDate(finishedTaskDate){
  finishedTaskDate = finishedTaskDate.toLowerCase();
  let tasksOnDate = tasks.filter(task=>{
    return task.dueDate == finishedTaskDate;
  });
  console.log("tasksOnDate: ",tasksOnDate);
  if(finishedTaskDate == "no date"){
    return
  }else if(tasksOnDate.length == 1){
    console.log("deleted date: ",finishedTaskDate);
    let dateIndex = taskDates.findIndex((taskDate)=>{
      return taskDate.toLowerCase() == finishedTaskDate;
    });
    console.log(dateIndex);
    if(dateIndex != -1){
      taskDates.splice(dateIndex,1);
      localStorage.setItem('taskDates', JSON.stringify(taskDates));
      insertTaskDates();
    }
  }
}
function toggleMobileDatesContainer(){
  taskDatesMobile_container.classList.toggle("p-2");
  taskDatesMobile_container.classList.toggle("pb-20");
  taskDatesMobile_container.classList.toggle("h-0");
  taskDatesMobile_container.classList.toggle("h-80");
}
let triggeredChosenDateOnReload = false;
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
  if(theDateLowerCase != 'index'){
    let tasksOnDate = tasks.filter(task=>{
      return task.dueDate == theDateLowerCase;
    });
    createTasks(tasksOnDate);
    toggleMobileDatesContainer();
  }else {
    createTasks(tasks);
    if(triggeredChosenDateOnReload){
      toggleMobileDatesContainer();
    }else {
      triggeredChosenDateOnReload = true;
    }
  }
}
chosenDate('index');

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
  if(tasks.length >1 && !taskId.includes("sub") && taskId !=1){
    let index = tasks.findIndex(clickedTask => clickedTask.task_id == taskId);
    console.log("task index: " + index);
    console.log(tasks[index].taskStatsGains);
    if(index != undefined && index != -1){
      if(tasks[index].taskStatsGains){
        console.log("gain stats triggered | condition 1");
        increaseStats(tasks[index].taskStatsGains);
      }
      if(tasks[index].rewardId){
        let taskReward =  rewardsImages.find(img => img.id == tasks[index].rewardId);
        if(taskReward.inventoryState){
          selectRewardImage(tasks[index].rewardId);
        }
        deleteImageById(tasks[index].rewardId);
      }
      deleteTaskDate(tasks[index].dueDate);
      completedTasks.push(tasks.splice(index, 1)[0]);
      console.log('first complete condition: ',completedTasks);
    }
  }else if(tasks.length == 1 && taskId !=1 && !taskId.includes("sub")){
    completedTasks.push(tasks[0]);
    
    if(tasks[0].taskStatsGains){
      console.log("gain stats triggered | condition 2");
      increaseStats(tasks[0].taskStatsGains);
    }
    if(tasks[0].rewardId){
      let taskReward =  rewardsImages.find(img => img.id == tasks[0].rewardId);
      if(taskReward.inventoryState){
        selectRewardImage(tasks[0].rewardId);
      }
      deleteImageById(tasks[0].rewardId);
    }
    deleteTaskDate(tasks[0].dueDate);
    tasks = [];
    console.log("second complete condition: ",completedTasks);
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

  // Animate toward 1000 if leveling up
  if (levelsGained > 0) {
    animateXP(currentXP, 1000);
  } else {
    // No level up, just animate normally
    animateXP(currentXP, finalXP);
  }

  // dont let the task to activate again
  let taskPreventionLayer = document.getElementById(`task${taskId}_preventionLayer`);
  taskPreventionLayer.classList.remove("hidden");
  taskPreventionLayer.classList.add("block");
}

function increaseStats(statsGainArray){
  statsGainArray.forEach(gainedStat =>{
    user_stats = user_stats.map(static =>{
      if(static.statName == gainedStat.statName){
        return {statName: gainedStat.statName, statLevel: parseInt(static.statLevel) + parseInt(gainedStat.statLevel)};
      }
      return static
    })
  })
  localStorage.setItem("user_stats",JSON.stringify(user_stats));
  console.log(user_stats);
}
function deleteTask(taskId){
  console.log("task_id passed to delete: " + taskId);
  if(taskId == 1){
    localStorage.setItem('checked_first_task', true);
    checked_first_task = true;
    toggleTaskDetailDisplay();
    return createTasks(tasks);
  }else if(taskId.includes('sub')){
      let mainTaskId = parseInt(taskId[0]);
      let foundMainTaskIndex = tasks.findIndex(task=>task.task_id == mainTaskId);
      let foundSubTaskIndex = tasks[foundMainTaskIndex].subTasks.findIndex(subTask => subTask.id == taskId);
      tasks[foundMainTaskIndex].subTasks.splice(foundSubTaskIndex,1);
      console.log("is this triggered")
  }else {
    let foundTaskIndex = tasks.findIndex(task => task.task_id == taskId);
    let deletedTask = tasks.splice(foundTaskIndex, 1);
    console.log("found index to delete"+foundTaskIndex);
    console.log(deletedTask);
    console.log(tasks);
  }
  localStorage.setItem('myTasks', JSON.stringify(tasks));
  toggleTaskDetailDisplay();
  createTasks(tasks);
}
function createNewTitle(levelNum){
  if(levelNum !=0){
    found_title = user_titles.findLast(title => title.level <= levelNum);
    if(user_title != found_title.title){
      user_title = found_title.title;
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
      localStorage.setItem("user_title",user_title);
    }
  }
}

//stats functions
function toggleSelectedStatsDisplay(){
  let selectedStatsDisplayContainer = document.getElementById("selectedStatsDisplayContainer");
  selectedStatsDisplayContainer.classList.toggle("hidden");
  selectedStatsDisplayContainer.classList.toggle("block");
}
let setStatsBgOnce = false;
function toggleStatsDisplay(){
  // resize stats window backgrounds
  if(!setStatsBgOnce){
    let statsBgs = [...document.getElementsByClassName("statsBg")];
    let statsBgSize = Math.ceil(window.innerHeight*2/3);
    statsBgs.forEach( bg => bg.style.height = `${statsBgSize}px`)
    console.log(statsBgs);
    setStatsBgOnce = true;
    console.log(Math.ceil(window.innerHeight/3));
  } 
  let statsOutside = document.getElementById("statsOutside");
  let statsContainer = document.getElementById("statsContainer");
  let statsBox = document.getElementById("statsBox");
  if(statsContainer.classList.contains("hidden")){
    // first toggle hidden class
    statsContainer.classList.toggle("hidden");
    statsOutside.classList.toggle("hidden");
    // before opening the container, add user stats
    statsBox.innerHTML = "";
    user_stats.forEach(stat=>{
      let levelFromZero = 0;
      let frameCount = 0;
      let framesToSkip = 6;
      let maxLevelGained = null;
      statsBox.innerHTML += `
      <div>
        <div>
            <span class="z-10">${stat.statName}:</span>
            <span id="${stat.statName}_${stat.statLevel}" class="z-10">0</span>
            <div class="w-4/5 h-4 bg-blue-500/80 blur-sm absolute right-1/2 translate-x-1/2 top-2 rounded-full z-0"></div>
        </div>
      </div>
      `;
      setTimeout(() => {
        let statLevelDom = document.getElementById(`${stat.statName}_${stat.statLevel}`);
        function increasingNum(statLevelGains = null){
          // console.log(statLevelDom);
            if(!maxLevelGained){
                maxLevelGained = levelFromZero + statLevelGains;
            }
            frameCount++;
            if(frameCount >= framesToSkip){
                levelFromZero++;
                statLevelDom.innerHTML = levelFromZero;
                frameCount = 0;
            }
            if(levelFromZero<maxLevelGained){
                requestAnimationFrame(()=>increasingNum(statLevelGains));
            }else {
                levelFromZero= 0;
                return maxLevelGained = null;
            }
        }
        requestAnimationFrame(()=>increasingNum(stat.statLevel));
      }, 700);
    })
    setTimeout(() => {
      statsContainer.classList.toggle("w-[0%]");
      statsContainer.classList.toggle("xl:w-3/5");
      statsContainer.classList.toggle("sm:w-4/5");
      statsContainer.classList.toggle("w-11/12");
      statsOutside.classList.toggle("opacity-0");
      statsOutside.classList.toggle("opacity-100");
    }, 10);
    setTimeout(() => {
      statsContainer.classList.toggle("h-2");
      statsContainer.classList.toggle("h-2/3");
    }, 310);
  }else {
    statsContainer.classList.toggle("h-2");
    statsContainer.classList.toggle("h-2/3");
    setTimeout(() => {
      statsContainer.classList.toggle("w-[0%]");
      statsContainer.classList.toggle("xl:w-3/5");
      statsContainer.classList.toggle("sm:w-4/5");
      statsContainer.classList.toggle("w-11/12");
      statsOutside.classList.toggle("opacity-0");
      statsOutside.classList.toggle("opacity-100");
    }, 310);
    setTimeout(() => {
      statsContainer.classList.toggle("hidden");
      statsOutside.classList.toggle("hidden");
    }, 800);
  }
}
// stats form
let formStatsContainer = document.getElementById("formStatsContainer");
let selectedStatsBtnAndInfoContainer = document.getElementById("selectedStatsBtnAndInfoContainer");
let selectedStatsDisplayContainer = document.getElementById("selectedStatsDisplayContainer");
let selectedStatsDisplay = document.getElementById("selectedStatsDisplay");
function toggleStatsForm(){
  let statsFrom = document.getElementById("statsForm");
  let statsFromOutside = document.getElementById("statsFromOutside");
  statsFromOutside.classList.toggle("hidden");
  setTimeout(() => {
    statsFromOutside.classList.toggle("opacity-0");
    statsFromOutside.classList.toggle("opacity-50");
  }, 1);
  statsFromOutside.classList.toggle("block");
  statsFrom.classList.toggle("scale-y-0");
  statsFrom.classList.toggle("scale-y-100");
  insertStats();
}
function deleteStat(){
  const deleteStatInput = document.getElementById("deleteStatInput")
  const StatIndex = user_stats.findIndex(stat=> stat.statName == deleteStatInput.value);
  if(StatIndex == -1){
    deleteStatInput.classList.add("shakingAnimation");
    setTimeout(() => {
      deleteStatInput.classList.remove("shakingAnimation");
    }, 210);
    deleteStatInput.placeholder = "stat didn't exist!";
    return
  }
  user_stats.splice(StatIndex,1);
  localStorage.setItem("user_stats",JSON.stringify(user_stats));
  deleteStatInput.placeholder = "delete stat";
  insertStats();
}
function addNewStat(){
  let newStatInput = document.getElementById("newStatInput");
  if(newStatInput.value == "" || newStatInput.value == " "){
    newStatInput.classList.add("shakingAnimation");
    setTimeout(() => {
      newStatInput.classList.remove("shakingAnimation");
    }, 210);
    return
  }
  let statExistingCheck = false;
  user_stats.forEach((stat)=> {
    if(stat.statName == newStatInput.value){
      statExistingCheck = true;
      newStatInput.classList.add("shakingAnimation");
      setTimeout(() => {
        newStatInput.classList.remove("shakingAnimation");
      }, 210);
      newStatInput.value = "";
      newStatInput.placeholder = "stat exists!";
      return 
    }
  })
  if(!statExistingCheck){
    newStatInput.placeholder = "new stat";
    if(user_stats.length == 0) formStatsContainer.innerHTML = "";
    let newStatObject = {
      statName: newStatInput.value,
      statLevel: 0
    }
    newStatInput.value = "";
    user_stats.push(newStatObject);
    localStorage.setItem("user_stats",JSON.stringify(user_stats));
    let newStat = document.createElement("template");
    newStat.innerHTML = `
      <div id="${newStatObject.statName}Container" class="w-fit py-1 px-2 border-2 border-transparent hover:-translate-y-0.5 hover:border-blue-300 transition-all duration-300 rounded-md flex justify-between items-center gap-2 text-lg relative">
          <div id="${newStatObject.statName}InfoBox" class="flex items-center">
              <div class="w-[160px] flex justify-between items-center">
                  <div class="w-3 h-3 rotate-45 bg-gradient-to-tr from-[var(--stat-list-icon-start)] via-[var(--stat-list-icon-mid)] to-[var(--stat-list-icon-end)]"></div>
                  <div class="w-[90px] shrink-0 overflow-hidden text-ellipsis ml-2">${newStatObject.statName}</div>
                  <div>:</div>
                  <div class="w-[38px] shrink-0 overflow-hidden text-ellipsis ml-2">${newStatObject.statLevel}</div>
              </div>
              <div class="flex items-center gap-2 ml-2 mr-4">
                  <button stat-name="${newStatObject.statName}" class="subtract cursor-pointer">-</button>
                  <input id="${newStatObject.statName}LevelInput" placeholder="0" class="w-8 appearance-none outline-0 border-b border-[var(--stat-level-input-border)]/50" value="0" type="number">
                  <button stat-name="${newStatObject.statName}" class="add cursor-pointer">+</button>
              </div>
          </div>
          <button id="${newStatObject.statName}" class="selectBtn w-6 h-6 bg-white rounded-full statCheckIcon cursor-pointer relative transition-all duration-300 active:scale-90">
          </button>
      </div>  
    `;
    formStatsContainer.appendChild(newStat.content);
    insertStatsFormCheckIcons();
    console.log(user_stats);
  }
}
// this variable is for stat in the add form
let selectedStats = [];
function insertStats(){
  if(user_stats.length == 0){
    formStatsContainer.innerHTML = `
    <div class="w-fit flex items-center gap-2 text-lg cursor-pointer">
        <div class="w-3 h-3 rotate-45 bg-gradient-to-tr from-[var(--stat-list-icon-start)] via-[var(--stat-list-icon-mid)] to-[var(--stat-list-icon-end)]"></div>
        <div>no stats yet!</div>
    </div>
    `;
  }else{
    formStatsContainer.innerHTML = "";
    user_stats.forEach((stat)=>{
      let checkIfSelected = selectedStats.findIndex((selectedstat)=> selectedstat.statName == stat.statName);
      formStatsContainer.innerHTML+= `
      <div id="${stat.statName}Container" class="w-fit py-1 px-2 border-2 border-transparent ${checkIfSelected != -1 ? 'opacity-55': ''} ${checkIfSelected != -1 ? '': 'hover:-translate-y-0.5'} hover:border-blue-300 transition-all duration-300 rounded-md flex justify-between items-center gap-2 text-lg relative">
        <div id="${stat.statName}InfoBox" class="flex items-center">
            <div class="w-[160px] flex justify-between items-center">
                <div class="w-3 h-3 rotate-45 bg-gradient-to-tr from-[var(--stat-list-icon-start)] via-[var(--stat-list-icon-mid)] to-[var(--stat-list-icon-end)]"></div>
                <div class="w-[90px] shrink-0 overflow-hidden text-ellipsis ml-2">${stat.statName}</div>
                <div>:</div>
                <div class="w-[38px] shrink-0 overflow-hidden text-ellipsis ml-2">${stat.statLevel}</div>
            </div>
            <div class="flex items-center gap-2 ml-2 mr-4">
                <button stat-name="${stat.statName}" class="subtract cursor-pointer">-</button>
                <input id="${stat.statName}LevelInput" placeholder="0" class="w-8 appearance-none outline-0 border-b border-[var(--stat-level-input-border)]/50" value="0" type="number">
                <button stat-name="${stat.statName}" class="add cursor-pointer">+</button>
            </div>
        </div>
        <button id="${stat.statName}" class="selectBtn w-6 h-6 bg-white rounded-full statCheckIcon cursor-pointer relative transition-all duration-300 active:scale-90">
        </button>
    </div>  
      `;
    });
    insertStatsFormCheckIcons();
  }
}
// writing the selected stats in the task form & + and - functions
formStatsContainer.addEventListener('click',(e)=>{
  //writing the stats
  if(e.target.classList.contains("selectBtn")){
    let selectedStat = document.getElementById(`${e.target.id}Container`);
    let statInfoBox = document.getElementById(`${e.target.id}InfoBox`);
    let SelectedStatLevelInput = document.getElementById(`${e.target.id}LevelInput`);
    selectedStat.classList.toggle("hover:-translate-y-0.5");
    selectedStat.classList.toggle("opacity-55");
    statInfoBox.classList.toggle("pointer-events-none");
    selectStat(e.target.id,SelectedStatLevelInput.value);
    // subtract and add the stats level with - and + buttons
  }else if(e.target.classList.contains("subtract")){
    let statLevel = document.getElementById(`${e.target.getAttribute("stat-name")}LevelInput`);
    statLevel.value = parseInt(statLevel.value)-1;
    if(parseInt(statLevel.value)<0) return statLevel.value = 0;
  }else if(e.target.classList.contains("add")){
    let statLevel = document.getElementById(`${e.target.getAttribute("stat-name")}LevelInput`);
    statLevel.value = parseInt(statLevel.value)+1;
  }
})
function selectStat(statInputId,statInputLevel){
  let selectedStatsBtnAndInfo = document.getElementById("selectedStatsBtnAndInfo");
  let statsIsSelected = selectedStats.findIndex(stat => stat.statName == statInputId);
  let selectedStatsDisplay = document.getElementById("selectedStatsDisplay");
  console.log("statIndex: " + statsIsSelected);
  if(statsIsSelected == -1){
    selectedStats.push({statName: statInputId, statLevel: statInputLevel});
    if(selectedStatsBtnAndInfo.classList.contains("hidden")){
      selectedStatsBtnAndInfo.classList.remove("hidden");
      selectedStatsBtnAndInfo.classList.add("flex");
    }
    document.getElementById("selectedStatsBtnName").innerHTML = selectedStats[0].statName;
    document.getElementById("selectedStatsBtnLevel").innerHTML = selectedStats[0].statLevel;
    if(selectedStats.length>1){
      selectedStatsDisplay.innerHTML = "";
      let remainingStats = selectedStats.slice(1,selectedStats.length);
      remainingStats.forEach(stat=>{
        selectedStatsDisplay.innerHTML += `
          <div>
              <span class="overflow-hidden text-ellipsis text-start w-8">${stat.statName}</span>
              <span>+</span>
              <span class="overflow-hidden text-ellipsis w-8">${stat.statLevel}</span>
          </div>
        `;
      })
    }
    console.log(selectedStats);
  }else {
    selectedStats.splice(statsIsSelected,1);
    if(selectedStats.length == 0){
      selectedStatsBtnAndInfo.classList.remove("flex");
      selectedStatsBtnAndInfo.classList.add("hidden");
    }
    console.log(selectedStats);
    if(selectedStats.length == 0){
      return
    }
    document.getElementById("selectedStatsBtnName").innerHTML = selectedStats[0].statName;
    document.getElementById("selectedStatsBtnLevel").innerHTML = selectedStats[0].statLevel;
    if(selectedStats.length>1){
      selectedStatsDisplay.innerHTML = "";
      let remainingStats = selectedStats.slice(1,selectedStats.length);
      remainingStats.forEach(stat=>{
        selectedStatsDisplay.innerHTML += `
          <div>
              <span class="overflow-hidden text-ellipsis text-start w-8">${stat.statName}</span>
              <span>+</span>
              <span class="overflow-hidden text-ellipsis w-8">${stat.statLevel}</span>
          </div>
        `;
      })
    }
  }
}

// the rest of the reward codes are in rewardsImgs.js

// add_task form functions
let addFormStatus = false;
let addForm = document.getElementById("addForm");
function showAddForm(){
  const addFormOutside = document.getElementById("addFormOutside");
  const addFormContent = document.getElementById("addFormContent");
  const addFormBtn = document.getElementById("addFormBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  // hide mobile menu
  // mobileMenu.classList.toggle("h-[50px]");
  // mobileMenu.classList.toggle("h-0");
  // mobileMenu.classList.toggle("pt-2");
  // mobileMenu.classList.toggle("pb-1");
  // mobileMenu.classList.toggle("px-3");
  // mobileMenu.classList.toggle("border-[var(--footer-border)]");
  // mobileMenu.classList.toggle("border-transparent");

  // show add task form
  if(!addFormStatus){
    addFormOutside.classList.toggle("hidden");
    addForm.classList.toggle("hidden");
    setTimeout(() => {
      // addForm.classList.toggle("h-0");
      // addForm.classList.toggle("h-[280px]");
      addForm.style.height = "280px";
      addFormOutside.classList.toggle("opacity-0");
      addFormOutside.classList.toggle("opacity-100");
      addFormContent.classList.toggle("opacity-0");
      addFormContent.classList.toggle("opacity-100");
      addFormBtn.classList.toggle("opacity-0");
      addFormBtn.classList.toggle("opacity-100");
    }, 10);
    setTimeout(() => {
      addForm.classList.toggle("overflow-hidden");
      // addForm.classList.toggle("h-[280px]");
      // addForm.classList.toggle("h-fit");
      addForm.style.height = "fit-content";
    }, 320);
  }else {
    addForm.classList.toggle("overflow-hidden");
    addForm.style.height = `${addForm.clientHeight}px`;
    // addForm.classList.toggle("h-fit");
    // addForm.classList.toggle("h-[280px]");
    addFormOutside.classList.toggle("opacity-100");
    addFormOutside.classList.toggle("opacity-0");
    addFormContent.classList.toggle("opacity-0");
    addFormContent.classList.toggle("opacity-100");
    addFormBtn.classList.toggle("opacity-0");
    addFormBtn.classList.toggle("opacity-100");
    setTimeout(() => {
      // addForm.classList.toggle("h-[280px]");
      // addForm.classList.toggle("h-0");
      addForm.style.height = "0px";
      addFormOutside.classList.toggle("hidden");
    }, 310);
    setTimeout(() => {
      addForm.classList.toggle("hidden");
    }, 610);
  }
  //   addForm.classList.add("h-[278.4px]");
  addFormStatus = !addFormStatus;
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
let addFormDates = ['No Date','Today', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' , 'Saturday','Custom date'];
let dateOptions = [...document.querySelectorAll(".addFormDateValue")];
dateOptions.forEach((dateValue,index)=>{
  dateValue.addEventListener("click",() => changeTaskDate(addFormDates[index]))
});
let mobileCalenderOptions = [...document.querySelectorAll(".mobileCalenderValue")]
mobileCalenderOptions.forEach((dateValue,index)=>{
  dateValue.addEventListener("click",() => changeTaskDate(addFormDates[index]))
});
function toggleDueDateDisplay(){
  let Duodate_options_container = document.getElementById("Duodate_options_container");
  Duodate_options_container.classList.toggle("hidden");
  Duodate_options_container.classList.toggle("block");
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
// the reward that the task has, is written in rewardsImgs.js
function addTask(){
  // Get values
  const xpAmount = document.getElementById("add_task_xp_amount").value;
  const taskTitle = document.getElementById("taskTitle");
  const taskDesc = document.getElementById("taskDesc").value;
  let taskDate;
  if(document.getElementById("chosenDueDate").innerText.toLowerCase() == 'custom date'){
    taskDate = document.getElementById("custom_date_input").value.toLowerCase();
    taskDates.push(taskDate);
    localStorage.setItem('taskDates', JSON.stringify(taskDates));
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
  //create task id
  let idCheck = false;
  function makeTaskId(){
    if(tasks.length > 0){
      let checkIfIdexists = tasks.find(task => task.task_id == taskNumber);
      if(checkIfIdexists != -1 && checkIfIdexists != undefined){
        taskNumber++;
        makeTaskId();
      }else{
        idCheck = true;
        return;
      }
    }else {
      return idCheck = true;
    }
  }
  if(!idCheck){
    makeTaskId();
  }
  if(temporaryImageObject){
    let rewardImgId = temporaryImageObject.id;
    console.log("reward image id: ",rewardImgId);
  }
  // Create task
  let newTask = {
    taskTitle: taskTitle.value,
    taskDesc: taskDesc,
    taskXP: xpAmount || 0,
    taskPriority: priority,
    subTasks: [...addedSubTasksArray],
    taskStatsGains: [...selectedStats],
    createdAt: new Date().toISOString(),
    dueDate: taskDate || 'today',
    task_id: taskNumber,
    rewardId: rewardImgId,
  };
  handleRewardButton();
  tasks.push(newTask);
  // Reset form
  console.log(tasks);
  insertTaskDates();
  createNewTask(newTask);
  localStorage.setItem('myTasks', JSON.stringify(tasks));
  localStorage.setItem('user_level',document.getElementById('levelNumber').innerText);
  resetTaskForm();
  subTasksArray = [];
  taskNumber++;
  localStorage.setItem("taskNumberSoFar",taskNumber);
}
function resetTaskForm() {
  document.getElementById("add_task_xp_amount").value = '';
  document.getElementById("taskTitle").value = '';
  document.getElementById("taskDesc").value = '';
  document.getElementById("custom_date_input").value = '';
  document.getElementById("chosenDueDate").innerText = 'Today';
  document.getElementById("rewardName").innerHTML = '';
  subtaskNum = 0;
  if(subTasksArray.length > 0){
    subTasksArray.forEach((subT,index) =>{
      document.getElementById(`task${taskNumber}_subTask${index+1}`).remove();
    })
  }
  if(parseInt(subTasksContainer.style.height) > 0){
      subTasksContainerHeight = 0;
      subTasksContainer.style.height = `0px`;
      addForm.style.height = `${addForm.clientHeight}px`;
      addForm.style.height = `280px`;
      setTimeout(() => {
        addForm.style.height = "fit-content";
      }, 301);
  }
  addedSubTasksArray = [];
  if(document.getElementById("taskPriority")){
    document.getElementById("taskPriority").remove();
  }
  priority = 4;
  // remove stats
  selectedStats = [];
  let selectedStatsBtnAndInfo = document.getElementById("selectedStatsBtnAndInfo");
  if(selectedStatsBtnAndInfo.classList.contains("flex")){
    selectedStatsBtnAndInfo.classList.remove("flex");
    selectedStatsBtnAndInfo.classList.add("hidden");
  }
}

// task details and edit
let detailsBoxStatus = false;
function toggleTaskDetailDisplay(taskId){
  detailsBoxStatus = !detailsBoxStatus;
  let taskDetailsAndEdit = document.getElementById("taskDetailsAndEdit");
  // let taskDetailsWrapper = document.getElementById("taskDetailsWrapper");
  let taskDetailsClipWrapper = document.getElementById("taskDetailsClipWrapper");
  let taskDetailsWrapperTopScroll = document.getElementById("taskDetailsWrapperTopScroll");
  let taskDetailsWrapperBottomScroll = document.getElementById("taskDetailsWrapperBottomScroll");
  let taskDetailsOutside = document.getElementById("taskDetailsOutside");
  // data elements
  let taskDetail_title = document.getElementById("taskDetail_title");
  let mainTaskTitleOfSubtask = document.getElementById("mainTaskTitleOfSubtask");
  let taskDetailTextArea = document.getElementById("taskDetailTextArea");
  let taskDetail_date = document.getElementById("taskDetail_date");
  let taskDetailXpInput = document.getElementById("taskDetailXpInput");
  let taskDetailXpInputContainer = document.getElementById("taskDetailXpInputContainer");
  let editTaskBtnContainer = document.getElementById("editTaskBtnContainer");
  let taskDetail_reward_container = document.getElementById("taskDetail_reward_container")
  let taskDetail_rewardImg = document.getElementById("taskDetail_rewardImg");
  let taskDetail_rewardName = document.getElementById("taskDetail_rewardName");
  let addToInventory_checkIcon = document.getElementById("addToInventory_checkIcon");
  // open and close task detail with inserted data
  if(detailsBoxStatus){
    if(taskDetail_date.classList.contains("hidden")){
      mainTaskTitleOfSubtask.classList.add("hidden");
      mainTaskTitleOfSubtask.classList.remove("block");
      taskDetail_date.classList.remove("hidden");
      taskDetail_date.classList.add("block");
      taskDetailTextArea.classList.remove("hidden");
      taskDetailTextArea.classList.add("block");
      taskDetailXpInputContainer.classList.remove("mt-4");
    }
    //insert data of the task first
    console.log("task id: " + taskId);
    if(taskId == 1){
      taskDetail_title.value = `Create Your First Task`;
      taskDetailTextArea.value = `Create your first task and start your journey!`;
      addDetailsPriority(1);
      taskDetail_date.value = `No Date`;
      taskDetailXpInput.value = "1000";
      if(!taskDetail_reward_container.classList.contains("hidden")){
        taskDetail_reward_container.classList.add("hidden")
      }
      editTaskBtnContainer.innerHTML = `
      <div>
          <button type="button" onclick="deleteTask(1)" class="pb-0.5 px-1 rounded-md text-[var(--content-text)] text-sm border border-[var(--content-text)] cursor-pointer">Delete</button>
          <button onclick="editTask()" type="button" class="pb-0.5 px-1 rounded-md text-[var(--content-text)] text-sm border border-[var(--content-text)] cursor-pointer opacity-50">Edit</button>
      </div>`;
      //insert subtask data
    }else if(taskId.includes('sub')){
      let mainTaskId = parseInt(taskId[0]);
      let foundMainTask = tasks.find(task=>task.task_id == mainTaskId);
      let foundSubTask = foundMainTask.subTasks.find(subTask => subTask.id == taskId);
      mainTaskTitleOfSubtask.innerText = `${foundMainTask.taskTitle}`;
      mainTaskTitleOfSubtask.classList.remove("hidden");
      mainTaskTitleOfSubtask.classList.add("block");
      taskDetail_title.value = foundSubTask.title;
      taskDetailTextArea.classList.add("hidden");
      addDetailsPriority(taskId);
      taskDetail_date.classList.add("hidden");
      taskDetailXpInputContainer.classList.add("mt-4");
      taskDetailXpInput.value = foundSubTask.xp;
      if(!taskDetail_reward_container.classList.contains("hidden")){
        taskDetail_reward_container.classList.add("hidden")
      }
      editTaskBtnContainer.innerHTML = `
      <div>
        <button type="button" onclick="deleteTask('${taskId}')" class="pb-0.5 px-1 rounded-md text-[var(--content-text)] text-sm border border-[var(--content-text)] cursor-pointer">Delete</button>
        <button onclick="editTask('${taskId}')" type="button" class="pb-0.5 px-1 rounded-md text-[var(--content-text)] text-sm border border-[var(--content-text)] cursor-pointer">Edit</button>
      </div>`;
      //insert data of the selected task
    }else {
      let foundTask = tasks.find(task => task.task_id == taskId);
      let task_rewardInfo = getImageById(foundTask.rewardId);
      if(task_rewardInfo){
        if(taskDetail_reward_container.classList.contains("hidden")){
          taskDetail_reward_container.classList.remove("hidden")
        }
        console.log(task_rewardInfo.inventoryState);
        if(task_rewardInfo.inventoryState){
          if(addToInventory_checkIcon.classList.contains("hidden")){
            addToInventory_checkIcon.classList.remove("hidden");
          }
        }else{
          if(!addToInventory_checkIcon.classList.contains("hidden")){
            addToInventory_checkIcon.classList.add("hidden");
          }
        }
        taskDetail_rewardImg.src = task_rewardInfo.img;
        taskDetail_rewardName.innerHTML = task_rewardInfo.fileName;
      }
      taskDetail_title.value = foundTask.taskTitle;
      taskDetailTextArea.value = foundTask.taskDesc;
      addDetailsPriority(foundTask.taskPriority);
      taskDetail_date.value = foundTask.dueDate;
      taskDetailXpInput.value = foundTask.taskXP;
      // console.log(foundTask);
      editTaskBtnContainer.innerHTML = `
      <div>
        <button type="button" onclick="deleteTask('${taskId}')" class="pb-0.5 px-1 rounded-md text-[var(--content-text)] text-sm border border-[var(--content-text)] cursor-pointer">Delete</button>
        <button onclick="editTask(${taskId})" type="button" class="pb-0.5 px-1 rounded-md text-[var(--content-text)] text-sm border border-[var(--content-text)] cursor-pointer">Edit</button>
      </div>
      <div onclick="toggleTaskDetailStatsDisplay()" class="w-[120px] py-1 px-3 bg-[var(--form-stats-Btn-bg)] rounded-md flex justify-between items-center gap-2 text-center relative">
          <div id="selectedStatsBtn" class="overflow-hidden text-ellipsis cursor-default">
              <div class="flex">
                  <p id="taskDetailStatsBtnName" class="overflow-hidden text-ellipsis max-w-10"></p>
                  <span>+</span>
                  <span id="taskDetailStatsBtnLevel" class="overflow-hidden text-ellipsis max-w-10"></span>
              </div>
          </div>
          <span class="transform rotate-90">
              <svg width="10px" height="10px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="102.4">

                  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                  
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                  
                  <g id="SVGRepo_iconCarrier">
                  
                  <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="currentColor"/>
                  
                  </g>
                  
              </svg>
          </span>
          <div id="taskDetailStatsDisplayContainer" class="w-[120px] absolute -top-[164px] left-0 shadow-sm shadow-blue-400 rounded-md gap-1 overflow-hidden z-50 hidden">
              <div class="relative">
                  <div id="taskDetailStatsDisplay" class="w-full h-40 overflow-y-auto statsScrollbar pb-7 px-2 bg-[var(--form-stats-Btn-bg)] [&>div]:pt-2 [&>div]:flex [&>div]:justify-center [&>div]:gap-1">
                      
                  </div>
                  <!-- bottom arrow svg -->
                  <div class="w-full p-2 bg-blue-950 flex justify-center transition-all duration-300 text-blue-300 hover:text-gray-50 [&>svg]:transform [&>svg]:-rotate-90 absolute bottom-0 right-0">
                      <svg width="10px" height="10px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="102.4">

                          <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                          
                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                          
                          <g id="SVGRepo_iconCarrier">
                          
                          <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="currentColor"/>
                          
                          </g>
                          
                      </svg>
                  </div>
              </div>
          </div>
      </div>
      `;
      if(foundTask.taskStatsGains.length > 0){
        document.getElementById("taskDetailStatsBtnName").innerHTML = foundTask.taskStatsGains[0].statName;
        document.getElementById("taskDetailStatsBtnLevel").innerHTML = foundTask.taskStatsGains[0].statLevel;
        if(foundTask.taskStatsGains.length>1){
          let remainingStats = foundTask.taskStatsGains.slice(1,foundTask.taskStatsGains.length);
          let taskDetailStatsDisplay = document.getElementById("taskDetailStatsDisplay");
          remainingStats.forEach(stat =>{
            taskDetailStatsDisplay.innerHTML +=`
              <div>
                <span class="overflow-hidden text-ellipsis text-start w-8">${stat.statName}</span>
                <span>+</span>
                <span class="overflow-hidden text-ellipsis w-8">${stat.statLevel}</span>
              </div>
            `;
          })
        }
      }
    }
    //open task detail
    taskDetailsOutside.classList.toggle("hidden");
    taskDetailsOutside.classList.toggle("block");
    taskDetailsAndEdit.classList.toggle("hidden");
    taskDetailsAndEdit.classList.toggle("block");
    autoResizeTextArea("taskDetailTextArea");
    autoResizeTextArea("taskDetail_title");
    resizeXpInput();
    setTimeout(() => {
      taskDetailsOutside.classList.toggle("opacity-0");
      taskDetailsOutside.classList.toggle("opacity-100");
      taskDetailsAndEdit.classList.toggle("opacity-0");
      taskDetailsAndEdit.classList.toggle("opacity-100");
    }, 1);
    setTimeout(() => {
      taskDetailsWrapperTopScroll.classList.toggle("-top-2");
      taskDetailsWrapperTopScroll.classList.toggle("top-1/2");
      taskDetailsWrapperBottomScroll.classList.toggle("-bottom-2");
      taskDetailsWrapperBottomScroll.classList.toggle("bottom-1/2");
      taskDetailsClipWrapper.classList.toggle("closed");
      taskDetailsClipWrapper.classList.toggle("open");
    }, 350);
    //this else is for opening and closing taskDetails
  }else {
    taskDetailsWrapperTopScroll.classList.toggle("-top-2");
    taskDetailsWrapperTopScroll.classList.toggle("top-1/2");
    taskDetailsWrapperBottomScroll.classList.toggle("-bottom-2");
    taskDetailsWrapperBottomScroll.classList.toggle("bottom-1/2");
    taskDetailsClipWrapper.classList.toggle("closed");
    taskDetailsClipWrapper.classList.toggle("open");
    taskDetailsOutside.classList.toggle("opacity-100");
    taskDetailsOutside.classList.toggle("opacity-0");
    taskDetailsAndEdit.classList.toggle("opacity-0");
    taskDetailsAndEdit.classList.toggle("opacity-100");
    setTimeout(() => {
      taskDetailsOutside.classList.toggle("hidden");
      taskDetailsOutside.classList.toggle("block");
      taskDetailsAndEdit.classList.toggle("hidden");
      taskDetailsAndEdit.classList.toggle("block");
    }, 301);
  }
  // console.log(taskDetailsWrapper.offsetHeight);
}
function toggleTaskDetailStatsDisplay(){
    let taskDetailStatsDisplayContainer = document.getElementById("taskDetailStatsDisplayContainer");
    taskDetailStatsDisplayContainer.classList.toggle("hidden");
    taskDetailStatsDisplayContainer.classList.toggle("block");
}
function ToggleTaskDetailPriorityDisplay(){
  let taskDetail_priorities_container = document.getElementById("taskDetail_priorities_container");
  taskDetail_priorities_container.classList.toggle("w-[143px]");
  taskDetail_priorities_container.classList.toggle("w-0");
}
function editTask(taskId){
  let taskDetail_title = document.getElementById("taskDetail_title");
  let taskDetailTextArea = document.getElementById("taskDetailTextArea");
  let taskDetail_date = document.getElementById("taskDetail_date");
  let taskDetailXpInput = document.getElementById("taskDetailXpInput");
  if(typeof(taskId)==="number"){
    let editedValues =  {
      taskTitle: taskDetail_title.value,
      taskDesc: taskDetailTextArea.value,
      taskXP: taskDetailXpInput.value,
      taskPriority: edited_priority,
      dueDate: taskDetail_date.value,
    };
    tasks = tasks.map(task => {
      if (task.task_id === taskId) {
        return { ...task, ...editedValues };
      }
      return task;
    });
  }else {
    let editedValues =  {
      title: taskDetail_title.value,
      xp: taskDetailXpInput.value,
    };
    tasks = tasks.map(task => {
    if (task.task_id == parseInt(taskId[0])) {
      const editedSubTasks = task.subTasks.map(subtask => {
        if (subtask.id == taskId) {
          return { ...subtask, ...editedValues };
        }
        return subtask;
      });
      return { ...task, subTasks: editedSubTasks };
    }
    return task;
  });
  }
  localStorage.setItem('myTasks', JSON.stringify(tasks));
  toggleTaskDetailDisplay();
  createTasks(tasks);
}