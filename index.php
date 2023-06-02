<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no" />
  <script src="js/readyState.v3.js"></script>
  <script src="js/index.js" defer></script>
  <script type="text/javascript">
  function index(url) {
    event.preventDefault()
    window.open(url, "_parent")
  }
  </script>
  <script src='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>
  <link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />
  <link href="font/style.css" rel="stylesheet" />
  <link href="css/reset.css" rel="stylesheet" />
  <link href="css/index.css" rel="stylesheet" />
  <link href="css/collection.css" rel="stylesheet" />
  <link href="css/submit.css" rel="stylesheet" />
  <link href="css/title.css" rel="stylesheet" />
  <link href="css/marker.v4.css" rel="stylesheet" />
  <link rel="icon" href="profile/mobile.png" sizes="192x192" type="image/png">
  <link rel="apple-touch-icon-precomposed" href="profile/mobile.png" sizes="180x180" type="image/png">
</head>
<body>
  <h1 id="title" class="goout">Go Out</h1>
  <button type="button" id="enter" class="goout">Let's have some fun</button>

  <main id="date">
    <h2 id="geolocation">
      Life is precious. Every minute. And more precious with you in it.
    </h2>
    <address>cite lyrics from "Jon Brion – Little Person"</address>
    <section>
      <h3>
        <span>知っていることの</span>
        <b>外へ</b>
        <span>わからないところまで</span>
        <b>出かける</b>
      </h3>
    </section>
  </main>

  <main id="submit" hidden>
    <input id="close" type="button" onclick="ChangeHidden()" value="×">
    <form>
      <section id="readme"></section>
      <p style="text-align: center;">
        <button type="submit" class="goout">I'm Here !</button>
      </p>
      <details open>
        <summary><b>Add A Comment to Your Location</b></summary>
        <textarea rows="7" id="comment" placeholder="位置情報にコメントを追加する"></textarea>
      </details>
      <details id="collection">
        <summary><b>View The Collection</b></summary>
      </details>
    </form>
    <hr/>
    <footer id="credit" class="goout"></footer>
  </main>

  <article id="map"></article>

  <script src="js/markers.v2.js"></script>
  <script type="text/javascript">
  const mapbox = document.querySelector('#map'),
  yourHere = document.querySelector('#date #geolocation'),
  yourAddress = document.querySelector('#date address'),
  dateSection = document.querySelector('#date section'),
  title = document.querySelector('#title'),
  enter = document.querySelector('#enter'),
  submitForm = document.querySelector('#submit form'),
  submitButton = document.querySelector('#submit button'),
  submitDetails = document.querySelector('#submit details'),
  collection = document.querySelector('#collection');

  mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';
  let center = [135.50433479522678, 34.69699057458179];
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pehu/ckx1e2xhw13kw14s4rjhaiv17',
    center: center,
    zoom: 1.75,
    scrollZoom: true
  });

  map.addControl(new mapboxgl.NavigationControl());

  // 地図にマーカーを追加
  map.on('load', () => {
    map.addSource('places', {
      'type': 'geojson',
      'data': stores
    });
    addMarkers();
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
      .addTo(map)

      el.addEventListener('click', (e) => {
        flyToStore(marker);
        createPopUp(marker);
      })
    };
  };

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

  function flyToStore(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    })
  }
  </script>
  <script src="js/polygon.v3.js"></script>
  <script src="js/submit.js"></script>
  <script src="/js/log.js"></script>
</body>
</html>
