// **********************           DECLARATIONS            ******************************* //
const activeListContainer = document.getElementById('activeTaskList')
const completeListContainer = document.querySelector('.completed-task-list')
let taskTitle = document.getElementById("title")
let taskDescription = document.getElementById("description")

let taskList = []
let activeTasks = [];
let completedTasks = [];

const apiUrl = 'http://localhost:3000/api/'


// **********************           DOCUMENT/WINDOW EVENTS            ******************************* //
window.addEventListener('load', () => {
    console.log("task-list-script loaded");
    // load from storage or server
    if (!Array.isArray(taskList) || !taskList.length) {
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
        
        addTask(indexId, taskTitle.value.toString(), taskDescription.value.toString(), indexId)

        closeAddTaskWindow()
    } else {
        alert("Title cannot be empty.\nAdd a title to continue.")
    }
})

function addTask(index, title, description) {

    let activeList = {
        "id": index,
        "title": title,
        "description": description,
        "status": "active"
    }

    console.log(activeTasks)

    activeTasks.push(activeList)
    createTask(activeList).then(r => console.warn(r))

    closeAddTaskWindow()
    clearTextFields()
}

// **********************           DELETE BUTTON           ******************************* //
function deleteActiveTask() {

    for (let index = 0; index < activeTasks.length; index++) {
        let deleteButtonCollection;
        deleteButtonCollection = document.getElementsByClassName("delete-button")

        let button = deleteButtonCollection[index]
        button.addEventListener('click', () => {
            deleteTask(activeTasks[index]["_id"])
            activeTasks.splice(index, 1)
            activeListContainer.removeChild(button.parentNode)
            
        })
    }
}


function completeTask() {
    for (let i = 0; i < activeTasks.length; i++) {
        let completedButtonCollection = 0;
        completedButtonCollection = document.getElementsByClassName('complete-button')
        const button = completedButtonCollection[i]

        const task = activeTasks[i]
        
        button.addEventListener('click', () => {
            task["status"] = "completed"
            
            completedTasks.push(task)

            moveToCompleteList(task)

            activeTasks.splice(task, 1)

            activeListContainer.removeChild(button.parentNode)

            setCompleted(task["_id"])
        })
    }
}

function moveToCompleteList(task) {

    let descriptionExists = false

    const completedTaskContainer = document.createElement('div')
    completedTaskContainer.classList.add('task')
    completedTaskContainer.classList.add('completed-task')
    completeListContainer.appendChild(completedTaskContainer)

    const undoButton = document.createElement('button')
    undoButton.classList.add('undo-button')
    
    const undoIcon = document.createElement('i')
    undoIcon.classList.add('fa-solid')
    undoIcon.classList.add('fa-arrow-rotate-left')
    undoIcon.classList.add('undo')

    undoButton.appendChild(undoIcon)
    completedTaskContainer.appendChild(undoButton)

    const taskInformationContainer = document.createElement('div')
    taskInformationContainer.classList.add('task-information')
    taskInformationContainer.classList.add('completed-task-information')

    const taskTitle = document.createElement('p')
    taskTitle.classList.add('task-title')
    taskTitle.innerText = task.title

    const taskDescription = document.createElement('p')

    if (task.description !== '') {
        taskDescription.innerText = task.description
        taskDescription.classList.add('task-description')
        descriptionExists = true
    }

    taskInformationContainer.appendChild(taskTitle)

    if (descriptionExists) {
        taskInformationContainer.appendChild(taskDescription)
    }

    completedTaskContainer.appendChild(taskInformationContainer)


}

// add UI elements for active task item
function displayActiveList(activeItemsList) {

    let descriptionExists = false

    for (let i = 0; i < activeItemsList.length; i++) {
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
        taskTitle.innerText = activeItemsList[i].title

        taskInformationContainer.appendChild(taskTitle)

        const taskDescription = document.createElement('p')

        if (activeTasks[i].description !== '') {
            taskDescription.classList.add('task-description')
            taskDescription.innerText = activeItemsList[i].description
            descriptionExists = true
        }


        if (descriptionExists) {
            taskInformationContainer.appendChild(taskDescription)
        }

        activeTask.appendChild(taskInformationContainer)


        const deleteButton = document.createElement('button')
        deleteButton.classList.add('delete-button')


        const deleteIcon = document.createElement('i')
        deleteIcon.classList.add('fa-solid')
        deleteIcon.classList.add('fa-trash-can')

        deleteButton.appendChild(deleteIcon)
        activeTask.appendChild(deleteButton)


        const editButton = document.createElement('button');
        editButton.classList.add('delete-button');
        editButton.classList.add('edit-button');
        const editIcon = document.createElement('i');
        editIcon.classList.add('fa-solid', 'fa-pencil');
        editButton.appendChild(editIcon);
        activeTask.appendChild(editButton);

        const task = activeTasks[i];
        
        editButton.addEventListener('click', () => {
            if (editTaskWindow.style.display === 'none') {
                taskListWindows.style.display = "none";
                editTaskWindow.style.display = 'block';

                preFill(task)
            } else {
                taskListWindows.style.display = "block";
                editTaskWindow.style.display = 'none';
            }
            
            
            activeListContainer.innerHTML = '';
            displayActiveList(activeTasks);
    });

    }

    // apply functions to buttons
    deleteActiveTask()
    completeTask()
}

function preFill(task) {

    const editTaskWindow = document.getElementById('editTaskWindow');
    const taskTitle = document.getElementById('editTaskTitle');
    const taskDescription = document.getElementById('editTaskDescription');
    const taskId = document.getElementById('editTaskId');
    
    document.getElementById('saveEditedTaskButton').addEventListener('click', () => {

        if (taskTitle.value) {
            task["title"] = taskTitle.value
            task["description"] = taskDescription.value

            editTask(task)
        }
    })
}

function editTask(task) {
    console.log(task)
    editTaskData(task)
    closeEditTaskWindow()
}


document.getElementById('cancelEditButton').addEventListener('click', () => {
    document.getElementById("editTaskWindow").style.display = "none"
    taskListWindows.style.display = "block"
})


function clearTextFields() {
    taskTitle.value = ""
    taskTitle.textContent = ""
    
    taskDescription.value = ""
    taskDescription.textContent = ""
    
    closeAddTaskWindow()
    refreshTaskList()
}

function closeEditTaskWindow() {
    document.getElementById("editTaskWindow").style.display = "none"
    taskListWindows.style.display = "block"
}

function closeAddTaskWindow() {
    document.getElementById("addTaskWindow").style.display = "none"
    taskListWindows.style.display = "block"
}

// **********************           REFRESH UI            ******************************* //
function refreshTaskList() {
    location.reload()
    activeListContainer.innerHTML = '';
    displayActiveList(activeTasks);
}

// **********************           GET REQUEST            ******************************* //
function getList() {
    const finalUrl = apiUrl + 'tasks';
    
    fetch(finalUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            // Display data on the webpage
            taskList = data

            for (let i = 0; i < taskList.length; i++) {
                let task = taskList[i];
                
                if (task["status"] === "completed") {
                    completedTasks.push(task)
                    activeTasks.splice(i, 1)
                    moveToCompleteList(task)
                } else {
                    activeTasks.push(task)
                    displayActiveList(activeTasks)
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// ***************************           DELETE REQUEST            ******************************* //
async function deleteTask(_id) {
    const route = apiUrl + `delete-task/${_id}`

    await fetch(route, {
        method: 'DELETE'
    }).then ( async (response) => {
        if (!response.ok) {
            throw new Error(`Network response error: ${response.status}`)
        } else {
            const isJson = response.headers.get('content-type')?.includes('application/json')
            const data = isJson && await response.json()
            console.log(data);
            refreshTaskList()
        }
    })
    .catch(error => {
        console.error(`Error: ${error}`);
        
    })
}

// ***************************           CREATE REQUEST            ******************************* //
async function createTask(task) {
    
    const finalUrl = apiUrl + 'new-task'

    await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, description: task.description, status: 'active' }),
    });
    document.getElementById('newTask').value = '';
    refreshTaskList()
    getList();
}

// ***************************           MARK AS COMPLETED REQUEST            ******************************* //
async function setCompleted(id) {
    const finalUrl = apiUrl + `update-task/${id}`;

    const response = await fetch(finalUrl, {
        method: 'PUT',
    });

    const data = await response.json();
    refreshTaskList()
}

// ***************************           EDIT REQUEST            ******************************* //
async function editTaskData(task) {
    const finalUrl = apiUrl + `edit-task/${task["_id"]}`

    const editedTask = {
        title: task["title"],
        description: task["description"]
    }

    await fetch(finalUrl, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editedTask),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response error: ${response.status}`);
        } else {
            console.log('Task updated successfully:', result);
            
            document.getElementById('editTaskWindow').style.display = 'none';

            refreshTaskList(); // re-render the task list
        }

        return response.json()
    })

    refreshTaskList()
}