function MongoController($scope, $http, $log) {

$scope.loadPerson = function(){
		$http.get('mongo/select.php', '').success(function(response) {
		$scope.personas = response;
	}).error(function(response) {
		$log.log('Error al conectar con la BD.');
	});
	}

	$scope.currentPage = 0;
	$scope.pageSize = 10;
	$scope.alerts;
	$scope.loadPerson();


	$scope.addPerson = function() {
		var FormData = {'nombre' : $scope.person.nombre, 'apellido' : $scope.person.apellido };

		$http.post('mongo/persist.php', FormData, '')
		.success(function(response) {
			// recargo nuevamente la lista
			$scope.loadPerson();
			//alert(response);
			$scope.alerts = [{ type: 'success', msg: 'Persona agregada con éxito.' }, ];
			// limpio el form
			$scope.person = '';
		})
		.error(function(response) {
			$log.log('Error al persistir información del usuario.');
		});

	};

	$scope.deletePerson = function( person ) {
		var deleteUser = confirm('Esta seguro de eliminar el usuario ' + person.nombre +'?');   

		if (deleteUser) {
			$http.post('mongo/delete.php', {'personId': person._id.$id }, '')
			.success(function(response) {
				$scope.alerts = [{ type: 'success', msg: 'El usuario ' + person.nombre + ' se a eliminado correctamente.' }, ];
				$scope.loadPerson();
			})
			.error(function(response) {
				$log.log('Error al eliminar el usuario.');
			});
		}
	}
}