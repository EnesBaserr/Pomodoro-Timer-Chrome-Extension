const timeOption = document.getElementById("time-option");
timeOption.addEventListener("change", (event) => {
  const val = event.target.value;
  if (val < 10) {
    timeOption.value = 10;
    timeOption.classList.add("shake");
    console.log(timeOption.value);
  } else {
    timeOption.classList.remove("shake");
  }
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    timeOption: timeOption.value,
    isRunning: false,
  });
});
chrome.storage.local.get(["timeOption"], (result) => {
  timeOption.value = result.timeOption || 10;
});
