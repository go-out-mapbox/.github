'use strict'

let array = JSON.parse(localStorage.getItem("map")) || [];
const addData = (geolocation, address, timestamp, comment) => {
  array.push({
    geolocation,
    address,
    timestamp,
    comment
  })

  localStorage.setItem("map", JSON.stringify(array))
  return {geolocation, address, timestamp, comment}
}

// 投稿内容を取得する
const thisGeolocation = document.querySelector('#date #geolocation')
const thisAddress = document.querySelector('#date address')
const thisTime = document.querySelector('#date time')
const thisComment = document.querySelector('#submit textarea')

const submitPin = document.querySelector('#submit')
submitPin.addEventListener('submit', submitThis)

async function submitThis() {
  event.preventDefault();
  let thisPin = {
    geolocation : thisGeolocation.textContent,
    address : thisAddress.textContent,
    timestamp : thisTime.textContent,
    comment : thisComment.textContent
  };

  // localStorage に 投稿 を追加
  addData(geolocation, address, timestamp, comment)

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
