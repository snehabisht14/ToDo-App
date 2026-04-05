let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Load tasks on page load
window.onload = function() {
    filterTasks(currentFilter);
};

// Add Task
function addTask() {
    let input = document.getElementById("taskInput");
    let text = input.value.trim();

    if (text === "") {
        alert("Enter a task!");
        return;
    }

    tasks.push({ text: text, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    input.value = "";
    filterTasks(currentFilter);
}

// Display tasks based on filter
function filterTasks(filter) {
    currentFilter = filter;

    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let filtered = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true; // all
    });

    filtered.forEach((task, index) => {
        let li = document.createElement("li");

        let span = document.createElement("span");
        span.innerText = task.text;

        // Apply completed style
        if (task.completed) {
            span.classList.add("completed");
        }

        // Toggle complete
        span.onclick = function() {
            tasks[index].completed = !tasks[index].completed;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            filterTasks(currentFilter);
        };

        // Delete
        let btn = document.createElement("button");
        btn.innerText = "🗑";
        btn.onclick = function() {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            filterTasks(currentFilter);
        };

        li.appendChild(span);
        li.appendChild(btn);
        taskList.appendChild(li);
    });
}