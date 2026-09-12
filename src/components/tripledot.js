const tripledot = document.createElement("template");
const tripledotContainers = document.querySelectorAll(".tripledot");
tripledotContainers.forEach(tripledotContainer =>{
    tripledot.innerHTML = `
    <svg width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="var(--content-text)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style>.cls-1{fill:currentColor;}.cls-2{fill:currentColor;}</style> </defs> <title></title> <g id="dots"> <circle class="cls-1" cx="16" cy="16" r="3"></circle> <circle class="cls-1" cx="16" cy="8" r="3"></circle> <circle class="cls-1" cx="16" cy="24" r="3"></circle> <path class="cls-2" d="M16,13v6a3,3,0,0,0,0-6Z"></path> <path class="cls-2" d="M16,5v6a3,3,0,0,0,0-6Z"></path> <path class="cls-2" d="M16,21v6a3,3,0,0,0,0-6Z"></path> </g> </g></svg>
    `;
    tripledotContainer.appendChild(tripledot.content);
})