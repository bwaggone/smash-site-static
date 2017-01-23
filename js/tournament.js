'use strict';   // See note about 'use strict'; below
$(document).ready(function(){
	$('.parallax').parallax();
	$('.button-collapse').sideNav();
	$('.search-bar').select2({
		placeholder: "Type to select a tournament, player, or game"
	});
	$('.collapsible').collapsible();

	$('ul.tabs').tabs();
	/*
	   $('input.autocomplete').autocomplete({
	   data: {
	   "Pikachu": './images/64-stocks/pikachu.png',
	   "Luigi": './images/64-stocks/luigi.png',
	   "Mario": './images/64-stocks/mario.png',
	   "Captain Falcon": './images/64-stocks/captain falcon.png',
	   "Kirby": './images/64-stocks/kirby.png',
	   "Jigglypuff":'/images/64-stocks/jigglypuff.png',
	   "Ness":'/images/64-stocks/ness.png',
	   "Link":'/images/64-stocks/link.png',
	   "Samus":'/images/64-stocks/samus.png',
	   "Donkey Kong":'/images/64-stocks/donkey kong.png',
	   "Yoshi":'/images/64-stocks/yoshi.png'
	   }
	   });*/
});

var tourneyApp = angular.module('tourneyApp', ['ngRoute', 'ui.router'])
.filter('split', function() {
	return function(input, delimiter) {
		var delimiter = delimiter || ';';

		return input.split(delimiter);
	}
	;})
.config(function ($stateProvider, $routeProvider, $locationProvider) {
	$routeProvider.when('/:type', {
		controller: "tourneyCtrl"
	});
	$locationProvider.html5Mode(true);

});



tourneyApp.controller('tourneyCtrl', function($scope, $route, $routeParams, $http, $location) {
	$scope.slug = $location.search().name;

	var handler = {
		get: function(target, name) {
			return target.hasOwnProperty(name) ? target[name] : { tag: name, rank: 0, characters: 'sandbag'};
		}
	};

	var rankedPlayers = new Proxy({}, handler);

	$scope.readCSV = function(){
		$http.get('./csv/Melee-rankings.csv').success($scope.readRanks);
		$http.get('./data/Melee/Singles/' + $scope.slug +'-standings.csv').success($scope.readPlacements);
	};

	$scope.readPlacements = function(allText){
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var lines = [];
		for (var i = 1; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split(',');
			if (data.length == headers.length) {
				var tarr = {
					tag: data[0],
					placement: parseInt(data[1]),
					characters: rankedPlayers[data[0]].characters
				};
				lines.push(tarr);
			}
		}

		$scope.placements = lines;
	};


	$scope.readRanks = function(allText) {
		// split content based on new line
		//console.log(allText);
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var lines = [];

		for (var i = 1; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split(',');
			if (data.length == headers.length) {
				rankedPlayers[(data[0]).toLowerCase()] = {
					tag: data[0],
					rank: parseInt(data[1]),
					characters: data[2]
				};
				/*
				   var tarr = {
				   tag: data[0],
				   rank: parseInt(data[1]),
				   characters: data[2],
				   score: parseFloat(data[3]),
				   change: isNaN(parseInt(data[4])) ? "NEW" : parseInt(data[4])

				   };
				   lines.push(tarr);*/
			}
		}

		//$scope.rankedPlayers = rankedPlayers;
	};


	$scope.capName = function(tag_in){
		if(rankedPlayers[tag_in].tag !== tag_in){
			return(rankedPlayers[tag_in].tag);
		}	
		return(tag_in);

	};

	$scope.byChar = function (fieldName, char_in) {
		return function predicateFunc(item) {
			if($scope.chars && char_in in item[fieldName])
				return 1;
			else if($scope.chars)
				return 0;
			else
				return 1;
		};
	};

	$scope.byRange = function (fieldName, minValue, maxValue) {
		if (minValue === undefined) minValue = Number.MIN_VALUE;
		if (maxValue === undefined) maxValue = Number.MAX_VALUE;
		if ($scope.eight && maxValue > 8) maxValue = 8;

		if(minValue === '') minValue = Number.MIN_VALUE;
		if(maxValue === '') maxValue = Number.MAX_VALUE;

		return function predicateFunc(item) {
			if($scope.range)
				return minValue <= item[fieldName] && item[fieldName] <= maxValue;
			else if($scope.eight)
				return item[fieldName] < 8;
			else
				return 1;
		};
	};


		$scope.filterPlaces = function(val_min, val_max){
			if(($scope.filters & 0x02) === 0){
				$scope.sortType = 'placement';
				//$scope.maxPlacement = val_max;
				//$scope.minPlacement = val_min;
				$scope.sortOrder = 0;
				$scope.range = true;
				console.log("Changed to range mode");
			}
			else{
				$scope.sortType = 'placement';
				$scope.sortOrder = 0;
				//$scope.maxPlacement = '';
				//$scope.minPlacement = '';
				$scope.range = false;
			}
			$scope.filters = $scope.filters ^ 0x02;
			return;

		};
		$scope.filterTop8 = function(){
			if(($scope.filters & 0x01) === 0){
				$scope.sortType = 'placement';
				$scope.sortOrder = 0;
				$scope.eight = true;
				console.log("Changed to top 8");
			}
			else{
				//$scope.maxPlacement = Number.MAX_VALUE;
				$scope.sortType = 'placement';
				$scope.eight = false;
				$scope.sortOrder = 0;
			}
			$scope.filters = $scope.filters ^ 0x01;
			return;

		};
		$scope.filterCharacter = function(){
			if(($scope.filters & 0x04) === 0){
				$scope.sortType = 'placement';
				$scope.sortOrder = 0;
				$scope.chars = false;
				console.log("Changed to chars");
			}
			else{
				//$scope.maxPlacement = Number.MAX_VALUE;
				$scope.sortType = 'placement';
				$scope.chars = true;
				$scope.sortOrder = 0;
			}
			$scope.filters = $scope.filters ^ 0x04;
			return;

		};



	$scope.filters = 0x00;
	$scope.sortType = 'placement';
	$scope.sortOrder = 0;
	$scope.sortAmount = 127;
	$scope.eight = false;
	$scope.range = false;
	$scope.chars = true;
//	$scope.maxPlacement = Number.MAX_VALUE;
//	$scope.minPlacement = 0;
	$scope.readCSV();

});
