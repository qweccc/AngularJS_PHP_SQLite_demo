<?php

$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() === JSON_ERROR_NONE) {

	try {

		$con = new MongoClient(); // connects to localhost:27017
		$db = $con->test;

		if (isset($data['personId'])) {
			$user = array('_id' => new MongoId($data['personId']), 'nombre' => $data['nombre'], 'apellido' => $data['apellido']);

			// insertar $obj en la base de datos
			$db->user->save($user);
		} else {
			// no tiene id es un insert
			$db->user->insert(array('nombre' => $data['nombre'], 'apellido' => $data['apellido']));
		}

	} catch (PDOException $e) {
		print "¡Error!: " . $e->getMessage() . "<br/>";
		die();
	}
}
?>