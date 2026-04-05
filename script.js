document.addEventListener("DOMContentLoaded", function() {});


// ELEMENTS
const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// SAVE TO LOCAL STORAGE
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// UPDATE STATS
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById("total").innerText = total;
    document.getElementById("completed").innerText = completed;
    document.getElementById("pending").innerText = pending;
}

// RENDER TASKS
function renderTasks() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
      <span>${task.text}</span><br>
      <small>${task.time}</small>
      <div class="task-buttons">
        <button class="complete">✔</button>
        <button class="edit">✏</button>
        <button class="pin">📌</button>
        <button class="delete">🗑</button>
      </div>
    `;

        // COMPLETE
        li.querySelector(".complete").onclick = () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        };

        // DELETE (FIXED BUG)
        li.querySelector(".delete").onclick = () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };

        // EDIT
        li.querySelector(".edit").onclick = () => {
            const newText = prompt("Edit your task:", task.text);
            if (newText !== null && newText.trim() !== "") {
                task.text = newText;
                saveTasks();
                renderTasks();
            }
        };

        // PIN (MOVE TO TOP)
        li.querySelector(".pin").onclick = () => {
            const pinnedTask = tasks.splice(index, 1)[0];
            tasks.unshift(pinnedTask);
            saveTasks();
            renderTasks();
        };

        if (task.completed) {
            completedList.appendChild(li);
        } else {
            pendingList.appendChild(li);
        }
    });

    updateStats();
}

// ADD TASK
function addTask() {
    const input = document.getElementById("task-input");
    const text = input.value.trim();

    if (text === "") {
        alert("⚠️ Please enter a task!");
        return;
    }

    const task = {
        text: text,
        time: new Date().toLocaleString(),
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    input.value = "";
}

// FILTERS
function showAll() {
    pendingList.parentElement.style.display = "block";
    completedList.parentElement.style.display = "block";
}

function showPending() {
    pendingList.parentElement.style.display = "block";
    completedList.parentElement.style.display = "none";
}

function showCompleted() {
    pendingList.parentElement.style.display = "none";
    completedList.parentElement.style.display = "block";
}

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// LOAD DARK MODE
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

// INITIAL LOAD
renderTasks();