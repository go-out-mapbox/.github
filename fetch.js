"use strict"

loadCSV("date/2023.csv");

async function loadCSV(targetCSV) {
  const request = new Request(targetCSV);
  const response = await fetch(request);
  const dateCSV = await response.text();

  // CSVの全行を取得
  const lines = dateCSV.split("\n");
  for (let i = 0; i < lines.length; i++) {
    // 1行ごとの処理
    let cells = lines[i].split(",");
    for( let ii = 0; ii < cells.length; ii++ ) {
      let removDouble = cells[ii].replace(/\"/g,"");
      cells[ii] = removDouble;
    }

    let lng = cells[0],
    lat = cells[1],
    address = cells[2],
    timestamp = cells[4],
    by = 'Posted by ' + cells[5];

    let addMarker = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [lng, lat]
      },
      'properties': {
        'title': [lng, lat],
        'address': address,
        'date': by,
        'timestamp': timestamp,
        'tags': 'marker',
      }
    }
    stores.features.push(addMarker)
  }
}
