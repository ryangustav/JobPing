# JobPing

**JobPing** is a Google Chrome extension that monitors new job postings on LinkedIn and sends automatic notifications to the user.

---

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Usage](#usage)  
- [Technologies](#technologies)  
- [Contributing](#contributing)  
- [License](#license)  
- [Author](#author)

---

## Overview

JobPing periodically checks a user-configured LinkedIn job search URL. When a new job posting is detected, it sends a Chrome notification with job details and a quick link to open it.

---

## Disclaimer

JobPing is not affiliated with LinkedIn. It opens your job search in the background and reads the first result, using your own session, at most once per hour.

LinkedIn's [User Agreement](https://www.linkedin.com/legal/user-agreement) (section 8.2) doesn't allow browser extensions that scrape the site, so using JobPing may go against their terms. Use it at your own risk. More in the [Terms of Use](./TERMS_OF_USE.md) ([PT-BR](./TERMS_OF_USE-pt.md)). If you want something 100% official, LinkedIn has its own Job Alerts.

If LinkedIn wants JobPing taken down or changed, I'll do it, just open an [issue](https://github.com/ryangustav/jobping/issues).

---

## Features

- Configure LinkedIn job search URL.  
- Set check interval (1 to 24 hours).  
- Receive Chrome notifications for new job postings.  
- Quick access to the latest notified job.  
- Local storage to avoid duplicate notifications.
- Warning: The extension will only work with the browser open!

---

## Installation

1. Clone or download this repository:  
   ```bash
   git clone https://github.com/ryangustav/jobping.git
   ```

2. Open `chrome://extensions/` in Google Chrome.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder.

---

## Configuration

In the extension popup:

* Enter a valid LinkedIn job search URL (e.g., `https://www.linkedin.com/jobs/...`).
* Select the check interval in minutes.

---

## Usage

* The extension runs in the background and performs automatic checks based on the configured interval.
* When a new job is found, a notification with company and time information is shown.
* Use the notification button to open the job posting on LinkedIn.

---

## Technologies

* Chrome Extension Manifest V3.
* JavaScript (background scripts, content scripts, popup).
* Chrome Notifications API.
* Local storage (`chrome.storage.local`).
* Chrome Alarms API for periodic checks.

---

## Contributing

Contributions are welcome:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes with clear messages.
4. Submit a Pull Request describing your changes.

---

## License

See also the [Terms of Use](./TERMS_OF_USE.md) and [Privacy Policy](./PRIVACY_POLICY.md).

This project is licensed under the **GNU General Public License version 3 (GPLv3)**.
See the [LICENSE](./LICENSE) file or visit:
[https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)

---

## Author

Ryan Gustavo — 2025
[GitHub](https://github.com/ryangustav)