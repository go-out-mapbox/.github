'use strict'

mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';
let center = [135.50433479522678, 34.69699057458179];

const mapbox = document.querySelector('#map');
const getLocation = document.querySelector('#geolocation');
const address = document.querySelector('#date address');
const dateSection = document.querySelector('#date section');
const title = document.querySelector('#title');
const enter = document.querySelector('#enter');
const submitForm = document.querySelector('#submit form');

/* ページにMapboxを埋め込む */
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/pehu/ckx1e2xhw13kw14s4rjhaiv17',
  center: center,
  zoom: 1.75,
  scrollZoom: false
});

// 現在地を取得する
function geoFindMe() {
  function success(position) {
    // 緯度経度を変数に代入
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    getLocation.textContent = `${longitude},${latitude}`;

    // 緯度経度から住所を検索
    let uri = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?language=ja&access_token=${mapboxgl.accessToken}`;
    fetchData(uri).then(function(response){ return response.text().then(function(jsonStr){
      var data = JSON.parse(jsonStr);
      var context = data.features[0].place_name;
      address.textContent = context;
    });}).catch(err => { console.log(err); })

    async function fetchData(_uri) {
      const res = await fetch(_uri);
      const data = await res;
      return data;
    }

    // 地図の中心を現在地へ移動
    let center = [longitude, latitude];
    map.flyTo({
      center: center,
      zoom: 20,
      scrollZoom: false
    });

    // ローカルストレージへ現在地を記録
    let date = new Date();
    const geolocation = {
      latitude : latitude,
      longitude : longitude,
      accuracy : accuracy,
      timestamp : date
    }

    const geoJSON = JSON.stringify(geolocation);
    localStorage.setItem("geolocation", geoJSON);
    console.log("geolocation", geoJSON);

    dateSection.innerHTML = `<p><time>${date}</time></p>`;
    enter.textContent = "You Are Here";
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";

    ChangeHidden()
  }

  function error() {
    getLocation.textContent = 'Unable to retrieve your location';
    address.textContent = `現在地を取得できませんでした`;
    dateSection.textContent = "";
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";

    submitForm.remove();
    ChangeHidden()
  }

  if(!navigator.geolocation) {
    getLocation.textContent = 'Geolocation is not supported by your browser';
    address.textContent = `現在地を取得できません`;
    dateSection.textContent = "";
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";

    submitForm.remove();
    ChangeHidden()
  } else {
    getLocation.textContent = 'Locating…';
    address.textContent = `現在地を取得中`;
    dateSection.textContent = "";
    mapbox.style.pointerEvents = "none";
    mapbox.style.userSelect = "none";
    navigator.geolocation.getCurrentPosition(success, error);

    title.style.opacity = "0";
    setTimeout(() => {
      title.remove();
    }, 2500)
  }
}

/**
* Use Mapbox GL JS's `flyTo` to move the camera smoothly
* a given center point.
**/
function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

/* ローカルストレージに現在地の記録があるかを確認 */
if(localStorage.getItem("geolocation")) {
  const geolocation = JSON.parse(localStorage.getItem("geolocation"));
  getLocation.textContent = `${geolocation.longitude},${geolocation.latitude}`;
  address.textContent = `Last Time You Visited ${geolocation.timestamp}`;

  let center = [geolocation.longitude, geolocation.latitude];
  map.flyTo({
    center: center,
    scrollZoom: false
  });
}

function ChangeHidden() {
  const mainAll = document.querySelectorAll('main');
  mainAll.forEach(main => {
    if (main.hidden == false) {
      main.hidden = true;
      enter.textContent = "Let's have some fun";
    } else {
      main.hidden = false;
      enter.textContent = "You Are Here";
    }
  })
};

const submitClose = document.querySelector('#submit #close');
submitClose.addEventListener('click', function () {
  const geolocation = JSON.parse(localStorage.getItem("geolocation"));
  let center = [geolocation.longitude, geolocation.latitude];
  map.flyTo({
    center: center,
    zoom: 11.11,
    scrollZoom: false
  });
})


// 地図にマーカーを追加
stores.features.forEach((store, i) => {
  store.properties.id = i;
});

map.on('load', () => {
  map.addSource('places', {
    'type': 'geojson',
    'data': stores
  });
  addMarkers();
});

function addMarkers() {
  for (const marker of stores.features) {
    const el = document.createElement('div');
    el.id = `marker-${marker.properties.id}`;
    el.className = 'marker';
    new mapboxgl.Marker(el, {
      offset: [0, -23]
    })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);

    /**
    * Listen to the element and when it is clicked, do three things:
    * 1. Fly to the point
    * 2. Close all other popups and display popup for clicked store
    * 3. Highlight listing in sidebar (and remove highlight for all other listings)
    **/

    el.addEventListener('click', (e) => {
      flyToStore(marker);
      createPopUp(marker);
    });
  }
}

/* Create a Mapbox GL JS `Popup`. */
function createPopUp(currentFeature) {
  dateSection.innerHTML = "";

  const popup = document.querySelector('#date');
  getLocation.textContent = currentFeature.properties.title;
  address.textContent = currentFeature.properties.address;

  const dateP = document.createElement('p');
  dateP.textContent = currentFeature.properties.date;
  dateSection.appendChild(dateP);
}

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
