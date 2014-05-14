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
      $scope.msg = "not clicked";
      $scope.clearButton = clearButton;
      $scope.count = 0;
      setInterval(function() {$scope.count++;}, 1000);
  	}

    function clearButton() {
      $scope.input = "";
      $scope.msg = "clicked";
    }

  }])
  .controller('GameCtrl', ['$scope', function($scope) {
  	init();
  	function init() {

  	}

  }]);
