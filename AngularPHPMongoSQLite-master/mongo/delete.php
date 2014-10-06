<?php

$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() === JSON_ERROR_NONE) {

	try {

		$con = new MongoClient();
		$db = $con->test;
		$user = array('_id' => new MongoId($data['personId']));

		$db->user->remove($user);

	} catch (PDOException $e) {
		print "¡Error!: " . $e->getMessage() . "<br/>";
		die();
	}

}


?>