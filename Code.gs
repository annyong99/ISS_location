function doGet() {
  const html = HtmlService.createTemplateFromFile('home');
  const htmlOutput = HtmlService.createHtmlOutput(html.evaluate());
  htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return htmlOutput;
}

function include(e){
  return HtmlService.createHtmlOutputFromFile(e).getContent();
}

function getIssLocation(dates) {
  let response = UrlFetchApp.fetch(`https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${dates.join()}`);
  response = JSON.parse(response.getContentText());
  const map = Maps.newStaticMap()
    .addPath(response.flatMap((point) => [point.latitude, point.longitude]))
    .getBlob();
  const image = DriveApp.createFile(map); // plotting path will be uploaded to drive
  for (let i = 0; i < response.length; i += 1) {
    const data = UrlFetchApp.fetch(`api.openweathermap.org/data/2.5/weather?lat=${response[i].latitude}&lon=${response[i].longitude}&appid=dee01c57a087d8a73da203f64309e191`); 
    response[i]['weather'] = JSON.parse(data).weather[0].main;
  }
  return JSON.stringify(response);
}


