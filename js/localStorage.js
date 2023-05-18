'use strict'

let stores = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [135.50433479522678, 34.69699057458179]
      },
      'properties': {
        'title': '135.50433479522678, 34.69699057458179',
        'address': '日本, 大阪府大阪市北区西天満4丁目8番1',
        'date': '∧° ┐ | creative, community space',
        'timestamp': 'Sat Dec 16 2017 - Sun Apr 29 2018 | Sun Jan 6 2019 - Sun 15 Sep 2019',
        'tags': 'marker pehu',
      }
    }
  ]
};

// localStorage から 投稿 を取得
if(localStorage.getItem("map")) {
  const mapJSON = JSON.parse(localStorage.getItem('map'));
  mapJSON.forEach((marker, i) => {
    let coordinates = marker.geolocation;
    let thisTitle = marker.address;
    let thisDate = marker.date;
    let thisOn = marker.timestamp;
    let yourMarker = `{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [${coordinates}]
      },
      'properties': {
        'title': ${coordinates},
        'address': ${thisTitle},
        'date': ${thisOn},
        'tags': 'marker',
      }`
    });

    stores.features.push(`${yourMarker}`)
  }

  // 地図にマーカーを追加
  map.on('load', () => {
    map.addSource('places', {
      'type': 'geojson',
      'data': stores
    });
    addMarkers();
  });

  function addMarkers() {
    for (const marker of stores.features) {
      const el = document.createElement('div');
      el.id = `marker-${marker.properties.id}`;
      el.className = marker.properties.tags;
      new mapboxgl.Marker(el, {
        offset: [0, 0]
      })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);

      el.addEventListener('click', (e) => {
        flyToStore(marker);
        createPopUp(marker);
      });
    }
  }

  /* Create a Mapbox GL JS `Popup`. */
  function createPopUp(currentFeature) {
    dateSection.innerHTML = "";
    yourHere.textContent = currentFeature.properties.title;
    yourAddress.textContent = currentFeature.properties.address;
    dateSection.className = currentFeature.properties.tags;

    const dateTXT = document.createElement('p');
    dateTXT.innerHTML = currentFeature.properties.date;
    dateSection.appendChild(dateTXT);

    const dateTime = document.createElement('p');
    dateTime.innerHTML = `<time>${currentFeature.properties.timestamp}</time>`;
    dateSection.appendChild(dateTime);
  }
