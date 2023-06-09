'use strict'

let stores = {
  'type': 'FeatureCollection',
  'features': []
}

function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch(e) {
    return e instanceof DOMException && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    ) && (storage && storage.length !== 0);
  }
}

if (!storageAvailable('localStorage')) {
  window.location.replace('/map/')
}
if (!'geolocation' in navigator) {
  window.location.replace('/map/')
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
      window.location.replace('/map/')
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
        map.flyTo({
          center: [longitude, latitude],
          bearing: 0,
          pitch: 0,
          zoom: 11.11,
          essential: true
        });
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

    stores.features.forEach((store, i) => {
      store.properties.id = i;
    })

    function addMarkers() {
      for (const marker of stores.features) {
        const el = document.createElement('div');
        el.id = `marker-${marker.properties.id}`;
        el.className = marker.properties.tags;
        new mapboxgl.Marker(el, {
          offset: [0, 0]
        })
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <p>${marker.properties.date}</p>
            <time>${marker.properties.timestamp}</time>
            `
          )
        )
        .addTo(map)

        el.addEventListener('click', (e) => {
          map.flyTo({
            center: marker.geometry.coordinates,
            bearing: 0,
            pitch: 60,
            zoom: 20
          })
        })
      }
    }

    if(localStorage.getItem('yourInfo')) {
      // localStorage から 投稿 を取得
      if(localStorage.getItem('map')) {
        storageTitle.innerText = 'The Collection of Your Location';
        storageSection.innerHTML = `
        <ol></ol>
        <h3>
        Add Your Location to Collection<br/>
        <a href="/map/search/">あなたがいた場所をコレクションに追加する</a>
        </h3>`
        ;

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
      storageSection.className = 'enter';

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
