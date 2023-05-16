'use strict'

mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';
let center = [135.50433479522678, 34.69699057458179]

const mapbox = document.querySelector('#map');
const getLocation = document.querySelector('#geolocation');
const address = document.querySelector('#date address');
const dateSection = document.querySelector('#date section');
if(localStorage.getItem('geolocation')) {
  document.body.classList.add('enter');
  const geolocation = JSON.parse(localStorage.getItem('geolocation'))
  getLocation.textContent = `Latitude: ${geolocation.latitude} °, Longitude: ${geolocation.longitude} °`;
  address.textContent = `Altitude Accuracy: ${geolocation.longitude} m`;
}

function geoFindMe() {
  getLocation.textContent = "";

  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    getLocation.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    address.textContent = `Altitude Accuracy: ${accuracy} m`;
    dateSection.textContent = "";
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";

    const geolocation = {
      latitude : latitude,
      longitude : longitude,
      accuracy : accuracy
    }

    const geoJSON = JSON.stringify(geolocation);
    localStorage.setItem('geolocation', geoJSON);
    console.log('geolocation', geoJSON);
  }

  function error() {
    getLocation.textContent = 'Unable to retrieve your location';
    address.textContent = `現在地を取得できません`;
    dateSection.textContent = "";
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";
  }

  if(!navigator.geolocation) {
    getLocation.textContent = 'Geolocation is not supported by your browser';
    address.textContent = `現在地を取得できません`;
    dateSection.textContent = "";
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";
  } else {
    getLocation.textContent = 'Locating…';
    address.textContent = `現在地を取得中`;
    dateSection.textContent = "";
    mapbox.style.pointerEvents = "none";
    mapbox.style.userSelect = "none";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

/* Add the map to the page */
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/pehu/ckx1e2xhw13kw14s4rjhaiv17',
  center: center,
  zoom: 11.11,
  scrollZoom: false
});

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

/* Add a marker to the map for every store listing. */
function addMarkers() {
  /* For each feature in the GeoJSON object above: */
  for (const marker of stores.features) {
    /* Create a div element for the marker. */
    const el = document.createElement('div');
    /* Assign a unique `id` to the marker. */
    el.id = `marker-${marker.properties.id}`;
    /* Assign the `marker` class to each marker for styling. */
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
      /* Fly to the point */
      flyToStore(marker);
      /* Close all other popups and display popup for clicked store */
      createPopUp(marker);
      /* Highlight listing in sidebar */
      const activeItem = document.getElementsByClassName('active');
      e.stopPropagation();
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      const listing = document.getElementById(`listing-${marker.properties.id}`);
      listing.classList.add('active');
    });
  }
}

/**
* Use Mapbox GL JS's `flyTo` to move the camera smoothly
* a given center point.
**/
function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 12.345
  });
}

/* Create a Mapbox GL JS `Popup`. */
function createPopUp(currentFeature) {
  dateSection.innerHTML = "";

  const popup = document.querySelector('#date');
  getLocation.innerText = currentFeature.properties.title;
  address.innerText = currentFeature.properties.address;

  const dateP = document.createElement('p');
  dateP.innerText = currentFeature.properties.date;
  dateSection.appendChild(dateP);

  const dateYouTube = document.createElement('iframe');
  dateYouTube.src = `https://www.youtube.com/embed/${currentFeature.properties.src}`;
  dateYouTube.title = "YouTube video player"
  dateYouTube.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  dateSection.appendChild(dateYouTube);
}

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
