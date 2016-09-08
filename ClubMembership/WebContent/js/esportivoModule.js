var module = angular.module('esportivo', ['ngRoute','ngCookies']);

function EsportivoController($scope, $http, $rootScope, $location, $route, $cookieStore) {

}

module.controller('EsportivoController', EsportivoController);

module.config(function($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'EsportivoController',
			templateUrl: 'home.html',
			activetab : 'index'
		})
		.otherwise({redirectTo: '/'})
});