'use strict'

if(!localStorage.getItem('yourInfo')) {
  // アイテムが存在しない場合に実行する文
  errorMD();
  title.remove();
  enter.remove();
  submitButton.remove();
  submitDetails.remove();
  mapbox.style.pointerEvents = "auto";
  mapbox.style.userSelect = "auto";
}

// 現在地を取得する
function geoFindMe() {
  function success(position) {
    // 緯度経度を変数に代入
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    yourHere.innerHTML = `
    <span id="longitude">${longitude}</span>,
    <span id="latitude">${latitude}</span>
    `;

    // 緯度経度から住所を検索
    let uri = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?language=ja&access_token=${mapboxgl.accessToken}`;
    fetchData(uri).then(function(response){ return response.text().then(function(jsonStr){
      var data = JSON.parse(jsonStr);
      var context = data.features[0].place_name;
      yourAddress.textContent = context;
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
      zoom: 20
    });

    // ローカルストレージへ現在地を記録
    let date = new Date();
    const geolocation = {
      latitude : latitude,
      longitude : longitude,
      accuracy : accuracy,
      timestamp : date
    };

    const geoJSON = JSON.stringify(geolocation);
    localStorage.setItem("geolocation", geoJSON);
    console.log("geolocation", geoJSON);

    dateSection.innerHTML = `<p class="goout"><time>${date}</time></p>`;
    enter.textContent = "You Are Here";
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";

    indexHTML();
    ChangeHidden();
  }

  function error() {
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";
    yourHere.textContent = 'Unable to retrieve your location';
    yourAddress.textContent = '現在地を取得できませんでした';
    errorMD();
    enter.remove();
    submitButton.remove();
    submitDetails.remove();
    ChangeHidden();
  }

  if(!navigator.geolocation) {
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";
    yourHere.textContent = 'Geolocation is not supported by your browser';
    yourAddress.textContent = 'このブラウザは現在地を取得できません';
    errorMD();
    enter.remove();
    submitButton.remove();
    submitDetails.remove();
    ChangeHidden();
  } else {
    mapbox.style.pointerEvents = "none";
    mapbox.style.userSelect = "none";
    yourHere.textContent = 'Locating…';
    yourAddress.textContent = '現在地を取得中';
    dateSection.textContent = '';
    navigator.geolocation.getCurrentPosition(success, error);

    title.style.opacity = "0";
    setTimeout(() => {
      title.remove();
    }, 2500)
  }
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
}


document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'interactive') {
    /* ローカルストレージに現在地の記録があるかを確認 */
    if(localStorage.getItem("geolocation")) {
      const geolocation = JSON.parse(localStorage.getItem("geolocation"));
      yourHere.innerHTML = `
      <span id="longitude">${geolocation.longitude}</span>,
      <span id="latitude">${geolocation.latitude}</span>
      `;
      yourAddress.textContent = `Your Device's Last Known Location ${geolocation.timestamp}`

      let center = [geolocation.longitude, geolocation.latitude];
      map.flyTo({
        center: center
      })
    };

    const submitClose = document.querySelector('#submit #close')
    submitClose.addEventListener('click', function () {
      const geolocation = JSON.parse(localStorage.getItem("geolocation"))
      let center = [geolocation.longitude, geolocation.latitude];
      map.flyTo({
        center: center,
        zoom: 11.11
      })
    })
  } else if (event.target.readyState === 'complete') {
    // 地図にマーカーを追加
    map.on('load', () => {
      map.addSource('places', {
        'type': 'geojson',
        'data': stores
      })
      addMarkers()
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
        .addTo(map);

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
  }
});
