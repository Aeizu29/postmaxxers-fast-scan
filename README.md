# Fast Scan Control — separate repository

This is a **separate copy**, based on the supplied 1.18.4 Chrome extension. It does not modify or replace your installed original extension or its GitHub repository.

## Install and use

1. Extract this ZIP and open `chrome://extensions`.
2. Enable Developer mode → Load unpacked → select the **extension/** folder. Disable the old publisher while testing to prevent duplicate scheduled scans and GitHub writes (leave it installed).
3. Open the new extension → **Open Fast Scan Setup**. Use **Scan now (no tab)** for your first test.
4. Create a new GitHub repository and upload **index.html** + **web-control.js** at repository root. Enable GitHub Pages (Deploy from branch, root).
5. Visit the Pages URL, copy your Chrome extension ID from Fast Scan Setup, paste it into the control page.
6. In the extension's Fast Scan Setup approve only your own Pages **origin**, e.g. `https://yourname.github.io` (no repository path).
7. Click Test Connection, then Scan Now.
8. Configure GitHub publishing in the **new** extension's Settings (tokens are saved locally in that extension, not in the public repository). Do not upload settings with real tokens.

## Important limitations

- No tab is opened by the **Fast Scan** command. The existing automatic scheduled and older Refresh Now features are preserved and can still open inactive tabs.
- The browser sends eligible session cookies with `credentials: include`, but cookie policies and Cloudflare challenges can prevent a headless fetch from accessing the authenticated HTML. This tool does **not** bypass challenges or authentication.
- A successful scan is not necessarily a successful GitHub upload; check the GitHub sync status in the extension.
- The Pages button runs only on Chrome where this new extension is installed. It is not an iPhone remote control.
- Any GitHub Pages page under **the approved origin** can message the extension; approve only an origin you control.
- This is an untested integration against live forum responses; use the extension setup test and inspect errors if the site's response differs.
