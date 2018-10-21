/* (function main($) {
  let map;
  const origin = {};

  function getLocation(funct) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          origin.lat = position.coords.latitude;
          origin.lng = position.coords.longitude;
          map = new google.maps.Map(document.getElementById('gmaps-markers'), {
            zoom: 8,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });

          const marker = new google.maps.Marker({
            position: origin,
            map,
            title: 'user',
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          });
        },
        (error_message) => {
          alert('An error has occured while retrieving location ', error_message);
          ipLookUp();
        },
      );
    } else {
      alert('geolocation is not enabled on this browser');
      ipLookUp();
    }
  }
  getLocation();
  $(document).ready(() => {
    const $jsonFile = $('.map-json-file');
    const fd = new FormData();
    const $statusDiv = $('#markers-status');
    let file;
    $jsonFile.on('change', (e) => {
      [file] = e.target.files;
      fd.append('file', file, file.name);
    });

    $('.map-json-btn').click((err) => {
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
          locations.forEach((location, ind) => {
            const {
              lat,
            } = location;
            const {
              lng,
            } = location;
            const $elem = $(`<button class="status red">${location.city}</button>`);
            path.push({
              lat,
              lng,
            });
            let status = 0;
            const marker = new google.maps.Marker({
              position: {
                lat,
                lng,
              },
              map,
              icon: icons[status],
              title: location.state,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
            });

            const markerPos = marker.getPosition();
            // Set event to display the InfoWindow anchored to the marker when the marker is clicked.
            google.maps.event.addListener(marker, 'click', () => {
              // getLocation();


              const stat = status;
              if (status < 2) {
                status += 1;
              } else {
                status = 0;
              }
              marker.setIcon(icons[status]);
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

            const directionsService = new google.maps.DirectionsService();
            const directionsDisplay = new google.maps.DirectionsRenderer();


            directionsDisplay.setMap(map);
            const request = {
              origin,
              destination: {
                lat: markerPos.lat(),
                lng: markerPos.lng(),
              },
              travelMode: google.maps.TravelMode.DRIVING,
            };
            $elem.on('click', (event) => {
              // getLocation();

              const stat = status;
              if (status < 2) {
                status += 1;
              } else {
                status = 0;
              }

              marker.setIcon(icons[status]);
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

              setTimeout(() => {
                directionsService.route(request, (res, status) => {
                  console.log(status);
                  if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(res);
                  } else if (status === 'ZERO_RESULTS') {
                    alert('No Direction found');
                  } else if (status === 'REQUEST_DENIED') {
                    alert('Direction service blocked by webpage');
                  }
                });
              }, 3000);
            });
            $statusDiv.hide().append($elem).show();
          });
        },
        error: error => console.log(error),
      });
    });
  });
}(jQuery));
*/
(function Maps($) {
  function Map(options) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.markers = [];
    this.init(options);
    this.directionsDisplay.setMap(this.map);
  }
  Map.prototype.drawRoute = function drawRoute(request) {
    this.directionsService.route(request, (res, status) => {
      console.log(status);
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(res);
      } else if (status === 'ZERO_RESULTS') {
        alert('No Direction found');
      } else if (status === 'REQUEST_DENIED') {
        alert('Direction service blocked by webpage');
      }
    });
  };
  Map.prototype.init = function init(options) {
    this.map = new google.maps.Map(document.getElementById(options.div), {
      zoom: options.zoom,
      center: {
        lat: options.lat,
        lng: options.lng,
      },
    });
    return this;
  };

  Map.prototype.drawMarker = function drawMarker(options) {
    const that = this;
    const marker = new google.maps.Marker({
      position: {
        lat: options.lat,
        lng: options.lng,
      },
      map: that.map,
      title: options.title,
    });
    if (options.icon) {
      marker.setIcon(options.icon);
    }
    this.markers.push(marker);
    return marker;
  };

  function Location() {
    const that = this;
    return new Promise((resolve, reject) => {
      that.init().then((pos) => {
        resolve(pos);
      }).catch((err) => {
        if (typeof error === 'string') {
          alert(err);
        } else {
          alert(err.message);
        }
      });
    });
  }
  Location.prototype.init = function init() {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error_message) => {
            reject(error_message);
          },
        );
      } else {
        reject('geolocation is not enabled on this browser');
      }
    });
  };
  Location.prototype.ipLookUp = function ipLookUp() {
    return $.ajax('http://ip-api.com/json');
  };

  const location = new Location();

  let myMap;
  location.then((pos) => {
    myMap = new Map({
      div: 'gmaps-markers',
      zoom: 8,
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });

    myMap.drawMarker({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      title: 'user',
    });
  });


  $(document).ready(() => {
    const $jsonFile = $('.map-json-file');
    const fd = new FormData();
    const $statusDiv = $('#markers-status');
    let file;
    $jsonFile.on('change', (e) => {
      [file] = e.target.files;
      fd.append('file', file, file.name);

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
          locations.forEach((loc, ind) => {
            const {
              lat,
            } = loc;
            const {
              lng,
            } = loc;
            const $elem = $(`<button class="status red">${loc.city}</button>`);
            path.push({
              lat,
              lng,
            });
            let status = 0;

            const marker = myMap.drawMarker({
              lat,
              lng,
              icon: icons[status],
              title: loc.city,
            });

            const markerPos = marker.getPosition();
            let request = {
              origin: {
                lat,
                lng,
              },
              destination: {
                lat: markerPos.lat(),
                lng: markerPos.lng(),
              },
              travelMode: google.maps.TravelMode.DRIVING,
            };
            // Set event to display the InfoWindow anchored to the marker when the marker is clicked.
            google.maps.event.addListener(marker, 'click', () => {
              location.then((pos) => {
                request = {
                  origin: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  },
                  destination: {
                    lat: markerPos.lat(),
                    lng: markerPos.lng(),
                  },
                  travelMode: google.maps.TravelMode.DRIVING,
                };
                myMap.drawRoute(request);
              });
              const stat = status;
              if (status < 2) {
                status += 1;
              } else {
                status = 0;
              }
              marker.setIcon(icons[status]);
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

            $elem.on('click', (event) => {
              location.then((pos) => {
                location.then((pos) => {
                  request = {
                    origin: {
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude,
                    },
                    destination: {
                      lat: markerPos.lat(),
                      lng: markerPos.lng(),
                    },
                    travelMode: google.maps.TravelMode.DRIVING,
                  };
                  myMap.drawRoute(request);
                });
                myMap.drawRoute(request);
              });

              const stat = status;
              if (status < 2) {
                status += 1;
              } else {
                status = 0;
              }

              marker.setIcon(icons[status]);
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
        },
        error: error => console.log(error),
      });
    });
  });
}(jQuery));
