'use strict'

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
