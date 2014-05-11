'use strict';

/* Services */

angular.module('airhockeyApp.services', []).
	value('version', '0.1').
	service('loginService', function() {
		this.getUser = function() {
			return "hey";
		};
	}).
	service('registerService', function() {
		
	});

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');
