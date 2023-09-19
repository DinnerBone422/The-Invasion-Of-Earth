var gameState, play, end;
var player, playerImg, leftAlien, rightAlien, blueAlienImg, greenAlienImg, redAlienImg, alienBullet;
var gameOver, gameOverImg, restart, restartImg;
var playerBulletsGroup, aliensGroup, alienBulletsGroup, leftAliensGroup, rightAliensGroup;
var bulletsRemain, timerMin, timerSec, timerFin, kills;
var canvasW, canvasH;
var FULLSCREEN;

function preload() {
  playerImg = loadImage("/Assets/playerImg.png");

  blueAlienImg = loadImage("/Assets/blueAlienImg.png");
  greenAlienImg = loadImage("/Assets/greenAlienImg.png");
  redAlienImg = loadImage("/Assets/redAlienImg.png");

  gameOverImg = loadImage("/Assets/gameOverImg.png");
  restartImg = loadImage("/Assets/restartImg.png");

}

function setup() {
	canvasW = windowWidth/1.5;
	canvasH = windowHeight/1.5;
	var canvas = createCanvas(canvasW, canvasH);
	canvas.parent('Game');
	rectMode(CENTER);

  player = createSprite(width/2, height/1.15);
  player.addImage(playerImg);
  player.scale = 0.2;

  gameOver = createSprite(width/2, height/2, width, height);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.75;
  gameOver.visible = false;

  restart = createSprite(width/2, height/1.2);
  restart.addImage(restartImg);
  restart.scale = 1;
  restart.visible = false;
  restart.depth = gameOver.depth + 1;

  playerBulletsGroup = new Group();
  aliensGroup = new Group();
  alienBulletsGroup = new Group();
  leftAliensGroup = new Group();
  rightAliensGroup = new Group();

  play = 0;
  end = 1;
  gameState = play;
  bulletsRemain = 100;
  timerMin = 1;
  timerSec = 0;
  timerFin = 0;
  kills = 0;

}

function draw() {
  if (gameState === play){
    collisions();
    timer();
    playerMovement();
    spawnAliens();
    noCursor();
    EndGame();
  }

  if (gameState === end) {
    playerBulletsGroup.destroyEach();
    aliensGroup.destroyEach();
    restart.visible = true;
    player.visible = false;
    cursor();
    if (kills >= 20) {

    }
    if (kills <= 19) {
      gameOver.visible = true;
    }
    if (mousePressedOver(restart)) {
      reset();
    }
  }

  
  background(10,5,4);
  drawSprites();
  textSize(25);
  fill("White");
  
  if (gameState === play) {
    text("Time Left: " + timerMin + ":" + round(timerSec), 0, 20);
    text("Bullets Left: " + bulletsRemain, 0, 45);
    text("Kills: " + kills, 0, 70);
  }

  if (gameState === end) {
    if (kills >= 20) {
      textSize(100);
      text("YOU WON", width/2.5, height/2);
    }
  }

  if (timerMin <= -1) {
    timerFin = 0;
  }
  else if (timerMin >= 0) {
    timerFin = timerMin;
  }
}

function EndGame() {
  if (timerMin == 0 && timerSec == 0) {
    gameState = end;
  }
  if (bulletsRemain <= 0) {
    gameState = end;
  }
}

function reset() {
  gameOver.visible = false;
  restart.visible = false;
  player.visible = true;
  player.x = width/2;
  gameState = play;
  bulletsRemain = 100;
  kills = 0;
  timerMin = 1;
  timerSec = 0;
  timerFin = 0;
}

function bigScreen() {
  domElementGame = document.getElementById('Game').style.position = "fixed";
  domElementGame = document.getElementById('Game').style.top = 0;
  domElementGame = document.getElementById('Game').style.left = 0;
  document.getElementById("footer").style.display= "none";
  resizeCanvas(window.innerWidth, window.innerHeight);
  FULLSCREEN = TRUE;
}

function playerMovement() {
  if (keyDown("left") || keyDown("a")) {
    if (player.x >=0 ) {
      player.x = player.x - 15;
    }
  }

  if (keyDown("right") || keyDown("d")) {
    if (player.x <= width) {
      player.x = player.x + 15;
    }
  }
  
  if (keyDown("up") || keyDown("w")) {
    Shoot();
  }
}

function Shoot() {
  if (gameState === play && bulletsRemain >= 1) {
    playersBullets();
  }
}

function playersBullets() {
  if (gameState === play) {
    var playerBullet = createSprite(player.x, player.y, width/70, height/15);
    playerBullet.setCollider("rectangle", 0, 0, width/70, height/15);
    playerBullet.velocityY = - 15;
    playerBulletsGroup.add(playerBullet);
    playerBullet.lifetime = 750;
    bulletsRemain = bulletsRemain - 1;
  }
}

function spawnAliens() {
  if (frameCount%150===0) {
    var leftAlien = createSprite(-10, random(30, height/2), 40, 40);

    switch(Math.round(random(2, 3))) {
      case 1:
      leftAlien.addImage(blueAlienImg);
      leftAlien.scale = 0.3;
      break;

      case 2:
      leftAlien.addImage(greenAlienImg);
      leftAlien.scale = 0.25;
      leftAlien.setCollider("rectangle", 0, 0, 275, 300);
      break;

      case 3:
      leftAlien.addImage(redAlienImg);
      leftAlien.scale = 0.08;
      leftAlien.setCollider("rectangle", 0, 0, 900, 900);
      break;

      default:
      break;
    }
    leftAlien.velocityX = 4;
    aliensGroup.add(leftAlien);
    leftAliensGroup.add(leftAlien);
  }

  if (frameCount%160===0) {
    var rightAlien = createSprite(width + 10, random(30, height/2), 40, 40);

    switch(Math.round(random(2, 3))) {
      case 1:
      rightAlien.addImage(blueAlienImg);
      rightAlien.scale = 0.3;
      break;

      case 2:
      rightAlien.addImage(greenAlienImg);
      rightAlien.scale = 0.25;
      rightAlien.setCollider("rectangle", 0, 0, 275, 300);
      break;

      case 3:
      rightAlien.addImage(redAlienImg);
      rightAlien.scale = 0.08;
      rightAlien.setCollider("rectangle", 0, 0, 900, 900);
      break;

      default:
      break;
    }
    rightAlien.velocityX = -4;
    aliensGroup.add(rightAlien);
    rightAliensGroup.add(rightAlien);
  }
}

function collisions() {
  if (aliensGroup.isTouching(playerBulletsGroup)) {
    for (var i=0;i<aliensGroup.length;i++) {
      if (aliensGroup[i].isTouching(playerBulletsGroup)) {
        aliensGroup[i].destroy();
        kills = kills + 1;
      }
    }
  }
}

function timer() {
  timerSec = timerSec - 0.033;
  if (timerSec < 2 && timerSec > 0) {
    timerMin = timerMin - 1;
    timerSec = timerSec - 2;
  }
  if (timerMin <= -1 ) {
    gameState = end;
  }
  else if (timerSec <= 0) {
    timerSec = 60;
  }
}