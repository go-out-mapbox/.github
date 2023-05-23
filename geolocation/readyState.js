'use strict'

function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch(e) {
    return e instanceof DOMException && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    ) && (storage && storage.length !== 0);
  }
}

if (!storageAvailable('localStorage')) {
  window.location.replace('/map/')
}
if (!'geolocation' in navigator) {
  window.location.replace('/map/')
}

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'interactive') {
    const title = document.querySelector('h1');
    const back = document.querySelector('#back');
    back.addEventListener('click', function () {
      location.assign('../');
    });
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
        bearing: 0,
        pitch: 60,
        zoom: 15
      });

      let marker = new mapboxgl.Marker({
        draggable: true,
        color: "red"
      })
      .setLngLat(center)
      .addTo(map);
    };

    // 現在位置を取得できなかった場合の処理
    function error() {
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
