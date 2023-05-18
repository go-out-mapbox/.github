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
  })

  if(localStorage.getItem('map')) {
    let mapJSON = JSON.parse(localStorage.getItem('map'));

    mapJSON.forEach((markerID, i) => {
      markerID.id = i;
    });

    for (const marker of mapJSON) {
      let coordinates = marker.geolocation;
      let thisTitle = marker.address;
      let thisDate = marker.date;
      let thisOn = marker.timestamp;

      const el = document.createElement('div');
      el.id = `marker-${markerID.id}`;
      el.className = 'marker';
      new mapboxgl.Marker(el, {
        offset: [0, -23]
      });
      .setLngLat(coordinates);
      .addTo(map);

      el.addEventListener('click', (e) => {
        flyToStore(marker);
      });
    }
  }
});
