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


(function () {
  // injected twice sometimes (load + fallback)
  if (window.__jobpingRunning) return;
  window.__jobpingRunning = true;

  const start = Date.now();
  const getText = (el) => el?.textContent.replace(/\s+/g, " ").trim() || null;

  // new linkedin layout, classes are random so use componentkey
  function readNew() {
    const card = document.querySelector('div[role="button"][componentkey^="job-card-component-ref-"]');
    if (!card) return null;

    const id = card.getAttribute("componentkey").replace("job-card-component-ref-", "");
    const ps = [...card.querySelectorAll("p")];

    const title = getText(ps[0]?.querySelector('span[aria-hidden="true"]')) || getText(ps[0]);
    const company = getText(ps[1]);
    const timeP = ps.slice(1).find((p) => p.querySelector(':scope > span[aria-hidden="true"]'));
    const time = getText(timeP?.querySelector(':scope > span[aria-hidden="true"]'));

    return {
      title,
      company,
      time,
      link: /^\d+$/.test(id) ? `https://www.linkedin.com/jobs/view/${id}/` : null
    };
  }

  function readOld() {
    const linkEl = document.querySelector("a.job-card-container__link.job-card-list__title--link");
    if (!linkEl) return null;

    const href = linkEl.getAttribute("href");
    return {
      title: getText(linkEl),
      company: getText(document.querySelector(".artdeco-entity-lockup__subtitle")),
      time: getText(document.querySelector(".job-card-container__footer-item--highlighted")),
      link: href ? new URL(href, "https://www.linkedin.com").toString() : null
    };
  }

  function tryRead() {
    try {
      const job = readNew() || readOld();

      if (job?.company && job?.link) {
        chrome.runtime.sendMessage({ type: "jobDetected", ...job, time: job.time || "" });
        return;
      }

      // cards load after the page, keep trying for 15s
      if (Date.now() - start < 15000) {
        setTimeout(tryRead, 500);
        return;
      }

      chrome.runtime.sendMessage({ type: "jobDetected", error: "No job card found." });
    } catch (err) {
      chrome.runtime.sendMessage({ type: "jobDetected", error: err.message });
    }
  }

  tryRead();
})();
