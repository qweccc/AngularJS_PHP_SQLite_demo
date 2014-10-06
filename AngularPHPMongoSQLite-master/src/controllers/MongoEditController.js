
function MongoEditController ($scope, $modal, $log, $http) {

	$scope.open = function ($person) {
		// armo la variable para pasarlas por get
		var config = { params: {'personId': $person._id.$id , }};
		// hago el pedido del usuario a editar y si todo sale ok, muestro el modal
		$http.get('mongo/select.php', config).success(function(response) {

			var modalInstance = $modal.open({
				templateUrl: "src/views/mongoEdit.html",
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

		var FormData = {'personId': $scope.person._id.$id ,'nombre' : $scope.person.nombre, 'apellido' : $scope.person.apellido };

		$http.post('mongo/persist.php', FormData, '').success(function(response) {
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
