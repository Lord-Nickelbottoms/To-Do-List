// **********************           DECLARATIONS            ******************************* //
const activeListContainer = document.getElementById('activeTaskList')
let taskTitle = document.getElementById("title")
let taskDescription = document.getElementById("description")

let activeTasks = [];
let completedTasks = [];


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
        
        addTask(indexId, taskTitle.value.toString(), taskDescription.value.toString(), indexId)
        localStorage.setItem(taskTitle.value.toString(), taskDescription.value.toString())

        closeAddTaskWindow()
    } else {
        alert("Title cannot be empty.\nAdd a title to continue.")
    }
})

// **********************           DELETE BUTTON           ******************************* //
function deleteTask(event, index) {
    
    // if (activeTasks[index]) {
    //     Array.prototype.remove = function() {
    //         let itemToDelete;
    //         let funcArguments = arguments;
    //         L = funcArguments.length;
    //         let ax;

    //         while (L && this.length) {
    //             itemToDelete = funcArguments[--L];

    //             while ( (ax = this.indexOf(itemToDelete)) !== -1 ) {
    //                 this.splice(ax, 1)
                    
    //                 if (event.target.nodeName === "BUTTON") {
    //                     event.parentNode.removeChild(event.target.parentNode)
    //                 }
    //             }
    //         }
    //     }
    //     console.log(`${activeTasks[index]} deleted.`);
        
    // }

    // activeTasks.remove(activeTasks[index])
}

function deleteTask() {
    let deleteButtonCollection = document.getElementsByClassName("delete-button")

    for (let index = 0; index < deleteButtonCollection.length; index++) {
        let button = deleteButtonCollection[index]

        button.addEventListener('click', () => {
            activeListContainer.removeChild(button.parentNode)
        })
    }
}

function addTask(index, title, description) {

    let activeList = {
        "id": index,
        "title": title,
        "description": description,
        "status": "active"
    }

    console.log(activeTasks)
    localStorage.removeItem("")

    activeTasks.push(activeList)
    // localStorage.setItem(`item${index}`, JSON.stringify(activeTasks[index]))

    closeAddTaskWindow()
    clearTextFields()
}

function completeTask() {

    const completedButtonCollection = document.getElementsByClassName('complete-button')

    for (let i = 0; i < completedButtonCollection.length; i++) {
        const button = completedButtonCollection[i];
        
        button.addEventListener('click', () => {
            activeListContainer.removeChild(button.parentNode)
        })
    }

    for (let i = 0; i < activeTasks.length; i++) {
        const element = activeTasks[i];
        
        // if (selectedTask === element) {
        //     element.status = "completed"
        //     completedTasks.push(element)
        //     console.log(element);
            
        // }
    }
}

// add UI elements for active task item
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

    // apply functions to buttons
    deleteTask()
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
    const apiUrl = 'http://localhost:3001/get-list';

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
        .then(data => {
            for (let index = 0; index < activeTasks.length; index++) {
                const element = activeTasks[index];
                console.log(element);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}