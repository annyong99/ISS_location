const json = (content) => ContentService.createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);

function doGet(request) {
  let date = new Date(request.parameters.datetime);
  date = date.getTime();
  if (date > Date.now()) {
    return;
  }
  return ContentService.createTextOutput(getPosition(date)).setMimeType(ContentService.MimeType.JSON); 
}

function getPosition(date) {
  date = Math.floor(date / 1000) - (60 * 60); 
  let timestamps = [];
  const minutesOffset = 600; // representing 10 minutes
  for (let i = 0; i < 13; i += 1) {
    if (date > (Date.now() / 1000)) break;
    timestamps.push(date);
    date += minutesOffset;
  }
  const response = UrlFetchApp.fetch(`https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${timestamps.join()}`);
  return response;
}
