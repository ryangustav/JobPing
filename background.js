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


const MAX_HISTORY = 5;

chrome.runtime.onInstalled.addListener(() => {
  closeCheckTab();
  setupAlarm();
});

chrome.runtime.onStartup.addListener(() => {
  closeCheckTab();
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "configUpdated") {
    setupAlarm();
  }

  if (msg.type === "checkNow") {
    checkForNewJob();
  }

  if (msg.type === "toggleMonitoring") {
    if (msg.paused) chrome.alarms.clearAll();
    else setupAlarm();
  }

  if (msg.type !== "jobDetected") return;

  // close the tab even if it failed
  if (sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id).catch(() => {});
    chrome.storage.local.remove("jobping_check_tab");
    chrome.alarms.clear("jobping-cleanup");
  }

  if (msg.error) return;

  const currentJob = {
    company: msg.company,
    title: msg.title,
    time: msg.time,
    link: msg.link
  };

  chrome.storage.local.get(["last_job", "jobping_history", "jobping_interval"], (result) => {
    const lastJob = result.last_job;
    const history = result.jobping_history || [];

    if (
      lastJob?.company === currentJob.company &&
      lastJob?.title === currentJob.title &&
      lastJob?.link === currentJob.link
    ) return;

    chrome.notifications.create("newJob", {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "New job detected!",
      message: `${currentJob.title || "New job"} @ ${currentJob.company} - ${currentJob.time}`,
      priority: 2,
      buttons: [{ title: "Open job" }]
    });

    const interval = result.jobping_interval || 60;

    chrome.storage.local.set({
      last_job: currentJob,
      jobping_history: [currentJob, ...history].slice(0, MAX_HISTORY),
      jobping_alarm_time: Date.now() + interval * 60 * 1000
    });
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "jobping-cleanup") {
    closeCheckTab();
    return;
  }

  chrome.storage.local.get(["jobping_paused"], (result) => {
    if (!result.jobping_paused) checkForNewJob();
  });
});

chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
  if (notifId !== "newJob" || btnIdx !== 0) return;

  chrome.storage.local.get(["last_job"], (result) => {
    if (result.last_job?.link) chrome.tabs.create({ url: result.last_job.link });
  });
});

function setupAlarm() {
  chrome.storage.local.get(["jobping_interval", "jobping_paused"], (result) => {
    if (result.jobping_paused) return;

    const interval = result.jobping_interval || 60;

    chrome.alarms.clearAll(() => {
      chrome.alarms.create({ delayInMinutes: 0.1, periodInMinutes: interval });
      chrome.storage.local.set({ jobping_alarm_time: Date.now() + interval * 60 * 1000 });
    });
  });
}

function checkForNewJob() {
  chrome.storage.local.get(["jobping_url", "jobping_terms_accepted"], (result) => {
    const url = result.jobping_url;
    if (!url || !result.jobping_terms_accepted) return;

    closeCheckTab(() => {
      chrome.tabs.create({ url, active: false }, (tab) => {
        // save the id, the service worker can die and lose the timeout below
        chrome.storage.local.set({ jobping_check_tab: tab.id });
        chrome.alarms.create("jobping-cleanup", { delayInMinutes: 1 });

        const inject = () => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
          }).catch(() => {});
        };

        function onUpdated(tabId, info) {
          if (tabId === tab.id && info.status === "complete") {
            chrome.tabs.onUpdated.removeListener(onUpdated);
            inject();
          }
        }
        chrome.tabs.onUpdated.addListener(onUpdated);

        setTimeout(() => {
          chrome.tabs.onUpdated.removeListener(onUpdated);
          inject();
        }, 10000);

        setTimeout(() => closeCheckTab(), 25000);
      });
    });
  });
}

function closeCheckTab(done) {
  chrome.storage.local.get(["jobping_check_tab"], (result) => {
    const tabId = result.jobping_check_tab;
    if (tabId == null) {
      done?.();
      return;
    }

    chrome.tabs.remove(tabId).catch(() => {});
    chrome.alarms.clear("jobping-cleanup");
    chrome.storage.local.remove("jobping_check_tab", () => done?.());
  });
}
