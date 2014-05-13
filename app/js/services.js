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
