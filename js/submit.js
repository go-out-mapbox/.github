'use strict'

// localStorage に 位置情報 を 保存する
let array = JSON.parse(localStorage.getItem("map")) || [];
const addData = (longitude, latitude, address, date, timestamp) => {
  array.push({
    longitude,
    latitude,
    address,
    date,
    timestamp
  })
  localStorage.setItem("map", JSON.stringify(array))
  return {longitude, latitude, address, date, timestamp}
}

// 位置情報 を 投稿する
submitForm.addEventListener('submit', submitThis)
async function submitThis() {
  event.preventDefault()

  // localStorage に 投稿 を 追加する
  const thisLongitude = document.querySelector('#longitude').textContent,
  thisLatitude = document.querySelector('#latitude').textContent,
  thisAddress = yourAddress.textContent.replace(/,"/g,"");

  const thisTXT = document.querySelector('#submit #comment');
  let text = thisTXT.value.replace(/\"/g,""),
  textArray = text.split('\n'),
  thisDate = textArray.join('<br>');

  const thisTime = document.querySelector('#timestamp').textContent
  addData(thisLongitude, thisLatitude, thisAddress, thisDate, thisTime)

  // PHP で CSVファイル に 投稿 を追加する
  let thisPin = {
    longitude : thisLongitude,
    latitude : thisLatitude,
    address : thisAddress,
    date : thisDate,
    timestamp : thisTime
  };

  const thisJSON = JSON.stringify(thisPin)
  let url = 'submit.php'
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
  })

  setTimeout(() => {
    window.location.replace('/map/profile/')
  }, 1000)
}
