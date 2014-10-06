<?php

$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() === JSON_ERROR_NONE) {

	try {

		$db = new PDO("sqlite:c:/sqllite/test.db");

		$query = $db->prepare("DELETE FROM USER WHERE id = :id");
		$query->bindParam(':id', $data['personId']);
		$query->execute();

	} catch (PDOException $e) {
		print "¡Error!: " . $e->getMessage() . "<br/>";
		die();
	}

}


?>