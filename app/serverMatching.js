var io = require('socket.io').listen(8080);
io.set('log level', 1);
var gamelobby = io.of('/gamelobby');

var playerInRoomState = new Object();
var roomList = new Object();


// roomList[1] =  {shape:"BarShape", player:2, occupied: 2, playerList:{"1":1,"2":1}, readyPlayerList:{}, roomId: 1, state:'waiting'};
// roomList[12] =  {shape:"RoundShape", player:4, occupied: 3, playerList:{"102":1,"49":1,"741":1}, readyPlayerList:{}, roomId: 12, state:'waiting'};

gamelobby.on('connection', function (socket) {

  socket.on('playerid register', function (playerid, inroom){
  	console.log("player: "+playerid+" is on line. In room ? "+inroom);
  	socket.playerid = playerid;
  	playerInRoomState[playerid] = inroom;
  	if (inroom!=false){
  		var roomId = inroom;
      	roomList[roomId].occupied++;
      	roomList[roomId].playerList[socket.playerid] = 1;
      	playerInRoomState[socket.playerid] = true;
      	replyAll();

  	}
  	socket.emit('playerid register ok');

  });

  socket.on('update room list', function (requestMode) {
    var relpyList = new Array();
    for (var roomId in roomList){
      if (roomList[roomId].shape == requestMode.shape 
        && roomList[roomId].player == requestMode.player)

        relpyList.push(roomList[roomId]);

    }
    socket.emit(requestMode.shape + " " + requestMode.player+'PlayerMode', relpyList);

  });

  socket.on('new room', function (requestMode) {
  	console.log('new room request received from player '+ socket.playerid);
  	if (socket.playerid in playerInRoomState && playerInRoomState[socket.playerid]==true){
  		socket.emit('new room fail');
  	}
	else{
	  	var room = new Object();
	  	var roomId;
	  	while (true){
	  		roomId = Math.round(Math.random() * 10000);
	  		roomId = roomId.toString();
	  		if (roomId in roomList)
	  			continue;
	  		break;
	  	}
	  	room.roomId = roomId;
	  	room.shape = requestMode.shape;
	  	room.player = requestMode.player;
	  	room.occupied = 0;
	  	room.playerList = new Object();
	  	room.readyPlayerList = new Object();
	  	// room.playerList[socket.playerid] = 1;
	  	// playerInRoomState[socket.playerid] = true;
	  	room.state = 'waiting';
	  	roomList[roomId] = room;
	  	socket.emit("new room success", roomId);
	  	replyAll();
	  }
  });

  socket.on('auto join', function (requestMode){
  	console.log("auto join request by player "+ socket.playerid);
  	if (socket.playerid in playerInRoomState && playerInRoomState[socket.playerid]==true){
  		socket.emit('auto join fail');
  	}
	else{
	  	var found = new Array();
	  	for (var roomId in roomList)
	      if (roomList[roomId].shape == requestMode.shape 
	        && roomList[roomId].player == requestMode.player
	        && roomList[roomId].state == 'waiting'
	        && roomList[roomId].occupied < roomList[roomId].player)

	      	found.push(roomId);

	    if (found.length == 0)
			socket.emit('auto join fail');
		else{
			roomId = found[Math.floor((Math.random()*found.length))];
	      	// roomList[roomId].occupied++;
	      	// roomList[roomId].playerList[socket.playerid] = 1;
	      	// playerInRoomState[socket.playerid] = true;
	      	socket.emit('auto join success', roomId);
	      	replyAll();
		}
	}


  });

  socket.on('game ready', function(){

  	for (var roomId in roomList)
  		if ((socket.playerid in roomList[roomId].playerList)
  			&& !(socket.playerid in roomList[roomId].readyPlayerList)){
  			roomList[roomId].readyPlayerList[socket.playerid] = 1;
  		  	gamelobby.emit('ready list', roomId, roomList[roomId].readyPlayerList);
  		  	if (Object.keys(roomList[roomId].readyPlayerList).length == roomList[roomId].player){
  		  		roomList[roomId].state = 'in game';
  		  		replyAll();
  		  		console.log('Game started in room '+roomId);
  		  	}
  			console.log('Player ' + socket.playerid + ' is ready to play in room ' + roomId);
	        break;
  		}

  })

  // socket.on('cancel ready', function(){
  // 	for (var roomId in roomList)
  // 		if ((socket.playerid in roomList[roomId].playerList)
  // 			&& (socket.playerid in roomList[roomId].readyPlayerList)){
  // 			delete roomList[roomId].readyPlayerList[socket.playerid];
  // 			break;
  // 		}
  // });


  socket.on('disconnect', function () {
  	  	for (var roomId in roomList){
  			if (socket.playerid in (roomList[roomId].playerList)) {
					console.log("player "+ sid +" is now offline from room "+rid);

	  				delete roomList[rid].playerList[sid];
	  				if (socket.playerid in roomList[rid].readyPlayerList)
	  					delete roomList[rid].readyPlayerList[sid];

  			}
  		}
  });


});


function replyAll(){
	replyList({shape:'BarShape', player:2});
	replyList({shape:'BarShape', player:4});
	replyList({shape:'RoundShape', player:2});
	replyList({shape:'RoundShape', player:4});
}

function replyList(requestMode) {
    var relpyList = new Array();
    for (var roomId in roomList){
      if (roomList[roomId].shape == requestMode.shape 
        && roomList[roomId].player == requestMode.player)

        relpyList.push(roomList[roomId]);

    }
    gamelobby.emit(requestMode.shape + " " + requestMode.player+'PlayerMode', relpyList);

}

