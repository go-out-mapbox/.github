<!DOCTYPE html>

<!-- 'll play first and tell what it is later -->
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no" />
  <script src="readyState.js"></script>
  <script src="../js/index.js" async></script>
  <script src="/js/log.js" async></script>
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet">
  <link href="../font/style.css" rel="stylesheet" />
  <link href="../css/reset.css" rel="stylesheet" />
  <link href="../css/submit.css" rel="stylesheet" />
  <link href="style.css" rel="stylesheet" />
  <link rel="icon" href="../profile/icon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@300&display=swap" rel="stylesheet">
</head>
<body>
  <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.min.js"></script>
  <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css" type="text/css">

  <main id="coordinates">
    <input type="button" name="button" id="back">
    <div id="geocoder"></div>
    <h1>
      <address class="relax"><u id="address">Geolocation API</u></address>
      <b id="longitude" class="goout">Longitude</b>,
      <b id="latitude" class="goout">Latitude</b>
    </h1>
    <details>
      <summary></summary>
      <section id="readme"></section>
    </details>
  </main>
  <main id="submit" hidden>
    <input id="close" type="button" onclick="ChangeHidden()" value="×">
    <input type="datetime-local" id="datetime" name="datetime"><br/>
    <h2><time id="timestamp">Select The Date and Time When You Were</time></h2>
    <form>
      <p style="text-align: center;">
        <button type="submit" class="goout">I Was Here</button>
      </p>
      <details open>
        <summary><b>Add A Comment to Your Location</b></summary>
        <textarea rows="7" id="comment" placeholder="位置情報にコメントを追加する"></textarea>
      </details>
    </form>
  </main>

  <article id="map"></article>
  <script type="text/javascript">
  const submitForm = document.querySelector('#submit form'),
  thisLng = document.querySelector('#coordinates #longitude'),
  thisLat = document.querySelector('#coordinates #latitude'),
  yourAddress = document.querySelector('#address');

  const readme = document.querySelector('#coordinates summary');

  // ページにMapboxを埋め込む
  mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';
  let center = [0, 0];
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pehu/ckx1e2xhw13kw14s4rjhaiv17',
    center: center,
    zoom: 1.23
  });

  if(localStorage.getItem('yourInfo')) {
    // ジオコーダーコントロールを追加
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: false,
      zoom: 17.5,
      language: 'ja',
      country: 'jp',
      mapboxgl: mapboxgl,
      reverseGeocode: true
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

      document.querySelector('#coordinates h1').classList.add('submit');
    });

    document.querySelector('#coordinates h1').addEventListener('click', function () {
      ChangeHidden()
    });

    function ChangeHidden() {
      const mainAll = document.querySelectorAll('main');
      mainAll.forEach(main => {
        if (main.hidden == false) {
          main.hidden = true;
        } else {
          main.hidden = false;
        }
      });
    };

    readme.innerText = "このページについて About This Page"
    fetch('README.md')
    .then(response => response.text())
    .then(innerText => {
      document.querySelector('#readme').innerText = innerText;
    });
  } else {
    readme.innerText = "Submit Your Info to Enter This Site";
    document.querySelector('#readme').className = "about";
    fetch('../yourinfo.php')
    .then(response => response.text())
    .then(innerHTML => {
      document.querySelector('#readme').innerHTML = innerHTML;
    });
  }
  </script>
  <script src="../js/submit.js"></script>
</body>
</html>
