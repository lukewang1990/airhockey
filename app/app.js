var app = angular.module('airHockey', ['ngRoute']);

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
        .when( '/'
			{
				controller: "HomeController",
				templateUrl: '/app/partials/home.html'
			})
        .when('/home',
	        {
	        	controller: 'HomeController',
	        	templateUrl: '/app/partials/home.html'
	        })
        .when('/login',
            {
                controller: 'LoginController',
                templateUrl: '/app/partials/login.html'
            })
        //Define a route that has a route parameter in it (:customerID)
        .when('/register',
            {
                controller: 'RegisterController',
                templateUrl: '/app/partials/register.html'
            })
        .when('/matching',
            {
                controller: 'MatchingController',
                templateUrl: '/app/partials/matching.html'
            })
        .otherwise({ redirectTo: '/' });
});

app.run(function ($rootScope, $location) {
	// register listener to watch route changes
	$rootScope.$on("$locationChangeStart", function(event, next, current) {
		if ($rootScope.loggedUser == null) {
			// no logged user, we should go to #login
			if (next.$route.templateUrl == "app/partials/login.html") {
				// already going to #login, no redirect needed
			} else {
				// not going to #login, we should redirect now
				$location.path('/login');
			}
		}
	});
});