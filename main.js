const 
	cnv				= document.getElementById('cnv'),
	ctx				= cnv.getContext('2d'),
	height			= cnv.height,
	width			= cnv.width;

let
	pl1 			= {
		yp: (height / 2) - 50,		// position Y
		yv: 0,						// velocity Y
		w: 20,						// width
		h: 100,						// height
	},
	pl2 			= {
		yp: (height / 2) - 50,
		yv: 0,
		w: 20,
		h: 100,
	},
	ball 			= {
		xp: width / 2,
		yp: height / 2,
		xv: 0,
		yv: 0,
		s: 35,
	},

	started			= false,
	finished		= false,
	speed			= 0,
	direction1		= '',
	direction2		= '',
	hit = false
;


document.addEventListener('keydown', move);
let game = setInterval(mainLoop, 1000/60);

function mainLoop() {
	// draw everyting
	draw();

	//move the ball
	ball.xp += ball.xv;
	ball.yp += ball.yv;

	// check ball's collision to walls
	if(ballCollision()){
		ball.yv *= -1;
	}

	// if player isn't near the wall
	if(!play1Collision()){
		// it can move
		pl1.yp += pl1.yv;
	}

	if(!play2Collision()){
		// it can move
		pl2.yp += pl2.yv;
	}

	if(Ball_vs_Player1() || Ball_vs_Player2()){
		ball.xv *= -1;

		ball.yv += .1;
		ball.xv += .1;
	}

	if(outOfBoard()){
		finished = true;
		started = false;
		document.getElementById('score').innerHTML = 'FINISHED';
		document.removeEventListener('keydown', move);
		document.addEventListener('keydown', function(e) {
			if(e.keyCode == 13) window.location.reload();
		});
		clearInterval(game);
	}
}

function Ball_vs_Player1() {
	if(!hit){
		if( ball.xp < pl1.w
			&& ball.yp > pl1.yp - (ball.s / 4)
			&& ball.yp < pl1.yp + pl1.h + (ball.s / 4)
		){
			hit = true;
			setTimeout(function() {
				hit = false;
			}, 500);
			return true
		}


		return false
	}		
}

function Ball_vs_Player2(){
	if(!hit){
		if( ball.xp + ball.s > width - pl2.w
			&& ball.yp > pl2.yp - (ball.s / 4)
			&& ball.yp < pl2.yp + pl2.h + (ball.s / 4)
		){
			hit = true;
			setTimeout(function() {
				hit = false;
			}, 500);
			return true
		}

		return false
	}
}

function outOfBoard() {
	if( ball.xp > width || ball.xp < 0){
		return true
	}
	return 0
}

function play1Collision() {
	if(pl1.yp < 5 && direction1 === 'up'){
		return true
	}
	if(pl1.yp + pl1.h > height && direction1 === 'down'){
		return true
	}
	return false
}

function play2Collision() {
	if(pl2.yp < 5 && direction2 === 'up'){
		return true
	}
	if(pl2.yp + pl2.h > height && direction2 === 'down'){
		return true
	}
	return false
}

function ballCollision() {
	if(ball.yp < 5 ){
		return true
	}
	if(ball.yp + ball.s > height){
		return true
	}
	return false
}

function drawTable() {
	//draw the table
	ctx.fillStyle = '#00f';
	ctx.fillRect(0, 0, width, height);
	ctx.strokeStyle = '#000';
	ctx.strokeRect(0, 0, width, height);

	// draw the grid
	for (let i = width / 2 - 20; i <= width / 2 + 20; i += 10) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, height);
	}
	for (let i = 0.5; i < height; i += 10) {
		ctx.moveTo(width / 2 - 20, i);
		ctx.lineTo(width / 2 + 20, i);
	}
	ctx.strokeStyle = "#ccc";
	ctx.stroke();
}

function drawPlayers() {
	ctx.fillStyle = '#f00';
	ctx.fillRect(0, pl1.yp, pl1.w, pl1.h);
	ctx.strokeStyle = "#565";
	ctx.strokeRect(0, pl1.yp, pl1.w, pl1.h);

	ctx.fillStyle = '#f00';
	ctx.fillRect(width - pl2.w, pl2.yp, pl2.w, pl2.h);
	ctx.strokeStyle = "#565";
	ctx.strokeRect(width - pl2.w, pl2.yp, pl2.w, pl2.h);
}

function drawBall() {
	ctx.beginPath();
	ctx.fillStyle = '#fff';
	ctx.arc(ball.xp, ball.yp, ball.s, 0, Math.PI * 2, true);
	ctx.fill();
}

function draw() {
	drawTable();
	drawBall();
	drawPlayers();
}

function start() {
	started = true;
	let posVel = [];
	for(let i = -10; i < 10; i++){
		if(i == -5) i = 5
		posVel.push(i)
	}
	do{
		let x = (~~(Math.random() * posVel.length));
		let y = (~~(Math.random() * posVel.length));
		ball.xv = posVel[x];
		ball.yv = posVel[y];
	}while(ball.xv == 0);
	speed = ball.yv > 0 ? ball.yv : -ball.yv;
}

function move(e) {
	if(!finished){
		if(!started) start();
		if(e.keyCode === 87){ // up arrow
			direction1 = 'up'
			pl1.yv = -speed;
		}
		if(e.keyCode === 83){ // down arrow
			direction1 = 'down'
			pl1.yv = speed;
		}
		if(e.keyCode === 38){ // up arrow
			direction2 = 'up'
			pl2.yv = -speed;
		}
		if(e.keyCode === 40){ // down arrow
			direction2 = 'down'
			pl2.yv = speed;
		}
	}		
}