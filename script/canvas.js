function drawRectangle() {
	var canvas = document.getElementById('arena');
	if (canvas.getContext){
		var ctx = canvas.getContext('2d');
		// drawing code here
		
		// ctx.fillStyle = "rgb(200,0,0)";
		// ctx.fillRect (10, 10, 55, 50);

		// ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
		// ctx.fillRect (30, 30, 55, 50);

		// ctx.fillRect(75,75,100,100);
	    // ctx.clearRect(95,95,60,60);
	    // ctx.strokeRect(100,100,50,50);

	    // ctx.beginPath();
	    // ctx.moveTo(75,50);
	    // ctx.lineTo(100,75);
	    // ctx.lineTo(100,25);
	    // ctx.fill();

	    // // x,y,r,s-angle,e-angle,anti-clockwise
	    // ctx.beginPath();
	    // ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
	    // ctx.moveTo(110,75);
	    // ctx.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
	    // ctx.moveTo(65,65);
	    // ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
	    // ctx.moveTo(95,65);
	    // ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
	    // ctx.stroke();

	    // // Filled triangle
	    // ctx.beginPath();
	    // ctx.moveTo(25,25);
	    // ctx.lineTo(105,25);
	    // ctx.lineTo(25,105);
	    // ctx.fill();

	    // // Stroked triangle
	    // ctx.beginPath();
	    // ctx.moveTo(125,125);
	    // ctx.lineTo(125,45);
	    // ctx.lineTo(45,125);
	    // ctx.closePath();
	    // ctx.stroke();

	 	// for(var i=0;i<4;i++){
		// 	for(var j=0;j<3;j++){
		// 		ctx.beginPath();
		// 		var x              = 25+j*50;               // x coordinate
		// 		var y              = 25+i*50;               // y coordinate
		// 		var radius         = 20;                    // Arc radius
		// 		var startAngle     = 0;                     // Starting point on circle
		// 		var endAngle       = Math.PI+(Math.PI*j)/2; // End point on circle
		// 		var anticlockwise  = i%2==0 ? false : true; // clockwise or anticlockwise
		// 		ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
		// 		if (i>1){
		// 			ctx.fill();
		// 		} else {
		// 			ctx.stroke();
		// 		}
		// 	}
		// }

		// // Quadratric curves example
		// ctx.beginPath();
		// ctx.moveTo(75,40);
		// ctx.bezierCurveTo(75,37,70,25,50,25);
		// ctx.bezierCurveTo(20,25,20,62.5,20,62.5);
		// ctx.bezierCurveTo(20,80,40,102,75,120);
		// ctx.bezierCurveTo(110,102,130,80,130,62.5);
		// ctx.bezierCurveTo(130,62.5,130,25,100,25);
		// ctx.bezierCurveTo(85,25,75,37,75,40);
		// ctx.fill();

	    // // Quadratric curves example
	    // ctx.beginPath();
	    // ctx.moveTo(75,25);
	    // ctx.quadraticCurveTo(25,25,25,62.5);
	    // ctx.quadraticCurveTo(25,100,50,100);
	    // ctx.quadraticCurveTo(50,120,30,125);
	    // ctx.quadraticCurveTo(60,120,65,100);
	    // ctx.quadraticCurveTo(125,100,125,62.5);
	    // ctx.quadraticCurveTo(125,25,75,25);
	    // ctx.stroke();

	    // roundedRect(ctx,12,12,150,150,15);
	    // roundedRect(ctx,19,19,150,150,9);
	    // roundedRect(ctx,53,53,49,33,10);
	    // roundedRect(ctx,53,119,49,16,6);
	    // roundedRect(ctx,135,53,49,33,10);
	    // roundedRect(ctx,135,119,25,49,10);

	} else {
	  // canvas-unsupported code here
	  console.log("canvas unsupported");
	  return null;
	}
}

function roundedRect(ctx,x,y,width,height,radius){
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
  ctx.lineTo(x+width-radius,y+height);
  ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  ctx.lineTo(x+width,y+radius);
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
  ctx.lineTo(x+radius,y);
  ctx.quadraticCurveTo(x,y,x,y+radius);
  ctx.stroke();
}