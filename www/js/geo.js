function init() {
	document.addEventListener('deviceready', onDeviceReady, false);
}
	var db;
	var username;
	var token;
	
function onDeviceReady() {
	
	var id="deviceready";
	var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
    console.log('Received Event: ' + id);
		
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
	alert(e.message);
}

function successHandler() {  
	//navigator.notification.alert("Saved to DB");
}

function getCredentialsSuccess() {  
	//alert("Got credentials from DB!");
}

function dbReady() {
	//alert("Database is ready");
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
	
	
function querySuccess(tx, results) {
 
	if (results.rows.length == 0) 
	{
		//alert("PUSTE - Log in");
		//	login();
		return true;
	}
	else {
		//alert("NIE PUSTE");
	var name = String(results.rows.item(0).name);
	username = String(results.rows.item(0).username);
	token = String(results.rows.item(0).token);

	tokenLogin(name, username, token);
	$.mobile.changePage("#menu", {transition:"slide"});
	return true;	
	}
	//return true;
	//document.getElementById('Result').innerHTML += wyniki;
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
			
			alert("Welcome "+credentials[0]+"!");
			
			db.transaction(function(tx) {
			var name = credentials[0];
			username = credentials[1];
			token = credentials[2];
			var date = new Date();
			tx.executeSql('INSERT INTO credentials(name, username, token, created_at) VALUES (?, ?, ?, ?)', [name, username, token, date.getTime()]);
						//alert("after saving credentials");
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
            navigator.notification.alert("Token expired!", null, "Wrong Creds", "Login Again");
			return;
        }
        else 
        {
			var credentials = xhr.responseText.substring(1, xhr.responseText.length-1).split(" ");
			
			var responseUsername = credentials[1];
			if (responseUsername == username)
			{ 
			alert("Welcome "+credentials[0]+"!");
			return;
			}
			
		return;
        }
    };  
	//alert("Przed wysłaniem");
    //xhr.send();
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
			
			alert("Welcome " + credentials[0] + "!");
			
			db.transaction(function(tx) {
			var name = credentials[0];
			var username = credentials[1];
			var token = credentials[2];
			var date = new Date();
			tx.executeSql('INSERT INTO credentials(name, username, token, created_at) VALUES (?, ?, ?, ?)', [name, username, token, date.getTime()]);
						//alert("after saving credentials");
			}, errorHandler, successHandler);
				
            $.mobile.changePage("#menu", {transition:"slide"});
        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});
}

function goto_register()
{
	$.mobile.changePage("#register", {transition:"slide"});
}

function goto_addLocation()
{
	$.mobile.changePage("#add_location", {transition:"slide"});
}

function getMyPosition() 
{
    navigator.geolocation.getCurrentPosition(positionSuccess, errorHandler);
}

function positionSuccess(position)
{
	//alert(position.coords.latitude + ', ' + position.coords.longitude);
	var geo_input = document.getElementById('loc_geo');	
	geo_input.value = position.coords.latitude + ', ' + position.coords.longitude; 
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

	alert(username);
	alert(token);
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
	var postContent = "username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token)+"&name="+encodeURIComponent(loc_name)+"&desc="+encodeURIComponent(loc_desc)+"&geo="+encodeURIComponent(loc_geo)+"&tags="+encodeURIComponent(loc_tags)+"&electricity="+encodeURIComponent(loc_electricity)+"&open="+encodeURIComponent(loc_open)+"&public="+encodeURIComponent(loc_public);
    xhr.send(postContent); 
    xhr.onload = function(){
        if(xhr.responseText == "false")
        {
            navigator.notification.alert("Wrong Username and Password", null, "Wrong Creds", "Try Again");
        }
        else 
        {
			var credentials = xhr.responseText.substring(1, xhr.responseText.length-1).split(" ");
			
			alert(xhr.responseText);
			
			return;
			
			db.transaction(function(tx) {
			var name = credentials[0];
			var username = credentials[1];
			var token = credentials[2];
			var date = new Date();
			tx.executeSql('INSERT INTO credentials(name, username, token, created_at) VALUES (?, ?, ?, ?)', [name, username, token, date.getTime()]);
						//alert("after saving credentials");
			}, errorHandler, successHandler);
				
            $.mobile.changePage("#menu", {transition:"slide"});
        }
    };  
    xhr.send();
	$.mobile.changePage("#menu", {transition:"slide"});

}




function getImage() {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(savePhoto, function(message) {
			alert('get picture failed');
		},{
			quality: 50, targetWidth: 500, targetHeight: 500,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
		}
            );
 
}



function savePhoto(imageURI) {
	
	var image1 = document.getElementById('image1');
	var image2 = document.getElementById('image2');
	var image3 = document.getElementById('image3');
	
	
	if (image1.value == "")
	{
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
		alert("You can upload up to 3 images");
		return;
	}
		
}

function checkPhotos() {
		var image1 = document.getElementById('image1').value;
	var image2 = document.getElementById('image2').value;
	var image3 = document.getElementById('image3').value;
	
	alert("1: " + image1.substring(333, 360) + "2: " + image2.substring(333, 50) + "3: " + image3.substring(17, 50));
}

