var divs = [];
var game_container;
var note_pad;
function Game() {
	var game = this;
	this.me = 0;
	this.room_id = 0;
	this.player_num = 2;
	this.room_id = 0;
	this.team = 0;
	this.my_pad = null;
	this.key_step = 20;
	this.screen_width = 420;
	this.screen_height = 560;
	this.pad_shape = "circle";
	this.win_condition = 5;
	this.prepareGame = function() {
		printWord("3", 0, 40, 800);
		printWord("2", 1000, 40, 800);
		printWord("1", 2000, 40, 800);
		printWord("Start!", 3000, 40, 800);

		setTimeout(function() {
			game.socket.emit('start', {});
		}, 3000); 
		game.startGame();
	};
	this.startGame = function() {
		events.listener = game.my_pad;
		game.my_pad.mousedown(events.mousedown);
		$(document).keydown(events.keydown);

		setTimeout(function() {
			game.controlInterval = setInterval(updateControl, 1000/constant.fps);
			updateControl();
		}, 500/constant.fps);
	}
	this.init = function(player_id, room_id, player_num, pad_shape) {
		game.me = player_id;
		game.room_id = room_id;
		game.player_num = player_num;
		game.pad_shape = (pad_shape == "BarShape")?"rec":"circle";
		game.team = Math.floor((game.me + game.player_num/2)/game.player_num);
	}
};

function printWord(input, delay, size, exist_time)
{
	var note_pad = $("#note_pad");
	var local_exec = (function() {
		var text = input;
		return function() {
			note_pad.text(text);
			var css = { 'font-size': size + "px",
						'width': game.screen_width + "px",
						'height': size + "px",
						'margin-top': (game.screen_height - size)/2 + "px",
						'opacity': '1'
					};
			note_pad.css(css);

			if (exist_time >= 0){
				setTimeout(function() {
					if (note_pad.text() == text) {
						var css1 = {'opacity': '0'};
						note_pad.css(css1);
					}
				}, exist_time);
			}
		}
	}) ();

	if (delay > 0) {
		setTimeout(local_exec, delay);
	}
	else {
		local_exec()
	}
}

var game = new Game();

var constant = {fps: 30};

var events = {
	diffX: 0,
	diffY: 0,
	listener: null,
	destination: {x:0, y:0},
	update: 0,
	mousedown: function(e){
		e.preventDefault();
		e.stopPropagation();

		//console.log("mousedown");
		events.diffX = e.clientX + window.pageXOffset - events.listener.offset().left - game_container.offset().left;
		events.diffY = e.clientY + window.pageYOffset - events.listener.offset().top - game_container.offset().top;

		events.update = 1;

		events.listener.mousemove(events.mousemove);
		//events.listener.mouseup(events.mouseup);
		$('body').mousemove(events.mousemove);
		//$('body').mouseup(events.mouseup);
		$(window).mousemove(events.mousemove);
		//$(window).mouseup(events.mouseup);
	},
	mousemove: function(e) {
		e.preventDefault();
		e.stopPropagation();

		events.destination.x = e.clientX + window.pageXOffset - events.listener._userModel.width/2 - game_container.offset().left;
		events.destination.y = e.clientY + window.pageXOffset - events.listener._userModel.height/2 - game_container.offset().top;

		// console.log("mousemove");
		// var css = {	'-webkit-transform': 'translate(' + Math.floor(events.destination.x) + 'px,' + Math.floor(events.destination.y) + 'px) rotate(' + events.listener._userModel.r  + 'deg)', 
		// 			'-moz-transform':	 'translate(' + Math.floor(events.destination.x) + 'px,' + Math.floor(events.destination.y) + 'px) rotate(' + events.listener._userModel.r  + 'deg)', 
		// 			'-ms-transform':	 'translate(' + Math.floor(events.destination.x) + 'px,' + Math.floor(events.destination.y) + 'px) rotate(' + events.listener._userModel.r  + 'deg)', 
		// 			'-o-transform':		 'translate(' + Math.floor(events.destination.x) + 'px,' + Math.floor(events.destination.y) + 'px) rotate(' + events.listener._userModel.r  + 'deg)', 
		// 			'transform':		 'translate(' + Math.floor(events.destination.x) + 'px,' + Math.floor(events.destination.y) + 'px) rotate(' + events.listener._userModel.r  + 'deg)'};
		// events.listener.css(css);	
	},
	mouseup: function(e) {
		e.preventDefault();
		e.stopPropagation();

	},
	keydown: function(e) {
		e.preventDefault();
		e.stopPropagation();

		var code = e.keyCode;

		console.log(code);
		if(code == 37) { //left
			events.destination.x = events.listener._userModel.x - game.key_step; events.update = 1;}
		else if(code == 38) { //up
			events.destination.y = events.listener._userModel.y - game.key_step; events.update = 1;}
		else if(code == 39) { //right
			events.destination.x = events.listener._userModel.x + game.key_step; events.update = 1;}
		else if(code == 40) { //down
			events.destination.y = events.listener._userModel.y + game.key_step; events.update = 1;}
		else if(code == 90) { //z
			console.log("removeing mousemove");
			events.listener.unbind("mousemove");
			$('body').unbind("mousemove");
			$(window).unbind("mousemove");

		}

		//console.log(events.destination);
		//console.log(events.listener._userModel);
	},
	noEvent: function(e) {
		e.preventDefault();
		e.stopPropagation();
	}
}

function updateControl()
{
	var control_package = {};
	control_package.player_id = game.me;

	control_package.destination = {}
	if(game.team == 1) {
		control_package.destination.x = events.destination.x;
		control_package.destination.y = events.destination.y;
	}
	else if(game.team == 0) {
		control_package.destination.x = game.screen_width - events.destination.x - events.listener._userModel.width;
		control_package.destination.y = game.screen_height - events.destination.y - events.listener._userModel.height;
	}

	game.socket.emit('control', control_package);
}

function setGame(room_id, player_num, pad_shape) {

	game.init(0, parseInt(room_id), parseInt(player_num), pad_shape);
	game_container = $("#game_container");
	game.socket = io.connect('http://54.186.241.95:8081/game');

	var room_info = {};
	room_info.room_id = game.room_id;
	room_info.player_id = game.me;
	room_info.screen_width = game.screen_width;
	room_info.screen_height = game.screen_height;
	room_info.player_num = game.player_num;
	room_info.pad_shape = game.pad_shape;
	room_info.win_condition = game.win_condition;
	game.socket.emit('room', room_info);

	game.socket.on('display', function (data) {
		for (var i = 0; i < data.length; i ++) {
			var pack = data[i];

			if(game.team == 0)
			{
				pack.x = game.screen_width - pack.x - pack.width;
				pack.y = game.screen_height - pack.y - pack.height;
			}

			var div = divs[pack.id];

			if (!div) {
				$('#game_container').append('<div id=' + pack.id + ' class=' + pack.css_class + '></div>')

				div = divs[pack.id] = $('#' + pack.id);
				div._userModel = {x: pack.x, y: pack.y, r: pack.r, width: pack.width, height: pack.height};

				if(pack.css_class == "pad") {
					var num = parseInt(pack.id.substring(3, 4));
					var color = (num == 0)?("#FF0000"):
								(num == 1)?("#428bca"):
								(num == 2)?("#FFFF00"):
								(num == 3)?("#5cb85c"):("#000000");
					div.css({"background": color});

				}

				// if(pack.css_class == "wall") {
				// 	console.log(parseInt(pack.id.substring(4,5)));
				// 	div.css({'z-index': Math.floor(parseInt(pack.id.substring(4,5))/2)});
				// }
			}
			else {
				div._userModel.x = pack.x;
				div._userModel.y = pack.y;
				div._userModel.r = pack.r;
				div._userModel.width = pack.width;
				div._userModel.height = pack.height;
			}
			var css = {	'-webkit-transform': 'translate(' + pack.x + 'px,' + pack.y + 'px) rotate(' + pack.r  + 'deg)', 
						'-moz-transform':	 'translate(' + pack.x + 'px,' + pack.y + 'px) rotate(' + pack.r  + 'deg)', 
						'-ms-transform':	 'translate(' + pack.x + 'px,' + pack.y + 'px) rotate(' + pack.r  + 'deg)', 
						'-o-transform':		 'translate(' + pack.x + 'px,' + pack.y + 'px) rotate(' + pack.r  + 'deg)', 
						'transform':		 'translate(' + pack.x + 'px,' + pack.y + 'px) rotate(' + pack.r  + 'deg)'};
			if (pack.circle) {
				css['-webkit-border-radius'] = css['-moz-border-radius'] = css['border-radius'] = pack.width  + 'px';
			}
			css['width']  = pack.width  + 'px';
			css['height'] = pack.height + 'px';
			div.css(css);
		}
	});

	game.socket.on('start', function (data) {
		var cur_t = new Date().getTime();
		console.log("start time: " + cur_t);
		var difference = data - cur_t;
		if(difference > 0 && difference < 1000) {
			setTimeout(function() {
				game.prepareGame();
			}, difference);
		}
		else {
			game.prepareGame();
		}
	});
	game.socket.on('goal', function (data) {
		console.log(data);
		updateScoreboard([data[2], data[3]]);

		var text1 = (data[0] + 1) + " goal!";
		var text2 = (data[1] + 1) + " win!";
		if (game.player_num == 2) {
			text1 = "Player " + text1;
			text2 = "Player " + text2;
		}
		else if(game.player_num == 4) {
			text1 = "Team " + text1;
			text2 = "Team " + text2;
		}

		printWord(text1, 0, 40, 800);

		if (data[1] != -1) {
			printWord(text2, 1000, 40, -1);
		} else {
			printWord("Ready", 1000, 40, 800);
			printWord("Go!", 2000, 40, 500);
		}
	});

	game.socket.on('end', function (data) {
		console.log("game end");
		clearInterval(game.controlInterval);
		game.my_pad.unbind("mousedown");
		$(document).unbind("keydown");
		game.socket.disconnect();
	})
}

function game_all_ready(player_id) {
	game.me = player_id;
	game.team = Math.floor((game.me + game.player_num/2)/game.player_num);

	var div = divs["pad" + game.me];
	console.log(div);
	game.my_pad = div;
	events.destination.x = div._userModel.x;
	events.destination.y = div._userModel.y;

	var data = {};
	data.room_id = game.room_id;
	data.player_id = game.me;
	console.log("ready:");
	console.log(data);	
	game.socket.emit('ready', data);
}
