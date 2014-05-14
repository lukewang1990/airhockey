var io = require('socket.io').listen(8080);

var gamelobby = io.of('/gamelobby');


io.set('log level', 1);

var roomList = new Object();
roomList[1] =  {shape:"BarShape", player:2, occupied: 2, playerList:[1,3], readyPlayerList:[], roomId: 1, state:'waiting'};
roomList[3] =  {shape:"BarShape", player:2, occupied: 2, playerList:[4,5], readyPlayerList:[], roomId: 2, state:'waiting'};
roomList[4] =  {shape:"BarShape", player:2, occupied: 1, playerList:[6], readyPlayerList:[], roomId: 3, state:'waiting'};
roomList[5] =  {shape:"BarShape", player:4, occupied: 2, playerList:[14,16], readyPlayerList:[], roomId: 4, state:'waiting'};
roomList[6] =  {shape:"BarShape", player:4, occupied: 3, playerList:[12,31,45], readyPlayerList:[], roomId: 5, state:'waiting'};
roomList[7] =  {shape:"RoundShape", player:4, occupied: 3, playerList:[2,9,41], readyPlayerList:[], roomId: 6, state:'waiting'};
roomList[8] =  {shape:"RoundShape", player:2, occupied: 2, playerList:[71,73], readyPlayerList:[], roomId: 7, state:'waiting'};
roomList[9] =  {shape:"RoundShape", player:2, occupied: 2, playerList:[74,75], readyPlayerList:[], roomId: 8, state:'waiting'};
roomList[10] =  {shape:"RoundShape", player:2, occupied: 1, playerList:[76], readyPlayerList:[], roomId: 9, state:'waiting'};
roomList[11] =  {shape:"RoundShape", player:4, occupied: 2, playerList:[714,716], readyPlayerList:[], roomId: 10, state:'waiting'};
roomList[12] =  {shape:"RoundShape", player:4, occupied: 3, playerList:[712,731,745], readyPlayerList:[], roomId: 11, state:'waiting'};
roomList[13] =  {shape:"RoundShape", player:4, occupied: 3, playerList:[102,49,741], readyPlayerList:[], roomId: 12, state:'waiting'};

gamelobby.on('connection', function (socket) {
  console.log("connected");


  socket.on('update room list', function (requestMode) {
    var relpyList = new Array();
    for (var roomId in roomList){
      if (roomList[roomId].shape == requestMode.shape 
        && roomList[roomId].player == requestMode.player)

        relpyList.push(roomList[roomId]);

    }
    socket.emit(requestMode.shape + " " + requestMode.player+'PlayerMode', relpyList);

  });

  socket.on('new room', function (playerid, requestMode) {
  	console.log('new room request received from player '+playerid);
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
  	room.playerList = new Array();
  	room.readyPlayerList = new Array();
  	room.playerList.push(playerid);
  	room.state = 'waiting';
  	roomList[roomId] = room;
  	socket.emit("new room success", roomId);
  	replyAll();
  });

  socket.on('auto join', function (playerid, requestMode){
  	console.log("auto join request by player "+ playerid);
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
      	roomList[roomId].playerList.push(playerid);
      	socket.emit('auto join success', roomId);
      	replyAll();
	}


  });


  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
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

