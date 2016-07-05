function init() {
	document.addEventListener('deviceready', onDeviceReady, false);
}
	var db;
	var username;
	var token;
	var showMyPositionOnMap;
	
function onDeviceReady() {
		
	db = window.openDatabase("floc_db", "1.0", "floc_db", 100000);
	db.transaction(setup, errorHandler, dbReady);
	db.transaction(getCredentials, errorHandler, getCredentialsSuccess);
}

function setup(tx) {
	tx.executeSql('create table if not exists credentials(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, username TEXT, token TEXT, created_at DATE)');
}

function getCredentials(tx) {
	tx.executeSql('SELECT * FROM credentials', [], querySuccess, errorHandler);
}

function errorHandler(e) {
	navigator.notification.alert(e.message);
}

function successHandler() {  
}

function getCredentialsSuccess() {  
}

function dbReady() {
}

	
function checkDb() {
	db.transaction(queryDb, errorHandler);
}

function deleteDb() {
	db.transaction(function delDB(tx){
    tx.executeSql('DELETE FROM credentials');}, errorHandler);
}

function queryDb(tx) {
	tx.executeSql('SELECT * FROM credentials', [], querySuccess, errorHandler);
}
	
function alertCallback() {
}
	
function querySuccess(tx, results) {
 
	if (results.rows.length == 0) 
	{
		return true;
	}
	else 
	{
		var name = String(results.rows.item(0).name);
		username = String(results.rows.item(0).username);
		token = String(results.rows.item(0).token);
		tokenLogin(name, username, token);
		$.mobile.changePage("#menu", {transition:"slide"});
		return true;	
	}

}

function login()
{
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    if(username == "")
    {
        navigator.notification.alert("Please enter username", null, "Username Missing", "OK");
        return;
    }

    if(password == "")
    {
        navigator.notification.alert("Please enter password", null, "Password Missing", "OK");  
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://flocfloc.herokuapp.com/app_signin", true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	var postContent = "username="+encodeURIComponent(username)+"&password="+encodeURIComponent(password);
    xhr.send(postContent); 
    xhr.onload = function(){
        if(xhr.responseText == "false")
        {
            navigator.notification.alert("Wrong Username and Password", null, "Wrong Creds", "Try Again");
        }
        else 
        {
			var credentials = xhr.responseText.substring(1, xhr.responseText.length-1).split(" ");
			
			navigator.notification.alert("You are logged in as "+credentials[0]+"!", null, "Welcome", "Continue");
			
			db.transaction(function(tx) {
			var name = credentials[0];
			username = credentials[1];
			token = credentials[2];
			var date = new Date();
			tx.executeSql('INSERT INTO credentials(name, username, token, created_at) VALUES (?, ?, ?, ?)', [name, username, token, date.getTime()]);
			}, errorHandler, successHandler);
            $.mobile.changePage("#menu", {transition:"slide"});
        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});
}

function tokenLogin(name, username, token)
{
	
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://flocfloc.herokuapp.com/token_signin", true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	var postContent = "username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token);
	
    xhr.send(postContent); 
	
    xhr.onload = function()
	{

        if(xhr.responseText == "false")
        {
            navigator.notification.navigator.notification.alert("Token expired!", null, "Wrong Creds", "Login Again");
			return;
        }
        else 
        {
			var credentials = xhr.responseText.substring(1, xhr.responseText.length-1).split(" ");
			var responseUsername = credentials[1];
			if (responseUsername == username)
			{ 
				navigator.notification.alert("You are logged in as "+credentials[0]+"!", null, "Welcome", "Continue");
				return;
			}
			return;
        }
    };  
	return;
}

function register()
{
	var name = document.getElementById("name").value;
	var country = document.getElementById("country").value;
	var email = document.getElementById("email").value;
	var webpage = document.getElementById("webpage").value;
    var password = document.getElementById("password2").value;
    var password_confirmation = document.getElementById("password_confirmation").value;
	

    if(name == "")
    {
        navigator.notification.alert("Please enter username", null, "Username Missing", "OK");
        return;
    }
	
	if(country == "")
    {
        navigator.notification.alert("Please enter country", null, "Country Missing", "OK");
        return;
    }
	
	if(email == "")
    {
        navigator.notification.alert("Please enter email", null, "Email Missing", "OK");
        return;
    }

	if(password == "")
    {
        navigator.notification.alert("Please enter password", null, "Password Missing", "OK");  
        return;
    }
	
    if(password != password_confirmation)
    {
        navigator.notification.alert("Password and Password confirmation must match!", null, "Password error", "OK");  
        return;
    }
	


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://flocfloc.herokuapp.com/app_signup", true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	var postContent = "name="+encodeURIComponent(name)+"&country="+encodeURIComponent(country)+"&email="+encodeURIComponent(email)+"&webpage="+encodeURIComponent(webpage)+"&password="+encodeURIComponent(password)+"&password_confirmation="+encodeURIComponent(password_confirmation);
    xhr.send(postContent); 
    xhr.onload = function(){
        if(xhr.responseText == "false")
        {
            navigator.notification.alert("Wrong Username and Password", null, "Wrong Creds", "Try Again");
        }
        else 
        {
			var credentials = xhr.responseText.substring(1, xhr.responseText.length-1).split(" ");
			
			navigator.notification.alert("You are logged in as " + credentials[0] + "!", null, "Welcome", "Continue");
			
			db.transaction(function(tx) {
			var name = credentials[0];
			var username = credentials[1];
			var token = credentials[2];
			var date = new Date();
			tx.executeSql('INSERT INTO credentials(name, username, token, created_at) VALUES (?, ?, ?, ?)', [name, username, token, date.getTime()]);
			}, errorHandler, successHandler);
			
            $.mobile.changePage("#menu", {transition:"slide"});
        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});
}


function goto_menu()
{
	$.mobile.changePage("#menu", {transition:"slide"});
}

function goto_login()
{
	$.mobile.changePage("#login", {transition:"slide"});
}

function goto_register()
{
	$.mobile.changePage("#register", {transition:"slide"});
}

function goto_addLocation()
{
	$.mobile.changePage("#add_location", {transition:"slide"});
	initMap();
}

function goto_browseLocations()
{
	$.mobile.changePage("#browse_locations", {transition:"slide"});
	initMap();
}

function goto_myLocations()
{
	$.mobile.changePage("#my_locations", {transition:"slide"});
	getMyLocations();
	
}

function logOut()
{	
	deleteDb();	
	$.mobile.changePage("#login", {transition:"slide"});
	navigator.notification.alert("You are now logged out", null, "Logged out", "Continue");
}

function closeLocation()
{
		goto_browseLocations();	
	document.getElementById('show_loc_name').innerHTML = "";
    document.getElementById('show_loc_desc').innerHTML = "";
    document.getElementById('show_loc_geo').innerHTML = "";
    document.getElementById('images-preview').innerHTML = "";	

}

function getMyPosition() 
{
    navigator.geolocation.getCurrentPosition(positionSuccess, errorHandler);
}

function positionSuccess(position)
{
	showMyPositionOnMap(position);
}


function saveLocation()
{
	
	var loc_name = document.getElementById("loc_name").value;
	var loc_desc = document.getElementById("loc_desc").value;
	var loc_geo = document.getElementById("loc_geo").value;
	var loc_tags = document.getElementById("loc_tags").value;
    var loc_electricity = document.getElementById("loc_electricity").checked;
    var loc_open = document.getElementById("loc_open").checked;
    var loc_public = document.getElementById("loc_public").checked;
	var image1 = document.getElementById("image1").value;
	var image2 = document.getElementById("image2").value;
	var image3 = document.getElementById("image3").value;
	var loc_latitude = document.getElementById("loc_latitude").value;
	var loc_longitude = document.getElementById("loc_longitude").value;
	
    if(loc_name == "")
    {
        navigator.notification.alert("Please enter location name", null, "Name missing", "OK");
        return;
    }
	
	if(loc_desc == "")
    {
        navigator.notification.alert("Please enter description", null, "Description missing", "OK");
        return;
    }
	
	if(loc_geo == "")
    {
        navigator.notification.alert("Please enter Adress", null, "Adress missing", "OK");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://flocfloc.herokuapp.com/app_add_location", true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	var postContent = "username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token)+"&name="+encodeURIComponent(loc_name)+"&desc="+encodeURIComponent(loc_desc)+"&geo="+encodeURIComponent(loc_geo)+"&tag_list="+encodeURIComponent(loc_tags)+"&electricity="+encodeURIComponent(loc_electricity)+"&open="+encodeURIComponent(loc_open)+"&public="+encodeURIComponent(loc_public)+"&latitude="+encodeURIComponent(loc_latitude)+"&longitude="+encodeURIComponent(loc_longitude)+"&image1="+encodeURIComponent(image1)+"&image2="+encodeURIComponent(image2)+"&image3="+encodeURIComponent(image3);
    xhr.send(postContent); 
    xhr.onload = function(){
        if(xhr.responseText == "false")
        {
            navigator.notification.alert("Adding location failed", null, "Fail", "Try Again");
        }
        else 
        {
			
			navigator.notification.alert("Your location " + loc_name + " was succesfully saved!", null, "Location saved!", "OK");
			$.mobile.changePage("#menu", {transition:"slide"});
			document.getElementById("loc_name").value = "";
			document.getElementById("loc_desc").value = "";
			document.getElementById("loc_geo").value = "";
			document.getElementById("loc_tags").value = "";
			document.getElementById("loc_electricity").checked =  false;
			document.getElementById("loc_open").checked = false;
			document.getElementById("loc_public").checked = false;
			document.getElementById("image1").value = "";
			document.getElementById("image2").value = "";
			document.getElementById("image3").value = "";
			document.getElementById("loc_latitude").value = "";
			document.getElementById("loc_longitude").value = "";
			return;

        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});

}


function getImage() 
{
            navigator.camera.getPicture(savePhoto, function(message) {
			navigator.notification.alert('Picture upload canceled', null, "", "Continue");

		},{
			quality: 50, targetWidth: 800, targetHeight: 600,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
		}
            );
 
}



function savePhoto(imageURI) 
{
	
	var image1 = document.getElementById('image1');
	var image2 = document.getElementById('image2');
	var image3 = document.getElementById('image3');
	

		
	if (image1.value == "")
	{		

		var div = document.getElementById('picPreviewsInfo');
		div.innerHTML = '(Click photo to delete it.)' + div.innerHTML;
		
		image1.value = imageURI;

		document.getElementById('image1_prev').src = "data:image/jpeg;base64," + imageURI;
		return;
	}
	
	if (image2.value == "")
	{
		image2.value = imageURI;
		document.getElementById('image2_prev').src = "data:image/jpeg;base64," + imageURI;
		return;
	}
	
	if (image3.value == "")
	{
		image3.value = imageURI;
		document.getElementById('image3_prev').src = "data:image/jpeg;base64," + imageURI;
		return
	}
	else
	{
		navigator.notification.alert("You can upload up to 3 images", null, "Error", "Continue");
		return;
	}
		
}

function deletePhoto(id) 
{
	navigator.notification.confirm(
        'Are you sure you want to delete this photo?',  
        onConfirm,              
        'Delete?',            
         ['Yes','No']             
    );
	
	function onConfirm() {
		var image = document.getElementById('image' + id);
		var image_prev = document.getElementById('image' + id +'_prev');
		image.value = null;
		image_prev.src = "";
	}
}



  var map;
  var infowindow;
  var marker = null;
  var geo_field = document.getElementById("loc_geo");
  var lat_field = document.getElementById("loc_latitude");
  var lng_field = document.getElementById("loc_longitude");


function initMap() 
{
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 50.0646, lng: 19.9449},
    zoom: 5
  });
  var input = /** @type {!HTMLInputElement} */(
      document.getElementById('loc_geo'));

  var types = document.getElementById('type-selector');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var geocoder = new google.maps.Geocoder();

  infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29),
    icon: 'img/map_pin.png'
  });
  

  var geo_field = document.getElementById("loc_geo");
  var lat_field = document.getElementById("loc_latitude");
  var lng_field = document.getElementById("loc_longitude");

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      navigator.notification.alert("Unfortunately - no such place was found", null, "Error", "Continue");
      return;
    }
    var latLng = place.geometry.location;

    marker.setPosition(latLng);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent(latLng.toString());
    infowindow.open(map, marker);

    lat_field.value = latLng.toString().slice(1, -1).split(",")[0];
    lng_field.value = latLng.toString().slice(1, -1).split(",")[1];
	

    geo_field.value += " | " + address;

  });

  map.addListener('click', function(e) {
	  
    infowindow.close();
    marker.setVisible(false);
    var latLng = e.latLng;
	
	geocoder = new google.maps.Geocoder();
	
      marker.setPosition(latLng);
      marker.setVisible(true);
	  
      infowindow.setContent(latLng.toString());
      infowindow.open(map, marker);

      lat_field.value = latLng.toString().slice(1, -1).split(",")[0];
      lng_field.value = latLng.toString().slice(1, -1).split(",")[1];
	  
                geo_field.value = geocoder.geocode( {location:latLng}, function(results, status) 
            {
              if (status == google.maps.GeocoderStatus.OK) 
              {
                geo_field.value = results[0].formatted_address;
              } else {
                navigator.notification.alert('Geocode was not successful for the following reason: ' + status, null, "Error", "OK");
             }
            });
    map.panTo(latLng);
				  
  });

showMyPositionOnMap = function(position){

    var latLng = null;
    if (position != null) 
	{
          latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          infowindow.close();
          marker.setVisible(false);
          marker.setPosition(latLng);
          marker.setVisible(true);
          infowindow.setContent(position.coords.latitude + ", " + position.coords.longitude);
          infowindow.open(map, marker);
          lat_field.value = latLng.toString().slice(1, -1).split(",")[0];
          lng_field.value = latLng.toString().slice(1, -1).split(",")[1];
          map.panTo(latLng);

          geo_field.value = geocoder.geocode( {location:latLng}, function(results, status) 
            {
              if (status == google.maps.GeocoderStatus.OK) 
              {
                geo_field.value = results[0].formatted_address;
              } 
			  else 
			  {
                navigator.notification.alert('Geocode was not successful for the following reason: ' + status, null, "Error", "OK");
			  }
            });
    } 
	else 
	{ 
		  navigator.notification.alert("Geolocation is not supported", null, "Error", "OK");
    }
 }
}

function searchLocations()
{
	
	var search_tag = document.getElementById("search_tag").value;
	var search_near = document.getElementById("search_near").value;
	
	
    if(search_tag == "" && search_near == "")
    {
        navigator.notification.alert("Please enter value to search", null, "Data missing", "OK");
        return;
    }

	document.getElementById("search_results").innerHTML = "";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://flocfloc.herokuapp.com/app_search", true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	var postContent = "search_tag="+encodeURIComponent(search_tag)+"&search_near="+encodeURIComponent(search_near);
    xhr.send(postContent); 
    xhr.onload = function(){
        if(xhr.responseText[0] == "[")
        {
			var locations = JSON.parse(xhr.responseText);
						
			for (i in locations)
			{
				var noimage = "img/noimage.jpg";
				
				if(locations[i].hasOwnProperty('photo'))
				{	
					$('#search_results').append('<div class="results_item">' + '<img src="' + locations[i].photo + '" onclick="showLocation(' + locations[i].id + ');" class="results_thumb"/>'  + locations[i].name.toString().slice(0, 15) + '...' + '</div>');	
				}
				else
				{
					$('#search_results').append('<div class="results_item">' + '<img src="' + noimage +'" id="noimage" onclick="showLocation(' + locations[i].id.toString() + ');" class="results_thumb"/>'  + locations[i].name.toString().slice(0, 15) + '...' + '</div>');
				}
			}
        }
        else 
        {
			navigator.notification.alert(xhr.responseText, null, "Error", "Continue");
			return;

        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});

}

function showLocation(id) 
{
    if(id == null)
    {
        navigator.notification.alert("Error, no location id specified", null, "Data missing", "OK");
        return;
    }


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://flocfloc.herokuapp.com/app_get_location", true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	var postContent = "username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token)+"&id="+encodeURIComponent(id);
    xhr.send(postContent); 
    xhr.onload = function(){
        if(xhr.responseText[0] == "{")
        {

			var location = JSON.parse(xhr.responseText);
			            document.getElementById('show_loc_name').innerHTML = location.name;
                        document.getElementById('show_loc_desc').innerHTML = location.desc;
                        document.getElementById('show_loc_geo').innerHTML = location.geo;
						document.getElementById('getmethere').innerHTML = '<button class="btn btn-lg btn-default"> <a class="getmetherelink" href="geo:' + location.latitude+ ',' + location.longitude + '"> <i class="fa fa-map-signs"></i>  Get me there!</a></button>';
						
						if(location.hasOwnProperty('images'))
						{
							if(location.images.length == 0)
							{
								document.getElementById('show_loc_images').innerHTML = 'No photos for this location...';
							}
							else
							{
								document.getElementById('show_loc_images').innerHTML = 'Photos (' + location.images.length + '):';
								for (i = 0; i < location.images.length; i++) 
								{ 
								$('.images-preview').append('<img src="' + location.images[i] + '"class="img-show-prev"/>');
								}
							}
						}
						$.mobile.changePage("#show_location", {transition:"slide"});
						showLocationMap(location.latitude, location.longitude);
		}
        else 
        {
			navigator.notification.alert(xhr.responseText, null, "Error", "Continue");
			return;

        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});

}

function showLocationMap(lat, lng) {
  var show_map = new google.maps.Map(document.getElementById('show_loc_map'), {
    center: {lat: 50.0646, lng: 19.9449},
    zoom: 18
  });
  
  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: show_map,
    anchorPoint: new google.maps.Point(0, -29),
    icon: 'img/map_pin.png'
  });
	
	latLng = new google.maps.LatLng(lat, lng);
	marker.setPosition(latLng);
    marker.setVisible(true);
	infowindow.setContent(latLng.toString());
    infowindow.open(show_map, marker);
	

}

function getMyLocations()
{
	
	

	document.getElementById("my_locations_results").innerHTML = "";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://flocfloc.herokuapp.com/app_get_user_locations", true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	var postContent = "username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token);
    xhr.send(postContent); 
    xhr.onload = function(){
        if(xhr.responseText[0] == "[")
        {
			var locations = JSON.parse(xhr.responseText);
			for (i in locations)
			{
				var noimage = "img/noimage.jpg";
				if(locations[i].hasOwnProperty('photo'))
				{	
					$('#my_locations_results').append('<div class="results_item">' + '<img src="' + locations[i].photo + '" onclick="showLocation(' + locations[i].id + ');" class="results_thumb"/>'  + locations[i].name.toString().slice(0, 15) + '...' + '</div>');	
				}
				else
				{
					$('#my_locations_results').append('<div class="results_item">' + '<img src="' + noimage + '" onclick="showLocation(' + locations[i].id + ');" class="results_thumb"/>'  + locations[i].name.toString().slice(0, 15) + '...' + '</div>');
				}
			}
        }
        else 
        {
			navigator.notification.alert(xhr.responseText, null, "Error", "Continue");
			return;

        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});

}


function profileSettings()
{
	

	$.mobile.changePage("#settings", {transition:"slide"});
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://flocfloc.herokuapp.com/app_get_user", true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	var postContent = "username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token);
    xhr.send(postContent); 
    xhr.onload = function(){
        if(xhr.responseText[0] == "{")
        {
			var user = JSON.parse(xhr.responseText);
			document.getElementById("edit_name").value = user.name;
			document.getElementById("edit_email").value = user.email;
			document.getElementById("edit_webpage").value = user.webpage;			
			
			var s = document.getElementById("edit_country");
			var country = user.country;
			
			for ( var i = 0; i < s.options.length; i++ ) 
			{
        		if ( s.options[i].text == country ) 
				{
					
					s.selectedIndex = i;
					s.options[i].selected = true;
					return;
		        }
   			}



        }
        else 
        {
			navigator.notification.alert(xhr.responseText, null, "Error", "Continue");
			return;

        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});

}

function updateProfile()
{
	var name = document.getElementById("edit_name").value;
	var country = document.getElementById("edit_country").value;
	var email = document.getElementById("edit_email").value;
	var webpage = document.getElementById("edit_webpage").value;
	var password = document.getElementById("edit_password").value;
    var new_password = document.getElementById("new_password").value;
    var new_password_confirmation = document.getElementById("new_password_confirmation").value;
	

    if(name == "")
    {
        navigator.notification.alert("Please enter username", null, "Username Missing", "OK");
        return;
    }
	
	if(country == "")
    {
        navigator.notification.alert("Please enter country", null, "Country Missing", "OK");
        return;
    }
	
	if(email == "")
    {
        navigator.notification.alert("Please enter email", null, "Email Missing", "OK");
        return;
    }

	if(password == "")
    {
        navigator.notification.alert("Please enter password", null, "Password Missing", "OK");  
        return;
    }
	
    if(new_password != new_password_confirmation)
    {
        navigator.notification.alert("Password and Password confirmation must match!", null, "Password error", "OK");  
        return;
    }
	


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://flocfloc.herokuapp.com/app_update_user", true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	
	if(new_password != "")
	{
		var postContent = "username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token)+"&name="+encodeURIComponent(name)+"&country="+		encodeURIComponent(country)+"&email="+encodeURIComponent(email)+"&webpage="+encodeURIComponent(webpage)+"&password="+encodeURIComponent(password)+"&new_password="+encodeURIComponent(new_password)+"&new_password_confirmation="+encodeURIComponent(new_password_confirmation);
	}
	else
	{
		var postContent = "username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token)+"&name="+encodeURIComponent(name)+"&country="+		encodeURIComponent(country)+"&email="+encodeURIComponent(email)+"&webpage="+encodeURIComponent(webpage)+"&password="+encodeURIComponent(password);
	}
    xhr.send(postContent); 
    xhr.onload = function(){
        if(xhr.responseText.substring(1, xhr.responseText.length-1).split(" ")[0] == "Error")
        {
            navigator.notification.alert(xhr.responseText, null, "Wrong Creds", "Try Again");
			return;
        }
        else 
        {
			var credentials = xhr.responseText.substring(1, xhr.responseText.length-1).split(" ");
			
			navigator.notification.alert(credentials[0] + ", your profile was successfully updated!", null, "Success", "Continue");
			
			deleteDb;
			db.transaction(function(tx) {
			name = credentials[0];
			username = credentials[1];
			token = credentials[2];
			date = new Date();
			tx.executeSql('INSERT INTO credentials(name, username, token, created_at) VALUES (?, ?, ?, ?)', [name, username, token, date.getTime()]);
			}, errorHandler, successHandler);
				
            $.mobile.changePage("#menu", {transition:"slide"});
        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});
}