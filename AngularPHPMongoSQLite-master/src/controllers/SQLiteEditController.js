
function SQLiteEditController ($scope, $modal, $log, $http) {

	$scope.open = function ($person) {
		// armo la variable para pasarlas por get
		var config = { params: {'personId': $person.id , }};
		// hago el pedido del usuario a editar y si todo sale ok, muestro el modal
		$http.get('sqllite/select.php', config).success(function(response) {

			var modalInstance = $modal.open({
				templateUrl: "src/views/sqliteEdit.html",
				controller: ModalInstanceCtrl,
				resolve: {
					person: function() {
						return response;
					}
				}
			});
		}).error(function(response) {
			alert('Se generó un error al obtener la información del usuario.');
		});
	};
};

var ModalInstanceCtrl = function ($scope, $modalInstance, $http, $route, person) {

	$scope.person = person;

	$scope.ok = function () {

		var FormData = {'id': $scope.person.id ,'nombre' : $scope.person.nombre, 'apellido' : $scope.person.apellido };

		$http.post('sqllite/persist.php', FormData, '').success(function(response) {
			$scope.alerts = [{ type: 'success', msg: 'Persona agregada con éxito.' }, ];
			$modalInstance.close();

			// confirmo la actualización del usuario, al aceptar el mensaje refresco la pagina
			alert('Se ha modificado correctamente el usuario ;)');   
			$route.reload();

		}).error(function(response) {
			$log.log('Error al persistir información del usuario.');
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};
