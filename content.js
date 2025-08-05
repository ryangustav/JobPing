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
  try {
    const timeEl = document.querySelector(".job-card-container__footer-item--highlighted");
    const companyEl = document.querySelector(".artdeco-entity-lockup__subtitle.ember-view");
    const linkEl = document.querySelector("a.job-card-container__link.job-card-list__title--link");

    const time = timeEl?.innerText.trim() || null;
    const company = companyEl?.innerText.trim() || null;
    const title = linkEl?.innerText.trim() || null;
    const relativeLink = linkEl?.getAttribute("href") || null;
    const fullLink = relativeLink ? `https://www.linkedin.com${relativeLink}` : null;

    if (time && company && fullLink) {
      chrome.runtime.sendMessage({
        type: "jobDetected",
        time,
        title,
        company,
        link: fullLink
      });

    } else {
      chrome.runtime.sendMessage({
        type: "jobDetected",
        error: "Missing job data (time, company, or link)."
      });
    }
  } catch (err) {
    chrome.runtime.sendMessage({
      type: "jobDetected",
      error: err.message
    });
  }
})();
