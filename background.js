chrome.alarms.create("Pomodoro Timer", {
  periodInMinutes: 1 / 60, // Assuming you want to trigger the alarm every 1/60th of a minute (i.e., every second).
});
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "Pomodoro Timer") {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
      if (res.isRunning) {
        let timer = res.timer + 1;
        let isRunning = true;
        let isFinished = false;
        if (timer === res.timeOption * 60) {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "clock.png",
            title: "Timer Notification",
            message: `${res.timeOption} minutes have passed!`,
          });
          timer = 0;
          isRunning = false;
          isFinished = true;
        }
        console.log(timer);
        chrome.storage.local.set({ timer, isRunning, isFinished });
      }
    });
  }
});

chrome.storage.local.get(["timer", "isRunning", "isFinished"], (res) => {
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    isRunning: "isRunning" in res ? res.isRunning : false,
    isFinished: "isFinished" in res ? res.isFinished : false,
  });
});
