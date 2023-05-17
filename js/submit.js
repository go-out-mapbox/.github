'use strict'

let array = JSON.parse(localStorage.getItem("map")) || [];
const addData = (geolocation, address, comment) => {
  array.push({
    geolocation,
    address,
    comment
  })

  localStorage.setItem("map", JSON.stringify(array))
  return {geolocation, address, comment, posted}
}

let thisTextarea = document.querySelector('#submit #comment');
let msg = document.querySelector('#date section');

// コメントを取得する
function preview(event){
  let text = thisTextarea.value;
  let textArray = text.split('\n');
  let thisComent = textArray.join('<br>');
  msg.innerHTML += `<p>${thisComent}</p>`;
}

thisTextarea.addEventListener('change', preview);


// 現在地を投稿する
const submitPin = document.querySelector('#submit')
submitPin.addEventListener('submit', submitThis)

async function submitThis() {
  event.preventDefault();
  const thisGeolocation = document.querySelector('#date #geolocation')
  const thisAddress = document.querySelector('#date address')

  let thisTextarea = document.querySelector('#submit #comment')
  let text = thisTextarea.value
  let textArray = text.split('\n')
  let thisComent = textArray.join('<br>')

  let thisPin = {
    geolocation : thisGeolocation.textContent,
    address : thisAddress.textContent,
    comment : thisComent
  };

  // localStorage に 投稿 を追加
  addData(geolocation, address, comment)

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
