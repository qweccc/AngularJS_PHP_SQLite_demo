<?php

/*CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre varchar(50),
  apellido varchar(50)
  )*/

$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() === JSON_ERROR_NONE) {

	try {

		$db = new PDO("sqlite:c:/sqllite/test.db");

		if (isset($data['id'])) {
			$query = $db->prepare(" UPDATE user SET nombre = :nombre, apellido = :apellido WHERE id = :id");
			$query->bindParam(':nombre', $data['nombre']);
			$query->bindParam(':apellido', $data['apellido']);
			$query->bindParam(':id', $data['id']);
		} else {
			// no tiene id es un insert
			$query = $db->prepare("INSERT INTO USER (nombre, apellido) VALUES (:name, :surname)");
			$query->bindParam(':name', $data['nombre']);
			$query->bindParam(':surname', $data['apellido']);
		}
		if ($query->execute()) {
			echo 'Guardado con éxito';
		}

	} catch (PDOException $e) {
		print "¡Error!: " . $e->getMessage() . "<br/>";
		die();
	}

}


?>