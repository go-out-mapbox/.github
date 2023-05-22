map.on('load', () => {
  // Add a data source containing GeoJSON data.
  map.addSource('heard', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            // These coordinates outline Maine.
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
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            // These coordinates outline Maine.
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
          }
        }
      ]
    }
  });

  // Add a new layer to visualize the polygon.
  map.addLayer({
    'id': 'heard',
    'type': 'fill',
    'source': 'heard', // reference the data source
    'layout': {},
    'paint': {
      'fill-color': '#CDCBCC',
      'fill-opacity': 0.7
    }
  });

  // Add a outline around the polygon.
  map.addLayer({
    'id': 'around',
    'type': 'line',
    'source': 'heard', // reference the data source
    'layout': {},
    'paint': {
      'line-color': '#fff',
      'line-width': 2
    }
  });
});
