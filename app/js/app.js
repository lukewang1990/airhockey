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
  	.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'})
  	.when('/register', {templateUrl: 'partials/register.html', controller: 'RegisterCtrl'})
  	.when('/instruction', {templateUrl: 'partials/instruction.html', controller: 'InstructionCtrl'})
  	.when('/matching', {templateUrl: 'partials/matching.html', controller: 'MatchingCtrl'})
  	.otherwise({redirectTo: '/home'});
}]);


/* Sample */
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);