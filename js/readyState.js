'use strict'

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'loading') {
    // 文書の読み込み中に実行する
  }

  else if (event.target.readyState === 'interactive') {
  }

  else if (event.target.readyState === 'complete') {
    // 地図にマーカーを追加
    stores.features.forEach((store, i) => {
      store.properties.id = i;
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

      const dateTXT = document.createElement('p');
      dateTXT.innerHTML = currentFeature.properties.date;
      dateTXT.className = currentFeature.properties.tags;
      dateSection.appendChild(dateTXT);

      const dateTime = document.createElement('p');
      dateTime.innerHTML = `<time>${currentFeature.properties.timestamp}</time>`;
      dateTime.className = currentFeature.properties.tags;
      dateSection.appendChild(dateTime);
    }

    map.on('load', () => {
      map.addSource('places', {
        'type': 'geojson',
        'data': stores
      });
      addMarkers();
    });
  }
});
