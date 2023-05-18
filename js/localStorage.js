// 地図にマーカーを追加
map.on('load', () => {
  map.addSource('places', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection'
    }
  });

  if(localStorage.getItem('map')) {
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
      .setLngLat(coordinates)
      .addTo(map);

      el.addEventListener('click', (e) => {
        flyToStore(coordinates);
      });
    }
  }
});
