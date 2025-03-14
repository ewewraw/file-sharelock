# File ShareLock: Unshare Google Drive files and create report in Spreadsheet

File ShareLock is a Google Apps script that automates the process of finding shared files in your Google Drive (owned by you) and unsharing them. It then generates a report in a Google Sheet detailing the files that were unshared.

## Features

* **Custom menu:** Adds a "Custom Menu" to your Google Sheet with an option to "Unshare files and create report".
* **File discovery:** Identifies files in your Google Drive owned by you that have been shared (i.e., have more than one permission).
* **Unsharing:** Removes all sharing permissions from the identified files, leaving only the owner's permission.
* **Report generation:** Creates a report in the active Google Sheet with the file name, URL, and unsharing status (success or failure).
* **Header creation:** Automatically adds headers to the spreadsheet if they don't exist.

## Setup

1.  Copy the script to Apps script
2.  Create test deplayment connected to your spreadsheets file
3.  Run the "Unshare files and create report" from custom menu
4.  Let it goooo let it goo-ooo (it will take time)
5.  The script will process your Google Drive files and create a report in the sheet, showing the file names, URLs, and unsharing status.

## Code Explanation

* **`onOpen()`:** Creates the custom menu when the spreadsheet is opened.
* **`unshareFiles()`:** Orchestrates the process of adding headers and unsharing files.
* **`addHeaders()`:** Adds the headers "Shared file name", "URL", and "Unshared" to the sheet.
* **`FIND_AND_UNSHARE_FILES()`:**
    * Searches for files owned by you in Google Drive.
    * Checks if each file has more than one permission (shared).
    * Calls `UNSHARE_FILE()` to remove sharing permissions.
    * Appends the file details and unsharing status to the sheet.
* **`UNSHARE_FILE()`:**
    * Removes all sharing permissions from a file, except the owner's permission.
    * Returns `true` if successful, `false` otherwise.

## Considerations and TODOs

* **Optimization:** The file search and permission removal could be optimized for performance, especially with a large number of files.
* **Error Handling:** Enhanced error handling can be implemented to handle various scenarios.
* **Sensitive Information Check:** A TODO item is included to add a check for sensitive information in file names or content before unsharing. This could be implemented to prevent accidental unsharing of critical files.
* **Batch Requests:** The script currently uses individual permission removal requests. Using batch requests could improve performance, but apperantly fetching shared files only is currently not supported by the API.
* **Multiple Owners:** The script assumes a single owner. 
* **Filtering by sharing:** The Script currently retrives all files owned by the user, then filters afterwards. There is no filter in the DriveApp.searchFiles to filter by shared status.

## Headers

The script uses the following headers in the Google Sheet:

* `Shared file name`
* `URL`
* `Unshared` (status of unsharing: "success" or "failed")

## Dependencies

* Google Sheets
* Google Drive
* Drive API (enabled in the Script Editor)
