# Google-API-Places-Template

Application Start-up:

I Doing the following wil give the ability for the app to access your current geolocation

1. Go to Command-Prompt and `cd` to the location where the index.html file is.
2. Run the following command:
	>> python -m SimpleHTTPServer 8080
3. This starts a HTTP server on port 8080.
4. Now go to the browser and type in "127.0.0.1:8080"	
5. The application will load up.

OR

II  Doing the following will render the application without accessing your geolocation
1. Go the folder that contains index.html file.
2. Double click it. It will open in your default browser.



Functionalities Implemented using Google Places API:

1. Text Search of a location.
2. Auto-complete functionality for the search input.
3. Display of the search results in the form of cards in the search results window.
4. Clicking on the results card will display the places details of the place selected along with- Name, Phone number, Website, formatted address and its photo
5. Implementation of location markers after every search.
6. Updating the markers after every search and selecting the place from search results.
7. Geolocation identification.
8. Blank search check.
9. Empty results returned by search check.
10. Template based HTML design for the search results cards.

Libraries referred:
1. Google Places API and its Samples.
2. Use of Bootstrap libraries.
3. Use of jquery.tmpl.js for using templates