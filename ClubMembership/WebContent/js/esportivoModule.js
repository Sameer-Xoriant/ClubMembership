var module = angular.module('esportivo', ['ngRoute','ngCookies']);

function EsportivoController($scope, $http, $rootScope, $location, $route, $cookieStore) {
	
	//Register Function
	$scope.registerUser = function(fn,ln,em,occ,pass){
		 var BDate=new Date($scope.dob).toLocaleDateString().split("/");
		 var BDate=BDate[0]+BDate[1]+BDate[2];
		 console.log(BDate);
		 var TDate=new Date().toLocaleDateString().split("/");
		 var TDate=TDate[0]+TDate[1]+TDate[2];
		 console.log(TDate);
		 $http({
             method : 'POST',
             url : 'http://10.20.14.83:9001/users/register',
             headers : {
                   'Content-Type' : 'application/json',
                   'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
             },
             data : {
            	   firstName : fn, 
            	   lastName : ln, 
            	   emailId : em, 
            	   dateOfBirth : BDate, 
            	   mobileNumber : "7666885985", 
            	   occupation : occ, 
            	   registeredDate : TDate,
            	   password : pass, 
            	   status : 0, 
            	   userType : "User", 
            	   entranceFee : 1000, 
            	   paymentDone : 0
             }
      }).then(function successCallback(response) {
      		var data = response.data;
      		if(data == "success")
      			{
      			alert('alertactive');
      			}
            alert("Registration successful!");
             },function errorCallback(response) {
            alert("Registration Failed!");
          	  });
	};
	
	//Login Function
	$scope.userLogin = function(u, p) {
	    $http({
	           method : 'POST',
	           url : 'http://10.20.14.83:9001/users/login',
	           headers : {
	                 'Content-Type' : 'application/json',
	                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	           },
	           data : {
	                 emailId: u,
	                 password: p,
	                 }
	    }).then(function successCallback(response) {
	           var data = response.data;
	           $rootScope.cid = data.id;
	           $rootScope.cut = data.userType;
	           $cookieStore.put("id", $rootScope.cid);
	           $cookieStore.put("userType", $rootScope.cut);
	           console.log($cookieStore.get("userType"));;
	           alert('Login Success!!');
	    }, function errorCallback(response) {
	          alert('Failed');
	    });
	
	};
	
	//Logout Function
	$scope.userLogout = function() {
	    $http({
	        method : 'GET',
	        url : 'http://10.20.14.83:9001/users/logout/' + $cookieStore.get("id"),
	        headers : {
	              'Content-Type' : 'application/json',
	              'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	        }}).then(function successCallback(response) {
	              $cookieStore.remove('id');
	              $cookieStore.remove('userType');
	              console.log('Logout Success !!')
	        });
	    };
	
	
	
	$scope.viewLoaded=function(){
		var $item = $('.carousel .item'); 
		var $wHeight = $(window).height() - 50;
		$item.eq(0).addClass('active');
		$item.height($wHeight); 
		$item.addClass('full-screen');

		$('.carousel img').each(function() {
		  var $src = $(this).attr('src');
		  var $color = $(this).attr('data-color');
		  $(this).parent().css({
		    'background-image' : 'url(' + $src + ')',
		    'background-color' : $color
		  });
		  $(this).remove();
		});

		$(window).on('resize', function (){
		  $wHeight = $(window).height();
		  $item.height($wHeight);
		});

		$('.carousel').carousel({
		  interval: 3000,
		  pause: "false"
		});
		
	}
	
}

module.controller('EsportivoController', EsportivoController);

/* module.directive('stringToTimestamp', function() {
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ngModel) {
            // view to model
            ngModel.$parsers.push(function(value) {
                return Date.parse(value);
            });
        }
    }
});
*/

module.config(function($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'EsportivoController',
			templateUrl: 'home.html',
			activetab : 'index'
		})
		.when('/login', {
			controller: 'EsportivoController',
			templateUrl: 'login.html'
		})
		.when('/aboutus', {
			controller: 'EsportivoController',
			templateUrl: 'aboutus.html'
		})	
		.otherwise({redirectTo: '/'})
});