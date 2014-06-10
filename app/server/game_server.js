var Box2D = require('./box2d.js');

// Keep a reference to the Box2D World
//var world;

// The scale between Box2D units and pixels
function Game (room_id)
{
	var game = this;
	this.id = room_id;
	this.screen_width = 0;
	this.screen_height = 0;
	this.player_num = 2;
	this.hole_size = 8;
	this.pad_width = 2;
	this.pad_height = 2;
	this.hocky_size = 1.5;
	this.edge_wdith = 0.5;
	this.id_sequence = 0;
	this.pad_shape = "circle"
	this.win_condition = 5;
	this.score = [0, 0];
	this.world = new b2World(new b2Vec2(0, 0), true);
	this.enter_count = 0;
	this.ready_count = 0;
	this.start_count = 0;
	this.state = "INIT";
	//world = game.world;
	this.players = new Array;
	this.init = function(width, height, player_num, pad_shape, win_condition) {
		game.screen_width  = width/constant.scale;
		game.screen_height = height/constant.scale;
		game.player_num = player_num;
		game.pad_shape = pad_shape;
		game.win_condition = win_condition;
		for(var i = 0; i < game.player_num; i++) {
			game.players.push(new Player(i, game.id));
		}

		if (pad_shape == "rec"){
			game.pad_width = 3;
			game.pad_height = 1;
		}

		if (player_num == 4) {
			game.hole_size = 10;
		}
		game.createForeground();
		game.createBackground();
	};

	this.createBackground = function() {
		createDOMObjects(game, game.screen_width/2,	game.screen_height - game.edge_wdith/2,	(game.screen_width - game.hole_size)/2, game.edge_wdith/2, { "type" : b2Body.b2_staticBody, "restitution": 0.9}, "wall6", "wall");
		createDOMObjects(game, game.screen_width/2, game.edge_wdith/2, 					    (game.screen_width - game.hole_size)/2, game.edge_wdith/2, { "type" : b2Body.b2_staticBody, "restitution": 0.9}, "wall5", "wall");

		createDOMObjects(game, game.edge_wdith/2,					  game.screen_height/2, game.edge_wdith/2, game.screen_height/2 - game.edge_wdith, { "type" : b2Body.b2_staticBody, "restitution": 0.9}, "wall4", "wall");
		createDOMObjects(game, game.screen_width - game.edge_wdith/2, game.screen_height/2, game.edge_wdith/2, game.screen_height/2 - game.edge_wdith, { "type" : b2Body.b2_staticBody, "restitution": 0.9}, "wall3", "wall");

		//createDOMObjects(game, (game.screen_width - game.hole_size)/4,					   game.screen_height - game.edge_wdith/2, (game.screen_width - game.hole_size)/4, game.edge_wdith/2, { "type" : b2Body.b2_staticBody, "restitution": 0.9}, "wall2", "wall");
		//createDOMObjects(game, game.screen_width - (game.screen_width - game.hole_size)/4, game.screen_height - game.edge_wdith/2, (game.screen_width - game.hole_size)/4, game.edge_wdith/2, { "type" : b2Body.b2_staticBody, "restitution": 0.9}, "wall1", "wall");
	};

	this.createForeground = function() {
		game.hocky = createDOMObjects(game, game.screen_width/2, game.screen_height/2, game.hocky_size/2, game.hocky_size/2, {"shape": "circle" }, "hocky", "hocky");

		if(game.player_num == 2)
		{
			game.players[0].pad = createDOMObjects(game, game.screen_width/2, game.screen_height/3,   game.pad_width/2, game.pad_height/2, { "type" : b2Body.b2_kinematicBody, "shape": game.pad_shape }, "pad0", "pad");
			game.players[1].pad = createDOMObjects(game, game.screen_width/2, 2*game.screen_height/3, game.pad_width/2, game.pad_height/2, { "type" : b2Body.b2_kinematicBody, "shape": game.pad_shape }, "pad1", "pad");

			game.players[0].destination.x = game.players[0].pad.GetPosition().x;
			game.players[0].destination.y = game.players[0].pad.GetPosition().y;
			game.players[1].destination.x = game.players[1].pad.GetPosition().x;
			game.players[1].destination.y = game.players[1].pad.GetPosition().y;
		}
		else if(game.player_num == 4)
		{
			game.players[0].pad = createDOMObjects(game, game.screen_width/4,	game.screen_height/3,   game.pad_width/2, game.pad_height/2, { "type" : b2Body.b2_kinematicBody, "shape": game.pad_shape }, "pad0", "pad");
			game.players[1].pad = createDOMObjects(game, 3*game.screen_width/4, game.screen_height/3,   game.pad_width/2, game.pad_height/2, { "type" : b2Body.b2_kinematicBody, "shape": game.pad_shape }, "pad1", "pad");
			game.players[2].pad = createDOMObjects(game, game.screen_width/4,	2*game.screen_height/3, game.pad_width/2, game.pad_height/2, { "type" : b2Body.b2_kinematicBody, "shape": game.pad_shape }, "pad2", "pad");
			game.players[3].pad = createDOMObjects(game, 3*game.screen_width/4, 2*game.screen_height/3, game.pad_width/2, game.pad_height/2, { "type" : b2Body.b2_kinematicBody, "shape": game.pad_shape }, "pad3", "pad");

			game.players[0].destination.x = game.players[0].pad.GetPosition().x;
			game.players[0].destination.y = game.players[0].pad.GetPosition().y;
			game.players[1].destination.x = game.players[1].pad.GetPosition().x;
			game.players[1].destination.y = game.players[1].pad.GetPosition().y;
			game.players[2].destination.x = game.players[2].pad.GetPosition().x;
			game.players[2].destination.y = game.players[2].pad.GetPosition().y;
			game.players[3].destination.x = game.players[3].pad.GetPosition().x;
			game.players[3].destination.y = game.players[3].pad.GetPosition().y;
		}
	};

	this.updateForeground = function() {   
		for(var i = 0; i < game.player_num; i ++)
		{
			var player = game.players[i];
			var pos = player.pad.GetPosition();

			player.destination.boundaryChecking();
			var X_diff = player.destination.x - pos.x;
			var Y_diff = player.destination.y - pos.y;
			var X_speed = X_diff/constant.time_step;
			var Y_speed = Y_diff/constant.time_step;
			
			player.pad.SetAwake(true);
			player.pad.SetLinearVelocity(new b2Vec2(X_speed, Y_speed));

		}

		var pos = game.hocky.GetPosition();
		var goal = -1;
		if(pos.y - game.hocky_size/2 > game.screen_height) {
			goal = 0;
		}
		else if(pos.y + game.hocky_size/2 < 0) {
			goal = 1;
		}

		if(goal != -1 && (game.state == "START")) {
			game.state = "GOAL";
			game.score[goal] ++;
			game.hocky.SetLinearVelocity(new b2Vec2(0, 0));

			var win = -1;
			if(game.score[0] >= game.win_condition) {
				win = 0;
			}
			else if(game.score[1] >= game.win_condition) {
				win = 1;
			}

			for(var i = 0; i < game.player_num; i++) {
				if(game.players[i].connection) {
					game.players[i].connection.emit('goal', [goal, win, game.score[0], game.score[1]]);
				}
			}

			setTimeout(function() {
				game.hocky.SetPosition(new b2Vec2(game.screen_width/2, game.screen_height/2));

				if(win == -1)
				{
					game.state = "START";
					setTimeout( function() {

						var horizontal = Math.random()*99 + 1;
						var vertical = Math.random()*99 + 1;
						var magnitude = Math.sqrt(horizontal*horizontal + vertical*vertical);
						horizontal = horizontal/magnitude*constant.velocity*(Math.floor(Math.random()*2)*2 - 1);
						vertical   = vertical  /magnitude*constant.velocity*(Math.floor(Math.random()*2)*2 - 1);

						game.hocky.SetAwake(true);
						game.hocky.SetLinearVelocity(new b2Vec2(horizontal, vertical));
					}, 1000);
				}
				else
				{
					game.state = "END";

					clearInterval(game.displayInterval);
					for(var i = 0; i < game.player_num; i++) {
						if(game.players[i].connection) {
							game.players[i].connection.emit('end');
							game.players[i].connection.disconnect();
						}
					}
				}
				
			}, 1000);
		}
	};

	this.drawDOMObjects = function(require_static) {
		var ret = [];
		var i = 0;
		for (var b = game.world.m_bodyList; b; b = b.m_next) {
		 	for (var f = b.m_fixtureList; f; f = f.m_next) {
					if(f.m_userData)
					{
						if(b.GetType() != b2Body.b2_staticBody || require_static) {
							var pack = {};
							//Retrieve positions and rotations from the Box2d world
							pack.x = Math.floor((f.m_body.m_xf.position.x - f.m_userData.width )*constant.scale);
							pack.y = Math.floor((f.m_body.m_xf.position.y - f.m_userData.height)*constant.scale);
							//console.log(f.m_body.m_xf.position);
							//CSS3 transform does not like negative values or infitate decimals
							pack.r = Math.round(((f.m_body.m_sweep.a + constant.PI2) % constant.PI2) * constant.R2D * 100) / 100;
							pack.circle = f.m_userData.circle;
							pack.width  = Math.floor(f.m_userData.width *2*constant.scale);
							pack.height = Math.floor(f.m_userData.height*2*constant.scale);
							pack.id = f.m_userData.domObj.id;
							pack.css_class = f.m_userData.domObj.css_class;
							f.m_userData.setup = false;
							ret.push(pack);
						}
					}
		 	}
	  	}
		return ret;
	};

	//Method for animating
	this.update = function() {
		game.updateForeground();

		game.world.Step(constant.time_step, 10, 10);

		game.world.ClearForces();

		var data = game.drawDOMObjects(false);
		//console.log(data);
		for(var i = 0; i < game.player_num; i++){
			if(game.players[i].connection) {
				game.players[i].connection.emit('display', data);
			}
		}

	};

	this.startGame = function() {
		//Set a random movement for the hocky

		var horizontal = Math.random()*99 + 1;
		var vertical = Math.random()*99 + 1;
		var magnitude = Math.sqrt(horizontal*horizontal + vertical*vertical);
		horizontal = horizontal/magnitude*constant.velocity*(Math.floor(Math.random()*2)*2 - 1);
		vertical   = vertical  /magnitude*constant.velocity*(Math.floor(Math.random()*2)*2 - 1);

		game.hocky.SetAwake(true);
		game.hocky.SetLinearVelocity(new b2Vec2(horizontal, vertical));

		//console.log("y: " +game.players[0].destination.y);
		//Do one animation interation and start animating
		game.displayInterval = setInterval(function() { 
			game.update();
		}, 1000/constant.fps);
	
		game.update();
	};

	this.prepareGame = function() {
		//Create DOB OBjects
		game.createBackground();
		game.createForeground();

		var data = game.drawDOMObjects(true);
		for(var i = 0; i < game.player_num; i++){
			if(game.players[i].connection) {
				game.players[i].connection.emit('display', data);
			}
		}
	};
}
// var game = {
// 	screen_width: 0,
// 	screen_height: 0,
// 	player_num: 2,
// 	hole_size: 10,
//	 pad_size: 1,
//	 hocky_size: 1,
//	 edge_wdith:0.5,
// 	me: 1,
// 	id_sequence: 0,
// 	init: function() {
// 		game.canvas_width = 1024;
// 		game.canvas_height = 768;

// 		game.screen_width = game.canvas_width/constant.scale;
// 		game.screen_height = game.canvas_height/constant.scale;
// 	}
// };

var constant = {
	scale: 30,
	fps: 40,
	D2R: Math.PI/180,
	R2D: 180/Math.PI,
	PI2: Math.PI*2,
	time_step: 1.0/30,
	velocity: 10
};

function Player (player_id, room_id)
{
	this.id = player_id;
	this.room = room_id;
	var game = room[room_id];
	this.destination = {x:0, y:0};
	this.connection = null;
	this.team = Math.floor((player_id + game.player_num/2)/game.player_num);
	this.pad_width = game.pad_width;
	this.pad_height = game.pad_height;
	var me = this;
	this.destination.boundaryChecking = (function() {
		var upper_bound = (me.team == 0)? (game.screen_height/2) : (game.screen_height - game.edge_wdith);
		var lower_bound = (me.team == 0)? (game.edge_wdith)		 : (game.screen_height/2);
		var left_bound = game.edge_wdith;
		var right_bound = game.screen_width - game.edge_wdith;
		return function() {
			if (me.destination.x - me.pad_width/2 < left_bound)
				me.destination.x = left_bound + me.pad_width/2;
			if (me.destination.x + me.pad_width/2 > right_bound)
				me.destination.x = right_bound - me.pad_width/2;
			if (me.destination.y - me.pad_height/2 < lower_bound)
				me.destination.y = lower_bound + me.pad_height/2;
			if (me.destination.y + me.pad_height/2 > upper_bound)
				me.destination.y = upper_bound - me.pad_height/2;

		}
	}) ()
	this.pad = null;
}

//Cache the canvas DOM reference
var canvas;

//Are we debug drawing
var debug = false;

// Shorthand "imports"
var b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2AABB = Box2D.Collision.b2AABB,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
	b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;


function combineObjects(o1, o2)
{
	for (var property in o2) {
		if (o2.hasOwnProperty(property)) {
			o1[property] = o2[property];
		}
	}
	return o1;
}

function createDOMObjects(game, x, y, width, height, options, id, css_class) {
	var domObj = {};
	if(id) {
		domObj.id = id;
	}
	else {
		game.id_sequence ++ ;
		domObj.id = "id" + game.id_sequence;

	}

	if(css_class) {
		domObj.css_class = css_class;
	}
	else {
		domObj.css_class = "defaultStatic";
	}
	//console.log("id when create:" + domObj.id);
	//var domPos = {left:x, top:y};
	var body = createBox(game, x, y, width, height, options)
	body.m_userData = {domObj:domObj, width:width, height:height, circle: (options.shape == "circle")? true:false, setup: true};
	return body.GetBody();
}

// function createBox(x,y,width,height, static, circle) {
// 	var bodyDef = new b2BodyDef;
// 	bodyDef.type = static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
// 	bodyDef.position.x = x / SCALE;
// 	bodyDef.position.y = y / SCALE

// 	var fixDef = new b2FixtureDef;
//  	fixDef.density = 1.5;
//  	fixDef.friction = 0.01;
//  	fixDef.restitution = 1;

//  	if (circle) {
//  		var circleShape = new b2CircleShape;
// 		circleShape.m_radius = width / SCALE;

// 		fixDef.shape = circleShape;
//  	} else {
// 		fixDef.shape = new b2PolygonShape;
// 		fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
//  	}
// 	return world.CreateBody(bodyDef).CreateFixture(fixDef);
// }

function createBox(game, x, y, width, height, options)
{
	//default setting
	options = combineObjects({
		density: 20.0 ,
		friction: 0.0 ,
		restitution: 0.0 ,

		linearDamping: 0.0 ,
		angularDamping: 0.0 ,

		gravityScale: 1.0 ,
		type: b2Body.b2_dynamicBody,
		shape: "rec"
	}, options);

	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;

	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;

	//console.log(options.shape);
	if(options.shape == "rec")
	{
		fix_def.shape = new b2PolygonShape();
		fix_def.shape.SetAsBox(width , height);
	}
	else if(options.shape == "circle")
	{
		fix_def.shape = new b2CircleShape(width);
	}

	body_def.position.Set(x , y);

	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;

	body_def.type = options.type;

	return game.world.CreateBody(body_def).CreateFixture(fix_def);
}

//Animate DOM objects





var connections = [];
var room = [];
var app = require('http').createServer();
var io = require('socket.io').listen(app);

io.set('log level', 1);
app.listen(8081);

var game_listener = io.of('/game').on('connection', function (socket) {

	socket.on('control', function (data) {
		var room_id = socket.room_id;
		var player_id = socket.player_id;
		if(room_id != null && player_id != null && room[room_id] && room[room_id].players[player_id])
		{
			var game = room[room_id];
			var player = game.players[player_id];
			player.destination.x = data.destination.x/constant.scale + game.pad_width/2;
			player.destination.y = data.destination.y/constant.scale + game.pad_height/2;
		}
		//console.log(player.destination);
	});

	socket.on('start', function() {
		var room_id = socket.room_id;
		room[room_id].start_count ++;
		if(room[room_id].start_count >= room[room_id].player_num) {
			room[room_id].state = "START";
			room[room_id].startGame();
		}
	});

	socket.on('room', function (data) {	
		console.log(data);
		socket.room_id = data.room_id;
		var room_id = data.room_id;

		if(!room[room_id]) {
			room[room_id] = new Game(room_id);
			room[room_id].init(data.screen_width, data.screen_height, data.player_num, data.pad_shape, data.win_condition);
		}
		else if(room[room_id].state == "END")
		{
			//lazy deletion
			room[room_id] = null;
			room[room_id] = new Game(room_id);
			room[room_id].init(data.screen_width, data.screen_height, data.player_num, data.pad_shape, data.win_condition);
		}

		room[room_id].state = "PREPARE";
		socket.emit('display', room[room_id].drawDOMObjects(true));
	});

	socket.on('ready', function(data) {
		var room_id = data.room_id;
		var player_id = data.player_id;
		socket.room_id = data.room_id;
		socket.player_id = data.player_id;
		console.log("room_id: " + room_id);
		console.log("player_id: " + player_id);
		if(room[room_id]) {
			room[room_id].ready_count ++;
		}
		room[room_id].players[player_id].connection = socket;

		if(room[room_id].ready_count >= room[room_id].player_num)
		{
			var start_time = new Date().getTime() + 200;
			console.log(start_time);
			for(var i = 0; i < room[room_id].player_num; i++) {
				if(room[room_id].players[i].connection) {
					room[room_id].players[i].connection.emit('display', room[room_id].drawDOMObjects(false));
					room[room_id].players[i].connection.emit('start', start_time);
				}
			}
		}
		
	});
});

