let starting = 0;
let ayo = null;
// Assuming your monitor runs at 60fps (most common):
// Each frame takes: 1000ms / 60 = ~16.67ms
// If you want 10 increments per second:
// Each increment should happen every: 1000ms / 10 = 100ms
// Number of frames needed: 100ms / 16.67ms = 6 frames
// Therefore: framesToSkip = 6
let frameToSkip = 25;
let frameCount = 0;
function increasingNum(newNum = null){
    if(!ayo){
        ayo = starting + newNum;
    }
    frameCount++;
    if(frameCount >= frameToSkip){
        starting++;
        console.log("my number:" + starting);
        frameCount = 0;
    }
    if(starting<ayo){
        requestAnimationFrame(()=>increasingNum(newNum));
    }else {
        return ayo = null;
    }
}

let user_level = localStorage.getItem('user_level') || 0;
// user titles are in options.js 
let user_title;
if (user_level == 0){
    user_title = 'New';
}else {
    //user_titles variable is in options.js
    let found_title = user_titles.findLast(title => title.level <= user_level);
    user_title = found_title.title;
}
let completedTasks = JSON.parse(localStorage.getItem('completed_tasks')) || [];
let checked_first_task = localStorage.getItem('checked_first_task') || false;
let remain_xp = parseInt(localStorage.getItem("remain_xp"));
if(completedTasks.length !=0 || remain_xp || user_level > 0){
    document.getElementById("levelNumber").innerText = user_level;
    document.getElementById("xpAmount_p").innerText = remain_xp;
    document.getElementById("xp-bar").style.width = `${remain_xp/10}%`
    document.querySelector(".oldTitle").innerText = user_title;
    console.log("data recovered");
}
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
// this is the number of tasks user has added, deleted, completed, and starts with 2 because the first is to create task
let taskNumber = parseInt(localStorage.getItem("taskNumberSoFar")) || 2;
const tasksContainer = document.getElementById("tasksContainer");
tasksContainer.addEventListener('click',(e)=>{
    // console.log(e.target);
    // console.log(e.target.getAttribute("data-task-id"));
    if(e.target.classList.contains('tasksClass') || e.target.classList.contains('taskContainer')){
        toggleTaskDetailDisplay(e.target.getAttribute("data-task-id"));
    }
})
// this function is triggered on reload in app.js "chosenDate" function
function createTasks(tasksArray){
    tasksContainer.innerHTML = '';
    if(tasksArray.length == 0 && !checked_first_task){
        tasksContainer.innerHTML +=`
        <div id="task1" class="relative">
            <!-- main task -->
            <div>
                <div id="task1_container" data-task-id="1" class="taskContainer duration-300 border-transparent hover:border-[var(--task-border)] taskShadow origin-center">
                    <!-- task goal-->
                    <div id="taskClass1" data-task-id="1" class="tasksClass">
                        
                        <div onclick="fillCheckbox(this),completeTask(1000, '1')" class="taskCheckbox checkboxFill"></div>
                        <div class="taskpriority">
                            <span>
                                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio1)"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio1)"></path> </g></svg>
                            </span>
                        </div>
                        <h3 class="taskTitle">Create Your First Task</h3>
                    </div>
                    <div class="text-[13px] sm:text-sm pl-6 flex gap-2 pointer-events-none">
                        <div>1000xp</div>
                        <p>No Date</p>
                    </div>
                </div>
                <div id="task1_preventionLayer" class="taskPreventionLayer hidden w-full h-full bg-transparent absolute top-0 right-0 z-20"></div>
            </div>
                <!-- sub tasks -->
        </div>
        `;
        document.getElementById("levelNumber").innerHTML = 0;
        console.log("first create task codition triggered" + "| first task completed? " + checked_first_task);
    }else {
        if(!checked_first_task){
            tasksContainer.innerHTML +=`
            <div id="task1" class="relative">
            <!-- main task -->
            <div>
                <div id="task1_container" data-task-id="1" class="taskContainer duration-300 border-transparent hover:border-[var(--task-border)] taskShadow origin-center">
                    <!-- task goal-->
                    <div id="taskClass1" data-task-id="1" class="tasksClass">
                        
                        <div onclick="fillCheckbox(this),completeTask(1000, '1')" class="taskCheckbox checkboxFill"></div>
                        <div class="taskpriority">
                            <span>
                                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio1)"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio1)"></path> </g></svg>
                            </span>
                        </div>
                        <h3 class="taskTitle">Create Your First Task</h3>
                    </div>
                    <div class="text-[13px] sm:text-sm pl-6 flex gap-2 pointer-events-none">
                        <div>1000xp</div>
                        <p>No Date</p>
                    </div>
                </div>
                <div id="task1_preventionLayer" class="taskPreventionLayer hidden w-full h-full bg-transparent absolute top-0 right-0 z-20"></div>
            </div>
                <!-- sub tasks -->
        </div>
            `;
        }
        // console.log("tasksArray: ",tasksArray);
        tasksArray.forEach((task)=>{
        let newTask = document.createElement("div");
        newTask.className = "relative";
        newTask.id = `task${task.task_id}`;
        newTask.innerHTML += `
        <div id="task${task.task_id}" class="relative">
        <div>
            <div id="task${task.task_id}_container" data-task-id="${task.task_id}" class="taskContainer  duration-300 border-transparent hover:border-[var(--task-border)] origin-center taskShadow">
            <!-- task goal-->
            <div id="taskClass${task.task_id}" data-task-id="${task.task_id}" class="tasksClass">
                <div onclick="fillCheckbox(this),completeTask(${task.taskXP}, '${task.task_id}')" class="taskCheckbox checkboxFill"></div>
                <div class="taskpriority">
                    <span>
                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio${task.taskPriority})"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio${task.taskPriority})"></path> </g></svg>
                    </span>
                </div>
                <h3 class="taskTitle">${task.taskTitle}</h3>
            </div>
            <div class="text-[13px] sm:text-sm pl-6 flex gap-2 pointer-events-none">
                <div>${task.taskXP!=0 ? task.taskXP : ''}${task.taskXP ? 'xp': ''}</div>
                <p>${task.dueDate}</p>
                <div class="overflow-hidden text-ellipsis max-w-12">${task.taskStatsGains.length>0 ? task.taskStatsGains[0].statName : ''}${task.taskStatsGains.length>0 ? '+': ''}${task.taskStatsGains.length>0 ? task.taskStatsGains[0].statLevel : ''}</div>
            </div>
            </div>
            <div id="task${task.task_id}_preventionLayer" class="taskPreventionLayer hidden w-full h-full bg-transparent absolute top-0 right-0 z-20"></div>
        </div>
        </div>
        `;
        if(task.subTasks.length !=0){
            task.subTasks.forEach((subT,index) => {
                newTask.innerHTML +=  `
        <div id="task${subT.id}" class="${subT.completed ? 'hidden':'subTask'}">
            <div id="task${subT.id}_container" data-task-id="${subT.id}" class="subTaskContainer duration-300 origin-center taskShadow relative">
            <!-- task goal-->
            <div id="taskClass${subT.id}" data-task-id="${subT.id}" class="tasksClass justify-between">
                <div class="flex items-center">
                    <div onclick="fillCheckbox(this),completeTask(${subT.xp}, '${subT.id}')" class="taskCheckbox checkboxFill"></div>
                    <div class="taskpriority">
                        <span>
                            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio${task.taskPriority})"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio${task.taskPriority})"></path> </g></svg>
                        </span>
                    </div>
                    <h3 class="taskTitle">${subT.title}</h3>
                </div>
                <div class="flex items-center text-xs sm:text-base">
                    <div class="flex gap-1 mx-2">
                        <span>${subT.firstNum}</span>
                        <span>${subT.secondNum=="" ? '': '/'}</span>
                        <span>${subT.secondNum}</span>
                    </div>
                    <div>${subT.xp}${subT.xp? 'xp': ''}</div>
                </div>
            </div>
            </div>
            <div id="task${subT.id}_preventionLayer" class="taskPreventionLayer hidden w-full h-full bg-transparent absolute top-0 right-0 z-20"></div>
        </div>
        `;
    
            })
        }else {
        }
        tasksContainer.appendChild(newTask);
        })
        console.log("second create task codition triggered" + "| first task completed? " + checked_first_task);
    }
}

// this function is triggered in addTask() function in app.js
function createNewTask(Array){ // actually I meant object here not an Array
    let tasksContainer = document.getElementById("tasksContainer");
    let newTask = document.createElement("div");
    newTask.className = "relative";
    newTask.id = `task${Array.task_id}`;
    newTask.innerHTML += `
    <div>
        <div id="task${Array.task_id}_container" data-task-id="${Array.task_id}" class="taskContainer duration-300 border-transparent hover:border-[var(--task-border)] origin-center taskShadow">
        <!-- task goal-->
        <div id="taskClass${Array.task_id}" data-task-id="${Array.task_id}" class="tasksClass">
            <div onclick="fillCheckbox(this),completeTask(${Array.taskXP}, '${Array.task_id}')" class="taskCheckbox checkboxFill"></div>
            <div class="taskpriority">
                <span>
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio${Array.taskPriority})"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio${Array.taskPriority})"></path> </g></svg>
                </span>
            </div>
            <h3 class="taskTitle">${Array.taskTitle}</h3>
        </div>
            <div class="text-[13px] sm:text-sm pl-6 flex gap-2 pointer-events-none">
                <div>${Array.taskXP!=0 ? Array.taskXP : ''}${Array.taskXP ? 'xp': ''}</div>
                <p>${Array.dueDate}</p>
                <div class="overflow-hidden text-ellipsis max-w-12">${Array.taskStatsGains.length>0 ? Array.taskStatsGains[0].statName : ''}${Array.taskStatsGains.length>0 ? '+' : ''}${Array.taskStatsGains.length>0 ? Array.taskStatsGains[0].statLevel : ''}</div>
            </div>
        </div>
        <div id="task${Array.task_id}_preventionLayer" class="taskPreventionLayer hidden w-full h-full bg-transparent absolute top-0 right-0 z-20"></div>
    </div>
    `;
    if(Array.subTasks.length !=0){
        Array.subTasks.forEach((subT,index) => {
            newTask.innerHTML +=  `
    <div id="task${subT.id}" class="subTask">
        <div id="task${subT.id}_container" data-task-id="${subT.id}" class="subTaskContainer duration-300 origin-center taskShadow relative">
        <!-- task goal-->
        <div id="taskClass${subT.id}" data-task-id="${subT.id}" class="tasksClass justify-between">
            <div class="flex items-center">
                <div onclick="fillCheckbox(this),completeTask(${subT.xp}, '${subT.id}')" class="taskCheckbox checkboxFill"></div>
                <div class="taskpriority">
                    <span>
                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio${Array.taskPriority})"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio${Array.taskPriority})"></path> </g></svg>
                    </span>
                </div>
                <h3 class="taskTitle">${subT.title}</h3>
            </div>
            <div class="flex items-center text-xs sm:text-base">
                <div class="flex gap-1 mx-2">
                    <span>${subT.firstNum}</span>
                    <span>${subT.secondNum=="" ? '': '/'}</span>
                    <span>${subT.secondNum}</span>
                </div>
                <div>${subT.xp}${subT.xp? 'xp': ''}</div>
            </div>
        </div>

        </div>
        <div id="task${subT.id}_preventionLayer" class="taskPreventionLayer hidden w-full h-full bg-transparent absolute top-0 right-0 z-20"></div>
    </div>
    `;

        })
    }else {
    }
    tasksContainer.appendChild(newTask);

}
