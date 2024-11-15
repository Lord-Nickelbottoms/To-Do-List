window.addEventListener('DOMContentLoaded', () => {
    console.log('Add new task window script loaded');
})

const addTaskWindow = document.getElementById("addTaskWindow")
const taskListWindows = document.getElementById("taskList")

document.getElementById("newTask").addEventListener("click", () => {
    if (addTaskWindow.style.display === "none") {
        addTaskWindow.style.display = "block";
        taskListWindows.style.display = "none";
    } else {
        addTaskWindow.style.display = "none";
        taskListWindows.style.display = "block";
    }
})

document.getElementById("closeButton").addEventListener("click", () => {
    if (addTaskWindow.style.display === "block") {
        addTaskWindow.style.display = "none";
        taskListWindows.style.display = "block";
    } else {
        addTaskWindow.style.display = "block";
        taskListWindows.style.display = "none";
    }
})