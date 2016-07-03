
/*Global Parameters*/
var map;
var currentLatlng;
var searchMode =false;
var markerArr =[];
var service;

function initMap() {
   
       map = new google.maps.Map(document.getElementById('map-places'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 13
        });
       var infowindow = new google.maps.InfoWindow();
    currentLatlng = new google.maps.LatLng(-34.397,150.644); // Convert Lat Lng to Positions to create marker
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
       currentLatlng = new google.maps.LatLng(pos.lat,pos.lng);
       createMarker(currentLatlng, "Your Location",infowindow);
            
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
       createMarker(currentLatlng, "Your Location", infowindow);
      }

$("#search").keyup(function(event){
    if(event.keyCode == 13){
        $("#searchButton").click();
    }
});

function initialize() {       
    searchMode = true;  
    $('#places-list').empty();       
    service = new google.maps.places.PlacesService(map);
    service.textSearch({
      location: currentLatlng,     
      query: document.getElementById("search").value
    }, callback);       
  }

      function callback(results, status) {
        deleteAllMarkers();
        var infowindow = new google.maps.InfoWindow();
        if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(results.length);
          for (var i = 0; i < results.length; i++) {
            var loc = new google.maps.LatLng(results[i].geometry.location.lat(),results[i].geometry.location.lng());
            createMarker(loc, results[i].name,infowindow);       
          }
       var updatedPos = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            };
      
      setMapOnAll(map);
      map.setCenter(updatedPos);
      drawPlaceDetails(results,infowindow);     
        
      }
  }
// Sets the markesr in their place:
function setMapOnAll(map) {
        for (var i = 0; i < markerArr.length; i++) {
          markerArr[i].setMap(map);
        }
      }
function deleteAllMarkers(){
  setMapOnAll(null);
  markerArr =[];
}

function drawPlaceDetails(results,infowindow){
 $('#places-list').empty();
     $("#places-list").append("<ul></ul>");
     for(var i=0; i<results.length; i++){
        var result = results[i];       
        var makeSelection = $("#places-template").tmpl(result);
        makeSelection[0].addEventListener('click',function(event){ 

            //The following request is made to get additional details for a given place
            var request = {reference: results[$(this).index()].reference};
            service = new google.maps.places.PlacesService(map);
             service.getDetails(request, function(details, status) {
                console.log(details);
                      
              $('#places-list').empty();             
              if(details.photos){
                var photo = getPhotoURL(details.photos);            
                var img = $('<img id="dynamic" class="resizeImage" alt= \'images/NoImage.png\'>'); 
                img.attr('src', photo);
                img.appendTo('#places-list');
              }
              else{
                var img = $('<img id="dynamic" class="resizeNoImage">'); 
                img.attr('src', "images/NoImage.png");
                img.appendTo('#places-list');
                /*$("#places-list").append("<ul></ul>");
                details.website = details.website.split("//");
                $("#places-details-template").tmpl(details).appendTo("ul");*/
              }

              $("#places-list").append("<ul></ul>");
              if(details.website){
                 details.website = details.website.split("//")[1].split("/")[0];
              }
              else{
                details.website = "No Website Information";
              }

              if(!details.formatted_phone_number){
                 details.formatted_phone_number = "No Information Available";
              }              

              $("#places-details-template").tmpl(details).appendTo("ul");

              //Set the marker to the selected place and redraw the map:
              deleteAllMarkers();
              var loc = new google.maps.LatLng(details.geometry.location.lat(),details.geometry.location.lng());
              createMarker(loc, details.name,infowindow);    
              setMapOnAll(map);     

              });        
          });
        makeSelection.appendTo( "ul" );      
  }
}

    function createMarker(place, placeName,infowindow) { 
    infowindow.close();       
        var marker = new google.maps.Marker({
          map: map,
          position: place
        });
    markerArr.push(marker);
    //console.log(place);
    google.maps.event.addListener(marker, 'click', function() {
         
          
          infowindow.setContent(placeName);
          infowindow.open(map, this);
        });
      }
function getPhotoURL(photos){
 
  if(photos){
    return photos[0].getUrl({'maxWidth': 800, 'maxHeight': 150});     
  }
}
