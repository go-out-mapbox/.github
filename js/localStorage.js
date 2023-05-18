'use strict'

map.on('load', () => {
  map.addSource('places', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection'
    }
  })
});

if(localStorage.getItem('map')) {
  const mapJSON = JSON.parse(localStorage.getItem('map'));
  mapJSON.forEach((marker, i) => {
    let coordinates = marker.geolocation;
    let thisTitle = marker.address;
    let thisDate = marker.date;
    let thisOn = marker.timestamp;

    const el = document.createElement('div');
    el.id = `marker-${i}`;
    el.className = 'marker';
    el.innerText = coordinates;
    dateSection.prepend(el)
  });
}



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
