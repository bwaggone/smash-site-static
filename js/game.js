'use strict';   // See note about 'use strict'; below
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		//
		//       // Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		//
		//                   // And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

$(document).ready(function(){
	$('.parallax').parallax();
	$('.button-collapse').sideNav();
	$('.search-bar').select2({
		placeholder: "Type to select a tournament, player, or game"
	});
	$('ul.tabs').tabs();
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
	});

	//$("*").filter(function() { return !$(this).children().length; })
	//    .html(function(index, old) { return old.replace('jigglypuff', '<img src="./images/neutral Jigglypuff.png" />');
});
/*
   function dateRange(date1, date2){
   var epoch_time = Date.parse(date1);
   var epoch_time2 = Date.parse(date2);
   var duration = (epoch_time2 - epoch_time2) / (1000*60*60*24);
   var date_range = 


   };
   */


var currentTab = 1;
document.onkeydown = function(evt) {
	evt = evt || window.event;
	if (evt.keyCode == 37) {
		currentTab -= 1;
	}
	else if (evt.keyCode == 39) {
		currentTab += 1;
	}
	if(evt.keyCode == 39 || evt.keyCode == 37){
		switch(currentTab){
			case 1:
				$('ul.tabs').tabs('select_tab', 'overview');
				break;
			case 2:
				$('ul.tabs').tabs('select_tab', 'rankings');
				break;
			case 3:
				$('ul.tabs').tabs('select_tab', 'tournaments');
				break;
			case 4:
				$('ul.tabs').tabs('select_tab', 'nplayers');
				break;

		};
	}
};

function updateTab(tabNum){
	currentTab = tabNum;
};

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
		$http.get('./csv/'+ $scope.game +'-rankings.csv').success($scope.readPlayers);
		$http.get('./csv/'+ $scope.game +'-notables.csv').success($scope.readNotables);
		$http.get('./data/'+ $scope.game +'/Singles/tournaments.csv').success($scope.readTournaments);
		$http.get('./data/'+ $scope.game +'/Singles/upsets.csv').success($scope.readUpsets);
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
					change: isNaN(parseInt(data[4])) ? "NEW" : parseInt(data[4])

				};
				//tarr.push(data[0])
				//for ( var j = 0; j < headers.length; j++) {
				//	tarr.push(data[j]);
				//}
				lines.push(tarr);
				//lines.push(data[0]);
			}
		}
		$scope.playerLabels = allTextLines[0].split(',');
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
				console.log(Date.parse(tarr.start));
				lines.push(tarr);
			}
		}

		$scope.tourneys = lines;

	};

	$scope.readUpsets = function(allText) {
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var lines = [];
		for (var i = 1; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split(',');
			if (data.length == headers.length) {
				var tarr = {
					tourney: data[0],
					slug: data[1],
					p1: data[2],
					p2: data[3],
				};
				lines.push(tarr);
			}
		}

		$scope.upsets = shuffle(lines);
		var yt_urls = [];
		for (var i = 0; i < lines.length; i++){
			var yt_search = $scope.upsets[i].tourney + " " + $scope.upsets[i].p1 + " " + $scope.upsets[i].p2 + " " + $scope.game;
			$scope.upsets[i].yt = yt_search;
		}

	};

	$scope.readNotables = function(allText) {
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split('`');
		var lines = [];
		for (var i = 1; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split('`');
			if (data.length == headers.length) {
				var tarr = {
					tag: data[0],
					characters: data[1],
					blurb: data[2]
				};
				lines.push(tarr);
			}
		}

		$scope.notables = lines;
	};

	$scope.replaceText = function(text) {
		$scope.text = text;

		return($scope.text);
	};
	$scope.testFunc = function(text) {

		if(text > 0)
			return("+" + text);
		return(text);
	};

	/*
	   $scope.tab = 1;
	   $scope.setTab = function(newTab){
	   $scope.tab = newTab;
	   };

	   $scope.isSet = function(tabNum){
	   return $scope.tab === tabNum;
	   };
	   */

	$scope.playersortType  = 'rank'; // set the default sort type
	$scope.playersortReverse = false;  // set the default sort order

	$scope.tourneysortType  = 'end'; // set the default sort type
	$scope.tourneysortReverse = true;  // set the default sort order
	$scope.readCSV();
})

;
