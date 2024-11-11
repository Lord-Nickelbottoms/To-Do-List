// **********************           DECLARATIONS            ******************************* //
const activeListContainer = document.getElementById('activeTaskList')
let taskTitle = document.getElementById("title")
let taskDescription = document.getElementById("description")


let activeTasks = [];
let completedTasks = [];

window.addEventListener('DOMContentLoaded', () => {
    console.log("task-list-script loaded");
    
    // load from storage or server

    if (!Array.isArray(activeTasks) || !activeTasks.length) {
        // array does not exist, is not an array, or is empty
        // ⇒ do not attempt to process array
        console.log("List is empty")
        getList()
    }
})

// **********************           CREATE BUTTON            ******************************* //
document.getElementById('createButton').addEventListener('click', () => {
    if (taskTitle.value !== "") {
        let indexId = 0

        if (localStorage.length > 0) {
            indexId = localStorage.length - 1
        }
        
        addTask(taskTitle.value.toString(), taskDescription.value.toString(), indexId)
        localStorage.setItem(taskTitle.value.toString(), taskDescription.value.toString())

        closeAddTaskWindow()
    } else {
        alert("Title cannot be empty.\nAdd a title to continue.")
    }
})

// **********************           DELETE BUTTON           ******************************* //
// document.getElementById()

function addTask(list) {

    let activeList = {
        "id": itemNumber,
        "title": title,
        "description": description,
        "status": "active"
    }

    console.log(activeTasks)
    localStorage.removeItem("")

    activeTasks.push(activeList)
    localStorage.setItem(`item${itemNumber}`, JSON.stringify(activeTasks[itemNumber]))

    closeAddTaskWindow()
    clearTextFields()
}

// add UI elements for task item
function displayActiveList() {
    for (let i = 0; i < activeTasks.length; i++) {
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
        taskTitle.innerText = activeTasks[i].title

        const taskDescription = document.createElement('p')
        taskDescription.classList.add('task-description')
        taskDescription.innerText = activeTasks[i].description

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

// **********************           GET REQUEST            ******************************* //
function getList() {
    // Define the API URL
    const apiUrl = 'http://localhost:3002/get-list';

// Make the API request
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Display the response data in the console
            console.log('API Response:', data);

            // Display data on the webpage
            activeTasks = data
            displayActiveList()
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}