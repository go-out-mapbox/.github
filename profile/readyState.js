'use strict'

function flyToStore(longitude, latitude) {
  map.flyTo({
    center: [longitude, latitude],
    zoom: 15,
    essential: true
  });
}

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'interactive') {
    const title = document.querySelector('h1');

    // localStorage から 最新の現在地 を取得
    if(localStorage.getItem('geolocation')) {
      const geoJSON = JSON.parse(localStorage.getItem('geolocation'));
      let longitude = geoJSON.longitude;
      let latitude = geoJSON.latitude;
      let accuracy = geoJSON.accuracy;
      let timestamp = geoJSON.timestamp;

      let center = [longitude, latitude];
      map.flyTo({
        center: center
      });

      title.innerHTML = `
      <u>Your Device's Last Known Location</u><br/>
      <b>${longitude}</b>,
      <b>${latitude}</b><br/>
      <small>${timestamp}</small>
      `

      // li 要素を クリックすると 投稿した位置に地図の中心が移動
      title.addEventListener('click', () => {
        flyToStore(longitude, latitude);
      })
    } else {
      title.innerHTML = `
      <u>Web Storage API</u><br/>
      <b>The Location Infometions of Your Device's</b>
      `
    }

    const back = document.querySelector('#back');
    back.addEventListener('click', function () {
      location.assign('../');
    })

    async function readmeMD() {
      fetch('README.md')
      .then(response => response.text())
      .then(innerText => {
        document.querySelector('#readme section').innerText = innerText;
      });
    }
    readmeMD();
  } else if (event.target.readyState === 'complete') {
    const storage = document.querySelector('#storage');
    const storageOl = document.querySelector('#storage ol');

    // localStorage から 投稿 を取得
    if(localStorage.getItem('map')) {
      const mapJSON = JSON.parse(localStorage.getItem('map'));
      for (let i = 0; i < mapJSON.length; i++) {
        let thisLongitude = mapJSON[i].longitude;
        let thisLatitude = mapJSON[i].latitude;
        let thisAddress = mapJSON[i].address;
        let thisDate = mapJSON[i].date;
        let thisOn = mapJSON[i].timestamp;

        // #storage に 投稿ごとの id名を付けた li要素 を生成
        const storageLi = document.createElement('li');
        storageLi.id = `log-${i}`;
        storageOl.appendChild(storageLi);

        // li 要素内に 投稿を出力
        storageLi.innerHTML = `
        <h2>${thisLongitude}, ${thisLatitude}</h2><br/>
        <address>${thisAddress}</address>
        <p>${thisDate}</p>
        <time>${thisOn}</time>
        `

        // li 要素を クリックすると 投稿した位置に地図の中心が移動
        storageLi.addEventListener('click', () => {
          flyToStore(thisLongitude, thisLatitude);
        })
      };
    } else {
      // まだ投稿がない場合、#storage を 削除
      storage.remove()
    }
  }
});
