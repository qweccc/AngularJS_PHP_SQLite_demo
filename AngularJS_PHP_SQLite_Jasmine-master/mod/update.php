<?php

try {
	if (
		empty($_POST['id'])
	) {
		throw new PDOException('Invalid request');	
	}
	
	$id = $_POST['id'];
	$done = empty($_POST['done']) ? 0 : 1;
	
	$objDb = new PDO('sqlite:../dbase/shopping-list');
	$objDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	// uses prepared statement PHP PDO, check PHP.net or check other tutorial
	$sql = "UPDATE items
			 SET done = ?
			 WHERE id = ?";
			
	$statement = $objDb->prepare($sql);
	
	if (!$statement->execute(array($done, $id))) {
			throw new PDOException('Execute method failed');
	}
	
	// only returning one record, so fetch
	$item = $statement->fetch();	
	
	echo json_encode (array (
		'error' => false
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
		
} catch (PDOException $e) {
	
	echo json_encode (array (
		'error' => true,
		'message' => $e->getMessage()
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
}
?>