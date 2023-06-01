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
  <link rel="icon" href="../profile/mobile.png" sizes="192x192" type="image/png">
  <link rel="apple-touch-icon-precomposed" href="../profile/mobile.png" sizes="180x180" type="image/png">
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
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: center,
    projection: 'globe',
    zoom: 1.75,
    scrollZoom: true
  })

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
  <script src="/js/log.js" async></script>
</body>
</html>
