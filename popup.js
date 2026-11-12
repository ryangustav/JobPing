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
  const $ = (id) => document.getElementById(id);

  const urlInput = $("linkedinUrl");
  const intervalSel = $("interval");
  const saveStatus = $("saveStatus");
  const pauseToggle = $("pauseToggle");

  let saved = {};
  let statusTimer = null;

  $("version").textContent = chrome.runtime.getManifest().version;

  chrome.storage.local.get(
    ["jobping_url", "jobping_interval", "jobping_paused", "last_job", "jobping_history", "jobping_alarm_time", "jobping_terms_accepted"],
    (result) => {
      saved = result;

      if (!result.jobping_terms_accepted) {
        $("termsGate").hidden = false;
        return;
      }

      showMain();
    }
  );

  // first run
  $("termsCheckbox").addEventListener("change", (e) => {
    $("termsAcceptBtn").disabled = !e.target.checked;
  });

  $("termsAcceptBtn").addEventListener("click", () => {
    saved.jobping_terms_accepted = Date.now();
    chrome.storage.local.set({ jobping_terms_accepted: saved.jobping_terms_accepted }, () => {
      $("termsGate").hidden = true;
      showMain();
      chrome.runtime.sendMessage({ type: "configUpdated" });
    });
  });

  function showMain() {
    $("mainContent").hidden = false;
    $("switchWrap").hidden = false;

    pauseToggle.checked = !saved.jobping_paused;
    updateStatusLabel();

    // older versions only saved last_job
    renderHistory(saved.jobping_history || (saved.last_job ? [saved.last_job] : []));

    if (saved.jobping_url) showWatching();
    else showForm();
  }

  // watching card
  function showWatching() {
    const { title, sub } = describeSearch(saved.jobping_url);
    const interval = saved.jobping_interval || 60;

    $("watchTitle").textContent = title;
    $("watchSub").textContent = [sub, `every ${formatInterval(interval)}`].filter(Boolean).join(" · ");
    updateNextCheck();

    $("watchCard").hidden = false;
    $("formCard").hidden = true;
  }

  function showForm() {
    urlInput.value = saved.jobping_url || "";
    intervalSel.value = saved.jobping_interval || 60;
    urlInput.classList.remove("invalid");

    $("formTitle").textContent = saved.jobping_url ? "Edit search" : "Set up your search";
    $("cancelBtn").hidden = !saved.jobping_url;
    $("watchCard").hidden = true;
    $("formCard").hidden = false;
    urlInput.focus();
  }

  $("editBtn").addEventListener("click", showForm);
  $("cancelBtn").addEventListener("click", showWatching);

  // pull "keywords" and "location" out of the search URL so the user sees what is being watched
  function describeSearch(url) {
    try {
      const params = new URL(url).searchParams;
      const keywords = params.get("keywords");
      const location = params.get("location");
      const remote = params.get("f_WT") === "2" ? "Remote" : null;
      return {
        title: keywords || "Your LinkedIn search",
        sub: [location, remote].filter(Boolean).join(", ")
      };
    } catch {
      return { title: "Your LinkedIn search", sub: "" };
    }
  }

  function formatInterval(minutes) {
    const h = minutes / 60;
    return h === 1 ? "hour" : `${h} hours`;
  }

  function updateNextCheck() {
    const el = $("nextCheck");
    if (saved.jobping_paused) {
      el.textContent = "Paused";
      return;
    }
    if (!saved.jobping_alarm_time) {
      el.textContent = "";
      return;
    }
    const time = new Date(saved.jobping_alarm_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    el.textContent = `Next check at ${time}`;
  }

  // form
  const isValidUrl = (url) => url.startsWith("https://www.linkedin.com/jobs");

  urlInput.addEventListener("input", () => {
    const url = urlInput.value.trim();
    urlInput.classList.toggle("invalid", url !== "" && !isValidUrl(url));
  });

  $("saveBtn").addEventListener("click", () => {
    const raw = urlInput.value.trim();

    if (!isValidUrl(raw)) {
      urlInput.classList.add("invalid");
      showStatus("That doesn't look like a LinkedIn jobs URL.", true);
      return;
    }

    const interval = parseInt(intervalSel.value);

    // only jobs posted inside the interval, newest first
    const urlObj = new URL(raw);
    urlObj.searchParams.set("f_TPR", `r${interval * 60}`);
    urlObj.searchParams.set("sortBy", "DD");

    const data = {
      jobping_url: urlObj.toString(),
      jobping_interval: interval,
      jobping_alarm_time: Date.now() + interval * 60 * 1000
    };

    chrome.storage.local.set(data, () => {
      Object.assign(saved, data);
      chrome.runtime.sendMessage({ type: "configUpdated" });
      showWatching();
      showStatus("Saved. You'll get a notification when a new job shows up.");
    });
  });

  $("checkNowBtn").addEventListener("click", (e) => {
    if (saved.jobping_paused) {
      showStatus("JobPing is off, turn it on first.", true);
      return;
    }
    e.target.disabled = true;
    e.target.textContent = "Checking…";
    chrome.runtime.sendMessage({ type: "checkNow" });
    setTimeout(() => {
      e.target.disabled = false;
      e.target.textContent = "Check now";
    }, 4000);
  });

  // on/off switch
  pauseToggle.addEventListener("change", () => {
    const paused = !pauseToggle.checked;
    chrome.storage.local.set({ jobping_paused: paused }, () => {
      saved.jobping_paused = paused;
      chrome.runtime.sendMessage({ type: "toggleMonitoring", paused });
      updateStatusLabel();
      // setupAlarm writes a new alarm time when resuming
      setTimeout(() => {
        chrome.storage.local.get(["jobping_alarm_time"], (r) => {
          saved.jobping_alarm_time = r.jobping_alarm_time;
          updateNextCheck();
        });
      }, 300);
    });
  });

  function updateStatusLabel() {
    $("statusLabel").textContent = saved.jobping_paused ? "Off" : "On";
    updateNextCheck();
  }

  function showStatus(msg, isError) {
    saveStatus.textContent = msg;
    saveStatus.className = isError ? "error" : "";
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => (saveStatus.textContent = ""), 4000);
  }

  // jobs list
  function renderHistory(history) {
    if (!history.length) return;

    $("historyList").innerHTML = history.map((job, i) => `
      <li>
        <a href="${esc(job.link)}" target="_blank" rel="noopener">
          <span class="avatar">${esc((job.company || "?").trim().charAt(0).toUpperCase())}</span>
          <span class="job-info">
            <div class="job-title">${esc(job.title || "Untitled")}</div>
            <div class="job-meta">${esc(job.company || "")}${job.time ? " · " + esc(job.time) : ""}</div>
          </span>
          ${i === 0 ? '<span class="new-tag">Latest</span>' : ""}
        </a>
      </li>
    `).join("");
  }

  function esc(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
});
