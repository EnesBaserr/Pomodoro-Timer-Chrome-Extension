let taskArray = [];
const addbtn = document.getElementById("add");
const start = document.getElementById("start");
function updateTime() {
  chrome.storage.local.get(["timer", "isFinished", "timeOption"], (res) => {
    if (res.isFinished) {
      start.textContent = "Start";
    }
    const time = document.getElementById("time");
    const seconds = (res.timeOption * 60 - res.timer) % 60;
    const minutes = (res.timeOption - Math.ceil(res.timer / 60)) % 60;
    const hours = Math.floor(res.timeOption / 60 - res.timer / 3600);
    time.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  });
}
updateTime();
setInterval(updateTime, 1000);

start.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set({ isRunning: !res.isRunning }, () => {
      start.textContent = !res.isRunning ? "Pause" : "Start";
    });
  });
});
const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  chrome.storage.local.set({ timer: 0, isRunning: false }, () => {
    start.textContent = "Start";
  });
});
addbtn.addEventListener("click", () => addTask());

chrome.storage.sync.get(["taskArray"], (res) => {
  taskArray = res.taskArray ? res.taskArray : [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({ taskArray });
  console.log("Tasks saved");
}

function renderTask(taskLength) {
  const taskRow = document.createElement("div");
  taskRow.style.display = "flex";
  taskRow.style.alignItems = "center";
  taskRow.style.marginBottom = "10px";

  const text = document.createElement("input");
  text.id = "task-input";
  text.type = "text";
  text.placeholder = "Enter task";
  text.value = taskArray[taskLength];
  text.addEventListener("change", () => {
    taskArray[taskLength] = text.value;
    saveTasks();
  });

  const deletebtn = document.createElement("input");
  deletebtn.id = "delete-btn";
  deletebtn.type = "button";
  deletebtn.value = "Delete Task";
  deletebtn.addEventListener("click", () => {
    deleteTask(taskLength);
  });
  deletebtn.style.marginLeft = "10px";
  deletebtn.style.padding = "5px 10px";
  deletebtn.style.borderRadius = "5px";
  deletebtn.style.backgroundColor = "#ff0000";
  deletebtn.style.color = "#fff";
  deletebtn.style.border = "none";

  taskRow.appendChild(text);
  taskRow.appendChild(deletebtn);

  const taskList = document.getElementById("tasks");
  taskList.appendChild(taskRow);
}

function addTask() {
  const taskLength = taskArray.length;
  taskArray.push("");
  renderTask(taskLength);
}
function deleteTask(taskLength) {
  taskArray.splice(taskLength, 1);
  saveTasks();
  renderTasks();
}
function renderTasks() {
  const tasks = document.getElementById("tasks");
  tasks.textContent = "";
  taskArray.forEach((task, index) => {
    renderTask(index);
  });
}
