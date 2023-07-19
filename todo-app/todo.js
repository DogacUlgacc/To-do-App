"use strict";

let taskList = [];

if (localStorage.getItem("taskList") !== null) {
    taskList = JSON.parse(localStorage.getItem("taskList"));
}

let updateId;
let isUpdateTask = false;

const taskInput = document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span");

displayTasks("all");

function displayTasks(filter) {
    let ul = document.getElementById("task-list");
    ul.innerHTML = "";

    if (taskList.length == 0) {
        ul.innerHTML = "<p class='p-3 m-0'>Your task list is empty!</p>";
    } else {
        for (let task of taskList) {
            let completed = task.status == "completed" ? "checked" : "";

            if (filter == task.status || filter == "all") {
                let li = `
                <li class="task list-group-item">
                    <div class="form-check">
                        <input type="checkbox" onclick="updateStatus(this)" id="${task.id}" class="form-check-input" ${completed}>
                        <label for="${task.id}" class="form-check-label ${completed}">${task.gorevAdi}</label>
                    </div>

                    <div class="dropdown">
                        <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <a onclick='updateTask(${task.id}, "${task.gorevAdi}")' class="dropdown-item" href="#">
                                    <i class="fa-solid fa-pen text-success"></i> Edit
                                </a>
                            </li>
                            <li>
                                <a onclick="deleteTask(${task.id})" class="dropdown-item" href="#">
                                    <i class="fa-solid fa-trash-can text-danger"></i> Clean
                                </a>
                            </li>
                        </ul>
                 </div>

                </li>
            `;
                ul.insertAdjacentHTML("beforeend", li);
            }
        }
    }
}

document.querySelector("#btnAddNewTask").addEventListener("click", newTask);

document
    .querySelector("#btnAddNewTask")
    .addEventListener("keypress", function () {
        if (event.key == "Enter") {
            document.getElementById("btnAddNewTask").click();
        }
    });

for (let span of filters) {
    span.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    });
}

function newTask(event) {
    if (taskInput.value == "") {
        alert("You must enter a task!");
    } else {
        if (!isUpdateTask) {
            taskList.push({
                id: taskList.length + 1,
                gorevAdi: taskInput.value,
                status: "uncompleted",
            });
        } else {
            for (let gorev of taskList) {
                if (gorev.id == updateId) {
                    gorev.gorevAdi = taskInput.value;
                }
                isUpdateTask = false;
            }
        }

        taskInput.value = "";
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }
    event.preventDefault();
}

function deleteTask(id) {
    let deletedId;

    for (let index in taskList) {
        if (taskList[index].id == id) {
            deletedId = index;
        }
    }

    taskList.splice(deletedId, 1);
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("taskList", JSON.stringify(taskList));
}

function updateTask(taskId, taskName) {
    updateId = taskId;
    isUpdateTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");
}

btnClear.addEventListener("click", function () {
    taskList.splice(0, taskList.length);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    displayTasks();
});

function updateStatus(selectedTask) {
    let label = selectedTask.nextElementSibling;
    let state;

    if (selectedTask.checked) {
        label.classList.add("checked");
        state = "completed";
    } else {
        label.classList.remove("checked");
        state = "uncompleted";
    }

    for (let task of taskList) {
        if (task.id == selectedTask.id) {
            task.status = state;
        }
    }
    displayTasks(document.querySelector("span.active").id);

    localStorage.setItem("taskList", JSON.stringify(taskList));
}
