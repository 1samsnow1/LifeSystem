const autoResizeTextArea = (textAreaId) => {
    let targetTextArea = document.getElementById(textAreaId);
    targetTextArea.style.height = "auto";
    targetTextArea.style.height = targetTextArea.scrollHeight + "px";
    // console.log(targetTextArea.scrollHeight)
};

//add auto resize text area to all textareas
const allTextAreas = document.querySelectorAll(".autoResizeTextArea");
allTextAreas.forEach((textAr)=>{
    textAr.addEventListener("input",()=>autoResizeTextArea(textAr.id));
});

const taskDetailXpInput = document.getElementById("taskDetailXpInput");
const taskDetailXpInputMirror = document.getElementById("taskDetailXpInputMirror");
const resizeXpInput = () => {
    // console.log(taskDetailXpInputMirror.offsetWidth + ": " + taskDetailXpInput.value);
    const allowed = /[^0-9\s\-]/g;
    const cursor = taskDetailXpInput.selectionStart;
    taskDetailXpInput.value = taskDetailXpInput.value.replace(allowed, "");
    // restore cursor position
    taskDetailXpInput.setSelectionRange(cursor, cursor);
    // resize input
    taskDetailXpInputMirror.textContent = taskDetailXpInput.value || "0";
    taskDetailXpInput.style.width = taskDetailXpInputMirror.offsetWidth +12 + "px";
};
// Resize on input
taskDetailXpInput.addEventListener("input", resizeXpInput);
// Resize once on page load (for initial value)
window.addEventListener("load", resizeXpInput);

