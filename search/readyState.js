'use strict'

if (!'geolocation' in navigator) {
  window.location.replace('/map/')
}

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'interactive') {
    const back = document.querySelector('#back');
    back.addEventListener('click', function () {
      location.assign('../');
    });

    const datetime = document.querySelector('#datetime');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    datetime.value = now.toISOString().slice(0, -1);

    datetime.addEventListener('change', event => {
      let setTime = new Date(event.target.value).toString();
      document.querySelector('#timestamp').textContent = setTime;
      console.log(setTime)
    })
  } else if (event.target.readyState === 'complete') {
    // 現在位置を取得できた場合の処理
    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      thisLng.innerText = longitude;
      thisLat.innerText = latitude;

      let center = [longitude, latitude];
      map.flyTo({
        center: center,
        zoom: 17.5
      });

      let marker = new mapboxgl.Marker({
        draggable: true
      })
      .setLngLat(center)
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
            yourAddress.textContent = context;
          });
        }).catch(err => { console.log(err); });

        async function fetchData(_uri) {
          const res = await fetch(_uri);
          const data = await res;
          return data;
        };
      };

      marker.on('dragend', onDragEnd);
      onDragEnd();

      const submit = document.querySelector('#coordinates h1');
      submit.addEventListener('click', function () {
        ChangeHidden()
      });
    };

    // 現在位置を取得できなかった場合の処理
    function error() {
      document.querySelector('#coordinates h1').classList.remove('submit');

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
  }
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
