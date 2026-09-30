/**
 * Outing Invitation -> Google Sheet logger
 * Saves the Date, Time and Vibe she picks as a new row in the "Responses" tab.
 */

const SHEET_NAME = "Responses";
const HEADERS = ["Received At (IST)", "Date She Picked", "Time She Picked", "Vibe She Picked"];

// Receives data from the web page
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    let data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) { data = {}; }
    }
    if (e && e.parameter) {
      data.date = data.date || e.parameter.date;
      data.time = data.time || e.parameter.time;
      data.vibe = data.vibe || e.parameter.vibe;
    }

    const sheet = getSheet_();
    const receivedAt = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a");
    // Leading apostrophe-free text so Sheets does not reformat date/time strings
    sheet.appendRow([receivedAt, String(data.date || ""), String(data.time || ""), String(data.vibe || "")]);

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// Opening the web app URL in a browser shows this (handy for testing)
function doGet() {
  return ContentService.createTextOutput("Outing sheet logger is running.");
}

// Run this once from the editor to test that rows get added
function testAddRow() {
  const sheet = getSheet_();
  sheet.appendRow(["TEST", "1 January 2026", "18:00", "☕ Coffee"]);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#fce4ec");
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, HEADERS.length, 190);
  }
  return sheet;
}
