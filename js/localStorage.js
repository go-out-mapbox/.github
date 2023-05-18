// 地図にマーカーを追加
async function indexJSON() {
  const requestURL = 'index.json';
  const request = new Request(requestURL);
  const response = await fetch(request);
  const jsonIndex = await response.text();

  const index = JSON.parse(jsonIndex);
}

map.on('load', () => {
  map.addSource('places', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection'
    }
  });
  addMarkers()
});

function addMarkers() {
  let mapJSON = JSON.parse(localStorage.getItem('map'));
  for (let i = 0; i < mapJSON.length; i++) {
    let coordinates = mapJSON[i].geolocation
    let thisTitle = mapJSON[i].address
    let thisDate = mapJSON[i].date
    let thisOn = mapJSON[i].timestamp

    const el = document.createElement('div');
    el.id = `marker-${i}`;
    el.className = 'marker';
    new mapboxgl.Marker(el, {
      offset: [0, -23]
    })
    .addTo(map);

    el.addEventListener('click', (e) => {
      flyToStore(coordinates);
    });
  }
}
