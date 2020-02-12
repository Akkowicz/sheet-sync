function onOpen(e) {
  SpreadsheetApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('Sheet Sync');
  SpreadsheetApp.getUi().showSidebar(ui);
}

function syncSheets(sUrl,sK, sV, tK, tV) {
  var tK_n = arrPos(tK);
  var tV_n = arrPos(tV);
  var sK_n = arrPos(sK);
  var sV_n = arrPos(sV);
  var tSheet = SpreadsheetApp.getActiveSheet();
  var sSheet = SpreadsheetApp.openByUrl(sUrl).getSheets()[0];
  // Obtain the number of rows and columns dynamically.
  // Starting from A1, because it's easier to align our array this way.
  // Adding 1 to the column range, because rows and columns are 1-based.
  var tValues = tSheet.getSheetValues(1, 1, tSheet.getMaxRows(), Math.max(tK_n, tV_n) + 1);
  var sValues = sSheet.getSheetValues(1, 1, sSheet.getMaxRows(), Math.max(sK_n, sV_n) + 1);
  
  var sDict = {};
  
  // Convert array to dictionary
  for (var row = 0; row < sValues.length; row++) {
    sDict[sValues[row][sK_n]] = sValues[row][sV_n];
  }
  
  for (var row = 0; row < tValues.length; row++) {
    if (tValues[row][tK_n] in sDict) {
      if (tValues[row][tK_n] == '' || sDict[tValues[row][tK_n]] == '') {
        continue;
      }
      var cell = tSheet.getRange(tV + (row + 1));
      cell.setValue(sDict[tValues[row][tK_n]]);
    }
  }

}

// Converts 'A' to 0
function arrPos(alfa) {
  return alfa.charCodeAt(0) - 65;
}