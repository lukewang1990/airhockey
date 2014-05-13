<?php

$str = file_get_contents('php://input');
$obj = json_decode($str, true);
$email = $obj['email'];
$password = $obj['password'];
$persistent = $obj['persistent'];

$resObj = array();
if (! empty($email) && ! empty($password) && ! empty($persistent)) {
	try {
		require_once 'db_module.php';
		$conn = mysqlConnector();
		// check if the email has been used
		$stmt = $conn->prepare("SELECT * FROM users WHERE email=\"$email\" AND password=\"$password\"");
		$stmt->execute();
		$rows = $stmt->fetchAll();
		
		if (count($rows) == 0) {
			$resObj['error'] = 'Email or password incorrect';
		} else {
			// matching record founded
		}
	} catch (PDOException $e) {
		$resObj['error'] = 'ERROR: '.$e->getMessage();
	}
} else {
	$resObj['error'] = 'Missing input field';
}

if (empty($resObj['error'])) { 	// login successful
	require_once('session_module.php');
	if (isset($_COOKIE['id_cookie'])) {
		$id_cookie = $_COOKIE['id_cookie'];
		if (! findIdCookie($id_cookie, $email, $err)) {
			$id_cookie = "";
		}
	} else {
		$id_cookie = "";
	}
	$session_cookie = "";
	if (sessionGen($id_cookie, $session_cookie, $email, $errMsg)) {
		$resObj['success'] = 'true';
		$resObj['redirect'] = 'true';
		$resObj['redirectURL'] = 'airhockey.php';
		$resObj['id_cookie'] = $id_cookie;
		$resObj['session_cookie'] = $session_cookie;
		$resObj['persistent'] = $persistent;
	} else {
		// session key generation fail
		$resObj['success'] = 'false';
		$resObj['error'] = $errMsg;
	}
} else {
	// return error message;
	$resObj['success'] = 'false';
}

$resStr = json_encode($resObj);
echo $resStr;

?>