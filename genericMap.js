/**
 * Created by constantin.crismaru on 1/31/2017.
 */
var geoLocated = false,
    markers = [],
    instancesMarker = [];

function addMarkerOnMap(map, icon, pos, user, inArray) {
    if(!inArray) {
        var marker = new MarkerWithLabel({
                map: map,
                draggable: false,
                icon: icon,
                animation: google.maps.Animation.DROP,
                position: pos
            }),
            contentStringCal = null,
            infowindow = new google.maps.InfoWindow({});

        if(user == 'cosmin') {
            contentStringCal = '<div id="contentCal" class="iw-container">' +
                '<div class="iw-title"></div>' +
                '<div>' +
                '<div style="margin: 0 auto;">' +
                '<img src="cosmin.jpg" width="80" height="80">' +
                '</div>' +
                '</div>' +
                '<div class="profile_information">' +
                '<div><div style="margin: 0 auto">Crismaru Constantin</div></div>' +
                '</div>' +
                '</div>';
        } else {
            contentStringCal = '<div id="contentCal">' +
                '<div>' +
                '<div style="margin: 0 auto;">' +
                '<img src="ana.jpg" width="80" height="80">' +
                '</div>' +
                '</div>' +
                '<div class="profile_information">' +
                '<div><div style="margin: 0 auto">Ana Pascal</div></div>' +
                '</div>' +
                '</div>';
        }

       var newLen = markers.push(marker);
        instancesMarker.forEach(function(item){
           if(item.username === user) {
               item.instancePosition = newLen - 1;
           }
        });

        instancesMarker[newLen - 1].instancePosition = newLen - 1;

        google.maps.event.addListener(marker, 'mouseover', function() {
            //open the infowindow when it's not open yet
            if(contentStringCal!=infowindow.getContent())
            {
                infowindow.setContent(contentStringCal);
                infowindow.open(map,marker);
            }
        });

        google.maps.event.addListener(marker, 'click', function() {
            //when the infowindow is open, close it an clear the contents
            if(contentStringCal==infowindow.getContent())
            {
                infowindow.close(map,marker);
                infowindow.setContent('');
            }
            //otherwise trigger mouseover to open the infowindow
            else
            {
                google.maps.event.trigger(marker, 'mouseover');
            }
        });
        //clear the contents of the infwindow on closeclick
        google.maps.event.addListener(infowindow, 'closeclick', function() {
            infowindow.setContent('');
        });
        google.maps.event.addListener(infowindow, 'domready', function() {
            // Reference to the DIV that wraps the bottom of infowindow
            var iwOuter = $('.gm-style-iw');

            /* Since this div is in a position prior to .gm-div style-iw.
             * We use jQuery and create a iwBackground variable,
             * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
             */
            var iwBackground = iwOuter.prev();

            // Removes background shadow DIV
            iwBackground.children(':nth-child(2)').css({'display' : 'none'});

            // Removes white background DIV
            iwBackground.children(':nth-child(4)').css({'display' : 'none'});

            // Moves the infowindow 115px to the right.
            iwOuter.parent().parent().css({left: '115px'});

            // Moves the shadow of the arrow 76px to the left margin.
            iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

            // Moves the arrow 76px to the left margin.
            iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

            // Changes the desired tail shadow color.
            iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

            // Reference to the div that groups the close button elements.
            var iwCloseBtn = iwOuter.next();

            // Apply the desired effect to the close button
            iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});

            // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
            if($('.iw-content').height() < 140){
                $('.iw-bottom-gradient').css({display: 'none'});
            }

            // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
            iwCloseBtn.mouseout(function(){
                $(this).css({opacity: '1'});
            });
        });
    } else {
        var newPosition = {
            lat: 47.1566,
            lng: 27.5902
        };

        var instanceMarker = instancesMarker.find(function (instance) {
            return instance.username === user;
        });

        markers[instanceMarker.instancePosition].setPosition(newPosition);
    }
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function getLocation(map) {
    var infoWindow = new google.maps.InfoWindow({}),
        username = localStorage.getItem('username'),
        icon = {
            url: "icons/man.png",
            anchor: new google.maps.Point(25,50),
            scaledSize: new google.maps.Size(42,100)
        },
        icon2 = {
            url: "icons/female.png",
            anchor: new google.maps.Point(25,50),
            scaledSize: new google.maps.Size(42,100)
        };
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var circle = new google.maps.Circle({
                map: map,
                radius: 85,
                strokeColor: "#83b7c7",
                strokeOpacity: 0.8,
                fillOpacity: 0.35,
                strokeWeight: 2,
                fillColor: '#83b7c7',
                center: pos
            });

            map.setCenter(pos);

            if(geoLocated) {
                //deleteMarkers();
            }

            $.post( "backend/storeLocations.php", { user: username, lat: pos.lat, lng: pos.lng }, function( data ) {
                $.get( "backend/getLocations.php", function( data ) {
                    var response = JSON && JSON.parse(data) || $.parseJSON(data);

                    response.forEach(function (item){
                        if(item.user != username) {
                            var pos = {
                                lat: parseFloat(item.lat),
                                lng: parseFloat(item.lng)
                            };

                            var inArray = instancesMarker.some(function (instance) {
                                return instance.username === item.user;
                            });

                            if(!inArray) {
                                instancesMarker.push({
                                    username: item.user,
                                    instancePosition: null
                                });
                            }

                            if(item.user == 'cosmin') {
                                addMarkerOnMap(map, icon, pos, item.user, inArray);
                            } else {
                                addMarkerOnMap(map, icon2, pos, item.user, inArray);
                            }

                        }
                    });
                });
            });
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });

        geoLocated = true;

        $( ".loader_wrapper" ).hide();
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function initMap() {
    var styledMapType = new google.maps.StyledMapType(
        [
            {elementType: 'geometry', stylers: [{color: '#e8e8e8'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
            {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#faf7f0'}]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#faf7f0'}]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{color: '#faf7f0'}]
            },
            {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#e8e8e8'}]
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{color: '#d9d9d9'}]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#e0dfdc'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{color: '#c4d6a7'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#c4d6a7'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#d4d0c7'}]
            },
            {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{color: '#b8b8b8'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#f8c967'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#e9bc62'}]
            },
            {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
            },
            {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{color: '#db8555'}]
            },
            {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{color: '#806b63'}]
            },
            {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{color: '#6b6e6c'}]
            },
            {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{color: '#8f7d77'}]
            },
            {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#6b6e6c'}]
            },
            {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
            },
            {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{color: '#b9d3c2'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#92998d'}]
            },
            {
                elementType: 'labels',
                stylers: [{visibility: 'off'}]
            }
        ],
        {name: 'Styled Map'}),
     map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.1569485, lng: 27.589585100000032},
        zoom: 18,
        disableDefaultUI: true,
        scrollwheel: true,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
        }
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    setInterval(function() { getLocation(map); }, 10000000000);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

initMap();

