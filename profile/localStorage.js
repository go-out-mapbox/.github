'use strict'

// localStorage から 投稿 を取得
if(localStorage.getItem("map")) {
  const mapJSON = JSON.parse(localStorage.getItem('map'));
  for (let i = 0; i < mapJSON.length; i++) {
    let coordinates = mapJSON[i].title;
    let thisAddress = mapJSON[i].address;
    let thisDate = mapJSON[i].date;
    let thisOn = mapJSON[i].timestamp;
    let yourMarker = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [coordinates]
      },
      'properties': {
        'title': coordinates,
        'address': thisAddress,
        'date': thisDate,
        'timestamp': thisOn,
        'tags': 'marker',
      }
    }
    stores.features.push(yourMarker)
  };
}
