'use strict'

let stores = {
  'type': 'FeatureCollection',
  'features': []
}

function flyToStore(longitude, latitude) {
  map.flyTo({
    center: [longitude, latitude],
    bearing: 0,
    pitch: 60,
    zoom: 17.5,
    essential: true
  });
}

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'interactive') {
    const title = document.querySelector('h1');
    const back = document.querySelector('#back');
    back.addEventListener('click', function () {
      location.assign('../');
    });

    // localStorage から 最新の現在地 を取得
    if(localStorage.getItem('geolocation')) {
      title.className = "hover";
      const geoJSON = JSON.parse(localStorage.getItem('geolocation'));
      let longitude = geoJSON.longitude,
      latitude = geoJSON.latitude,
      accuracy = geoJSON.accuracy,
      timestamp = geoJSON.timestamp;

      let center = [longitude, latitude];
      map.flyTo({
        center: center
      });

      title.innerHTML = `
      <u>あなたの位置情報</u><br/>
      <b>${longitude}</b>,
      <b>${latitude}</b><br/>
      <small>Last Known Location ${timestamp}</small>
      `;
      title.addEventListener('click', () => {
        flyToStore(longitude, latitude)
      });
    } else {
      title.innerHTML = `
      <u>Web Storage API</u><br/>
      <b>The Collection of Your Location</b>
      `;
    }
  } else if (event.target.readyState === 'complete') {
    const storageTitle = document.querySelector('#storage summary');
    const storageSection = document.querySelector('#storage section');

    // 地図にマーカーを追加
    map.on('load', () => {
      map.addSource('places', {
        'type': 'geojson',
        'data': stores
      })
      addMarkers()
    })

    stores.features.forEach((marker, i) => {
      marker.properties.id = i;
    })

    function addMarkers() {
      for (const marker of stores.features) {
        const el = document.createElement('div');
        el.id = `marker-${marker.properties.id}`;
        el.className = marker.properties.tags;

        new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <time>${marker.properties.timestamp}</time>
            <p>${marker.properties.date}</p>
            `
          )
        )
        .addTo(map)

        el.addEventListener('click', (e) => {
          map.flyTo({
            center: marker.geometry.coordinates,
            zoom: 15
          })
        })
      }
    }

    if(localStorage.getItem('yourInfo')) {
      // localStorage から 投稿 を取得
      if(localStorage.getItem('map')) {
        storageTitle.innerText = 'あなたの位置情報 The Collection of Your Location';
        storageSection.innerHTML = '<ol></ol>';

        const mapJSON = JSON.parse(localStorage.getItem('map'));
        for (let i = 0; i < mapJSON.length; i++) {
          let thisLongitude = mapJSON[i].longitude,
          thisLatitude = mapJSON[i].latitude,
          thisAddress = mapJSON[i].address,
          thisDate = mapJSON[i].date,
          thisOn = mapJSON[i].timestamp,
          thisCenter = [thisLongitude, thisLatitude];

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
          stores.features.push(yourMarker);

          // #storage に 投稿ごとの id名を付けた li要素 を生成
          const storageItem = document.createElement('li');
          storageItem.id = `log-${i}`;
          document.querySelector('#storage ol').appendChild(storageItem);

          // li 要素内に 投稿を出力
          storageItem.innerHTML = `
          <h2>${thisLongitude}, ${thisLatitude}</h2><br/>
          <address>${thisAddress}</address>
          <p>${thisDate}</p>
          <time>${thisOn}</time>
          `;

          // li 要素を クリックすると 投稿した位置に地図の中心が移動
          storageItem.addEventListener('click', () => {
            flyToStore(thisLongitude, thisLatitude)
          })
        }
      } else {
        storageTitle.innerText = 'このウェブサイトについて About This Website';
        storageSection.className = 'readme';

        async function readmeMD() {
          fetch('../README.md')
          .then(response => response.text())
          .then(innerText => {
            storageSection.innerText = innerText;
          });
        }
        readmeMD()
      }
    } else {
      storageTitle.innerText = 'Submit Your Info to Enter This Site';
      storageSection.className = 'readme';

      async function readmeMD() {
        fetch('../yourinfo.php')
        .then(response => response.text())
        .then(innerHTML => {
          storageSection.innerHTML = innerHTML;
        });
      }
      readmeMD()
    }
  }
});
