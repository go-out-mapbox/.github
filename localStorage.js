'use strict'

// localStorage から 投稿 を取得
if(localStorage.getItem("map")) {
  const mapJSON = JSON.parse(localStorage.getItem('map'))
  for (let i = 0; i < mapJSON.length; i++) {
    let thisLongitude = mapJSON[i].longitude,
    thisLatitude = mapJSON[i].latitude,
    thisAddress = mapJSON[i].address,
    thisDate = mapJSON[i].date,
    thisOn = mapJSON[i].timestamp;

    let thisCenter = [thisLongitude, thisLatitude];
    let yourMarker = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': thisCenter
      },
      'properties': {
        'title': `${thisLongitude}, ${thisLatitude}`,
        'address': thisAddress,
        'date': thisDate,
        'timestamp': thisOn,
        'tags': 'marker',
      }
    }
    stores.features.push(yourMarker)
  }
}
