'use strict'

// localStorage から 投稿 を取得
let array = JSON.parse(localStorage.getItem("map")) || [];
const addData = (title, address, date, timestamp) => {
  array.push({
    title,
    address,
    date,
    timestamp
  })

  localStorage.setItem("map", JSON.stringify(array))
  return {title, address, date, timestamp}
}


// 現在地を投稿する
submitForm.addEventListener('submit', submitThis)

async function submitThis() {
  event.preventDefault();

  // localStorage に 投稿 を追加する
  const thisGeolocation = yourHere.textContent
  const thisAddress = yourAddress.textContent

  const thisTXT = document.querySelector('#submit #comment');
  let text = thisTXT.value
  let textArray = text.split('\n')
  let thisDate = textArray.join('<br>')

  const thisTime = document.querySelector('#date section time').textContent

  addData(thisGeolocation, thisAddress, thisDate, thisTime)


  // PHP で CSVファイル に 投稿 を追加する
  let thisPin = {
    title : thisGeolocation,
    address : thisAddress,
    date : thisDate,
    timestamp : thisTime
  };

  const thisJSON = JSON.stringify(thisPin)
  let url = 'submit.php';
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: thisJSON
  })

  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  });

  setTimeout(() => {
    window.location.replace('/map/');
  }, 1000);
}
