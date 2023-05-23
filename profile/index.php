<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no" />
  <script type="text/javascript">
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
  </script>
  <script src="../js/index.js" async></script>
  <script src="/js/log.js" async></script>
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet">
  <link href="../font/style.css" rel="stylesheet" />
  <link href="../css/reset.css" rel="stylesheet" />
  <link href="style.css" rel="stylesheet" />
  <link rel="icon" href="icon.png" type="image/png">
</head>
<body>
  <input type="button" name="button" id="back">
  <header>
    <h1></h1>
  </header>
  <article>
    <details id="storage">
      <summary></summary>
      <section></section>
    </details>
  </article>
  <main id="map"></main>
  <script type="text/javascript">
  // ページにMapboxを埋め込む
  mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';
  let center = [135.50433479522678, 34.69699057458179];
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pehu/ckx1e2xhw13kw14s4rjhaiv17',
    center: center,
    projection: 'globe',
    zoom: 1.75,
    scrollZoom: true
  })

  // 現在位置を取得するボタンを追加
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      // デバイスの位置の変更に応じて位置情報を更新
      trackUserLocation: true,
      // デバイスが向いている方向を矢印で描画
      showUserHeading: true
    })
  );

  let stores = {
    'type': 'FeatureCollection',
    'features': []
  }

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

  // 回転する地球儀を作成
  let userInteracting = 0;
  function spinGlobe(){
    const zoom = map.getZoom();
    if(!userInteracting && zoom < 5) {
      let speed = 1;
      if(zoom > 3) {
        speed *= (5 - zoom) / 2
      }
      const lng = map.getCenter();
      lng.lng -= speed,
      map.easeTo({
        center: lng,
        easing: zoom => zoom
      })
    }
  }

  map.on("mousedown",()=>{userInteracting=!0}),
  map.on("dragstart",()=>{userInteracting=!0}),
  map.on("moveend",()=>{spinGlobe()}),
  spinGlobe()
  </script>
  <script src="readyState.js"></script>
</body>
</html>
