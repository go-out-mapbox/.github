function geoFindMe() {
  const getLocation = document.querySelector('#geolocation');
  getLocation.textContent = "";

  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    getLocation.innerHTML = `Latitude: ${latitude} °, Longitude: ${longitude} °<br/>Altitude Accuracy: ${accuracy} m`;

    const geolocation = {
      latitude : latitude,
      longitude : longitude,
      accuracy : accuracy
    }

    const geoJSON = JSON.stringify(geolocation);
    localStorage.setItem('geolocation', geoJSON);
    console.log('geolocation', geoJSON);
    const mapIframe = document.querySelector('#map');
    mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}&amp;layer=mapnik`;
  }

  function error() {
    getLocation.textContent = '現在地を取得できません Unable to retrieve your location';
  }

  if(!navigator.geolocation) {
    getLocation.textContent = '現在地を取得できません Geolocation is not supported by your browser';
  } else {
    getLocation.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
