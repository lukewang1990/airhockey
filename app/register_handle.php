<?php

$str = file_get_contents('php://input');
$obj = json_decode($str, true);
$email = $obj['email'];
$nickname = $obj['name'];
$password = $obj['password'];
$playerID;

$resObj = array();
if (! empty($email) && ! empty($nickname) && ! empty($password)) {
	try {
		require_once 'db_module.php';
		$conn = mysqlConnector();
		// check if the email has been used
		$stmt = $conn->prepare("SELECT uid FROM users WHERE email=\"$email\"");
		$stmt->execute();
		$rows = $stmt->fetchAll();
		if (count($rows) > 0) {
			$resObj['error'] = 'Email address already used';
		} else {
			$stmt = $conn->prepare("INSERT INTO users (email, password, nickname) VALUES (\"{$email}\", \"{$password}\", \"{$nickname}\")");
	    	$stmt->execute();
	    	$stmt = $conn->prepare("SELECT uid FROM users WHERE email=\"$email\"");
	    	$stmt->execute();
	    	$rows = $stmt->fetchAll();
	    	$playerID = $rows[0][0];
		}
	} catch (PDOException $e) {
		$resObj['error'] = 'ERROR: '.$e->getMessage();
	}
} else {
	$resObj['error'] = 'Missing input field';
}

if (empty($resObj['error'])) { 	// registration successful
	require_once('session_module.php');
	$id_cookie = "";
	$session_cookie = "";
	if (sessionGen($id_cookie, $session_cookie, $email, $errMsg)) {
		$resObj['success'] = 'true';
		$resObj['redirect'] = 'true';
		$resObj['redirectURL'] = 'airhockey.php';
		$resObj['id_cookie'] = $id_cookie;
		$resObj['session_cookie'] = $session_cookie;
		$resObj['persistent'] = 'true';
		$resObj['nickname'] = $nickname;
		$resObj['playerID'] = $playerID;
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