<?php

try {
	if (
		empty($_POST['item']) ||
		empty($_POST['qty']) ||
		empty($_POST['type'])
	) {
		throw new PDOException('Invalid request');	
	}
	
	$item = $_POST['item'];
	$qty = $_POST['qty'];
	$type = $_POST['type'];
	
	$objDb = new PDO('sqlite:../dbase/shopping-list');
	$objDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	// uses prepared statement PHP PDO, check PHP.net or check other tutorial
	$sql = "INSERT INTO 'items'
			('id', 'item', 'qty', 'type')
			VALUES (null, ?, ?, ?)";
			
	$statement = $objDb->prepare($sql);
	
	if (!$statement->execute(array($item, $qty, $type))) {
			throw new PDOException('Execute method failed');
	}
	
	$id = $objDb->lastInsertId();
	
	$sql = "SELECT i.*,
			t.name AS type_name
			FROM items i
			JOIN types t
				ON t.'id' = i.type
			WHERE i.'id' = ?";
			
	$statement = $objDb->prepare($sql);
	
	if (!$statement->execute(array($id))) {
		throw new PDOException('Execute result returned null object');
	}
		
	// set fetch mode to associated array, so record is returned as table cell name value
	$statement->setFetchMode(PDO::FETCH_ASSOC);
	
	// only returning one record, so fetch
	$item = $statement->fetch();	
	
	echo json_encode (array (
		'error' => false,
		'item' => $item
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
		
} catch (PDOException $e) {
	
	echo json_encode (array (
		'error' => true,
		'message' => $e->getMessage()
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
}
?>