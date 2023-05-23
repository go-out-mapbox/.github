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
    border-radius: 5px;
    box-sizing: border-box;
    color: #000;
    font-size: 1rem;
    padding: 5px 10px;
    margin: 0 auto;
    position: absolute;
    bottom: 40px;
    left: 0.5rem;
    max-width: calc(100% - 1rem);
    z-index: 5;
  }

  .coordinates address {
    font-style: normal;
    font-size: 75%;
    margin: 0.25rem;
  }

  .coordinates p {
    padding: 0;
    margin: 0.25rem;
  }

  .coordinates p b {
    font-size: 125%;
  }
  </style>

  <input type="button" name="button" id="back">
  <div id="geocoder" class="geocoder"></div>
  <div id="coordinates" class="coordinates">
    <p class="relax">経度: <b id="lng" class="goout">Longitude</b></p>
    <p class="relax">緯度: <b id="lat" class="goout">Latitude</b></p>
    <address id="address" class="relax"></address>
  </div>

  <main id="map"></main>
  <script type="text/javascript">
  const thisLng = document.querySelector('#coordinates #lng');
  const thisLat = document.querySelector('#coordinates #lat');

  // ページにMapboxを埋め込む
  mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';
  let center = [0, 0];
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    center: center,
    zoom: 1.23
  });

  // ジオコーダーコントロールを追加
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: false,
    mapboxgl: mapboxgl
  })

  // ジオコーダー を #geocoder に配置
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

  // ジオコーダーの結果後にドラッグ可能マーカーを設定
  geocoder.on('result', function(e) {
    let marker = new mapboxgl.Marker({
      draggable: true,
      color: "red"
    })
    .setLngLat(e.result.center)
    .addTo(map);

    // マーカーの座標を表示
    function onDragEnd() {
      const lngLat = marker.getLngLat();
      thisLng.innerText = `${lngLat.lng}`;
      thisLat.innerText = `${lngLat.lat}`;

      // Mapbox リバースジオコーディング
      let uri = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?language=ja&access_token=${mapboxgl.accessToken}`;
      fetchData(uri).then(function(response) {
        return response.text().then(function(jsonStr) {
          var data = JSON.parse(jsonStr);
          var context = data.features[0].place_name;
          const thisAddress= document.querySelector('#address');
          thisAddress.textContent = context;
        });
      }).catch(err => { console.log(err); });

      async function fetchData(_uri) {
        const res = await fetch(_uri);
        const data = await res;
        return data;
      };
    }

    marker.on('dragend', onDragEnd);
    onDragEnd();
  });
</script>
</body>
</html>
