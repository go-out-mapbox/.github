map.on('load', () => {
  map.addSource('heard', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [135.7610870139788,35.003577397910576],
                [135.77127222646072,35.00395605842333],
                [135.77182001546186,34.99863256550397],
                [135.7695921021695,34.995663687378766],
                [135.76610542193487,34.99538439351177],
                [135.7610870139788,35.003577397910576]
              ]
            ]
          },
          'properties': {
            'title': '私（わたしたち）がビーエヌエーオルターミュージアムの周りで聞いた言葉',
            'date': '<a href="heard/bnaaltermuseum/">京都・河原町周辺で聞いた 55 の言葉</a>',
            'tags': 'heard',
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [135.41570459932808, 34.6444498906305],
                [135.40108965184288, 34.634712067653496],
                [135.4016286962231, 34.61486617414742],
                [135.46833474746012, 34.603447361713776],
                [135.47666421864864, 34.60006459036512],
                [135.49227968288875, 34.605819819360846],
                [135.50391050613052, 34.64546789712162],
                [135.49603212288486, 34.64744739591383],
                [135.41570459932808, 34.6444498906305]
              ]
            ]
          },
          'properties': {
            'title': '私（わたしたち）が音ビルの周りで聞いた言葉',
            'date': '<a href="heard/otobuilding/">大阪市住之江区全域と大正区・西成区の一部で聞いた 80 の言葉</a>',
            'tags': 'heard',
          }
        }
      ]
    }
  });

  map.addLayer({
    'id': 'heard',
    'type': 'fill',
    'source': 'heard',
    'layout': {},
    'paint': {
      'fill-color': '#CDCBCC',
      'fill-opacity': 0.7
    }
  });

  map.addLayer({
    'id': 'around',
    'type': 'line',
    'source': 'heard',
    'layout': {},
    'paint': {
      'line-color': '#fff',
      'line-width': 2
    }
  });

  // やるぞ ‼
  map.addSource('polygonPopup', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [135.4953517829611, 34.62702765533572],
                [135.4960245179385, 34.627339317979306],
                [135.50391050613052, 34.64546789712162],
                [135.48776750786493, 34.63920320769225],
                [135.48717317682286, 34.63879986177503],
                [135.48641471397286, 34.63357632592684],
                [135.4953517829611, 34.62702765533572]
              ]
            ]
          },
          'properties': {
            'title': 'やるぞ ‼',
            'date': '<a href="https://go-out-mapbox.github.io/do/" target="_blank" rel="nofollow noreferrer">go-out-mapbox.github.io/do/</a>',
          }
        }
      ]
    }
  });

  map.addLayer({
    'id': 'fillPolygon',
    'type': 'fill',
    'source': 'polygonPopup',
    'layout': {},
    'paint': {
      'fill-color': 'lemonchiffon',
      'fill-opacity': 0.75
    }
  });

  map.addLayer({
    'id': 'linePolygon',
    'type': 'line',
    'source': 'polygonPopup',
    'layout': {},
    'paint': {
      'line-color': 'lightskyblue',
      'line-width': 4
    }
  });

  map.on('click', 'fillPolygon', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`
      <strong>${e.features[0].properties.title}</strong>
      <p>${e.features[0].properties.date}</p>
      `)
    .addTo(map);
    map.flyTo({
      center: e.lngLat
    });
  });

  map.on('mouseenter', 'fillPolygon', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'fillPolygon', () => {
    map.getCanvas().style.cursor = '';
  });
});
