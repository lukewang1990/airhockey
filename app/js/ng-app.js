'use strict';

// Declare app level module which depends on filters, and services
angular.module('airhockeyApp', [
  'ngRoute',
  'airhockeyApp.filters',
  'airhockeyApp.services',
  'airhockeyApp.directives',
  'airhockeyApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  	.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'})
  	.when('/matching', {templateUrl: 'partials/matching.html', controller: 'MatchingCtrl'})
  	.when('/game', {templateUrl: 'partials/game.html', controller: 'GameCtrl'})
  	.otherwise({redirectTo: '/home'});
}]);
