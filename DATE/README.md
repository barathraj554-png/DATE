# Outing Invitation -> Google Sheet

When she taps **Confirm Outing**, the Date, Time and Vibe she picked are saved as a new row in your Google Sheet.

## Files
- `Code.gs` - the Google Apps Script (paste into your Sheet)
- `index.html` - your page (same as sam_2.html, with the sheet-sending code fixed)
- Keep `bartah.jpeg` and `song.mp3` in the same folder as `index.html`

## Setup (about 3 minutes)

1. Go to https://sheets.google.com and create a **blank spreadsheet** (name it e.g. "Outing Responses").
2. In the sheet, click **Extensions -> Apps Script**.
3. Delete everything in the editor, then paste the full contents of `Code.gs`. Click **Save** (disk icon).
4. *(Optional test)* Select `testAddRow` in the function dropdown, click **Run**, and allow permissions when asked
   (Advanced -> Go to project (unsafe) -> Allow). A "Responses" tab with a TEST row appears. Delete that row afterwards.
5. Click **Deploy -> New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - **Execute as:** Me
   - **Who has access:** **Anyone**  (required, otherwise her phone cannot send data)
   - Click **Deploy** and allow permissions if asked.
6. Copy the **Web app URL** (it ends with `/exec`).
7. Open `index.html` in a text editor, find this line near the bottom:

   ```js
   const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
   and replace the text inside the quotes with your Web app URL. Save.
8. Host/share the page as you normally do (GitHub Pages, Netlify, etc.).

## What you will see in the sheet

| Received At (IST) | Date She Picked | Time She Picked | Vibe She Picked |
|---|---|---|---|
| 30 Sep 2026, 06:10:22 PM | 5 October 2026 | 18:30 | 🍽️ Dinner |

## Test it
Open your Web app URL in a browser: you should see "Outing sheet logger is running."
Then go through your page and press **Confirm Outing** - a new row appears within a few seconds.

## Important notes
- **If you edit `Code.gs` later**, you must do **Deploy -> Manage deployments -> pencil icon -> Version: New version -> Deploy**. The URL stays the same.
- The old URL that was hard-coded in your sam_2.html belongs to an older deployment. Use the **new** URL from step 6.
- The page will not show any error to her if sending fails (it sends silently). If nothing arrives, re-check: access is set to **Anyone**, and the URL is pasted correctly.
- The data is sent when she presses **Confirm Outing** (not when she only picks options), so you get her final choice.

## What I fixed in index.html
The original check `SCRIPT_URL === "https://script.google.com/..."` would have made the page skip sending as soon as you pasted a real URL. It now only skips while the placeholder text is still there. The request also uses `text/plain`, which is more reliable with Apps Script.
