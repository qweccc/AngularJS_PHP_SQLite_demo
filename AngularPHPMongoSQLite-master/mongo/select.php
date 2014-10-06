<?php

try {

	$con = new MongoClient(); // connects to localhost:27017
	$db = $con->test;

	if (isset($_GET['personId'])) {
		$personQuery = array('_id' =>  new MongoId($_GET['personId']));
		$result = $db->user->findOne($personQuery);
		//echo "restul asdf " . $result['_id'];
	} else {
		$result = iterator_to_array($db->user->find(), false);
	}
	echo json_encode($result);
} catch (PDOException $e) {
	print "¡Error!: " . $e->getMessage() . "<br/>";
	die();
}

?>