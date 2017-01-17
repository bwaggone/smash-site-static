'use strict';   // See note about 'use strict'; below
$(document).ready(function(){
	$('.parallax').parallax();
	$('.button-collapse').sideNav();
	$('.search-bar').select2({
		placeholder: "Type to select a tournament, player, or game"
	});
});

$(function(){
	// bind change event to select
	$('#dynamic_select').on('change', function () {
		var url = $(this).val(); // get selected value
		if (url) { // require a URL
			window.location = url; // redirect
		}
		return false;
	});
});

var myApp = angular.module('myApp', []);

myApp.controller('testCtrl', function($scope) {
	$scope.test1 = "hola";
	$scope.test2 = "konichiwa";
});

myApp.controller("searchTest",['$scope', '$q', '$http', function($scope,$q,$http) {
	var _this = this;

	$http.get('json/test.json')
		.success(function(data) {
			console.log(data);
			angular.extend(_this, data);
			$scope.test3 = data;
		})
	.error(function() {
		console.log('could not find test.json');
	});

	$scope.results = [];
	$scope.findValue = function(enteredValue) {     
		angular.forEach($scope.test3, function(value) {
			if (value === enteredValue) {
				$scope.results.push({value});
			}
		});
	};

	$scope.findValue("Armada")
}]);


myApp.controller('myCtrl', function($scope, $http) {
	$scope.readCSV = function() {
		// http get request to read CSV file content
		console.log("Reading csv")
			$http.get('/csv/sample.csv').success($scope.processData);
		//$http.get('/csv/sample.csv').success($scope.processData);
	};

	$scope.processData = function(allText) {
		// split content based on new line
		console.log(allText);
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var lines = [];

		for (var i = 1; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split(',');
			if (data.length == headers.length) {
				//var tarr = [];
				//tarr.push(data[0])
				//for ( var j = 0; j < headers.length; j++) {
				//	tarr.push(data[j]);
				//}
				//lines.push(tarr);
				lines.push(data[0]);
			}
		}
		$scope.data = lines;
	};
	$scope.readCSV();
});





//var myApp = angular.module('myApp', [], function($interpolateProvider) {
//	$interpolateProvider.startSymbol('[[');
//	$interpolateProvider.endSymbol(']]');
//});
