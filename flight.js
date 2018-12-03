var map;
var marker;
function initMap(){
     map = new google.maps.Map(document.getElementById('map'),{
         center: {lat: 34, lng: -97.644},
         zoom:4
     });
 };

document.addEventListener("DOMContentLoaded", function(event){
    document.getElementById('button').addEventListener('click', removeAll);
    var flightPoints = [];
    var distancePoints = [];

$('.autocomplete').autocomplete({ // uses api lib to retrieve and display airport
     source: function(request,response) {
         $.ajax({
             url:"https://www.air-port-codes.com/search",
             jsonp: "callback",
             dataType:"jsonp",
             data: {
                 term: request.term,
                 limit: 100,
                 size: 0,
                 key: "dfa4a1b831", //key form api
                 secret:"ada2f00f3152682" //key form api
         },

            success: function(data) {
                if (data.status) {
                    response(data.airports.filter(function  (airport) {
                        return airport.country.iso === "US" && airport.latitude !== null;
                    }).map(function(ap){
                        return {
                        label: ap.name,
                        state: ap.state.abbr,
                        LatLng: {
                            lat: parseFloat(ap.latitude),
                            lng: parseFloat(ap.longitude)
                            }
                        }
                    }));
                } else {response();}
            }
        });
    },
    select: function(event, selected){
        setMarker(selected, distancePoints, flightPoints);
     }
 });

function setMarker(selectedClick,dPoints,fPoints){
        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: selectedClick.item.LatLng,
            coor:{
                lat: selectedClick.item.LatLng.lat,
                lng: selectedClick.item.LatLng.lng
                },
            label: selectedClick.item.label
        });
    dPoints.push(marker.position);
    fPoints.push(marker.coor);
    createFlightPath(fPoints, dPoints, marker);
    };


    function removeAll() {
        flightPoints = [];
        distancePoints = [];
        initMap();
        clearInputs();
        document.getElementById("distance").textContent="0"
        distance = 0;
        flightPath = 0;
    };
    function clearInputs(){
       document.getElementById('autocomplete1').value="";
       document.getElementById('autocomplete2').value="";
    };

    function convertToSeaMiles(dist){
        return Math.round(dist / 1000 * 0.539957 *10)/10
    };

    function createFlightPath(fPoints, dPoints,m) {
        if(fPoints.length <= 1){
            //Do nothing
        }
        else if(fPoints.length == 2){
            var distance = google.maps.geometry.spherical.computeDistanceBetween(dPoints[0],dPoints[1]);
            document.getElementById('distance').textContent=convertToSeaMiles(distance);
            var flightPath = new google.maps.Polyline({
                map: map,
                path: fPoints,
                geodesic: true,
                strokeColor: 'FF0000',
                strokeOpacity: 1.0,
                strokeWeight:2
            });
        }else {
            var reset = confirm("Would you like to reset the form and check again?")
            if(reset != true){
                m.setMap(null);
            }else{
                removeAll();
            }
        }
    };
});
