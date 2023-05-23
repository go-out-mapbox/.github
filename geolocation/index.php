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
    zoom: 1.23,
    scrollZoom: true
  })

  // 現在位置を取得できた場合の処理
  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    let center = [longitude, latitude];
    map.flyTo({
      center: center,
      zoom: 15
    });
  };

  // 現在位置を取得できなかった場合の処理
  function error() {
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
  };

  // 現在位置を取得する
  navigator.geolocation.getCurrentPosition(success, error);

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

  // 場所を検索するジオコーダーコントロールを追加
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: false,
    mapboxgl: mapboxgl
  })

  // ジオコーダー を #geocoder に配置
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));



  // ジオコーダーの結果後にドラッグ可能マーカーを設定
  geocoder.on('result', function(e) {
    var marker = new mapboxgl.Marker({
      draggable: true,
      color: "red"
    })
    .setLngLat(e.result.center)
    .addTo(map);

    // マーカーの座標を #coordinates に表示
    const coordinates = document.getElementById('coordinates');
    function onDragEnd() {
      const lngLat = marker.getLngLat();
      coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    }

    marker.on('dragend', onDragEnd);
    onDragEnd();
  });
</script>
</body>
</html>
