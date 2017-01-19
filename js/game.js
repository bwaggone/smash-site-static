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

var myApp = angular.module('myApp', ['ngRoute', 'ui.router'])
.filter('split', function() {
	return function(input, delimiter) {
		var delimiter = delimiter || ';';

		return input.split(delimiter);
	}
	;})
.config(function ($stateProvider, $routeProvider, $locationProvider) {
	$routeProvider.when('/:type', {
		controller: "myCtrl"
	});
	$locationProvider.html5Mode(true);

});

;

myApp.controller('myCtrl', function($scope, $route, $routeParams, $http, $location) {
	$scope.game = ($location.search()).type;

	$scope.readCSV = function() {
		// http get request to read CSV file content
		console.log("Reading csv");
		$http.get('./smash-site-static/csv/'+ $scope.game +'-rankings.csv').success($scope.readPlayers);
		$http.get('./smash-site-static//data/'+ $scope.game +'/Singles/tournaments.csv').success($scope.readTournaments);
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
				var tarr = {
					tag: data[0],
					rank: parseInt(data[1]),
					characters: data[2],
					score: parseFloat(data[3]),
					change: parseInt(data[4])

				};
				//tarr.push(data[0])
				//for ( var j = 0; j < headers.length; j++) {
				//	tarr.push(data[j]);
				//}
				lines.push(tarr);
				//lines.push(data[0]);
			}
		}
		$scope.players = lines;
	};

	$scope.readTournaments = function(allText) {
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var lines = [];
		for (var i = 1; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split(',');
			if (data.length == headers.length) {
				var tarr = {
					name: data[0],
					slug: data[1],
					start: data[2],
					end: data[3],
					entrants: parseFloat(data[4]),
				};
				lines.push(tarr);
			}
		}

		$scope.tourneys = lines;

	};

	$scope.replaceText = function(text) {
		$scope.text = text;

		return($scope.text);
	};


	$scope.tab = 1;
	$scope.setTab = function(newTab){
		$scope.tab = newTab;
		console.log($scope.tab);
	};

	$scope.isSet = function(tabNum){
		return $scope.tab === tabNum;
	};


	$scope.playersortType  = 'rank'; // set the default sort type
	$scope.playersortReverse = false;  // set the default sort order

	$scope.tourneysortType  = 'end'; // set the default sort type
	$scope.tourneysortReverse = true;  // set the default sort order
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
