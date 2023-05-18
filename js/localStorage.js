'use strict'

// 地図にマーカーを追加
map.on('load', () => {
  map.addSource('places', {
    'type': 'geojson',
    'data': stores
  });
  addMarkers();
});

function addMarkers() {
  const mapJSON = JSON.parse(localStorage.getItem('map'));
  mapJSON.forEach((marker, i) => {
    let coordinates = marker.geolocation;
    let thisTitle = marker.address;
    let thisDate = marker.date;
    let thisOn = marker.timestamp;

    const el = document.createElement('div');
    el.id = `marker-${i}`;
    el.className = 'marker';
    new mapboxgl.Marker(el, {
      offset: [0, -23]
    })
    .setLngLat(coordinates)
    .addTo(map);
  });
}
