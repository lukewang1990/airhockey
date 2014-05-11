'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])
  .controller('LoginController', function ($scope, loginService) {
	
	init();

	function init() {
		$scope.user = loginService.getUser();
	}

	$scope.checkPassword = function() {
		/// TODO
	}
  }]);