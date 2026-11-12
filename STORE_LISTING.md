# Chrome Web Store listing

**Language:** English
**Category:** Productivity > Tools

## Summary (max 132 chars)

Checks a LinkedIn job search every few hours and notifies you when a new job shows up.

## Description

I built JobPing while I was looking for a job myself. I got tired of refreshing the same LinkedIn search all day, so this does it for me and sends a notification when something new is posted.

How it works
1. Search for jobs on LinkedIn and set your filters (role, location, remote, etc.)
2. Copy the URL and paste it into JobPing
3. Pick how often to check: every 1, 3, 6, 12 or 24 hours

That's it. When a new job shows up at the top of your search, you get a Chrome notification with the title, company and a button to open it. The last few jobs found stay in the popup.

Good to know
- Chrome needs to be open for checks to happen.
- Each check opens your search in a background tab, reads the first result and closes the tab.
- You can turn it off anytime with the switch in the popup.

Privacy
Everything stays in your browser. No accounts, no servers, no tracking. The only site JobPing talks to is LinkedIn, using your own session.

Important
JobPing is an independent project and is not affiliated with or endorsed by LinkedIn. LinkedIn's User Agreement does not allow extensions that scrape the site, so using JobPing may go against their terms and could lead to restrictions on your account. Use it at your own risk. If you want something fully official, LinkedIn has built-in job alerts.

If LinkedIn asks for JobPing to be removed or changed, I'll do it. Requests and bug reports: https://github.com/ryangustav/jobping/issues

Open source (GPLv3): https://github.com/ryangustav/jobping

## Privacy tab

**Single purpose:** Notify the user about new jobs in a LinkedIn search they configured.

**Permissions:**
- `tabs`, `scripting`: open the saved search in a background tab and read the first result.
- `alarms`: schedule the periodic checks.
- `notifications`: tell the user when a new job is found.
- `storage`: save the search URL, interval and recent jobs locally.
- `https://www.linkedin.com/*`: access the job search page.

**Data usage:** No user data is collected or sent anywhere.

**Privacy policy URL:** https://github.com/ryangustav/jobping/blob/main/PRIVACY_POLICY.md
