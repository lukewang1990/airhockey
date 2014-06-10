<?php

require_once('../php_module/db_module.php');
try {
	$conn = mysqlConnector();
	$stmt = $conn->prepare("DROP TABLE IF EXISTS users");
	$stmt->execute();
	$stmt = $conn->prepare("DROP TABLE IF EXISTS sessions");
	$stmt->execute();
	$stmt = $conn->prepare("CREATE TABLE users (uid INT NOT NULL AUTO_INCREMENT, email VARCHAR(256), password VARCHAR(256), nickname VARCHAR(256), headshot VARCHAR(256), PRIMARY KEY (uid))");
	$stmt->execute();
	$stmt = $conn->prepare("CREATE TABLE sessions (sid INT NOT NULL AUTO_INCREMENT, id_cookie VARCHAR(256), session_cookie VARCHAR(256), email VARCHAR(256), time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (sid))");
	$stmt->execute();
} catch (PDOException $e) {
	echo 'ERROR: '.$e->getMessage();
}

?>