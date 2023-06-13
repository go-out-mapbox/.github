"use strict"

let stores = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [133.91774108127242, 34.66596367986325]
      },
      'properties': {
        'title': "Hiroki Ito's Recommended Spots in Okayama",
        'address': '岡山県オススメ60スポット',
        'date': '<a href="https://go-out-mapbox.github.io/okayama/" target="_blank" rel="noopener">go-out-mapbox.github.io/okayama</a>',
        'timestamp': '',
        'tags': 'goout',
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [135.76854055131543, 35.00017558944718]
      },
      'properties': {
        'title': '135.76854055131543,35.00017558944718',
        'address': '日本, 京都府京都市下京区天満町２６７−１',
        'date': '<a href="heard/bnaaltermuseum/">things that i (we) heard around BnA Alter Museum</a>',
        'timestamp': 'Thu Jul 21 2022 - Mon Aug 15 2022',
        'tags': 'heard',
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [135.47306292634534, 34.62458544610712]
      },
      'properties': {
        'title': '135.50433479522678, 34.69699057458179',
        'address': '日本, 大阪府大阪市住之江区北加賀屋５丁目５−１',
        'date': '<a href="heard/otobuilding/">things that i (we) heard around OTO building</a>',
        'timestamp': 'Sun Jan 5 2020 - Sun May 22 2022',
        'tags': 'heard',
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [135.50433479522678, 34.69699057458179]
      },
      'properties': {
        'title': '135.50433479522678, 34.69699057458179',
        'address': '日本, 大阪府大阪市北区西天満4丁目8番1',
        'date': '<a href="https://vg.pe.hu/jp/" target="_blank" rel="noopener">∧°┐ | creative, community space</a>',
        'timestamp': 'Sat Dec 16 2017 - Sun Apr 29 2018 | Sun Jan 6 2019 - Sun 15 Sep 2019',
        'tags': 'pehu',
      }
    }
  ]
}


async function loadCSV(targetCSV) {
  const request = new Request(targetCSV);
  const response = await fetch(request);
  const csv = await response.text();

  // CSVの全行を取得
  const lines = csv.split("\n");
  for (let i = 0; i < lines.length; i++) {
    // 1行ごとの処理
    let cells = lines[i].split(",");

    for( let ii = 0; ii < cells.length; ii++ ) {
      var removDouble = cells[ii].replace(/\"/g,"");
      cells[ii] = removDouble;
    }

    let addMarker = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [cells[0], cells[1]]
      },
      'properties': {
        'title': [cells[0], cells[1]],
        'address': cells[2],
        'date': cells[3],
        'timestamp': cells[4],
        'tags': 'marker',
      }
    }
    stores.features.push(addMarker)
  }
}

loadCSV("date/2023.csv");
