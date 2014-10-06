//creamos la configuración de nuestro modulo
var configApp = function($routeProvider){

    $routeProvider.when("/sqlite", {
        controller: "SQLiteController",
        templateUrl: "src/views/sqlite.html"
    }).when("/mongo", {
        controller: "MongoController",
        templateUrl: "src/views/mongo.html"
    }).when("/", {
        controller: "",
        templateUrl: "src/views/home.html"
    }).otherwise({
      redirectTo: '/'
    });

}

//creamos el modulo y le aplicamos la configuración
var app = angular.module('myapp', ['ui.bootstrap']).config(configApp);


//*** FILTROS ***//
//We already have a limitTo filter built-in to angular, let's make a startFrom filter
// utilizado en controladores para el paginado
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        if (input != undefined && input.length != undefined) {
            return input.slice(start);
        };
    }
});
