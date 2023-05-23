<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no" />
  <script src="readyState.js"></script>
  <script src="../js/index.js" async></script>
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet">
  <link href="../font/style.css" rel="stylesheet" />
  <link href="../css/reset.css" rel="stylesheet" />
  <link href="style.css" rel="stylesheet" />
  <link rel="icon" href="icon.png" type="image/png">
</head>
<body>
  <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.min.js"></script>
  <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css" type="text/css">

  <style>
  .geocoder {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    width: calc(100% - 85px);
    max-width: 300px;
    z-index: 10;
  }

  .coordinates {
    background: #fff;
    color: #000;
    font-size: 1rem;
    padding: 5px 10px;
    margin: 0;
    position: absolute;
    bottom: 40px;
    left: 0.5rem;
    z-index: 10;
  }

  .mapboxgl-ctrl-geocoder {
    min-width: 100%;
  }
  </style>

  <input type="button" name="button" id="back">
  <div id="geocoder" class="geocoder"></div>
  <pre id="coordinates" class="coordinates"></pre>

  <main id="map"></main>
  <script type="text/javascript">
  // ページにMapboxを埋め込む
  mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';
  let center = [0, 0];
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pehu/ckx1e2xhw13kw14s4rjhaiv17',
    center: center,
    zoom: 10,
    scrollZoom: true
  })

  // 現在位置を取得できた場合の処理
  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    let center = [longitude, latitude];
  };

  // 現在位置を取得できなかった場合の処理
  function error() {
    let center = [135.50433479522678, 34.69699057458179];
  };

  // 現在位置を取得する
  navigator.geolocation.getCurrentPosition(success, error);

  map.flyTo({
    center: center,
    zoom: 15
  });

  // Add the control to the map.
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: {
      color: 'lightskyblue',
      draggable: true
    },
    mapboxgl: mapboxgl
  })

  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

  const marker = new mapboxgl.Marker({
    draggable: true
  })
  .setLngLat(center)
  .addTo(map);

  const coordinates = document.getElementById('coordinates');
  function onDragEnd() {
    const lngLat = marker.getLngLat();
    coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
  }

  marker.on('dragend', onDragEnd);
</script>
</body>
</html>
