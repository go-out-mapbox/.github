'use strict'

let array = JSON.parse(localStorage.getItem("map")) || [];
const addData = (geolocation, address, timestamp, comment) => {
  array.push({
    geolocation,
    address,
    comment,
    timestamp
  })

  localStorage.setItem("map", JSON.stringify(array))
  return {geolocation, address, comment, timestamp}
}

// 投稿内容を取得する
const thisGeolocation = document.querySelector('#date #geolocation')
const thisAddress = document.querySelector('#date address')
const thisComment = document.querySelector('#submit textarea')
let thisTime = new Date();

const submitPin = document.querySelector('#submit')
submitPin.addEventListener('submit', submitThis)

async function submitThis() {
  event.preventDefault();
  let thisPin = {
    geolocation : thisGeolocation.textContent,
    address : thisAddress.textContent,
    comment : thisComment.innerText,
    timestamp : thisTime
  };

  // localStorage に 投稿 を追加
  addData(geolocation, address, comment, timestamp)

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
