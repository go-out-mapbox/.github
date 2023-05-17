'use strict'

// 現在地を取得する
function geoFindMe() {
  function success(position) {
    // 緯度経度を変数に代入
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    yourHere.textContent = `${longitude},${latitude}`;

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
    yourHere.textContent = 'Unable to retrieve your location';
    yourAddress.textContent = `現在地を取得できませんでした`;
    dateSection.textContent = "";
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";

    submitForm.remove();
    ChangeHidden()
  }

  if(!navigator.geolocation) {
    yourHere.textContent = 'Geolocation is not supported by your browser';
    yourAddress.textContent = `このブラウザは現在地を取得できません`;
    dateSection.textContent = "";
    mapbox.style.pointerEvents = "auto";
    mapbox.style.userSelect = "auto";

    submitForm.remove();
    ChangeHidden()
  } else {
    yourHere.textContent = 'Locating…';
    yourAddress.textContent = `現在地を取得中`;
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
  yourHere.textContent = `${geolocation.longitude},${geolocation.latitude}`;
  yourAddress.textContent = `Last Time You Visited Here ${geolocation.timestamp}`;

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


// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
