<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no" />
  <script src="js/index.js"></script>
  <script src="/js/log.js" async></script>
  <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js"></script>
  <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
  <link href="font/style.css" rel="stylesheet" />
  <link href="css/reset.css" rel="stylesheet" />
  <link href="css/index.css" rel="stylesheet" />
  <link href="css/marker.css" rel="stylesheet" />
  <link href="css/submit.css" rel="stylesheet" />
  <link href="css/title.css" rel="stylesheet" />
  <link rel="icon" href="profile/icon.png" type="image/png">
  <link rel="icon" href="profile/icon.png" sizes="192x192" type="image/png">
  <link rel="apple-touch-icon-precomposed" href="profile/icon.png" sizes="180x180" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital@0;1&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap" rel="stylesheet">
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
        <span>知っている場所の</span>
        <b>外へ</b>
        <span>わからないところまで</span>
        <b>出かける</b>
      </h3>
    </section>
  </main>

  <main id="submit" hidden>
    <input id="close" type="button" onclick="ChangeHidden()" value="×">
    <form>
      <section id="readme">
        <h3>
          <span>We Create a Collection of Where We Were on this Map.</span>
        </h3>
        <h4>この地図に、わたしたちがいた場所を記録します。</h4>
        <p>「I'm here !」をクリックすると、あなたの位置情報がコレクションに投稿されます。</p>
        <p><small>※ あなたが投稿した 位置情報 は、<a href="profile/">プロフィール</a> ページから閲覧できます。</small></p>
      </section>
      <p style="text-align: center;">
        <button type="submit" class="goout">I'm Here !</button>
      </p>
      <details>
        <summary><b>Submit A Comment コメントを残す</b></summary>
        <textarea rows="7" id="comment"></textarea>
      </details>
    </form>
    <footer id="credit" class="goout"></footer>
  </main>

  <article id="map"></article>

  <script type="text/javascript">
  const mapbox = document.querySelector('#map'),
  yourHere = document.querySelector('#date #geolocation'),
  yourAddress = document.querySelector('#date address'),
  dateSection = document.querySelector('#date section'),
  title = document.querySelector('#title'),
  enter = document.querySelector('#enter'),
  submitForm = document.querySelector('#submit form'),
  submitButton = document.querySelector('#submit button'),
  submitDetails = document.querySelector('#submit details');

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

  async function indexHTML() {
    fetch('credit.html')
    .then(response => response.text())
    .then(innerHTML => {
      document.querySelector('#credit').innerHTML = innerHTML;
    });
  }

  async function errorMD() {
    fetch('profile/README.md')
    .then(response => response.text())
    .then(innerText => {
      document.querySelector('#readme').innerText = innerText;
    });

    fetch('credit.html')
    .then(response => response.text())
    .then(innerHTML => {
      document.querySelector('#credit').innerHTML = innerHTML;
    });
  }
  </script>
  <script src="js/markers.js"></script>
  <script src="js/polygon.js"></script>
  <script src="js/readyState.js"></script>
  <script src="js/submit.js"></script>
</body>
</html>