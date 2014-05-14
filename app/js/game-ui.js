var selfTeam, 
	index; 	// index within the game room

$(document).ready(function(event) {
	// read and set the game info fields
	var shape = localStorage.getItem('shape');
	var num = localStorage.getItem('numPlayer');
	var name = localStorage.getItem('nickname');
	var playerID = localStorage.getItem('playerID');
	var roomID = localStorage.getItem('roomId');
	$('#game-shape').html(shape);
	$('#game-num').html(num);
	$('#nickname').html(name);

	setGame(playerID, roomID ,num, shape);

// ///////////////// TEST /////////////////
// 	var data = new Array();
// 	data[0] = {name:'Lance',state:'true'};
// 	data[1] = {name:'Luke',state:'false'};
// 	data[2] = {name:'Paladin',state:'false'};
// 	data[3] = {name: 'Jason', state:'true'};
// 	name = "Rings";
// 	// console.log(data);
// 	var updateList = function(data) {
// 		// console.log(data.length);
// 		for (var i = 0; i < data.length; i++) {
// 			var element = $('#player-list li:nth-child(' + (i + 1) +')');
// 			element.children('.player-name').html(data[i].name);
			
// 			if (data[i].state == 'true' && ! element.hasClass('list-group-item-info')) {
// 				element.children('.badge').html('Waiting');
// 				element.addClass('list-group-item-info');
// 			}
// 		}
// 		if (data.length == num) {
// 			// find the index of this player
// 			for (var i = 0; i < num; i++) {
// 				if (data[i].name == name) {
// 					if (i < num / 2) {
// 						selfTeam = 0;
// 					} else {
// 						selfTeam = 1;
// 					}
// 				}
// 			}
// 			if (selfTeam === undefined) {
// 				console.log('the nickname is not in the full player list');
// 			}
// 		}
		
// 	};
// 	updateList(data);

// ///////////////// TEST END //////////////////

// ///////////////// TEST /////////////////

// 	var data = new Array();
// 	data[0] = 1;
// 	data[1] = 5;
// 	selfTeam = 1;
// 	var updateScore = function(data) {
// 		$('#self-score').children('span').html(data[selfTeam]);
// 		$('#opponent-score').children('span').html(data[1 - selfTeam]);
// 	}
// 	updateScore(data);

// ///////////////// TEST END //////////////////

	// initialize socket.io connections
	var scoreConn = io.connect('http://localhost:8080/score'),
		lobbyConn = io.connect('http://localhost:8080/gamelobby');

	// notify the game controller that the player is in the game
	lobbyConn.emit('playerid register', playerID, roomID);

	lobbyConn.on('ready list', function(roomId, readyList){
		if (localStorage.getItem('roomId') == roomId){
			localStorage.setItem('readyList', readyList);
		}
	});
	
	// prepare data to send to the game server
	data = new Object();
	data.readyList = localStorage(getItem('readyList'));
	data.num = num;
	data.score = 5;
	data.shape = shape;
	gameConn.emit('enter config', data);

	scoreConn.on('score-update', function () {
		console.log(data);
		$('#self-score').children('span').html(data[selfTeam]);
		$('#opponent-score').children('span').html(data[1 - selfTeam]);
	});
  
	lobbyConn.on('list-update', function (data) {
		for (var i = 0; i < data.length; i++) {
			var element = $('#player-list li:nth-child(' + (i + 1) +')');
			element.children('.player-name').html(data[i].name);
			
			if (data[i].state == 'true' && ! element.hasClass('list-group-item-info')) {
				element.children('.badge').html('Waiting');
				element.addClass('list-group-item-info');
			}
		}
		if (data.length == num) {
			// find the index of this player
			for (var i = 0; i < num; i++) {
				if (data[i].name == name) {
					if (i < num / 2) {
						selfTeam = 0;
					} else {
						selfTeam = 1;
					}
				}
			}
			if (selfTeam === undefined) {
				console.log('the nickname is not in the full player list');
			}
		}
	});

	// add event listeners
	$('#ready-button').click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		// send data
		lobbyConn.emit('game ready', playerID);
		// gameConn.emit('game ready', playerID);
	});

	$('#return-button').click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		window.location = 'airhockey.php';
	});

	$('#logout-button').click(function(event) {
		event.stopPropagation;
		localStorage.clear();
	});

});
