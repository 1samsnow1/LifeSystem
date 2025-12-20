let user_level = localStorage.getItem('user_level') || 0;
let user_titles = [
    {level:1, title:'Novice'},
    {level:5, title:'Apprentice'},
    {level:10, title:'Adept'},
    {level:20, title:'Expert'},
    {level:35, title:'Master'},
    {level:50, title:'Grandmaster'},
    {level:70, title:'Challenger'},
]
let user_title = localStorage.getItem("user_title") || 'New';
let completedTasks = JSON.parse(localStorage.getItem('completed_tasks')) || [];
let checked_first_task = localStorage.getItem('checked_first_task') || false;
let remain_xp = parseInt(localStorage.getItem("remain_xp"));
if(completedTasks.length !=0 || remain_xp){
    document.getElementById("levelNumber").innerText = user_level;
    document.getElementById("xpAmount_p").innerText = remain_xp;
    document.getElementById("xp-bar").style.width = `${remain_xp/10}%`
    document.querySelector(".oldTitle").innerText = user_title;
    console.log("data recovered");
}
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let taskNumber = tasks.length + 2;
const tasksContainer = document.getElementById("tasksContainer");

// this function is triggered on reload in app.js "chosenDate" function
function createTasks(tasksArray){
    tasksContainer.innerHTML = '';
    if(tasksArray.length == 0 && !checked_first_task){
        tasksContainer.innerHTML +=`
     <div id="task1" class="relative">
                                <!-- main task -->
                                 <div>
                                     <div id="task1_container" style="max-height: 52px;" class="taskContainer duration-300 border-transparent hover:border-[var(--task-border)] taskShadow origin-center">
                                     <!-- task goal-->
                                     <div id="taskClass1" class="tasksClass">
                                     <p class="absolute -bottom-5 left-6 text-[13px]">No Date</p>
                                            <div onclick="fillCheckbox(this),completeTask(1000, '1')" class="taskCheckbox checkboxFill"></div>
                                            <div class="taskpriority">
                                                <span>
                                                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio1)"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio1)"></path> </g></svg>
                                                </span>
                                            </div>
                                            <h3 class="taskTitle">Create Your First Task</h3>
                                            <div class="taskLine"></div>
                                            <!-- open description button -->
                                            <button onclick="openTaskDesc(1 , this)" class="taskDescBtn">
                                                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 20L18 14M12 20L6 14M12 20L12 9.5M12 4V6.5" stroke="var(--content-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                            </button>
                                            <div class="taskLine"></div>
                                            <div class="">1000xp</div>
                                        </div>
                                        <!-- task description -->
                                         <div id="task1_desc" class="text-[var(--content-text)] pl-6 mt-6 text-sm sm:text-base sm:text-justify flex gap-2 justify-between">
                                         <P>Create your first task and start your journey!</p>
                                        <div onclick="deleteTask(1)" class="cursor-pointer">
                                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="var(--trash-icon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>               
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
                                     <div id="task1_container" style="max-height: 52px;" class="taskContainer duration-300 border-transparent hover:border-[var(--task-border)] taskShadow origin-center relative">
                                        <!-- task goal-->
                                        <div id="taskClass1" class="tasksClass">
                                        <p class="absolute -bottom-5 left-6 text-[13px]">No Date</p>
                                            <div onclick="fillCheckbox(this),completeTask(1000, '1')" class="taskCheckbox checkboxFill"></div>
                                            <div class="taskpriority">
                                                <span>
                                                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio1)"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio1)"></path> </g></svg>
                                                </span>
                                            </div>
                                            <h3 class="taskTitle">Create Your First Task</h3>
                                            <div class="taskLine"></div>
                                            <!-- open description button -->
                                            <button onclick="openTaskDesc(1 , this)" class="taskDescBtn">
                                                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 20L18 14M12 20L6 14M12 20L12 9.5M12 4V6.5" stroke="var(--content-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                            </button>
                                            <div class="taskLine"></div>
                                            <div class="">1000xp</div>
                                        </div>
                                        <!-- task description -->
                                         <div id="task1_desc" class="text-[var(--content-text)] pl-6 mt-6 text-sm sm:text-base sm:text-justify flex gap-2 justify-between">
                                         <P>Create your first task and start your journey!</p>
                                        <div onclick="deleteTask(1)" class="cursor-pointer">
                                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="var(--trash-icon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>               
                                        </div>
                                     </div>
                                     <div id="task1_preventionLayer" class="taskPreventionLayer hidden w-full h-full bg-transparent absolute top-0 right-0 z-20"></div>
                                 </div>
                                 <!-- sub tasks -->
                            </div>
        `;
        }
        tasksArray.forEach((task)=>{
        let newTask = document.createElement("div");
        newTask.className = "relative";
        newTask.id = `task${task.task_id}`;
        newTask.innerHTML += `
        <div>
            <div id="task${task.task_id}_container" style="max-height: 52px;" class="taskContainer  duration-300 border-transparent hover:border-[var(--task-border)] origin-center taskShadow">
            <!-- task goal-->
            <div id="taskClass${task.task_id}" class="tasksClass">
            <p class="absolute -bottom-5 left-6 text-[13px]">${task.dueDate}</p>
                <div onclick="fillCheckbox(this),completeTask(${task.taskXP}, '${task.task_id}')" class="taskCheckbox checkboxFill"></div>
                <div class="taskpriority">
                    <span>
                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio${task.taskPriority})"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio${task.taskPriority})"></path> </g></svg>
                    </span>
                </div>
                <h3 class="taskTitle">${task.taskTitle}</h3>
                <div class="taskLine"></div>
                <!-- open description button -->
                <button onclick="openTaskDesc(${task.task_id} , this)" class="taskDescBtn">
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 20L18 14M12 20L6 14M12 20L12 9.5M12 4V6.5" stroke="var(--content-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </button>
                <div class="taskLine"></div>
                <div class="">${task.taskXP}${task.taskXP ? 'xp': ''}</div>
            </div>
            <!-- task description -->
            <div id="task${task.task_id}_desc" class="text-[var(--content-text)] pl-6 mt-6 text-sm sm:text-base sm:text-justify flex justify-between gap-2">
            <P>${task.taskDesc}</p>
            <div class="cursor-pointer">
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="var(--trash-icon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            </div>
            </div>
            <div id="task${task.task_id}_preventionLayer" class="taskPreventionLayer hidden w-full h-full bg-transparent absolute top-0 right-0 z-20"></div>
        </div>
        `;
        if(task.subTasks.length !=0){
            task.subTasks.forEach((subT,index) => {
                newTask.innerHTML +=  `
        <div id="task${subT.id}" class="${subT.completed ? 'hidden':''}">
            <div id="task${subT.id}_container" style="max-height: 52px;" class="subTaskContainer duration-300 border-0 border-l-2 pt-1 hover:border-2 border-[var(--task-line)] hover:border-[var(--task-border)] origin-center taskShadow ml-2 sm:ml-6 relative">
            <!-- task goal-->
            <div id="taskClass${subT.id}" class="tasksClass">
                <div class="min-w-2 w-4 h-0.5 max-h-0.5 bg-[var(--task-line)] mr-1"></div>
                <div onclick="fillCheckbox(this),completeTask(${subT.xp}, '${subT.id}')" class="taskCheckbox checkboxFill"></div>
                <div class="taskpriority">
                    <span>
                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio${task.taskPriority})"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio${task.taskPriority})"></path> </g></svg>
                    </span>
                </div>
                <h3 class="taskTitle">${subT.title}</h3>
                <div class="taskLine"></div>
                <!-- open description button -->
                <button onclick="openSubTaskDesc('${subT.id}' , this)" class="taskDescBtn">
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 20L18 14M12 20L6 14M12 20L12 9.5M12 4V6.5" stroke="var(--content-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </button>
                <div class="taskLine"></div>
                <div class="flex gap-1 mx-2">
                    <span>${subT.firstNum}</span>
                    <span>${subT.secondNum=="" ? '': '/'}</span>
                    <span>${subT.secondNum}</span>
                </div>
                <div class="sm:static text-xs sm:text-base absolute top-6 left-8">${subT.xp}${subT.xp? 'xp': ''}</div>
            </div>
            <!-- subtask delete and edit -->
            <div id="task${subT.id}_desc" class="text-[var(--content-text)] pl-6 mt-6 text-justify flex justify-between gap-2">
            <div class="cursor-pointer">
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="var(--trash-icon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
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
        <div id="task${Array.task_id}_container" style="max-height: 52px;" class="taskContainer  duration-300 border-transparent hover:border-[var(--task-border)] origin-center taskShadow">
        <!-- task goal-->
        <div id="taskClass${Array.task_id}" class="tasksClass">
            <p class="absolute -bottom-5 left-6 text-[13px]">${Array.dueDate}</p>
            <div onclick="fillCheckbox(this),completeTask(${Array.taskXP}, '${Array.task_id}')" class="taskCheckbox checkboxFill"></div>
            <div class="taskpriority">
                <span>
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio${Array.taskPriority})"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio${Array.taskPriority})"></path> </g></svg>
                </span>
            </div>
            <h3 class="taskTitle">${Array.taskTitle}</h3>
            <div class="taskLine"></div>
            <!-- open description button -->
            <button onclick="openTaskDesc(${Array.task_id} , this)" class="taskDescBtn">
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 20L18 14M12 20L6 14M12 20L12 9.5M12 4V6.5" stroke="var(--content-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
            <div class="taskLine"></div>
            <div class="">${Array.taskXP}${Array.taskXP ? 'xp': ''}</div>
        </div>
        <!-- task description -->
        <div id="task${Array.task_id}_desc" class="text-[var(--content-text)] pl-6 mt-6 text-sm sm:text-base sm:text-justify flex justify-between gap-2">
        <P>${Array.taskDesc}</p>
        <div class="cursor-pointer">
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="var(--trash-icon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        </div>
        </div>
        <div id="task${Array.task_id}_preventionLayer" class="taskPreventionLayer hidden w-full h-full bg-transparent absolute top-0 right-0 z-20"></div>
    </div>
    `;
    if(Array.subTasks.length !=0){
        Array.subTasks.forEach((subT,index) => {
            newTask.innerHTML +=  `
    <div id="task${subT.id}">
        <div id="task${subT.id}_container" style="max-height: 52px;" class="subTaskContainer duration-300 border-0 border-l-2 pt-1 hover:border-2 border-[var(--task-line)] hover:border-[var(--task-border)] origin-center taskShadow ml-2 sm:ml-6 relative">
        <!-- task goal-->
        <div id="taskClass${subT.id}" class="tasksClass">
            <div class="min-w-2 w-4 h-0.5 bg-[var(--task-line)] mr-1"></div>
            <div onclick="fillCheckbox(this),completeTask(${subT.xp}, '${subT.id}')" class="taskCheckbox checkboxFill"></div>
            <div class="taskpriority">
                <span>
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="var(--prio${Array.taskPriority})"></path> <path d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z" fill="var(--prio${Array.taskPriority})"></path> </g></svg>
                </span>
            </div>
            <h3 class="taskTitle">${subT.title}</h3>
            <div class="taskLine"></div>
            <!-- open description button -->
            <button onclick="openSubTaskDesc('${subT.id}' , this)" class="taskDescBtn">
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 20L18 14M12 20L6 14M12 20L12 9.5M12 4V6.5" stroke="var(--content-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
            <div class="taskLine"></div>
            <div class="flex gap-1 mx-2">
                <span>${subT.firstNum}</span>
                <span>${subT.secondNum=="" ? '': '/'}</span>
                <span>${subT.secondNum}</span>
            </div>
            <div class="sm:static text-xs sm:text-base absolute top-6 left-8">${subT.xp}${subT.xp? 'xp': ''}</div>
        </div>
        <!-- subtask delete and edit -->
        <div id="task${subT.id}_desc" class="text-[var(--content-text)] pl-6 mt-6 text-justify flex justify-between gap-2">
        <div class="cursor-pointer">
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="var(--trash-icon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
