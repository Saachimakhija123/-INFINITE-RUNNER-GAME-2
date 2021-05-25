var PLAY = 1;
var END = 0;
var gameState = PLAY;


var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var birdsGroup,bird;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var highScore=0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud1.png");
  birdImg=loadImage("bird.png")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

  backgroundImg=loadImage("background.jpg");
}

function setup() {
  createCanvas(600,600);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  

  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  birdsGroup=createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
  //trex.setCollider("rectangle",0,0,150,40);
  //trex.debug = true
  
  score = 0;
  highScore=0;
  
}

function draw() {
  
  background(backgroundImg);
  //displaying score
  textSize(15);
  fill("Black");
  text("Score: "+ score, 520,10);
  text("HighestScore:" + highScore, 400,10);
  text("Note: Avoid touching cactus.", 100,10)
  
  
  console.log(getFrameRate());
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4+score/60);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score % 100 ===0 && score>0){
      checkPointSound.play();
     
    
    }
    

    
     
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")) {
        trex.velocityY = -20;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.5
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();

    spawnBirds();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
       //trex.velocityY=-12;
      //jumpSound.play(); 
    }
  
  }

  

   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
     if(mousePressedOver(restart)){
        reset();
      
     
    }
     
 
     
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    birdsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     birdsGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  camera.position.x=600/2;
  camera.position.y=trex.y;

  drawSprites();
}


function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  birdsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
 
  
if(score>highScore){
  
  highScore=score;
}
  score=0; 
  
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6+score/60);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function spawnBirds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
     bird = createSprite(600,100,40,10);
    bird.y = Math.round(random(2,70));
    bird.addImage(birdImg);
    bird.scale = 0.1;
    bird.velocityX = -3;
    
     //assign lifetime to the variable
    bird.lifetime = 134;
    
    //adjust the depth
    bird.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   birdsGroup.add(bird);
    }
}

