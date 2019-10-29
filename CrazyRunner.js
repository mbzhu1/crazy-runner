
var body = document.getElementsByTagName("BODY")[0];
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var HP = document.getElementById('HP');
var HPTitle = document.getElementById('HPTitle')
var score = document.getElementById('score');
var highScore = document.getElementById('highScore')
var alert = document.getElementById('alert')
var restartButton = document.getElementById('restart')
var scoreKeeper = 0;
var gameOverFlag = false;
var levelKeeper = 0;
var controls = {left: false, up: false, right: false, down: false}
var highScoreKeeper = Number(localStorage.getItem("hiScore"))

var enemySize={width:50,height:50};
var sizeRatio = 40;
var HPKeeper = 150;
var Player = {x: canvas.width/2, y :canvas.height/2, width: 35, height: 35};
var playerSpeed = 5;
var enemies = [];
var enemyNumber = 2
var speedRatio = 1.6
var Checkpoint = {x:canvas.width-100, y:canvas.height-100, width:50, height:50};
var newCheckpoint = {x:canvas.width-100, y:canvas.height-100, width:50, height:50};
var checkpointRespawnInterval = 2000;
var flagImg = new Image();
flagImg.src = "troll_flag.png"

var healthPackList = [];
var healthPack1 = {x:canvas.width * 3/4, y: canvas.height * 1/4, width: 35, height:35}
var healthPack2 = {x:canvas.width * 1/4, y: canvas.height * 3/4, width: 35, height:35}
var healthPackImg = new Image();
healthPackImg.src = "healthPack.png"

var easyButton = document.getElementById('easy')
var mediumButton = document.getElementById('med')
var hardButton = document.getElementById('hard')

function makeEnemies(num){
	for(i=0; i < num; i++){
		var randRatio1 = [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
		var randRatio2 = [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
		var randRatio3 = [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
		var randRatio4 = [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
		var random = Math.random();
		if (random < 1){   //top spawn
			var ratio = randRatio1[Math.floor(Math.random() * randRatio1.length)];
			randRatio1.splice(Math.floor(Math.random() * randRatio1.length),1);
			var enemyPosition = {x: canvas.width * ratio, y:0, speed: Math.random()* speedRatio, width: Math.random() * sizeRatio};
			enemies.push(enemyPosition);
		}
		if (random < 0.75){ // bot spawn
			var ratio = randRatio2[Math.floor(Math.random() * randRatio2.length)];
			randRatio2.splice(Math.floor(Math.random() * randRatio2.length),1);
			var enemyPosition = {x: canvas.width * ratio, y:canvas.height-enemySize.height, speed: Math.random()*speedRatio,width: Math.random() * sizeRatio};
			enemies.push(enemyPosition);
		}
		if (random < 0.5){ // left spawn
			var ratio = randRatio3[Math.floor(Math.random() * randRatio3.length)];
			randRatio3.splice(Math.floor(Math.random() * randRatio3.length),1);
			var enemyPosition = {x: 0 , y:canvas.height * ratio, speed:Math.random()*speedRatio,width: Math.random() * sizeRatio};
			enemies.push(enemyPosition);
		}
		if (random < 0.25){ // right spawn
			var ratio = randRatio4[Math.floor(Math.random() * randRatio4.length)];
			randRatio4.splice(Math.floor(Math.random() * randRatio4.length),1);
			var enemyPosition = {x: canvas.width -enemySize.width, y:canvas.height * ratio, speed:Math.random()*speedRatio,width: Math.random() * sizeRatio};
			enemies.push(enemyPosition);
		}
	}
	for (i=0; i<enemies.length;i++){
		if (enemies[i].speed > speedRatio) {
			enemies[i].speed = speedRatio;
		}
		if (enemies[i].width < 20){
			enemies[i].width = 20;
		}
	}
}

function main(){
	HPTitle.style.color = "white"
	HP.style.color = "white"
	highScoreCounter();
	levelKeeper +=1;
	numberOfEnemyByLevel();
	Player = {x: canvas.width/2, y :canvas.height/2, width: 27, height: 27};
	enemies = []
	healthPackList = [];
	resetHealthPack();
	healthPackSpawn();
	makeEnemies(enemyNumber);
}

function highScoreCounter(){
	if (scoreKeeper > highScoreKeeper){
		highScoreKeeper = scoreKeeper;
		localStorage.setItem("hiScore",highScoreKeeper)
	}
	highScore.innerHTML = highScoreKeeper;
}

function restart(){
	alert.innerHTML = null;
	levelKeeper = 0;
	scoreKeeper = 0;
	HPKeeper = 150;
	main();
}

function numberOfEnemyByLevel(){
	if (levelKeeper >= 4){
		enemyNumber =3;
	}
	if (levelKeeper >= 9){
		enemyNumber = 4;
	}
	if (levelKeeper >= 18){
		enemyNumber = 6;
	}
	if (levelKeeper >= 25){
		enemyNumber = 8;
	}
	if (levelKeeper >=30){
		enemyNumber=15;
	}
	if (levelKeeper>=35){
		enemyNumber = 20
	}
	if (levelKeeper>=40){
		enemyNumber = 25
	}
	if (levelKeeper>=45){
		enemyNumber = 30
	}
	if (levelKeeper>=50){
		enemyNumber = 50
	}
}

HP.innerHTML=HPKeeper;
score.innerHTML=scoreKeeper;
highScore.innerHTML = highScoreKeeper;

main()
createCharacters()

function createCharacters(){
	ctx.fillStyle="#15dc40";
	ctx.fillRect(Checkpoint.x,Checkpoint.y,Checkpoint.width,Checkpoint.height);
	ctx.drawImage(flagImg,Checkpoint.x,Checkpoint.y,Checkpoint.width,Checkpoint.height)
	drawEnemies();
	ctx.fillStyle = "#0077ee";
	ctx.fillRect(Player.x,Player.y,Player.width,Player.height);
}

function drawEnemies() {
	ctx.fillStyle = "#aa3322"
	for(i=0; i < enemies.length; i++){
		ctx.fillRect(enemies[i].x,enemies[i].y,enemies[i].width,enemies[i].width);
	}
}

function animate(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	healthPackSpawn();
	createCharacters();
	collisionChecker(Player,enemies)
	collectHealthPack();
	checkpointChecker();
}

function onKeyPress(evt) {
	if(evt.keyCode == 82) {//R key
		restart();
	}
	gameOver()
	if (gameOverFlag == false){
		if (evt.keyCode == 37) { //left
				evt.preventDefault();
				controls.left = true;
		}
		if (evt.keyCode == 38) { //up
				evt.preventDefault();
				controls.up = true;
		}
		if (evt.keyCode == 39) { //right
				evt.preventDefault();
				controls.right = true;
		}
		if (evt.keyCode == 40) { //down
				evt.preventDefault();
				controls.down = true;
		}
		animate();
	}
}

function keyUp(evt){
	gameOver()
	if (gameOverFlag == false){
		if (evt.keyCode == 37) {
				controls.left = false;
		}
		if (evt.keyCode == 38) {
				controls.up = false;
		}
		if (evt.keyCode == 39) {
				controls.right = false;
		}
		if (evt.keyCode == 40) {
				controls.down = false;
		}
		animate();
	}
}


window.addEventListener("keydown",onKeyPress)
window.addEventListener("keyup", keyUp)
window.setInterval(playerMovement, 10);
window.setInterval(enemyMovement, 10);
window.setInterval(checkpointRespawn,checkpointRespawnInterval)

function easySpeed(){
	speedRatio=1.2
	checkpointRespawnInterval = 3000
	sizeRatio = 30
}

function mediumSpeed(){
	enemyNumber=1.6
	checkpointRespawnInterval = 2000
	sizeRatio = 40
}

function hardSpeed(){
	enemyNumber=2
	checkpointRespawnInterval = 500
	sizeRatio = 50
}

easyButton.addEventListener('click', easySpeed);
mediumButton.addEventListener('click', mediumSpeed);
hardButton.addEventListener('click', hardSpeed);
restartButton.addEventListener('click',restart)

function collisionChecker(player,list){
	gameOver();
	if (gameOverFlag == false){
		for (i=0; i<list.length;i++){
			if (player.x < list[i].x + list[i].width &&
    		player.x + player.width > list[i].x &&
    		player.y < list[i].y + list[i].width &&
    		player.height + player.y > list[i].y) {
				if (Math.random() < 0.2) {
					HP.style.color = "red";
					HPTitle.style.color = "red"
					HPKeeper -= 1;
				}
			}
		}
		HP.innerHTML=HPKeeper;
	}
}

function gameOver() {
	if (HPKeeper <1){
		HP.innerHTML = 0;
		enemyNumber = 2;
		gameOverFlag=true;
	}else{
		gameOverFlag=false;
	}
}

function checkpointChecker(){
	if (Player.x < Checkpoint.x + Checkpoint.width &&
	Player.x + Player.width > Checkpoint.x &&
	Player.y < Checkpoint.y + Checkpoint.height &&
	Player.height + Player.y > Checkpoint.y){
		scoreKeeper ++;
		checkpointRespawn();
		main();
	}
	score.innerHTML=scoreKeeper;
}

function healthPackSpawn(){
	if (levelKeeper % 5 == 0) {
		ctx.fillStyle = "red";
		for (i=0; i< healthPackList.length;i++){
			ctx.fillRect(healthPackList[i].x,healthPackList[i].y,healthPackList[i].width,   healthPackList[i].height)
			ctx.drawImage(healthPackImg, healthPackList[i].x, healthPackList[i].y, healthPackList[i].width, healthPackList[i].height)
		}
	}
}

function resetHealthPack(){
	if (levelKeeper % 5 == 0){
		healthPackList.push(healthPack1);
		healthPackList.push(healthPack2);
	}
}

function collectHealthPack(){
	for (i=0; i< healthPackList.length;i++){
		if (itemHit(healthPackList[i]) == true){
			healthPackList.splice(i,1);
			HPKeeper += levelKeeper * 5;
		}
	}
}

function itemHit(item){
	if (Player.x < item.x + item.width &&
	Player.x + Player.width > item.x &&
	Player.y < item.y + item.height &&
	Player.height + Player.y > item.y){
		return true;
	}else{
		return false;
	}
}

function enemyMovement(){
	gameOver()
	if (gameOverFlag == false){
		for (i=0; i<enemies.length;i++){
			if (enemies[i].x < Player.x){
				enemies[i].x += enemies[i].speed;
			}else{
				enemies[i].x -= enemies[i].speed;
			}
			if (enemies[i].y < Player.y){
				enemies[i].y += enemies[i].speed;
			}else{
				enemies[i].y -= enemies[i].speed;
			}
		}
		animate()
	}else{
		alert.innerHTML = "YOU DIED!"

	}
}

function playerMovement(){
	gameOver();
	if (gameOverFlag == false){
		if (controls.left == true){
			if (Player.x > 0){
				Player.x -= 2;
			}
		}
		if (controls.up == true){
			if (Player.y > 0) {
				Player.y -= 2;
			}
		}
		if (controls.right == true){
			if(Player.x + Player.width < canvas.width){
				Player.x += 2;
			}
		}
		if (controls.down == true){
			if(Player.y + Player.height < canvas.height){
				Player.y += 2;
			}
		}
	}
}

function checkpointRespawn(){
	if(Math.random() < 1){
		newCheckpoint = {x:canvas.width-100, y:canvas.height-100, width:50, height:50};
		if (newCheckpoint == Checkpoint){
			Checkpoint = {x:100, y:100, width:50, height:50};
		}else{
			Checkpoint = newCheckpoint;
		}
	}
	if(Math.random() < 0.75){
		newCheckpoint = {x:100, y:100, width:50, height:50};
		if (newCheckpoint == Checkpoint){
			Checkpoint = {x:canvas.width-100, y:100, width:50, height:50};
		}else{
			Checkpoint = newCheckpoint;
		}
	}
	if(Math.random() < 0.5){
		newCheckpoint = {x:canvas.width-100, y:100, width:50, height:50};
		if (newCheckpoint == Checkpoint){
			Checkpoint = {x:100, y:canvas.height-100, width:50, height:50};
		}else{
			Checkpoint = newCheckpoint;
		}
	}
	if(Math.random() < 0.25){
		newCheckpoint = {x:100, y:canvas.height-100, width:50, height:50};
		if (newCheckpoint == Checkpoint){
			Checkpoint = {x:canvas.width-100, y:canvas.height-100, width:50, height:50};
		}else{
			Checkpoint = newCheckpoint;
		}
	}
}
