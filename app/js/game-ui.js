var selfTeam, 
	index,
	playerID,
	num; 	// index within the game room

function updatePlayerList() {
	var readyObj = JSON.parse(localStorage.getItem('readyList'));
	var mapping = JSON.parse(localStorage.getItem('mapping'));

	var p = 0;
	for (var k in readyObj) {
		var el = $('#player-list li:nth-child(' + (p + 1) +')');
		el.children('.player-name').html(mapping[k]);
		
		if (p == num && k == playerID) {
			if (p < num / 2) {
				selfTeam = 0;
			} else {
				selfTeam = 1;
			}
		}

		if (readyObj[k] == '0') {
			el.children('.badge').html('Not ready');
		} else if (readyObj[k] == '1') {
			el.children('.badge').html('Waiting');
		}
		p++;
	}

}

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

	// hide
	if (num == 2) {
		$('#player-list li:nth-child(1)').addClass('list-group-item-success');
		$('#player-list li:nth-child(2)').addClass('list-group-item-warning');
		$('#player-list li:nth-child(3)').hide();
		$('#player-list li:nth-child(4)').hide();
	} else if (num == 4) {
		$('#player-list li:nth-child(1)').addClass('list-group-item-success');
		$('#player-list li:nth-child(2)').addClass('list-group-item-success');
		$('#player-list li:nth-child(3)').addClass('list-group-item-warning');
		$('#player-list li:nth-child(4)').addClass('list-group-item-warning');
	} else {
		console.log('invalid number of player parameter encountered');
	}

	updatePlayerList();

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
	lobbyConn.emit('playerid register', playerID, roomID, name);

	lobbyConn.on('ready list', function(roomId, readyList){
		if (localStorage.getItem('roomId') == roomId){
			localStorage.setItem('readyList', readyList);
			updatePlayerList();
		}
	});

	lobbyConn.on('nickname mapping', function(data) {
		localStorage.setItem('mapping', data);
	});
	
	// prepare data to send to the game server
	data = new Object();
	data.readyList = localStorage.getItem('readyList');
	data.num = num;
	data.score = 5;
	data.shape = shape;
	// gameConn.emit('enter config', data);

	scoreConn.on('score-update', function () {
		console.log(data);
		$('#self-score').children('span').html(data[selfTeam]);
		$('#opponent-score').children('span').html(data[1 - selfTeam]);
	});

	// add event listeners
	$('#ready-button').click(function(event) {
		event.preventDefault();
		event.stopPropagation();

		if (selfTeam === undefined) {
			console.log('the nickname is not in the full player list');
		}
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
