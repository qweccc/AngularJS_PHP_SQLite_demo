describe('helperFactory test', function() {
	var helperFactory = null,
		items = [
			{id : 1, item: 'Apples', qty : 1, type : 2, done : 0},
			{id : 2, item: 'Bread', qty : 1, type : 1, done : 1},
			{id : 3, item: 'Bananas', qty : 2, type : 2, done : 1},
			{id : 4, item: 'Pears', qty : 1, type : 2, done : 0}
		],
		thisItems = [];
		
	// jasmine there is beforeEach and afterEach
	// now we can do it two ways:
	// 1. before test (before beforeEach) we must call the module
	/*beforeEach(module('clausApp'));
	
	// inject helper factory by using underscore
	// Jasmine knows to remove underscore when searching for service to inject
	// we use underscores because we have already a private variable with same name
	beforeEach(inject(function (_helperFactory_) {
		helperFactory = _helperFactory_;
	}));*/
	
	// 2. alternative to separate beforeEach, wrap them within one beforeEach
	beforeEach(function () {
		module ('clausApp');
		
		inject(function(_helperFactory_) {
			helperFactory = _helperFactory_;
		});	
	});
	
	// helperFactory has one method, so test this using jasmine it function
	it('should filter array and return records that are completed (done)', function(){
		thisItems = helperFactory.filterFieldArrayByDone(items, 'id', 1);
		
		expect(thisItems.length).toEqual(2);
	});	
});

describe('ShoppingListController helper methods test', function() {
	var $scope,
			helperFactory,
			ShoppingListController;
			
	beforeEach(function () {
		module('clausApp');
		
		// each angular app has a single root scope 
		// (all other scope - such as $scope - are simply a descendant of root scope)
		inject(function($rootScope, _helperFactory_, $controller) {
			
			// creating new scope for our test
			$scope = $rootScope.$new();
			
			helperFactory = _helperFactory_;
			
			ShoppingListController = $controller('ShoppingListController', {
				
				// object with two parameters which are the arguments we are passing to the controller
				// (there are more than two, but we just pass two two for our test)
				
				// all arguments we have missed are automatically passed to controller, 
				// but we only need access to these two				
				$scope : $scope,
				helperFactory : helperFactory
			});
		});
	});
	
	// start test
	it('should return 0 for 2 characters', function () {
		$scope.item = '12'; // just two character string
		
		expect($scope.howManyMoreCharactersNeeded()).toEqual(0);
	});	
	
	it('should return 40 for 10 characters', function() {
		$scope.item = '1234567890'; // 10 character string
		
		expect($scope.howManyCharactersRemaining()).toEqual(40);
	});
	
	it('should return 10 for 60 characters', function () {
		$scope.item ='123456789012345678901234567890123456789012345678901234567890';
		
		expect($scope.howManyCharactersOver()).toEqual(10);
	});
	
	it('it should return true for 2 or more characters - false otherwise', function () {
		$scope.item ='1';
		
		expect($scope.minimumCharactersMet()).toBeFalsy();
		
		$scope.item ='12';
		
		expect($scope.minimumCharactersMet()).toBeTruthy();
	});
	
	// could do more tests, but we just test clear for now
	it('should clear the item, qty and type properties', function () {
		$scope.item = 'Bananas';
		$scope.qty = 1;
		$scope.type = 2;
		
		$scope.clear();
		
		expect($scope.item).toBe('');
		expect($scope.qty).toBe('');
		expect($scope.type).toBe(2); // default selected item
	});
});

// test method calling PHP script communicating with database

describe('ShoppingListController $http methods test', function () {
		var $scope,
			$http,
			$httpBackend,
			$log,
			helperFactory,
			ShoppingListcontroller;
			
		beforeEach(function () {
			module('clausApp');
			
			// $httpBackend Angulars mock allows us to create fake backend calls
			// and return hard coded data
			inject(function ($rootScope, _$http_, _$httpBackend_, _$log_, _helperFactory_, $controller) {
				$scope = $rootScope.$new();
				$http = _$http_;
				$httpBackend = _$httpBackend_;
				$log = _$log_;
				helperFactory = _helperFactory_;
				
				$httpBackend.whenGET('/mod/select.php').respond({
					items : [
						{id : 1, item: 'Apples', qty : 1, type : 2, done : 0},
						{id : 2, item: 'Bread', qty : 1, type : 1, done : 1}
					],
					types : [
						{ id : 1, name : 'Qty' },
						{ id : 2, name : 'Kg' }					
					]				
				});
				
				ShoppingListController = $controller('ShoppingListController', {
					$scope: $scope,
					$http: $http,
					$log: $log,
					helperFactory: helperFactory
				});			
			});		
		});
		
		// make sure everything is clear after each test
		afterEach(function () {
			// verify all requests defined by expect were made, ie. no outstanding			
			$httpBackend.verifyNoOutstandingExpectation();
			// if making ajax (fake) that all of them have been flushed and everything has been returned
			$httpBackend.verifyNoOutstandingRequest();
		});
		
		it('should get all items', function () {
			
			$httpBackend.flush();
			
			expect($scope.items.length).toBe(2);
			expect($scope.types.length).toBe(2);
		});
		
		it('should insert new item and clear properties', function () {
			$httpBackend.flush();
			
			expect($scope.items.length).toBe(2);
			
			$scope.item = 'Bananas';
			$scope.qty = 2;
			$scope.type = 2;
			
			// prepare statement for insert method is called (respond with JSON)
			$httpBackend
				.expectPOST('/mod/insert.php')
				.respond(
					{
						error: false,
						item : {
							id : 3,
							item : 'Bananas',
							qty : 2,
							type : 2,
							done : 0,
							date : '2014-10-01 18:18:18'
						}
					});
					
			$scope.insert();
			
			// flush to make sure insert is executed
			$httpBackend.flush();
	
			// we get initial array of 2 from first flush statement, we've then executed insert		
			expect($scope.items.length).toBe(3);
			//expect($scope.items[2].id).toBe(3);
			expect($scope.items[2].item).toBe('Bananas');
			expect($scope.items[2].qty).toBe(2);
			expect($scope.items[2].type).toBe(2);
			
			// test clear method after insert
			expect($scope.item).toBe('');
			expect($scope.qty).toBe('');
			expect($scope.type).toBe(2);
				
						
		});
		
		it('should update and return json {error : false}', function () {
			$httpBackend.flush();
			
			$httpBackend
				.expectPOST('/mod/update.php')
				.respond({ error : false });
			
			$scope.update({ id : 1, done : 1});
			
			$httpBackend.flush();
			
			expect($log.info.logs).toContain([{ error : false }]);
		});
		
		it('should remove and filter to include only { done : 0}', function () {
			$httpBackend.flush();
			
			$httpBackend
				.expectPOST('/mod/remove.php')
				.respond({ error : false });
			
			$scope.remove();
			
			$httpBackend.flush();
			
			// we know only "Apples" had Done : 0
			
			expect($scope.items.length).toBe(1);
			expect($scope.items[0].item).toContain('Apples');
		});
});