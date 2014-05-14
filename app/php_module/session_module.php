<?php

require_once('db_module.php');

function randomStringGen($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}

function idCookieGen($email) {
	return md5($email.randomStringGen());
}

function sessionCookieGen() {
	return md5(randomStringGen());
}

function sessionGen(&$idCookie, &$sessionCookie, $email, &$err) {
	if (empty($idCookie)) {
		$idCookie = idCookieGen($email);
		$sessionCookie = sessionCookieGen();
		try {
			$conn = mysqlConnector();
			$stmt = $conn->prepare("INSERT INTO sessions (id_cookie, session_cookie, email) VALUES (\"$idCookie\", \"$sessionCookie\", \"$email\")");
			$stmt->execute();
		} catch (PDOException $e) {
			$err = 'ERROR: '.$e->getMessage();
			return false;
		}
		return true;
	} else { 	// there is id_cookie input
		$sessionCookie = sessionCookieGen();
		try {
			$conn = mysqlConnector();
			$stmt = $conn->prepare("UPDATE sessions SET session_cookie=\"$sessionCookie\" WHERE id_cookie=\"$idCookie\"");
			$stmt->execute();
		} catch (PDOException $e) {
			$err = 'ERROR: '.$e->getMessage();
			return false;
		}
		return true;
	}
}

function sessionCheck($idCookie, $sessionCookie, &$newSessionCookie, &$err) {
	$sid = -1; 	// to keep the returned session_id
	if (validCheck($idCookie, $sessionCookie, $sid, $errMsg)) {
		// generate new session key and update it in db
		$newSessionCookie = sessionCookieGen();
		try {
			$conn = mysqlConnector();
			$stmt = $conn->prepare("UPDATE sessions SET session_cookie=\"$newSessionCookie\" WHERE sid=\"$sid\"");
			$stmt->execute();
		} catch (PDOException $e) {
			$err = 'ERROR: '.$e->getMessage();
			return false;
		}
		return true;
	} else {
		$err = $errMsg;
		return false;
	}
}

function validCheck($idCookie, $sessionCookie, &$sid, &$err) {
	try {
		$conn = mysqlConnector();
		$stmt = $conn->prepare("SELECT * FROM sessions WHERE id_cookie=\"$idCookie\"");
		$stmt->execute();
		$row = $stmt->fetch(); 	// there should be only one tuple
		if (! empty($row) && $row['session_cookie'] == $sessionCookie) {
			return true;
		} else {
			return false;
		}
	} catch (PDOException $e) {
		$err = 'ERROR: '.$e->getMessage();
		return false;
	}
}

function sessionDelete($idCookie, $sessionCookie, &$err) {
	try {
		$conn = mysqlConnector();
		$stmt = $conn->prepare("DELETE FROM sessions WHERE id_cookie = \"$idCookie\" AND session_cookie = \"$sessionCookie\"");
		$stmt->execute();
		return true;
	} catch (PDOException $e) {
		$err = 'ERROR: '.$e->getMessage();
		return false;
	}
}

function findIdCookie($idCookie, $email, &$err) {
	try {
		$conn = mysqlConnector();
		$stmt = $conn->prepare("SELECT * FROM sessions WHERE id_cookie=\"$idCookie\" and email=\"$email\"");
		$stmt->execute();
		$row = $stmt->fetch();
		if (! empty($row)) {
			return true;
		} else {
			return false;
		}
	} catch (PDOException $e) {
		$err = 'ERROR: '.$e->getMessage();
		return false;
	}
}

function redirect($url, $statusCode = 303)
{
   header('Location: ' . $url, true, $statusCode);
   die();
}

?>