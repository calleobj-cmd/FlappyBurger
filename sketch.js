// Flappy Burger in p5.js

let y = 350;
let v = 0;
let gravity = 0.6;
let a = 500;

let burgerX = 150;
let burgerW = 50;
let burgerH = 25;

let wingAngle = 0;

let angle = 0;        // current burger rotation
let targetAngle = 0;  // target rotation
let maxUpAngle = radians(-55);  
let maxDownAngle = radians(65);

let score = 0;
let highScore = 0;
let scored = false;
let firstRoundPlayed = false;

let start = false;
let gameOver = false;

// Mouth variables
let numMouths = 2;
let mouthX = [];
let mouthY = [];
let mouthSpeed = 5;
let mouthSpacing = 350;

function setup() {
  createCanvas(500, 800);
  
  for (let i = 0; i < numMouths; i++) {
    mouthX[i] = width + i * mouthSpacing;
    mouthY[i] = int(random(150, 450)); 
  }
}

function draw() {
  drawBackgroundGradient();
  drawClouds();
  drawFastFood();
  drawSun();
  
  strokeWeight(1.5);

  wingAngle = sin(frameCount * 0.4) * 20;

  if (start && !gameOver) {
    v += gravity;
    y += v;
    moveObstacle();
    checkCollision();
  }

  drawBurger();

  if (!start) {
    textSize(40);
    textAlign(CENTER, CENTER);

    let title = "Flappy Burger";
    let textX = 233;
    let textY = 140;

    // Gradient text
    for (let i = 0; i < 30; i++) {
      let inter = map(i, 0, 30, 0, 1);
      let c = lerpColor(color(255, 255, 120), color(255, 120, 0), inter);
      fill(c);
      text(title, textX, textY + i*0.3);
    }

    if (firstRoundPlayed) {
      fill(255);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("High Score: " + highScore, 230, 205);
    }
  }

  if (start && !gameOver) {
    stroke(0);
    strokeWeight(3);
    fill(255);
    textSize(40);
    textAlign(CENTER, TOP);
    text(score, width/2, 20);
    noStroke();
  }
}

function moveObstacle() {
  for (let i = 0; i < numMouths; i++) {
    mouthX[i] -= mouthSpeed;          
    drawMouth(mouthX[i], mouthY[i]);  

    if (!scored && mouthX[i] + 100 < burgerX) {
      score++;
      if (score > highScore) highScore = score;
      scored = true;
    }

    if (mouthX[i] < -100) {
      mouthX[i] = max(mouthX) + mouthSpacing; 
      mouthY[i] = int(random(150, 450));     
      scored = false;
    }
  }
}

function checkCollision() {
  let partWidth = 100;
  let numTeeth = 5;
  let teethWidth = 18;
  let teethHeight = 35;

  let burgerTop = y - burgerH/2;
  let burgerBottom = y + burgerH/2;
  let burgerLeft = burgerX - burgerW/2;
  let burgerRight = burgerX + burgerW/2;

  for (let m = 0; m < numMouths; m++) {
    let startX = mouthX[m] + (partWidth - numTeeth * teethWidth) / 2.0;
    let by = mouthY[m] + 190;
    let ty = mouthY[m];

    // Top teeth
    for (let i = 0; i < numTeeth; i++) {
      let tx = startX + i * teethWidth;
      let tyTop = ty - teethHeight;
      let tyBottom = ty;
      if (burgerRight > tx && burgerLeft < tx + teethWidth &&
          burgerBottom > tyTop && burgerTop < tyBottom) {
        resetGame();
      }
    }

    // Bottom teeth
    for (let i = 0; i < numTeeth; i++) {
      let tx = startX + i * teethWidth;
      let tyTop = by;
      let tyBottom = by + teethHeight;
      if (burgerRight > tx && burgerLeft < tx + teethWidth &&
          burgerBottom > tyTop && burgerTop < tyBottom) {
        resetGame();
      }
    }

    // Check burger
    if (burgerRight > mouthX[m] && burgerLeft < mouthX[m] + partWidth) {
      if (burgerTop < ty || burgerBottom > by) {
        resetGame();
      }
    }
  }
}

function resetGame() {
  start = false;
  gameOver = false;
  y = 350;
  v = 0;

  for (let i = 0; i < numMouths; i++) {
    mouthX[i] = width + i * mouthSpacing;
    mouthY[i] = int(random(150, 450));
  }

  score = 0;
  scored = false;
  firstRoundPlayed = true;
}

function keyPressed() {
  if (!start) start = true;
  else if (!gameOver && key === ' ') v = -12;
}

function mousePressed() {
  if (!start) start = true;
  else if (!gameOver) v = -12;
}

function drawBurger() {
  noStroke();

  if (start) {
    if (v < 0) targetAngle = maxUpAngle; 
    else targetAngle = min(maxDownAngle, v * 3);
    angle = lerp(angle, targetAngle, 0.08);
  } else {
    angle = 0;
  }

  push();
  translate(burgerX, y);
  rotate(angle);

  // Top bun gradient
  let bunTopY = -13;
  let bunHeight = 20;
  for (let i = 0; i < bunHeight; i++) {
    let inter = map(i, 0, bunHeight, 0, 1);
    let bunColor = lerpColor(color(230, 180, 110), color(190, 130, 70), inter);
    fill(bunColor);
    ellipse(0, bunTopY + i, burgerW, burgerH - i*0.2);
  }

  // Bottom bun gradient
  let bottomHeight = 20;
  for (let i = 0; i < bottomHeight; i++) {
    let inter = map(i, 0, bottomHeight, 0, 1);
    let bunColor = lerpColor(color(200, 150, 90), color(150, 100, 60), inter);
    fill(bunColor);
    ellipse(0, 18 + i*0.1, 50, 20 - i*0.1);
  }

  // Lettuce gradient
  for (let i = 0; i < 6; i++) {
    let inter = map(i, 0, 6, 0, 1);
    let lettuceColor = lerpColor(color(120, 220, 120), color(40, 150, 60), inter);
    fill(lettuceColor);
    rect(-25, -5 + i, 50, 1);
  }

  // Cheese gradient
  for (let i = 0; i < 6; i++) {
    let inter = map(i, 0, 6, 0, 1);
    let cheeseColor = lerpColor(color(255, 240, 100), color(255, 180, 0), inter);
    fill(cheeseColor);
    rect(-25, i, 50, 1);
  }

  // Patty gradient
  for (let i = 0; i < 10; i++) {
    let inter = map(i, 0, 10, 0, 1);
    let pattyColor = lerpColor(color(140, 90, 40), color(80, 40, 20), inter);
    fill(pattyColor);
    rect(-25, 6 + i, 50, 1);
  }

  // Eye
  fill(255);
  circle(13, -12, 10);
  fill(0);
  circle(15, -11, 7);

  // Wing
  fill(255, 200);
  push();
  translate(-10, 12);
  rotate(radians(sin(frameCount * 0.4) * 20));
  ellipse(0, 0, 50, 15);
  pop();

  pop();
}


