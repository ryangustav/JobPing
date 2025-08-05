/**
 * This file is part of JobPing.
 * Copyright (C) 2025 Ryan Gustavo
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/gpl-3.0.html>.
 */


chrome.runtime.onInstalled.addListener(() => {
  setupAlarm();
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "configUpdated") {
    setupAlarm();
  }

  if (msg.type === "jobDetected" && !msg.error) {
    const currentJob = {
      company: msg.company,
      title: msg.title,
      time: msg.time,
      link: msg.link
    };

    chrome.storage.local.get(["last_job"], (result) => {
      const lastJob = result.last_job;

      if (lastJob?.company === currentJob.company && lastJob?.title === currentJob.title)
        return;

      chrome.notifications.create("newJob", {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "New job detected!",
        message: `${msg.company} posted: ${msg.time}`,
        priority: 2,
        buttons: [{ title: "Open job" }]
      });

      chrome.storage.local.set({ last_job: currentJob }, () => {
        console.log("Saved last_job:", currentJob);
      });
    });

    if (sender.tab?.id) chrome.tabs.remove(sender.tab.id);
  }
});

chrome.alarms.onAlarm.addListener(() => {
  checkForNewJob();
});

chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
  if (notifId === "newJob" && btnIdx === 0) {
    chrome.storage.local.get(["last_job"], (result) => {
      if (result.last_job?.link) {
        chrome.tabs.create({ url: result.last_job.link });
      }
    });
  }
});

function setupAlarm() {
  chrome.storage.local.get(["jobping_interval"], (result) => {
    const interval = result.jobping_interval || 60;
    chrome.alarms.clearAll(() => {
      chrome.alarms.create({ delayInMinutes: 0.1, periodInMinutes: interval });
    });
  });
}

function checkForNewJob() {
  chrome.storage.local.get(["jobping_url"], (result) => {
    const url = result.jobping_url;
    if (!url) return;

    chrome.tabs.create({ url, active: false }, (tab) => {
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
      }, 5000);
    });
  });
}
