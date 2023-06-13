"use strict"

loadCSV("date/2023.csv");

function loadCSV(targetCSV) {
  // XMLHttpRequestの用意
  const request = new XMLHttpRequest();
  request.open("get", targetCSV, false);
  request.send(null);

  // 読み込んだCSVデータ
  const csv = request.responseText;

  // CSVの全行を取得
  const lines = csv.split("\n");
  for (let i = 0; i < lines.length; i++) {
    // 1行ごとの処理
    let cells = lines[i].split(",");

    for( let ii = 0; ii < cells.length; ii++ ) {
      var removDouble = cells[ii].replace(/\"/g,"");
      cells[ii] = removDouble;
    }

    let heardCenter = [cells[0], cells[1]];
    let addMarker = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': heardCenter
      },
      'properties': {
        'title': heardCenter,
        'date': cells[3],
        'address': cells[2],
        'timestamp': cells[4],
        'tags': 'marker'
      }
    }
    stores.features.push(addMarker)
  }
}
