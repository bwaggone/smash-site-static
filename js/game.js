'use strict';   // See note about 'use strict'; below
$(document).ready(function(){
	$('.parallax').parallax();
	$('.button-collapse').sideNav();
	$('.search-bar').select2({
		placeholder: "Type to select a tournament, player, or game"
	});
	//$("*").filter(function() { return !$(this).children().length; })
	//    .html(function(index, old) { return old.replace('jigglypuff', '<img src="./images/neutral Jigglypuff.png" />');
});

var myApp = angular.module('myApp', [])
.filter('split', function() {
	return function(input, delimiter) {
		var delimiter = delimiter || ';';

		return input.split(delimiter);
		//.filter('split', function() {
		//	return function(input, splitChar, splitIndex) {
		// do some bounds checking here to ensure it has that index
		//		return input.split(splitChar)[splitIndex];
	}
	;});

myApp.controller('myCtrl', function($scope, $http) {
	$scope.readCSV = function() {
		// http get request to read CSV file content
		console.log("Reading csv")
			$http.get('./csv/sample3.csv').success($scope.readPlayers);
	};

	$scope.readPlayers = function(allText) {
		// split content based on new line
		//console.log(allText);
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var lines = [];

		for (var i = 1; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split(',');
			if (data.length == headers.length) {
				var tarr = [];
				//tarr.push(data[0])
				for ( var j = 0; j < headers.length; j++) {
					tarr.push(data[j]);
				}
				lines.push(tarr);
				//lines.push(data[0]);
			}
		}
		$scope.players = lines;
	};

	$scope.replaceText = function(text) {
		$scope.text = text;

		if($scope.text == "cf")
			$scope.text = "captainfalcon";

		return($scope.text);
	};

	$scope.mySplit = function(string) {
		console.log("test");
		var array = string.split(';');
		return array;
	};

	$scope.readCSV();
})

;

/*
   myApp.controller('insertPic', function($scope, $http) {
   $scope.replaceText = function(text) {
   console.log("Hello");
   if(text == "fox")
   $scope.text = "this is a test";
   else
   $scope.text = text;

   console.log($scope.text);
   };
   });

   $(window).bind("load", function() {
// code here
$("*").filter(function() { return !$(this).children().length; })
.html(function(index, old) { return old.replace('jigglypuff', '<img src="./images/neutral Jigglypuff.png" />');

})});

$( document ).ready(function() {
// Handler for .ready() called.
$("*").filter(function() { return !$(this).children().length; })
.html(function(index, old) { return old.replace('jigglypuff', '<img src="./images/neutral Jigglypuff.png" />');

})});
*/
//$("*").filter(function() { return !$(this).children().length; })
//    .html(function(index, old) { return old.replace('jigglypuff', '<img src="./images/neutral Jigglypuff.png" />');
