// 地図にマーカーを追加
map.on('load', () => {
  map.addSource('places', {
    'type': 'geojson',
    'data': mapJSON
  });
  addMarkers();
});

function addMarkers() {
  let mapJSON = JSON.parse(localStorage.getItem('map'));
  for (let i = 0; i < mapJSON.length; i++) {
    let coordinates = mapJSON[i].geolocation
    let thisTitle = mapJSON[i].address
    let thisDate = mapJSON[i].comment
    let thisOn = mapJSON[i].timestamp
    dateSection.innerText += coordinates

    const el = document.createElement('div');
    el.id = `marker-${i}`;
    el.className = 'marker';
    new mapboxgl.Marker(el, {
      offset: [0, -23]
    })
    .setLngLat(coordinates)
    .addTo(map);

    el.addEventListener('click', (e) => {
      flyToStore(coordinates);
    });
  }
}

const stores = {
  'type': 'FeatureCollection',
  'features': [{
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [135.4854249,34.616754]
    },
    'properties': {
      'title': '135.4854249,34.616754',
      'address': '日本, 大阪府大阪市住之江区粉浜西3丁目1番8',
      'date': 'Under Construction',
      'on': 'Wed May 17 2023 17:30:30 GMT+0900 (日本標準時)',
    }
  }]
};
