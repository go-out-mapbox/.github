'use strict'

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'interactive') {
    const back = document.querySelector('#back');
    back.addEventListener('click', function () {
      location.assign('../')
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
        let coordinates = mapJSON[i].title;
        let thisAddress = mapJSON[i].address;
        let thisDate = mapJSON[i].date;
        let thisOn = mapJSON[i].timestamp;

        // #storage に 投稿ごとの id名を付けた li要素 を生成
        const storageLi = document.createElement('li');
        storageLi.id = `post-${i}`;
        storage.appendChild(storageLi);

        // li 要素内に 投稿を出力
        storageLi.innerHTML = `
        <h2>${coordinates}</h2><br/>
        <address>${thisAddress}</address>
        <p>${thisDate}</p>
        <time>${thisOn}</time>
        `
      };
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
