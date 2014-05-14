var socket = io.connect('http://localhost:8080/gamelobby');

var requestMode = new Object();
requestMode.player = 2;
requestMode.shape = "BarShape";
var playerid = 10000;

socket.emit('update room list', requestMode);


$("#BarShape").click(function(){
  $(this).addClass("active");
  $("#RoundShape").removeClass("active");
  requestMode.shape = "BarShape";
  socket.emit('update room list', requestMode);
  console.log('update request emitted');
});

$("#RoundShape").click(function(){
  $(this).addClass("active");
  $("#BarShape").removeClass("active");
  requestMode.shape = "RoundShape";
  socket.emit('update room list', requestMode);

});

$("#2PlayerMode").click(function(){
  $(this).addClass("active");
  $("#4PlayerMode").removeClass("active");
  requestMode.player = 2;
  socket.emit('update room list', requestMode);

});

$("#4PlayerMode").click(function(){
  $(this).addClass("active");
  $("#2PlayerMode").removeClass("active");
  requestMode.player = 4;
  socket.emit('update room list', requestMode);

});

$("#auto-join").click(function(){

	socket.emit('auto join', playerid, requestMode);

});

$("#new-room").click(function(){

	socket.emit('new room', playerid, requestMode);

});

socket.on('BarShape 2PlayerMode', function (data){
	if ($("#BarShape").hasClass("active") && $("#2PlayerMode").hasClass("active"))
		updateRoomList(data);

});
socket.on('RoundShape 2PlayerMode', function (data){
	if ($("#RoundShape").hasClass("active") && $("#2PlayerMode").hasClass("active"))
		updateRoomList(data);

});
socket.on('BarShape 4PlayerMode', function (data){
	if ($("#BarShape").hasClass("active") && $("#4PlayerMode").hasClass("active"))
		updateRoomList(data);

});
socket.on('RoundShape 4PlayerMode', function (data){
	if ($("#RoundShape").hasClass("active") && $("#4PlayerMode").hasClass("active"))
		updateRoomList(data);

});

socket.on("new room success", function (roomId){

	console.log('new room success');

});

socket.on('auto join success', function (roomId){

	console.log("auto join success, you are in room "+ roomId );

});

socket.on('auto join fail', function(){

	alert('no available game room found!');
});

// roomList.push({shape:"RoundShape", player:4, occupied: 3, playerList:[102,49,741], roomId: 12});

function updateRoomList(data){
	document.getElementById("room-list").innerHTML='';
	for (var i = 0; i < data.length; i++){
		var li = document.createElement('li');
		li.className = "list-group-item";
		li.innerHTML = "Room"+data[i].roomId;

		var badge1 = document.createElement('span');
		badge1.className = 'badge';
		badge1.innerHTML = data[i].occupied+'/'+data[i].player;
		li.appendChild(badge1);
		var badge2 = document.createElement('span');
		badge2.className = 'badge';
		badge2.innerHTML = data[i].state;
		li.appendChild(badge2);
		document.getElementById("room-list").appendChild(li);
	}
}





