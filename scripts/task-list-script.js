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
// var observeDOM = (function() {
//     var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  
//     return function(obj, callback) {
//       if (!obj || obj.nodeType !== 1) {
//         return;
//       }
  
//       if (MutationObserver) {
//         // define a new observer
//         var mutationObserver = new MutationObserver(callback);
  
//         // have the observer observe for changes in children
//         mutationObserver.observe(obj, {childList: true, subtree: true});
//         return mutationObserver;
//       } else if (window.addEventListener) { // browser support fallback
//         obj.addEventListener('DOMNodeInserted', callback, false);
//         obj.addEventListener('DOMNodeRemoved', callback, false);
//       }
//     }
//   })();

  // Observe a specific DOM element:
// observeDOM(listEl, function(m) {
//     var addedNodes = [], removedNodes = [];
 
//     m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes));
 
//     m.forEach(record => record.removedNodes.length & removedNodes.push(...record.removedNodes));
 
//     console.clear();
//     console.log('Added:', addedNodes, 'Removed:', removedNodes);
//  });
window.addEventListener('load', () => {
    console.log("task-list-script loaded");

    getList()
    
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
        localStorage.setItem(taskTitle.value.toString(), taskDescription.value.toString())

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

    let completedButtonCollection

    for (let i = 0; i < activeTasks.length; i++) {
        completedButtonCollection = document.getElementsByClassName('complete-button')
        const button = completedButtonCollection[i]

        completedButtonCollection.length = activeTasks.length
        
        button.addEventListener('click', () => {
            activeTasks[i]["status"] = "completed"
            console.log(activeTasks[i]);
            
            completedTasks.push(activeTasks[i])
            console.log(completedTasks[i])

            moveToCompleteList(completedTasks[i])
            activeTasks.splice(i, 1)
            activeListContainer.removeChild(button.parentNode)

            
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
        taskTitle.innerText = activeTasks[i].title

        taskInformationContainer.appendChild(taskTitle)

        const taskDescription = document.createElement('p')

        if (activeTasks[i].description !== '') {
            taskDescription.classList.add('task-description')
            taskDescription.innerText = activeTasks[i].description
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
    }

    // apply functions to buttons
    deleteActiveTask()
    completeTask()
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
    const route = apiUrl + 'tasks';
// Make the API request
    fetch(route)
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
    getList();
}

async function setCompleted(_id) {
    const finalUrl = apiUrl + `update-task/${id}`

    
}