'use strict';

function checkIfLoggedIn() {
	var settings = {
	  url: "../users/me",
	  method: "GET",
	  headers: {
	    'content-type': "application/json"
	  }
	};

	$.ajax(settings).done(function(response) {
		console.log("Inside login EVent ****************");
		if (response.redirect === '/login.html') {
			window.location = response.redirect;
		}
		else {
			console.log("Inside login EVent ****************");
			window.location = '/js/';
		}
	});
}

function watchLogIn() {
	$('.nav-button').click(function(event) {
		event.preventDefault();
		checkIfLoggedIn();
	});
}

$(watchLogIn);