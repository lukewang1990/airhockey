<?php

require_once('db_module.php');

function randomGen() {
	# generate random 8 digit hex session ID
    return sprintf("%0.8x",rand()*0xffffffff);
}

function idCookieGen($email) {
	return md5($email.randomGen());
}

function sessionCookieGen() {
	return md5(randomGen());
}

function sessionSave($idCookie, $sessionCookie) {
	try {
		$conn = mysqlConnector();
		$stmt = $conn->prepare("INSERT INTO sessions (id_cookie, session_cookie) VALUES (\"$idCookie\", \"$sessionCookie\")");
		$stmt->execute();
	} catch (PDOException $e) {
		echo 'ERROR: '.$e->getMessage();
		return false;
	}
	return true;
}

function sessionCheck($idCookie, $sessionCookie) {
	$sid = -1; 	// to keep the returned session_id
	if (validCheck($idCookie, $sessionCookie, $sid)) {
		// generate new session key and update it in db
		$new_session_key = sessionCookieGen();
		try {
			$conn = mysqlConnector();
			$stmt = $conn->prepare("UPDATE sessions SET session_cookie=\"$new_session_key\" WHERE sid=\"$sid\"");
			$stmt->execute();
		} catch (PDOException $e) {
			echo 'ERROR: '.$e->getMessage();
			return false;
		}
		
		return true;
	} else {
		return false;
	}
}

function validCheck($idCookie, $sessionCookie, &$sid) {
	try {
		$conn = mysqlConnector();
		$stmt = $conn->prepare("SELECT * FROM sessions WHERE id_cookie=\"$idCookie\"");
		$stmt->execute();
		$row = $stmt->fetch(); 	// there should be only one tuple
		if (!empty($row) && $row['session_cookie'] == $sessionCookie) {
			return true;
		} else {
			return false;
		}
	} catch (PDOException $e) {
		echo 'ERROR: '.$e->getMessage();
		return false;
	}
}

?>