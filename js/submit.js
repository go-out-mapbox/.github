'use strict'

let mapPins = JSON.parse(localStorage.getItem("map")) || [];
const addPins = (geolocation, address, timestamp, comment) => {
  mapPins.push({
    geolocation,
    address,
    timestamp,
    comment
  })

  localStorage.setItem("sign", JSON.stringify(mapPins))
  return {geolocation, address, timestamp, comment}
}

// 投稿内容を取得する
const thisGeolocation = document.querySelector('#date #geolocation').textContent
const thisAddress = document.querySelector('#date address').textContent
const thisTime = document.querySelector('#date time').textContent
const thisComment = document.querySelector('#submit textarea').textContent

const submitForm = document.querySelector('#submit')
submitForm.addEventListener('submit', submitThis)

async function submitThis() {
  event.preventDefault();
  let thisPin = {
    geolocation : thisGeolocation,
    address : thisAddress,
    timestamp : thisTime,
    comment : thisComment
  };

  // localStorage に 投稿 を追加
  addPins(geolocation, address, timestamp, comment)

  const mappinsJSON = JSON.stringify(thisPin)
  let url = 'submit.php';
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: mappinsJSON
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
