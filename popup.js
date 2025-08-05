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


document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("linkedinUrl");
  const intervalSelect = document.getElementById("interval");
  const saveBtn = document.getElementById("saveBtn");
  const statusMsg = document.getElementById("statusMsg");
  const openLastJobBtn = document.getElementById("openLastJobBtn");

  openLastJobBtn.addEventListener("click", () => {
    chrome.storage.local.get(["last_job"], (result) => {
      const link = result.last_job?.link;
      if (link) {
        chrome.tabs.create({ url: link });
      } else {
        alert("No saved job to open.");
      }
    });
  });

  chrome.storage.local.get(["jobping_url", "jobping_interval"], (result) => {
    if (result.jobping_url) urlInput.value = result.jobping_url;
    if (result.jobping_interval) intervalSelect.value = result.jobping_interval;
  });

  saveBtn.addEventListener("click", () => {
    let url = urlInput.value.trim();

    if (!url.startsWith("https://www.linkedin.com/jobs")) {
      statusMsg.textContent = "Invalid LinkedIn job search URL.";
      statusMsg.style.color = "red";
      return;
    }

    const interval = parseInt(intervalSelect.value);
    const seconds = interval * 60;
    const f_TPR_value = `r${seconds}`;

    const urlObj = new URL(url);
    urlObj.searchParams.set("f_TPR", f_TPR_value);
    url = urlObj.toString();
    urlInput.value = url;

    chrome.storage.local.set(
      {
        jobping_url: url,
        jobping_interval: interval
      },
      () => {
        statusMsg.textContent = `Settings saved! Interval: ${interval} minutes`;
        statusMsg.style.color = "green";

        chrome.runtime.sendMessage({ type: "configUpdated" });
      }
    );
  });
});
