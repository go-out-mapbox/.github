getCSV("date/2023.csv");
'use strict'

// CSVファイルを取得
function getCSV(filePath = "") {
  let csv = new XMLHttpRequest();
  csv.open("GET", filePath, false);

  // csvファイル読み込み失敗時のエラー対応
  try {
    csv.send(null);
  } catch (err) {
    console.log(err);
  }

  // 改行ごとに配列化
  let lines = csv.responseText.split(/\r\n|\n/);

  // 1行ごとに処理
  for (let i = 0; i < lines.length; ++i) {
    let cells = lines[i].split(",");

    for( let ii = 0; ii < cells.length; ii++ ) {
      var removDouble = cells[ii].replace(/\"/g,"");
      cells[ii] = removDouble;
      let addCenter = [cells[0], cells[1]];
      let addMarker = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': addCenter
        },
        'properties': {
          'title': `${cells[0]}, ${cells[1]}`,
          'address': cells[2],
          'date': cells[3],
          'timestamp': cells[4],
          'tags': 'marker',
        }
      }
      stores.features.push(addMarker)
    }
  }

}
