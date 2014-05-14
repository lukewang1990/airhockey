<?php
	require_once('php_module/session_module.php');
	if (isset($_COOKIE['id_cookie']) && isset($_COOKIE['session_cookie'])) {
		$id_cookie = $_COOKIE['id_cookie'];
		$session_cookie = $_COOKIE['session_cookie'];
		if (sessionCheck($id_cookie, $session_cookie, $new_session_cookie, $err)) {
?>

<!DOCTYPE html>
<html ng-app="airhockeyApp">
<head>
	<meta charset="UTF-8">
	<title>Airhockey</title>
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css">
	<link rel="stylesheet" href="css/app.css">
</head>
<body>
	<nav role="navigation" class="navbar navbar-default navbar-fixed-top">
	    <!-- Brand and toggle get grouped for better mobile display -->
	    <div class="navbar-header">
	        <button type="button" data-target="#navbarCollapse" data-toggle="collapse" class="navbar-toggle">
	            <span class="sr-only">Toggle navigation</span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	        </button>
	        <a href="#" class="navbar-brand">Air Hockey</a>
	    </div>
	    <!-- Collection of nav links, forms, and other content for toggling -->
	    <div id="navbarCollapse" class="collapse navbar-collapse">
	        <ul class="nav navbar-nav" ng-controller="NavbarCtrl">
	            <li ng-class="{'active':getClass('/home')}"><a href="#/home">Home</a></li>
	            <li class="dropdown">
	                <a data-toggle="dropdown" class="dropdown-toggle" href="">Game<b class="caret"></b></a>
	                <ul role="menu" class="dropdown-menu">
	                    <li><a href="#/matching">Matching</a></li>
	                    <li><a href="#/instruction">Instruction</a></li>
	                </ul>
	            </li>
	        </ul>
	        <ul class="nav navbar-nav navbar-right">
				<li><a href="logout_handle.php">Log out&nbsp;&nbsp;</a></li>
	        </ul>
	    </div>
	</nav>

	<div ng-view></div>

	<script src="bower_components/angular/angular.js"></script>
	<script src="bower_components/angular-route/angular-route.js"></script>
	<script src="bower_components/angular-resource/angular-resource.js"></script>
	<script src="bower_components/jquery/dist/jquery.js"></script>
	<script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
	<script src="js/services.js"></script>
	<script src="js/controllers.js"></script>
	<script src="js/app.js"></script>
	<script src="js/filters.js"></script>
	<script src="js/directives.js"></script>
	<script src="js/jquery.cookie.js"></script>
	<script src="js/helper.js"></script>
</body>
</html>

<?php
		} else {
			// redirect to login page
			redirect('login.php');
		}
	} else {
		// redirect to login page
		redirect('login.php');
	}

?>
