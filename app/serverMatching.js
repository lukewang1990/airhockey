var io = require('socket.io').listen(8080);

var gamelobby = io.of('/gamelobby');

var playerInRoomState = new Object();
var onLeaveTimeOut = new Object();

io.set('log level', 1);

var roomList = new Object();
// roomList[1] =  {shape:"BarShape", player:2, occupied: 2, playerList:{"1":1,"2":1}, readyPlayerList:{}, roomId: 1, state:'waiting'};
// roomList[2] =  {shape:"BarShape", player:2, occupied: 2, playerList:{"4":1,"5":1}, readyPlayerList:{}, roomId: 2, state:'waiting'};
// roomList[3] =  {shape:"BarShape", player:2, occupied: 1, playerList:{"6":1}, readyPlayerList:{}, roomId: 3, state:'waiting'};
// roomList[4] =  {shape:"BarShape", player:4, occupied: 2, playerList:{"14":1,"16":1}, readyPlayerList:{}, roomId: 4, state:'waiting'};
// roomList[5] =  {shape:"BarShape", player:4, occupied: 3, playerList:{"12":1,"31":1,"45":1}, readyPlayerList:{}, roomId: 5, state:'waiting'};
// roomList[6] =  {shape:"RoundShape", player:4, occupied: 3, playerList:{"2":1,"9":1,"41":1}, readyPlayerList:{}, roomId: 6, state:'waiting'};
// roomList[7] =  {shape:"RoundShape", player:2, occupied: 2, playerList:{"71":1,"73":1}, readyPlayerList:{}, roomId: 7, state:'waiting'};
// roomList[8] =  {shape:"RoundShape", player:2, occupied: 2, playerList:{"74":1,"75":1}, readyPlayerList:{}, roomId: 8, state:'waiting'};
// roomList[9] =  {shape:"RoundShape", player:2, occupied: 1, playerList:{"76":1}, readyPlayerList:{}, roomId: 9, state:'waiting'};
// roomList[10] =  {shape:"RoundShape", player:4, occupied: 2, playerList:{"714":1,"716":1}, readyPlayerList:{}, roomId: 10, state:'waiting'};
// roomList[11] =  {shape:"RoundShape", player:4, occupied: 3, playerList:{"712":1,"731":1,"745":1}, readyPlayerList:{}, roomId: 11, state:'waiting'};
// roomList[12] =  {shape:"RoundShape", player:4, occupied: 3, playerList:{"102":1,"49":1,"741":1}, readyPlayerList:{}, roomId: 12, state:'waiting'};

gamelobby.on('connection', function (socket) {
  console.log("connected");

  socket.on('playerid register', function (playerid, inroom){
  	console.log("playerid reg: "+playerid+" inroom: "+inroom);
  	socket.playerid = playerid;
  	playerInRoomState[playerid] = inroom;

  	if (socket.playerid in onLeaveTimeOut){
      console.log('this is reached');
  		clearTimeout(onLeaveTimeOut[socket.playerid]);
  		delete onLeaveTimeOut[socket.playerid];
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
	  	room.occupied = 1;
	  	room.playerList = new Object();
	  	room.readyPlayerList = new Object();
	  	room.playerList[socket.playerid] = 1;
	  	playerInRoomState[socket.playerid] = true;
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
	      	roomList[roomId].occupied++;
	      	roomList[roomId].playerList[socket.playerid] = 1;
	      	playerInRoomState[socket.playerid] = true;
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
  			console.log('Player ' + socket.playerid + 'says he is ready.');
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
  		console.log("disconnecting");
  	  	for (var roomId in roomList){
  			if (socket.playerid in (roomList[roomId].playerList)) {
  				console.log('now player '+ socket.playerid +' is in room '+roomId);

  				onLeaveTimeOut[socket.playerid] =  setTimeout(function(){
  					var rid = roomId;
  					var sid = socket.playerid;
  					return function(){
  						
  						console.log("player "+sid+" is now offline from room "+rid);

		  				delete roomList[rid].playerList[sid];
		  				if (socket.playerid in roomList[rid].readyPlayerList)
		  					delete roomList[rid].readyPlayerList[sid];
			  		}

  				}(), 10000);
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

