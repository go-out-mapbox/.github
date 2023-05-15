'use strict'

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'loading') {
    // 文書の読み込み中に実行する
  }

  else if (event.target.readyState === 'interactive') {
  }

  else if (event.target.readyState === 'complete') {
    const enterBtn = document.querySelector('#enter')
    const mapIframe = document.querySelector('#map')
    if(!localStorage.getItem('yourInfo')) {
      enterBtn.innerText = 'Members Only'
      enterBtn.classList.add('goout')
      enterBtn.addEventListener('click', function () {
        mapIframe.src = "members.html"
      })
    } else {
      enterBtn.innerText = "現在地を取得"
      enterBtn.classList.add('relax')
      enterBtn.addEventListener('click', function () {
        geoFindMe()
      })
    }
  }
});
