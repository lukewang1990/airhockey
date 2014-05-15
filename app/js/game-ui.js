var selfTeam, 
	index,
	playerID,
	lobbyConn,
	num; 	// index within the game room

function updatePlayerList() {
	var readyObj = JSON.parse(localStorage.getItem('readyList'));
	var mapping = JSON.parse(localStorage.getItem('mapping'));

	var p = 0;
	for (var k in readyObj) {
		var el = $('#player-list li:nth-child(' + (p + 1) +')');
		el.children('.player-name').html(mapping[k]);
		
		if (readyObj[k] == '0') {
			el.children('.badge').html('Not ready');
		} else if (readyObj[k] == '1') {
			el.children('.badge').html('Waiting');
		}
		p++;
	}

	for (; p < num; p++) {
		var el = $('#player-list li:nth-child(' + (p + 1) +')');
		el.children('.player-name').html('&nbsp;');
		el.children('.badge').html('Empty');
	}

}

// data is two element array
function updateScoreboard(data) {
	// update view
	console.log(data);
	console.log(data[selfTeam]);
	console.log(selfTeam);
	$('#self-score').children('span').html(data[selfTeam]);
	$('#opponent-score').children('span').html(data[1 - selfTeam]);

	// check if game ends
	if (data[0] == 5 && selfTeam == 0 || data[1] == 5 && selfTeam == 1) {
		lobbyConn.emit('game end', '');
		$('#opponent-score').addClass('list-group-item-info');
	} else if (data[0] == 5 && selfTeam == 1 || data[1] == 5 && selfTeam == 0) {
		lobbyConn.emit('game end', '');
		$('#opponent-score').addClass('list-group-item-info');
	}
}

$(document).ready(function(event) {
	// read and set the game info fields
	var shape = localStorage.getItem('shape');
	num = localStorage.getItem('numPlayer');
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

	setGame(roomID ,num, shape);

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
	lobbyConn = io.connect('http://54.186.241.95:8080/gamelobby');

	// notify the game controller that the player is in the game
	lobbyConn.emit('playerid register', playerID, roomID, name);

	lobbyConn.on('ready list', function(roomId, readyList, mapping){
		if (localStorage.getItem('roomId') == roomId){
			localStorage.setItem('readyList', readyList);
			localStorage.setItem('mapping', mapping);
			
			// check if all players are ready
			var readyListObj = JSON.parse(readyList);
			var keys = Object.keys(readyListObj);
			var sum = 0;
			for (var i = 0; i < keys.length; i++) {
				sum += readyListObj[keys[i]];
				if (playerID == keys[i]) {
					index = i;
				}
			}
			if (keys.length == num && sum == num) {
				if (index < num / 2) {
					selfTeam = 0;
				} else {
					selfTeam = 1;
				}
				console.log('selfTeam is ' + selfTeam);
				localStorage.setItem('idx2id', keys);
				localStorage.setItem('selfIndex', index);
				/// TODO: Tell the game server
				game_all_ready(index);
			}
			
			updatePlayerList();
		}
	});

	// add event listeners
	$('#ready-button').click(function(event) {
		event.preventDefault();
		event.stopPropagation();

		$(this).prop('disabled', true);
		// send data
		lobbyConn.emit('game ready', playerID);
		//game_ready_clicked();
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
