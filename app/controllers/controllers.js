app.controller('LoginController', function ($scope, loginService) {
	
	init();

	function init() {
		$scope.user = loginService.getUser();
	}

	$scope.checkPassword = function() {
		/// TODO
	}
});

