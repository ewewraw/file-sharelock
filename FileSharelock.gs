const HEADER_FILE_NAME = "Shared file name" 
const HEADER_URL = "URL"
const HEADER_STATUS = "Unshared"

/**
 * Runs when the spreadsheet is opened.  Adds a custom menu
 * to the active spreadsheet and sets up headers.
 */
function onOpen() {
  // TODO: consider adding it to drive instead 
  SpreadsheetApp.getUi()
      .createMenu('Custom Menu')
      .addItem('Unshare files and create report', 'unshareFiles')
      .addToUi();
}

/**
 * Runs the FIND_AND_UNSHARE_FILES and UNSHARE_FILE functions.
 */
function unshareFiles() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    Logger.log("Error fetching Active Spreadsheet. Well, if it fails in the very first check of your code, I have bad news for you.");
    return;
  }

  const sheet = ss.getSheets()[0]

  if (!sheet) {
    Logger.log("Error parsing sheet. Do it yourself if you're such a smartass, huh?");
    return;
  }

  addHeaders(sheet);
  FIND_AND_UNSHARE_FILES(sheet);
}

/**
 * Adds the headers to the sheet if they don't already exist.
 */
function addHeaders(sheet) {
  
  let headers = sheet.getRange(1, 1, 1, 3).getValues()[0];

  if (headers[0] !== HEADER_FILE_NAME || headers[1] !== HEADER_URL || headers[2] !== HEADER_STATUS) {
    sheet.getRange(1, 1).setValue(HEADER_FILE_NAME);
    sheet.getRange(1, 2).setValue(HEADER_URL);
    sheet.getRange(1, 3).setValue(HEADER_STATUS);
  }
}

/**
 * Finds all files in your Google Drive that have more than one permission
 * AND owned by you. Uses the Drive API for permissions.
 *
 * @return {array} A list of shared files (owned by you) with their names and URLs.
 * @customfunction
 */
function FIND_AND_UNSHARE_FILES() {

  // This line could be optimized: 
  //
  // Consideration_1: there can be multiple owners (or mb not, the documentation is confusing. 
  // Check it yourself and decide: https://developers.google.com/drive/api/guides/ref-search-terms )
  //
  // Consideration_2: It's not optimal to fetch all files owned by me without filtering them by multiple permissions. 
  // However, there's apparently no query term for filtering by the number of permissions (or the fact of sharing)
  let files = DriveApp.searchFiles('trashed = false and "me" in owners');

  while (files.hasNext()) {
    let file = files.next();
    let fileId = file.getId();
    let fileName = file.getName();
    let fileUrl = file.getUrl();

    // TODO: we can later add an unshare condition, for example,
    // check for potentially sensitive information in file name or content (passport, bank statement etc)

    try {
      // TODO: check if possible to extract from the file (e.g. getSharingPermission())
      let permissions = Drive.Permissions.list(fileId);
      let permissionsFromFile = file.permissions;
      Logger.log("TESTO");

      Logger.log("permission 1");
      Logger.log(permissions);

      Logger.log("permission 2");
      Logger.log(permissionsFromFile);
      console.log(permissionsFromFile)


      // If there's more than one permission in the array -> we're sharing this file 
      // (the one obligatory permission is us - the owner. See https://developers.google.com/apps-script/reference/drive/permission)
      if (permissions.permissions && permissions.permissions.length > 1) {
      Logger.log("found!!!");
        let isSuccessfullyUnshared = UNSHARE_FILE(fileId, permissions);
        let unsharedStatus = isSuccessfullyUnshared ? "success" : "failed";
        sheet.appendRow(fileName, fileUrl, unsharedStatus);
      }
    } catch (error) {
      Logger.log("Error getting permissions for file " + file.getName() + ": " + error);
    }
  }
}

/**
 * Radically removes all the permissions but ownership to rock that privacy of yours!
 *
 * @param {string} fileId The ID of the file to unshare.
 * @return {boolean} True if successful, false if fails.
 */
function UNSHARE_FILE(fileId, permissions) {
  if (!fileId || !permissions) {
    return false;
  }

  try {
    // Consideration: this is not optimal because we're making multiple requests instead of e.g. a batch request, 
    // but we're limited by the API offering. Please create a pull request if you find a better way :)
      permissions.permissions.filter(permission => permission.role !== 'owner').forEach(permission => {
        Drive.Permissions.remove(fileId, permission.id);
        Logger.log("file unshared ", permission);
  });
      return true;
  } catch (error) {
    Logger.log("Error removing permissions for file " + fileId + ": " + error);
    return false;
  }
}
