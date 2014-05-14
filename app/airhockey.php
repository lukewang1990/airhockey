<?php
	require_once('session_module.php');
	if (isset($_COOKIE['id_cookie']) && isset($_COOKIE['session_cookie'])) {
		$id_cookie = $_COOKIE['id_cookie'];
		$session_cookie = $_COOKIE['session_cookie'];
		if (sessionCheck($id_cookie, $session_cookie, $new_session_cookie, $err)) {
?>

<!DOCTYPE html>
<html>
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
	        <ul class="nav navbar-nav">
	            <li ><a href="index.html">Home</a></li>
	            <li ><a href="airhockey.php">Game</a></li>
	        </ul>
	        <ul class="nav navbar-nav navbar-right">
				<li><a href="logout_handle.php">Log out&nbsp;&nbsp;</a></li>
	        </ul>
	    </div>
	</nav>

    <div class="container">
        <div class="row">
            <div class="col-xs-3" id="control-panel">
                big pic of mole
            </div>
            <div class="col-xs-9" id="list-container">
                <div class="row">
                    <div class="col-xs-6">
                        <ul class="nav nav-tabs nav-justified">
                            <li class="active"><a href="#">Bar Shape</a></li>
                            <li><a href="#">Round Shape</a></li>
                        </ul>
                    </div>
                    <div class="col-xs-6">
                        <ul class="nav nav-tabs nav-justified">
                            <li class="active"><a href="#">2 Players</a></li>
                            <li><a href="#">4 Players</a></li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <ul class="list-group">
                        <li class="list-group-item">Cras justo odio</li>
                        <li class="list-group-item">Dapibus ac facilisis in</li>
                        <li class="list-group-item">Morbi leo risus</li>
                        <li class="list-group-item">Porta ac consectetur ac</li>
                        <li class="list-group-item">Vestibulum at eros</li>
                    </ul>
                </div>
                
            </div>

        </div>
    </div>

	<script src="bower_components/jquery/dist/jquery.js"></script>
	<script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
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
