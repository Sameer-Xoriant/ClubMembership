var module = angular.module('app', ['ngRoute']);

module.service('ProductService', function () {
    var uid = 2;
    
    var products = [{
        id: 0,
        'name': 'Table',
            'quantity': '100',
            'price': '2000'
    },{
        id: 1,
        'name': 'Chair',
            'quantity': '50',
            'price': '5000'
    }];
    
    //save method create a new product if not already exists
    //else update the existing object
    this.save = function (product) {
    	if (product.id == null) {
            //if this is new product, add it in products array
            product.id = uid++;
            products.push(product);
        }else {
            //for existing contact, find this contact using id
            //and update it.
            for (i in products) {
                if (products[i].id == product.id) {
                	products[i] = product;
                }
            }
        }

    }
    
    this.edit = function (product) {
            for (i in products) {
                if (products[i].id == product.id) {
                	products[i] = product;
                }
            }
        }
    
    //simply search products list for given id
    //and returns the product object if found
    this.get = function (id) {
        for (i in products) {
            if (products[i].id == id) {
                return products[i];
            }
        }

    }
    
    //iterate through products list and delete 
    //product if found
    this.delete1 = function (id) {
        for (i in products) {
            if (products[i].id == id) {
                products.splice(i, 1);
            }
        }
    }

    //simply returns the products list
    this.list = function () {
        return products;
    }
});

module.controller('ProductController', function ($scope, ProductService ,$location) {

    $scope.products = ProductService.list();
    $scope.saveProduct = function () {
        ProductService.save($scope.newproduct);
        $scope.newproduct = {};
    }
    
    $scope.saveProductthere = function () {
    	var item = {id: $scope.id,name: $scope.name,quantity: $scope.quantity,price: $scope.price};
        ProductService.edit(item);
        $location.path("/");
    }
    
    $scope.delete1 = function (id) {

        ProductService.delete1(id);
        if ($scope.newproduct.id == id) $scope.newproduct = {};
    }


    $scope.edit = function (id) {
    	$scope.newproduct = angular.copy(ProductService.get(id));
    	$location.path('/editPage/' + $scope.newproduct.id + '/' + $scope.newproduct.name + '/' + $scope.newproduct.quantity + '/' + $scope.newproduct.price);
    }
});

module.config(function($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'ProductController',
			templateUrl: 'productinfo.html'
		})
		.when('/editPage/:id/:name/:quantity/:price', {
			controller: function($scope, $routeParams) {
				$scope.id = $routeParams.id;
				$scope.name = $routeParams.name;
				$scope.quantity = $routeParams.quantity;
				$scope.price = $routeParams.price;
			},
			templateUrl: 'edit.html'
		})
		.otherwise({redirectTo: '/'})
});