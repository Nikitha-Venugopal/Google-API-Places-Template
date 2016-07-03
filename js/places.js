

/*
The following is the script that calls the Google Places API Services and controls the view.
*/

/*Global Parameters*/
var map;
var currentLatlng;
var markerArr =[];
var service;

// The following function initializes the Map either based on GeoLocation or based on the hardcoded Lat Lng positions
function initMap() {   
  map = new google.maps.Map(document.getElementById('map-places'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 13
      });
  var origin_input = document.getElementById('search');
  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  google.maps.event.addListener(origin_autocomplete, 'place_changed', function() {
        initialize();
  });
     
  var infowindow = new google.maps.InfoWindow();
  currentLatlng = new google.maps.LatLng(-34.397,150.644); // Convert Lat Lng to Positions to create marker. This is the default Lat Long positions
   // Get the GeoLocation of the User if he permits it.
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
            handleLocationError(true, currentLatlng,infowindow);
  });
  } else {
          // Browser doesn't support Geolocation
         handleLocationError(false, currentLatlng,infowindow);
        }
      }

//The function handles Location Error
function handleLocationError(browserHasGeolocation, currentLatlng, infowindow) {
       createMarker(currentLatlng, "Your Location", infowindow);
}

//The following function allows presing "Enter" key from keyboard to start the search
$("#search").keyup(function(event){
    if(event.keyCode == 13){
        $("#searchButton").click();
    }
});

//The following function is responsible for returning searches after clicking the search button
function initialize() {       
    $('#places-list').empty(); 

    //Initialize the service for search      
    service = new google.maps.places.PlacesService(map);


    //Check for Empty Searches
    if(document.getElementById("search").value ===""){
       $('#places-list').empty();
       var noResultsDiv = $('<span class="initialSearchText"> Come On.. Its a Blank Search</span>');
       noResultsDiv.appendTo('#places-list');
    }
    else{
      //Performing the Google text search
      service.textSearch({
      location: currentLatlng,     
      query: document.getElementById("search").value
    }, callback);
    }
           
  }

//Callback function which gives back the list of search results
function callback(results, status) {

  //Update the markers
  deleteAllMarkers();
  
  //Create InfoWindows for markers
  var infowindow = new google.maps.InfoWindow();

  //Check for Zero Search Results
  if(status === "ZERO_RESULTS"){
    $('#places-list').empty();
    var noResultsDiv = $('<span class="initialSearchText"> Oops...NO Results ... Dont Give up Now.. Search Again</span>');
    noResultsDiv.appendTo('#places-list');
  }
  //Status is 200 OK
  else if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
        var loc = new google.maps.LatLng(results[i].geometry.location.lat(),results[i].geometry.location.lng());
        createMarker(loc, results[i].name,infowindow);       
    }
    var updatedPos = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
    };
    
    //Set the position of the map
    setMapOnAll(map);
    map.setCenter(updatedPos);

    //Call the draw place details which initializes the templates to display results
    drawPlaceDetails(results,infowindow);        
  }
}
// Sets the markers in their place:
function setMapOnAll(map) {
  for (var i = 0; i < markerArr.length; i++) {
    markerArr[i].setMap(map);
  }
}

//Delete all markers
function deleteAllMarkers(){
  setMapOnAll(null);
  markerArr =[];
}

//Use this function to display the results 
function drawPlaceDetails(results,infowindow){
  $('#places-list').empty();
  $("#places-list").append("<ul></ul>");
     for(var i=0; i<results.length; i++){
        var result = results[i];       
        var makeSelection = $("#places-template").tmpl(result);

        //Add Event Listener every places card displayed in the result area
        makeSelection[0].addEventListener('click',function(event){ 

            //The following request is made to get additional details for a given place
            var request = {reference: results[$(this).index()].reference};
            service = new google.maps.places.PlacesService(map);
            service.getDetails(request, function(details, status) {             
              $('#places-list').empty();        

              //If the place details have photos, then dynamically add them to the details div.
              //Else display a "No Image Avalable" message     
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
              }

              $("#places-list").append("<ul></ul>");

              //Check if Website and Phone numbers exist as a part of the search results.
              //If exists show them else display No information available
              if(details.website){
                 details.additionalWebsite = details.website.split("//")[1].split("/")[0];
              }
              else{
                details.additionalWebsite = "No Website Information";
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

//Creates the markers on the page after every search
function createMarker(place, placeName,infowindow) { 
  infowindow.close();       
        var marker = new google.maps.Marker({
          map: map,
          position: place
        });
  markerArr.push(marker);
  
  //Add Event Listener to show the name of the place on clicking the marker
  google.maps.event.addListener(marker, 'click', function() {         
    infowindow.setContent(placeName);
    infowindow.open(map, this);
  });
}

//The following function gets the photo url if photos do exist for the searched place
function getPhotoURL(photos){ 
  if(photos){
    return photos[0].getUrl({'maxWidth': 800, 'maxHeight': 150});     
  }
}
