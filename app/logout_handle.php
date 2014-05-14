<?php

require_once('php_module/session_module.php');
if (isset($_COOKIE['id_cookie']) && isset($_COOKIE['session_cookie'])) {
	$id_cookie = $_COOKIE['id_cookie'];
	$session_cookie = $_COOKIE['session_cookie'];
	sessionDelete($id_cookie, $session_cookie, $err);
	setcookie ('id_cookie', $id_cookie, time() - 3600, '/');
	setcookie('session_cookie', $session_cookie, time() - 3600, '/');
	redirect('index.html');
} else {
	redirect('index.html');
}

?>
