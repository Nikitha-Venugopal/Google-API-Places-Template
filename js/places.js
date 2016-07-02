
/*Global Parameters*/
var map;
var currentLatlng;
var searchMode =false;

function initMap() {
   
       map = new google.maps.Map(document.getElementById('map-places'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 13
        });
    currentLatlng = new google.maps.LatLng(-34.397,150.644); // Convert Lat Lng to Positions to create marker
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
       currentLatlng = new google.maps.LatLng(pos.lat,pos.lng);
       createMarker(currentLatlng);
            
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, currentLatlng);
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, currentLatlng);
        }
      }

      function handleLocationError(browserHasGeolocation, currentLatlng) {
       createMarker(currentLatlng);
      }

$("#search").keyup(function(event){
    if(event.keyCode == 13){
        $("#searchButton").click();
    }
});

function initialize() {       
    searchMode = true;  
    $('#places-list > span').empty();   
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.textSearch({
      location: currentLatlng,     
      query: document.getElementById("search").value
    }, callback);       
  }

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(results.length);
          for (var i = 0; i < results.length; i++) {
            var loc = new google.maps.LatLng(results[i].geometry.location.lat(),results[i].geometry.location.lng());
            createMarker(loc);       
          }
       var updatedPos = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            };
      //currentLatlng = new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());
      map.setCenter(updatedPos);
      drawPlaceDetails(results);     
        
      }
  }

function drawPlaceDetails(results){
 $('#places-list > ul').empty();
     $("#places-list").append("<ul></ul>");
     for(var i=0; i<results.length; i++){
        var result = results[i];       
        var makeSelection = $("#places-template").tmpl(result);
        makeSelection[0].addEventListener('click',function(event){      
          console.log(results[$(this).index()]);
         });
        makeSelection.appendTo( "ul" );
      
  }
}
    function createMarker(place) {     
        var marker = new google.maps.Marker({
          map: map,
          position: place
        });
    
    //console.log(place);
    google.maps.event.addListener(marker, 'click', function() {
          infowindow = new google.maps.InfoWindow();
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }
function getPhotoURL(photos){
  alert("photos");
  if(photos){
    return photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35});     
  }
}
