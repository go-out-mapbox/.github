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
      var removDouble = cells[ii].replace(/\"/g,"");
      cells[ii] = removDouble;
    }

    const addCenter = [cells[0], cells[1]]

    let addMarker = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [cells[0], cells[1]]
      },
      'properties': {
        'title': addCenter,
        'address': cells[2],
        'date': 'Submit by ' + cells[5],
        'timestamp': cells[4],
        'tags': 'marker',
      }
    }
    stores.features.push(addMarker)
  }
}
