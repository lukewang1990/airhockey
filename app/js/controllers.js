'use strict';

/* Controllers */

angular.module('airhockeyApp.controllers', [])
  .controller('NavbarCtrl', ['$scope', function($scope){
  	init();
  	function init() {

  	}

  }])
  .controller('HomeCtrl', ['$scope', function($scope) {
  	init();
  	function init() {

  	}

  }])
  .controller('MatchingCtrl', ['$scope', function($scope) {
  	init();
  	function init() {

  	}

  }])
  .controller('LoginCtrl', ['$scope', 'loginService', function($scope, loginService) {
	init();
	function init() {
		$scope.user = loginService.getUser();
	}

	$scope.checkPassword = function() {
		/// TODO
	};
  }])
  .controller('RegisterCtrl', ['$scope', 'registerService', function($scope, registerService){
  	init();
  	function init() {
  		
  	}
  	
  }])
  .controller('InstructionCtrl', ['$scope', function($scope){
  	
  }])
  ;


/* Sample */
angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);