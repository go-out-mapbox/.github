'use strict'

mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';

/* Add the map to the page */
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/pehu/ckx1e2xhw13kw14s4rjhaiv17',
  center: [135.50433479522678, 34.69699057458179],
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
  buildLocationList(stores);
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

/* Add a listing for each store to the sidebar. */
function buildLocationList(stores) {
  for (const store of stores.features) {
    /* Add a new listing section to the sidebar. */
    const listings = document.getElementById('listings');
    const listing = listings.appendChild(document.createElement('li'));
    /* Assign a unique `id` to the listing. */
    listing.id = `listing-${store.properties.id}`;
    /* Assign the `item` class to each listing for styling. */
    listing.className = `item ${store.properties.tags}`;

    /* Add the link to the individual listing created above. */
    const link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.id = `link-${store.properties.id}`;
    link.innerHTML = `${store.properties.title}`;

    /* Add details to the individual listing. */
    const details = listing.appendChild(document.createElement('div'));
    details.innerHTML = `${store.properties.address}`;

    /**
    * Listen to the element and when it is clicked, do four things:
    * 1. Update the `currentFeature` to the store associated with the clicked link
    * 2. Fly to the point
    * 3. Close all other popups and display popup for clicked store
    * 4. Highlight listing in sidebar (and remove highlight for all other listings)
    **/
    link.addEventListener('click', function() {
      for (const feature of stores.features) {
        if (this.id === `link-${feature.properties.id}`) {
          flyToStore(feature);
          createPopUp(feature);
        }
      }
      const activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');
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
    zoom: 15
  });
}

/* Create a Mapbox GL JS `Popup`. */
function createPopUp(currentFeature) {
  const popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();
  const popup = new mapboxgl.Popup({
    closeOnClick: false
  })
  .setLngLat(currentFeature.geometry.coordinates)
  .setHTML(
    `
    <h3>${currentFeature.properties.title}</h3>
    <img style="display:${currentFeature.properties.img};" src="${currentFeature.properties.src}" width="100%">
    <h4>${currentFeature.properties.date}</h4>
    </a>
    `
  )
  .addTo(map);
}

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
