# Browser Extension — Dev Guide

## Load unpacked in Chrome / Edge

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `browser-extension/` directory

The extension will appear in your toolbar. Pin it for easy access.

## Reload after changes

After editing any file, click the reload icon on the extension card in `chrome://extensions`.
Content scripts reload automatically on next page load.

## Test the /env-impact command

1. Open claude.ai, chatgpt.com, or gemini.google.com
2. Type `/env-impact` in the chat input and press Enter
3. The message is intercepted — a carbon report overlay appears instead of sending

## Storage inspection

Open DevTools on any tracked page, go to Application > Storage > Extension Storage,
and find the `ecoai` key to see raw token counts.

Or run in the background service worker console:
```js
chrome.storage.local.get('ecoai', console.log)
```

## Selector maintenance

Chat UIs update their DOM frequently. If tracking stops working, inspect the page and
update the selectors in `content.js` under the `SELECTORS` object for that site.
Open a PR with the fix.

## Firefox

The extension is MV3-compatible. For Firefox:
1. Open `about:debugging`
2. Click **This Firefox > Load Temporary Add-on**
3. Select `manifest.json`

Firefox uses `browser.*` APIs instead of `chrome.*`. The extension currently uses
`chrome.*` directly — adding `webextension-polyfill` is the path to full Firefox support.
