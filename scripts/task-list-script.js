let completedTasks = [];
let activeTasks = [];


let completeList = {}

window.addEventListener('DOMContentLoaded', () => {
    console.log("task-list-script loaded");
    
    // load from storage or server
    if (localStorage.length !== 0) {
        for (let i = 0; i < localStorage.length - 1; i++) {
            // activeTasks.push(JSON.stringify(localStorage.getItem(localStorage.key(i))));
            localStorage.removeItem("");
            localStorage.removeItem(null);

            activeTasks = JSON.parse(localStorage.getItem(localStorage.key(i)))
            
            displayActiveList(activeTasks[i]["title"], activeTasks[i]["description"]);
        }
    }
})

const activeListContainer = document.getElementById('activeTaskList')

let taskTitle = document.getElementById("title")
let taskDescription = document.getElementById("description")

document.getElementById('createButton').addEventListener('click', () => {
    if (taskTitle.value !== "") {
        addTask(taskTitle.value.toString(), taskDescription.value.toString())
        localStorage.setItem(taskTitle.value.toString(), taskDescription.value.toString())
    } else {
        alert("Title cannot be empty.\nAdd a title to continue.")
    }
})

function addTask(title, description) {

    let activeList = {
        "title": title,
        "description": description,
        "status": "active"
    }

    // activeTasks.push(activeList)
    // activeTasks.push(activeList)

    // change to POST when backend is integrated
    for (let i = 0; i <= activeTasks.length; i++) {
        localStorage.setItem(`item${i}`, JSON.stringify(activeTasks));
    }

    clearTextFields()
    displayActiveList(activeList)
}

// add UI elements for task item
function displayActiveList(title, description) {
    const activeTask = document.createElement('div')
    activeTask.classList.add('task')
    activeTask.classList.add('active-task')
    activeListContainer.appendChild(activeTask)

    
    const completeButton = document.createElement('button')
    completeButton.classList.add('complete-button')

    const completeIcon = document.createElement('i')
    completeIcon.classList.add('fa-solid')
    completeIcon.classList.add('fa-check')

    completeButton.appendChild(completeIcon)
    activeTask.appendChild(completeButton)
    

    const taskInformationContainer = document.createElement('div')
    taskInformationContainer.classList.add('task-information')

    const taskTitle = document.createElement('p')
    taskTitle.classList.add('task-title')
    taskTitle.innerText = title

    const taskDescription = document.createElement('p')
    taskDescription.classList.add('task-description')
    taskDescription.innerText = description

    taskInformationContainer.appendChild(taskTitle)
    taskInformationContainer.appendChild(taskDescription)
    activeTask.appendChild(taskInformationContainer)
    
    
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('delete-button')
    
    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('fa-solid')
    deleteIcon.classList.add('fa-trash-can')
    
    deleteButton.appendChild(deleteIcon)
    activeTask.appendChild(deleteButton)
}

function clearTextFields() {
    taskTitle.value = ""
    taskTitle.textContent = ""
    
    taskDescription.value = ""
    taskDescription.textContent = ""
    
    closeAddTaskWindow()
}

function closeAddTaskWindow() {
    document.getElementById("addTaskWindow").style.display = "none"
    taskListWindows.style.display = "block"
}
