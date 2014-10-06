"use strict";

var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function($scope) {
  $scope.phones = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'Motorola XOOM™ with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'MOTOROLA XOOM™',
     'snippet': 'The Next, Next Generation tablet.'}
  ];
});

var clausApp = angular.module('clausApp', []);

// module constants
// javascript does not have constants, but use caps to show these will never change
clausApp.constant('MAX_LENGTH', 50)
clausApp.constant('MIN_LENGTH', 2)

clausApp.factory('helperFactory', function () {
	return {
		filterFieldArrayByDone : function (thisArray, thisField, thisValue) {
			var arrayToReturn = [];
			
			for (var i = 0; i < thisArray.length; i++) {
				if (thisArray[i].done == thisValue) {
					arrayToReturn.push(thisArray[i][thisField]);
				}
			}
			
			return arrayToReturn;
		}	
		
	};		
}});

// dependency injections
// $scope service allows communciate between controller and view (index.html) - two way binding to change field values
// $http service to allow ajax
// $log service log to console
clausApp.controller('ShoppingListController', function ($scope, $http, $log, helperFactory, MAX_LENGTH, MIN_LENGTH) {
	var urlInsert = '/mod/insert.php';
	var urlSelect = '/mod/select.php';
	var urlUpdate = '/mod/update.php';
	var urlRemove = '/mod/remove.php';
	
	$scope.types = [];
	$scope.items = [];
	
	$scope.item = '';
	$scope.qty = '';
	$scope.types = '';
	
	$scope.howManyMoreCharactersNeeded = function() {
		var characters = (MIN_LENGTH - $scope.item.length);
		return (characters > 0) ? characters : 0;
	};
	
	$scope.howManyCharactersRemaining = function() {
		var characters = (MAX_LENGTH - $scope.item.length);
		
		return (characters > 0) ? characters : 0;
	};
	
	$scope.howManyCharactersOver = function () {
		var characters = (MAX_LENGTH - $scope.item.length);
		
		return (characters < 0) ? Math.abs(characters) : 0;
	};
	
	$scope.minimumCharactersMet = function () {
		return ($scope.howManyCharactersNeeded() == 0);
	};
	
	$scope.anyCharactersOver = function () {
		return ($scope.howManyCharactersOver() > 0);
	};
	
	$scope.isNumberOfCharactersWithinRange = function () {
		return ($scope.minimumCharactersMet() && !$scope.anyCharactersOver());
	};
	
	$scope.goodToGo = function(){
		return ($scope.isNumberOfCharactersWithingRange() && $scope.qty > 0 && $scope.type > 0);
	};
	
	$scope.clear = function () {
		$scope.item = '';
		$scope.qty = '';
	};
	
	function _recordAddedSuccessfully(data){
		return (data && !data.error && data.item);
	}
	
	$scope.insert = function () {
		if ($scope.goodToGo()) {
			$http({
				method : 'POST',
				url : urlInsert,
				data : "item=" + $scope.item + "&qty=" + $scope.qty + "&type=" + $scope.type,
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}				
			})
				.success(function(data) {
					if (_recordAddedSuccessfully(data)) {
						$scope.item.push({
							id : data.item.item,
							qty : data.item.qty,
							type : data.item.type,
							type_name : data.item.type_name,
							done : data.item.done
						});
						
						$scope.clear();
					}
				})
				.error(function(data, status, headers. config){
					throw new Error('Something went wrong with inserting record');						
				});
		}
	};
	
	$scope.select = function () {
		$http.get(urlSelect)
		.success(function(data) {
			if (data.items) {
				$scope.items = data.items;
			}
			
			if (data.types) {
				$scope.types = data.types;
				$scope.type = $scope.types[0].id;
			}
		})
		.error(function(data, status, headers. config){
			throw new Error('Something went wrong with selecting records');						
		});
	};
	
	// when page first loaded, automatically select
//		$scope.select();
	
	$scope.update = function (item) {
		$http({
			method: 'POST',
			url : urlUpdate,
			data : "id=" + item.id + "&done=" + item.done,
			headers : {'Content-Type' : 'application/x-www-form-urlencoded'}	
		})
		.success(function (data) {
			$log.info(data);
		})
		.error(function(data, status, headers. config){
			throw new Error('Something went wrong with updating record');						
		});
	};
	
	function _recordRemovedSuccessfully(data) {
		return (data && !data.error);
	}
	
	$scope.remove = function () {
		var removeIds = helperFactory.filterFieldArrayByDone($scope.items, 'id', 1);
		
		if (removeIds.length > 0) {
			&http({
				method: 'POST',
				url : urlRemove,
				data : "ids=" + removeIds.join('|'),
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}	
			})
			.success(function (data) {
				if (_recordRemovedSuccessfully(data)) {
					$scope.items = $scope.items.filter(function(item) {
						return item.done == 0;
					});
				}
				
			})
			.error(function(data, status, headers. config){
				throw new Error('Something went wrong with removing records');						
			});
		}
	};
	
	$scope.print = function() {
		window.print();
	};
});
	