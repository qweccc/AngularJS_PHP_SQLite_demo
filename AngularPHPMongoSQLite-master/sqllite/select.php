<?php

try {

	$db = new PDO("sqlite:c:/sqllite/test.db");

	if (isset($_GET['personId'])) {
		$query = $db->prepare("SELECT * FROM user WHERE id = :id");
		$query->bindParam(':id', $_GET['personId']);

		$query->execute();
		$result = $query->fetch();
		
	} else {

		$results = $db->query("SELECT * FROM user ");
		$result = $results->fetchAll();
	}

	echo json_encode($result);

} catch (PDOException $e) {
	print "¡Error!: " . $e->getMessage() . "<br/>";
	die();
}

?>