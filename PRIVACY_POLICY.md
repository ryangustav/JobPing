# Privacy Policy for JobPing

**Effective Date:** 2025

This Privacy Policy describes how JobPing ("we", "us", or "our") collects, uses, and protects your information when you use our Chrome Extension.

## 1. Information Collection and Use
JobPing is designed with your privacy in mind. We **do not** collect, store, or transmit any personal information or browsing data to external servers.

All operations, including checking for new job postings, are performed locally on your device.

## 2. Local Storage
The extension uses Chrome's local storage API (`chrome.storage.local`) to save your preferences and operational data. This data never leaves your browser:
*   **Settings:** Your chosen LinkedIn job search URL and check interval.
*   **Operational State:** Whether the monitoring is currently paused or active.
*   **Job History:** A temporary list of the last 5 detected job postings to avoid duplicate notifications.
*   **Next Check Time:** The timestamp for the next scheduled background check.

## 3. Permissions
To function properly, JobPing requires the following permissions:
*   **`storage`**: Used exclusively to save your settings and job history locally on your device.
*   **`notifications`**: Used to alert you when a new job matching your criteria is found.
*   **`tabs`**: Used to open job links from notifications and to silently check your configured LinkedIn URL in the background.
*   **`scripting`**: Used to extract job details (title, company, time, link) from the background tab when checking for new postings.
*   **`alarms`**: Used to schedule and run the background checks at the interval you selected.
*   **Host Permission (`https://www.linkedin.com/*`)**: Required to read the job search results page and extract the relevant job data. We do not access or read data from any other websites.

## 4. Third-Party Services
We do not use any third-party analytics, tracking, or data collection services.

## 5. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Effective Date" at the top of this policy. You are advised to review this Privacy Policy periodically for any changes.

## 6. Contact Us
If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact the developer:

**Author:** Ryan Gustavo
**Repository:** [GitHub](https://github.com/ryangustav)
