(function main($) {
  $(document).ready(() => {
    const $jsonFile = $('.json-file');
    const fd = new FormData();
    const $statusDiv = $('#markers-status');
    let file;
    $jsonFile.on('change', (e) => {
      [file] = e.target.files;
      fd.append('file', file, file.name);
    });
    $('.json-btn').click((err) => {
      if (!file) {
        return alert('Please select a file');
      }

      $.ajax({
        url: 'http://localhost:3000/map',
        data: fd,
        contentType: false,
        cache: false,
        type: 'POST',
        method: 'POST',
        processData: false,
        success: (result) => {
          const locations = JSON.parse(result);
          const path = [];
          const map = new GMaps({
            div: '#gmaps-markers',
            lat: locations[3].latitude,
            lng: locations[3].longitude,
            zoom: 5,
          });

          const icons = [
            'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          ];

          const colors = [
            'red',
            'yellow',
            'green',
          ];

          locations.forEach((location) => {
            const $elem = $(`<button class="status red">${location.state}</button>`);
            path.push([location.latitude, location.longitude]);
            let status = 0;
            const mm = map.addMarker({
              lat: location.latitude,
              lng: location.longitude,
              title: location.state,
              icon: icons[status],
              click: (e) => {
                const stat = status;
                if (status < 2) {
                  status += 1;
                } else {
                  status = 0;
                }
                mm.setIcon(icons[status]);
                $elem.removeClass(colors[stat]).addClass(colors[status]);
                if (status === 1) {
                  $elem.css({
                    color: 'black',
                  });
                } else {
                  $elem.css({
                    color: 'white',
                  });
                }
              },
            });
            $elem.on('click', (event) => {
              const stat = status;
              if (status < 2) {
                status += 1;
              } else {
                status = 0;
              }

              mm.setIcon(icons[status]);
              $elem.removeClass(colors[stat]).addClass(colors[status]);
              if (status === 1) {
                $elem.css({
                  color: 'black',
                });
              } else {
                $elem.css({
                  color: 'white',
                });
              }
            });
            $statusDiv.hide().append($elem).show();
          });

          map.drawPolyline({
            path,
            strokeColor: '#ff0000',
            strokeOpacity: 0.6,
            strokeWeight: 6,
          });
        },
        error: error => console.log(error),
      });
    });
  });
}(jQuery));
