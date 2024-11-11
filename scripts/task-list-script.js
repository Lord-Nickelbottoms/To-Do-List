// add UI elements for task item
function addTask(title, description) {
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
