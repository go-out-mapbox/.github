'use strict'

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'interactive') {
    const title = document.querySelector('h1');

    // localStorage から 最新の現在地 を取得
    if(localStorage.getItem("geolocation")) {
      const geoJSON = JSON.parse(localStorage.getItem('geolocation'));
      let latitude = geoJSON.latitude;
      let longitude = geoJSON.longitude;
      let accuracy = geoJSON.accuracy;
      let timestamp = geoJSON.timestamp;

      let center = [geoJSON.longitude, geoJSON.latitude];
      map.flyTo({
        center: center
      });

      title.innerHTML = `
      <u>Your Device's Location Infomations</u><br/>
      <b>${latitude}</b>,
      <b>${longitude}</b><br/>
      <small>${timestamp}</small>
      `
    } else {
      title.innerHTML = `
      <u>Web Storage API</u><br/>
      <b>Your Device's Location Infomations</b><br/>
      <small>あなたのデバイスのウェブストレージに記録されたあなたの位置情報</small>
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
  }

  else if (event.target.readyState === 'complete') {
    const storage = document.querySelector('#storage');

    // localStorage から 投稿 を取得
    if(localStorage.getItem("map")) {
      const mapJSON = JSON.parse(localStorage.getItem('map'));
      for (let i = 0; i < mapJSON.length; i++) {
        let thisLongitude = mapJSON[i].longitude;
        let thisLatitude = mapJSON[i].latitude;
        let thisAddress = mapJSON[i].address;
        let thisDate = mapJSON[i].date;
        let thisOn = mapJSON[i].timestamp;

        // #storage に 投稿ごとの id名を付けた li要素 を生成
        const storageLi = document.createElement('li');
        storageLi.id = `post-${i}`;
        storageLi.setAttribute('date-lng', thisLongitude);
        storageLi.setAttribute('date-lat', thisLatitude);
        storage.appendChild(storageLi);

        // li 要素内に 投稿を出力
        storageLi.innerHTML = `
        <h2>${thisLongitude}, ${thisLatitude}</h2><br/>
        <address>${thisAddress}</address>
        <p>${thisDate}</p>
        <time>${thisOn}</time>
        `
      };

      const storageAll = document.querySelectorAll('#storage li');
      storageAll.forEach(storageEach => {
        storageEach.addEventListener('click', function () {
          let thisLng = storageEach.dataset.longitude
          let thisLat = storageEach.dataset.latitude
          map.flyTo({
            center: [thisLng, thisLat],
            zoom: 11.11
          });
        });
      });
    } else {
      // まだ投稿がない場合、#storage に li要素 を生成
      const storageLi = document.createElement('li');
      storage.appendChild(storageLi);

      // li 要素内に HTML を出力
      storageLi.innerHTML = `
      <h2>No Posts Yet</h2>
      <p>投稿はまだありません</p>
      `
    }
  }
});
