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
      let center = [longitude, latitude];
    };

    // 現在位置を取得できなかった場合の処理
    function error() {
      let center = [135.50433479522678, 34.69699057458179];
    };

    // 現在位置を取得する
    navigator.geolocation.getCurrentPosition(success, error);

    map.flyTo({
      center: center,
      zoom: 15
    });
  }
});
