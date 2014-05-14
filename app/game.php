<?php
	require_once('php_module/session_module.php');
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
	<link rel="stylesheet" href="css/game-style.css">
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
	            <li><a href="index.html">Home</a></li>
	        </ul>
	        <ul class="nav navbar-nav navbar-right">
				<li><a href="logout_handle.php" id="logout-button">Log out&nbsp;&nbsp;</a></li>
	        </ul>
	    </div>
	</nav>

	<div class="container">
        <div class="row">
            <div class="col-xs-3" id="control-panel">
                <div class="row" style="margin: 5px 0;">
                	<span class="col-xs-6 label label-info">Welcome</span>
                	<span class="col-xs-6 label label-primary" id="nickname">Luke</span>
                </div>
                <div class="row" style="margin: 5px 0;">
                   	<span class="col-xs-6 label label-info">Game type</span>
                	<span class="col-xs-6 label label-success" id="game-shape">bar</span>
                </div>
                <div class="row" style="margin: 5px 0;">
                	<span class="col-xs-6 label label-info">Number of players</span>
                	<span class="col-xs-6 label label-warning" id="game-num">2</span>
                </div>
                <div class="row">
	            	<button type="button" class="btn btn-primary btn-block btn-lg" style="margin: 20px 0;" id="ready-button">
						<span class="glyphicon glyphicon-play"></span> Ready
					</button>
                </div>
                <div class="row">
                <ul class="list-group">
                	<li class="list-group-item" id="self-score"><span class="badge">1</span>You</li>
                	<li class="list-group-item" id="opponent-score"><span class="badge">2</span>Opponent</li>
                </ul>
                </div>
                <div class="row">
                	<ul class="list-group" id="player-list">
                		<li class="list-group-item"><span class="badge">Not ready</span><span class="player-name">Blablabla</span></li>
						<li class="list-group-item"><span class="badge">Not ready</span><span class="player-name">Blablabla</span></li>
						<li class="list-group-item"><span class="badge">Not ready</span><span class="player-name">Blablabla</span></li>
						<li class="list-group-item"><span class="badge">Not ready</span><span class="player-name">Blablabla</span></li>
                	</ul>
                </div>
                <div class="row">
                	<button type="button" class="btn btn-primary btn-block btn-lg" style="margin: 20px 0;" id="return-button">
						<span class="glyphicon glyphicon-home"></span> Exit to Lobby
					</button>
                </div>
            </div>
            <div class="col-xs-9" id="board-container">
                <div class="container">
					<div id="game_container">
						<div id="note_pad"></div>
					</div>
                </div>
                
                
            </div>

        </div>
    </div>

	<script src="bower_components/jquery/dist/jquery.js"></script>
	<script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
	<script src="bower_components/socket.io-client/dist/socket.io.js"></script>
	<script src="js/jquery.cookie.js"></script>
	<script src="js/helper.js"></script>
	<script src="js/game-ui.js"></script>
	<script src="js/game-client.js"></script>
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
