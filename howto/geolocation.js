function geoFindMe() {
  const myLocation = document.querySelector('#myLocation');
  myLocation.textContent = '';
  document.querySelector('#myBtn').style.display = "none"

  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    myLocation.innerHTML = `Latitude: ${latitude} °, Longitude: ${longitude} ° | Altitude Accuracy: ${accuracy} m`;

    const geolocation = {
      latitude : latitude,
      longitude : longitude,
      accuracy : accuracy
    }
    const gpsJSON = JSON.stringify(geolocation);
    localStorage.setItem('geolocation', gpsJSON);
    console.log('geolocation', gpsJSON);

    const mapIframe = document.createElement('iframe');
    mapIframe.name = 'mapIframe';
    mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}&amp;layer=mapnik`;
    mapIframe.style.position = "fixed";
    mapIframe.style.top = "0";
    mapIframe.style.left = "0";
    mapIframe.style.right = "0";
    mapIframe.style.zIndex = "0";
    mapIframe.style.mixBlendMode = "overlay";
    mapIframe.style.width = "100%";
    mapIframe.style.height = "100vh";
    mapIframe.style.border = "none";
    document.body.appendChild(mapIframe);

    const mapLink = document.createElement('button');
    mapLink.textContent = 'Link';
    document.querySelector('#map-link').appendChild(mapLink);

    mapLink.addEventListener('click', () => {
      open(`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`, '_blank');
      });
    }

    function error() {
      myLocation.textContent = 'Unable to retrieve your location';
    }

    if(!navigator.geolocation) {
      myLocation.textContent = 'Geolocation is not supported by your browser';
    } else {
      myLocation.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  document.querySelector('#myBtn').addEventListener('click', geoFindMe);
