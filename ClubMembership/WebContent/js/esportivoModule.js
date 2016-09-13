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
            swal({title: "Registration successful!",   text: "Now you can Proceed To login.",   imageUrl: "images/thumbs-up.jpg" });
             },function errorCallback(response) {
            alert("Registration Fialed !" , "Please try again" , "warning");
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
	           if(data.id != 'failure'){
	           $rootScope.cid = data.id;
	           $rootScope.cut = data.userType;
	           $cookieStore.put("id", $rootScope.cid);
	           $cookieStore.put("userType", $rootScope.cut);
	           $scope.userDetails();
	           console.log($cookieStore.get("userType"));
	           $cookieStore.put("login", true);
	           swal("Welcome Aboard !", "Login was Successful" , "success");
	           }
	           if($cookieStore.get('userType') === "User" || $cookieStore.get('userType') === "permanent"){
	        	   $location.path('/dashboard');
	           }else if($cookieStore.get('userType') === "Staff" || $cookieStore.get('userType') === "Secretary"){
	        	   $location.path('/staffDashboard');
	           }else {
	    	   swal("Login Failed" ," ", "warning");
	    	   $location.path('/login');
	           }
	    });
	};
	
	//Get Pending Request
	$scope.getPending = function(){
		var users=[];
		$http({
	        method : 'GET',
	        url : 'http://10.20.14.83:9001/users/pendingrequests/' + $cookieStore.get("id"),
	        headers : {
	              'Content-Type' : 'application/json',
	              'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	        }}).then(function successCallback(response) {
	        	$scope.users = response.data;
	        	});             
	};
	
	//Get Permanent Pending
	$scope.getPermPending = function(){
		var permUsers=[];
		$http({
	        method : 'GET',
	        url : 'http://10.20.14.83:9001/users/pendingrequests/permanent/' + $cookieStore.get("id"),
	        headers : {
	              'Content-Type' : 'application/json',
	              'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	        }}).then(function successCallback(response) {
	        	$scope.permUsers = response.data;
	        	});             
	};
	
	//Approve Status 1
	$scope.approveUser = function(a) {
	    $http({
	           method : 'GET',
	           url : 'http://10.20.14.83:9001/users/request?email=' + a + '&status=accept',
	           headers : {
	                 'Content-Type' : 'application/json',
	                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	           }
	    }).then(function successCallback(response) {
	           var data = response.data;
	           if(data.status != null){
	        	   swal("User Approved :D" , "User Reminded" , "success");
	        	   $route.reload();
	           }
	    });
	};
	
	//Approve Perm User
	$scope.approvePermUser = function(a) {
	    $http({
	           method : 'PUT',
	           url : 'http://10.20.14.83:9001/users/status/approve/permanent/' + a,
	           headers : {
	                 'Content-Type' : 'application/json',
	                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	           }
	    }).then(function successCallback(response) {
	           var data = response.data;
	           if(data.result != null){
	        	   swal("Approved !" , "Usertype set To Permanent" , "success");
	        	   $route.reload();
	           }
	    });
	};
	
	//Reject Perm user
	$scope.rejectPerm = function(a) {
		$http({
	           method : 'PUT',
	           url : 'http://10.20.14.83:9001/users/payment/' + a + '/entry',
	           headers : {
	                 'Content-Type' : 'application/json',
	                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	           }
	    }).then(function successCallback(response) {
	           var data = response.data;
	           console.log("Rejected");
	    }, function errorCallback(response) {
	    		console.log("Error Hoo Gaya bhai");
	    }); 
};

	
	//Reject Normal user
	$scope.rejectUser = function(a) {
	    $http({
	           method : 'GET',
	           url : 'http://10.20.14.83:9001/users/request?email=' + a + '&status=1',
	           headers : {
	                 'Content-Type' : 'application/json',
	                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	           }
	    }).then(function successCallback(response) {
	           var data = response.data;
	           if(data.status == ""){
	        	   swal("User Rejected :D" , "User Reminded" , "success");
	        	   $route.reload();
	           }
	    });
	};
	
	//Set User Details
	$scope.userDetails = function(){
		 $http({
		        method : 'GET',
		        url : 'http://10.20.14.83:9001/users/' + $cookieStore.get("id"),
		        headers : {
		              'Content-Type' : 'application/json',
		              'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
		        }}).then(function successCallback(response) {
		        		var data = response.data;
			           $rootScope.cname = data.firstName;
			           $rootScope.cdate = data.registeredDate;
			           var dater = new Date($rootScope.cdate).toLocaleDateString();
			           $cookieStore.put("Name", $rootScope.cname);
			           $cookieStore.put("dater",dater);
			           console.log($cookieStore.get("dater"));
		        });
		
	};
	
	//Profile Dashboard
	$scope.userProfile = function(){
		if($cookieStore.get("id") != null){
		$http({
	        method : 'GET',
	        url : 'http://10.20.14.83:9001/users/' + $cookieStore.get("id"),
	        headers : {
	              'Content-Type' : 'application/json',
	              'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	        }}).then(function successCallback(response) {
	        		var data = response.data;
	        		var userProfile = [];
	        		var dater = [];
	        		var dob = new Date(data.dateOfBirth);
	        		dater[1] = dob.toString().substring(4, 7);
	        		dater[2] = dob.toString().substring(8, 10);
	        		dater[3] = dob.toString().substring(11, 16);
	        		var finalDob = dater.join(" ");
	        		userProfile.push({id: data.id, firstName : data.firstName, lastName: data.lastName, emailId: data.emailId, dateOfBirth : finalDob, 
	        			mobileNumber : data.mobileNumber, occupation: data.occupation, registeredDate: data.registeredDate, password: data.password, totalAmount : data.totalAmount,
	        			status : data.status, userType : data.userType, entranceFee : data.entranceFee, facilities : data.facilities, addOns : data.addOns, previousRenewalTime : data.previousRenewalTime, paymentDone : data.paymentDone});
	        		$scope.userProfile = userProfile[0];
	        });
	}else{
		$location.path('/login');
	}
};
	
	//Payment Model
	$scope.payu = function() {
		$http({
	           method : 'PUT',
	           url : 'http://10.20.14.83:9001/users/payment/' + $cookieStore.get("id") + '/entry',
	           headers : {
	                 'Content-Type' : 'application/json',
	                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	           }
	    }).then(function successCallback(response) {
	           var data = response.data;
	           swal("Payment Done Successfully" , "" , "success");
	           $location.path('/dashboard');
	    }, function errorCallback(response) {
	    		swal("Payment Declined." , "Please try again later." , "warning");
	    }); 
};

//Payment Model
$scope.permPayu = function() {
	$http({
           method : 'PUT',
           url : 'http://10.20.14.83:9001/users/payment/' + $cookieStore.get("id") + '/user',
           headers : {
                 'Content-Type' : 'application/json',
                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
           }
    }).then(function successCallback(response) {
           var data = response.data;
           swal("Payment Done Successfully" , "" , "success");
           $location.path('/dashboard');
    }, function errorCallback(response) {
    		swal("Payment Declined." , "Please try again later." , "warning");
    }); 
};

$scope.updateUser = function() {
	var id = $cookieStore.get('id');
	var f=$(".modal-body #updatefname").val();
	var l=$(".modal-body #updatelname").val();
	var o=$(".modal-body #updateocc").val();
	var m=$(".modal-body #updatemob").val();
	$http({
		method : 'PUT',
		url : 'http://10.20.14.83:9001/users/' + $cookieStore.get("id"),
		headers : {
			'Content-Type' : 'application/json',
			'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/',
			'auth-token' : $cookieStore.get('auth-token')
		},
		data : {
			"Id" : id,
			"firstName" : f,
			"lastName" : l,
			"occupation" : o,
			"mobileNumber" : m,
		}
	}).then(function successCallback(response) {
		var data = response.data;
		if (data.id != null) 
		{
			$('#updateModal').modal('hide');
			$route.reload();
			swal('Profile Updated');
		} else 
		{
			swal('Profile not updated'+"\n\n"+"Not valid auth-token or postid");
		}		
	}, function errorCallback(response) {
		swal("Server Error. Try After Some time: " + response.data.data.error);
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
	              $cookieStore.remove('Name');
	              $cookieStore.remove('dater');	
	              $cookieStore.put("login", false);
	              console.log('Logout Success !!');
	              swal('Adiós mi amigo.');
	              $location.path('/');
	              });
	        };
	
	//Compare dates
	$scope.compDate = function(){
		var datetoday = new Date().toISOString();
		console.log(datetoday);
		var dateold = new Date($cookieStore.get("dater")).toISOString();
		var timeDiff = Math.floor((Date.parse(datetoday) - Date.parse(dateold))/86400000);
        console.log(timeDiff);
        if(timeDiff > 90){
        	$scope.userPapplication();
        }else{
        	swal("Sorry !" , "You need to wate for 90 days before applying for Permanent Membership");
        }
	};
		        
	// Apply for Permanent Membership
	$scope.userPapplication = function(){
		$http({
	           method : 'PUT',
	           url : 'http://10.20.14.83:9001/users/status/apply/permanent/' + $cookieStore.get("id"),
	           headers : {
	                 'Content-Type' : 'application/json',
	                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9001/'
	           }
	    }).then(function successCallback(response) {
	           var data = response.data;
	           swal("Application Successfull" , "The Staff will get back to you soon." , "success");
	           $route.reload();
	    }, function errorCallback(response) {
	    		swal("Application Failed." , "Please contact out helpdesk." , "warning");
	    }); 
	};
	
	//View Function
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
		$('input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="time"], input[type="week"]').each(function() {
		    var el = this, type = $(el).attr('type');
		    if ($(el).val() == '') $(el).attr('type', 'text');
		    $(el).focus(function() {
		        $(el).attr('type', type);
		        el.click();
		    });
		    $(el).blur(function() {
		        if ($(el).val() == '') $(el).attr('type', 'text');
		    });
		});
	};

	$scope.showstatus = function() {
	  	
		return $cookieStore.get("login");  
	};

	$scope.showName = function(){
		
		return $cookieStore.get("Name");

	};
	
};
	
	


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
		.when('/dashboard', {
			controller: 'EsportivoController',
			templateUrl: 'dashboard.html'
		})
		.when('/staffDashboard', {
			controller: 'EsportivoController',
			templateUrl: 'staffDashboard.html'
		})
		.when('/payu', {
			controller: 'EsportivoController',
			templateUrl: 'payu.html'
		})
		.when('/indoor', {
			controller: 'EsportivoController',
			templateUrl: 'Indoor.html'
		})
		.when('/outdoor', {
			controller: 'EsportivoController',
			templateUrl: 'Outdoor.html'
		})
		.when('/leisure', {
			controller: 'EsportivoController',
			templateUrl: 'Leisure.html'
		})
		.when('/permPay', {
			controller: 'EsportivoController',
			templateUrl: 'permpay.html'
		})
		.otherwise({redirectTo: '/'})
});