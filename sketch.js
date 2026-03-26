let y = 350;
let v = 0;
let gravity = 0.6;
let a = 500;

let burgerX = 150;
let burgerW = 50;
let burgerH = 25;

let wingAngle = 0;

let angle = 0;
let targetAngle = 0;
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
    mouthY[i] = random(150, 450);
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
  } else {
    drawMouth(a, random(150, 450));
  }

  drawBurger();

  if (!start) {
    textSize(40);
    textAlign(CENTER, CENTER);

    let title = "Flappy Burger";
    let textX = 233;
    let textY = 140;

    for (let i = 0; i < 30; i++) {
      let inter = map(i, 0, 30, 0, 1);
      let c = lerpColor(color(255, 255, 120), color(255, 120, 0), inter);
      fill(c);
      text(title, textX, textY + i * 0.3);
    }

    if (firstRoundPlayed) {
      fill(255);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("High Score: " + highScore, 230, 205);
    }
  }

  if (start && !gameOver) {
    fill(255);
    textSize(40);
    textAlign(CENTER, TOP);
    text(score, width / 2, 20);
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
      mouthX[i] = Math.max(...mouthX) + mouthSpacing;
      mouthY[i] = random(150, 450);
      scored = false;
    }
  }
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
    if (v < 0) {
      targetAngle = maxUpAngle;
    } else {
      targetAngle = min(maxDownAngle, v * 3);
    }

    angle = lerp(angle, targetAngle, 0.08);
  } else {
    angle = 0;
  }

  push();
  translate(burgerX, y);
  rotate(angle);

  fill(230,180,110);
  ellipse(0,-13,burgerW,burgerH);

  fill(255);
  circle(13,-12,10);
  fill(0);
  circle(15,-11,7);

  fill(255,200);
  push();
  translate(-10,12);
  rotate(radians(sin(frameCount * 0.4) * 20));
  ellipse(0,0,50,15);
  pop();

  pop();
}
// Draw all your original fast food stuff
void drawFastFood() {
  noStroke();

  // Table gradient
  for (int i = 0; i < 40; i++) {
    float inter = map(i, 0, 40, 0, 1);
    color tableColor = lerpColor(color(180, 120, 60), color(120, 70, 30), inter);
    stroke(tableColor);
    line(0, 760 + i, width, 760 + i);
  }

  // Grass gradient in front of the table
  float grassTop = 640;
  float grassHeight = 120;
  
  for (int i = 0; i < grassHeight; i++) {
    float inter = map(i, 0, grassHeight, 0, 1);
    float alphaFade;
    if (i < 40) alphaFade = map(i, 0, 40, 40, 255);
    else alphaFade = 255;
    
    color grassColor = lerpColor(color(90, 255, 90), color(40, 140, 40), inter);
    stroke(grassColor, alphaFade);
    line(0, grassTop + i, width, grassTop + i);
  }

  noStroke();

  // Fries box
  float friesBoxX = 50;
  float friesBoxY = 700;
  float friesBoxW = 60;
  float friesBoxH = 85;
  
  for (int i = 0; i < friesBoxH; i++) {
    float inter = map(i, 0, friesBoxH, 0, 1);
    color boxColor = lerpColor(color(#FF5E5E), color(#C22A2A), inter);
    fill(boxColor);
    rect(friesBoxX, friesBoxY + 5 + i, friesBoxW, 1);
  }
  fill(#8B2323);
  ellipse(friesBoxX + 30, friesBoxY + 15, 55, 13);

  fill(#F0CD05);
  textSize(35);
  textAlign(CENTER, CENTER);
  text("m", friesBoxX + friesBoxW / 2, friesBoxY + 40);

  // Fries gradient
  float[] fryX = { friesBoxX + 9, friesBoxX + 21, friesBoxX + 33, friesBoxX + 44 };
  float[] fryY = { friesBoxY - 14, friesBoxY - 13, friesBoxY - 13, friesBoxY - 14 };
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 35; j++) {
      float inter = map(j, 0, 35, 0, 1);
      color fryColor = lerpColor(color(#FFD700), color(#FFA500), inter);
      fill(fryColor);
      rect(fryX[i], fryY[i] + j, 8, 1);
    }
  }

  // Cup
  float cupX = 206;
  float cupY = 710;
  for (int i = 0; i < 80; i++) {
    float inter = map(i, 0, 80, 0, 1);
    color cupColor = lerpColor(color(255, 200), color(200, 150), inter);
    fill(cupColor, 160);
    rect(cupX, cupY + i, 50, 1);
  }
  
  fill(255);
  rect(cupX + 30, cupY - 17, 10, 90, 15);
  
  for (int i = 0; i < 58; i++) {
    float inter = map(i, 0, 58, 0, 1);
    color liquidColor = lerpColor(color(139, 69, 19, 210), color(100, 50, 10, 210), inter);
    fill(liquidColor);
    rect(cupX + 3, cupY + 17 + i, 44, 1, 10);
  }
  
  fill(#FF0000);
  rect(cupX, cupY - 3, 50, 15, 20);
  fill(#FF0000);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Coke", cupX + 25, cupY + 40);
  fill(255);
  rect(cupX + 30, cupY - 17, 10, 25, 15);
  
  fill(0, 180);
  rect(cupX + 31, cupY - 16, 8, 7, 17);

  // Nuggets gradient
  float[][] nuggetPos = { {319, 771}, {375, 785}, {335, 785}, {400, 780}, {355, 775} };
  for (int i = 0; i < nuggetPos.length; i++) {
    for (int j = 0; j < 20; j++) {
      float inter = map(j, 0, 20, 0, 1);
      color nuggetColor = lerpColor(color(#FFD700), color(#FFA500), inter);
      fill(nuggetColor);
      ellipse(nuggetPos[i][0], nuggetPos[i][1], 25 - j * 0.5, 17 - j * 0.5);
    }
  }

  // McNuggets box
  float boxX = 425;
  float boxY = 750;
  float boxW = 70;
  float boxH = 40;

  // Box gradient
  for (int i = 0; i < boxH; i++) {
    float inter = map(i, 0, boxH, 0, 1);
    color boxColor = lerpColor(color(#FFD8A6), color(#FFB85C), inter);
    fill(boxColor);
    rect(boxX, boxY + i, boxW, 1, 8);
  }

  fill(0);
  textSize(15);
  textAlign(CENTER, CENTER);
  text("McNuggets", boxX + boxW / 2, boxY + boxH / 2);

  fill(0, 130);
  rect(boxX + 2.5, boxY + 1, 65, 10);
}

void drawClouds() {
  fill(255, 220);
  noStroke();
  ellipse(100, 100, 80, 50);
  ellipse(140, 90, 60, 40);
  ellipse(400, 130, 90, 60);
  ellipse(450, 120, 70, 50);
  ellipse(300, 70, 90, 50);
  ellipse(50, 40, 90, 50);
  ellipse(180, 40, 80, 40);
  ellipse(30, 130, 60, 40);
  ellipse(210, 90, 60, 40);
  ellipse(230, 95, 50, 30);
  ellipse(350, 35, 50, 30);
}

void drawSun() {
  pushStyle();

  float sunX = width - 30;
  float sunY = 30;

  noStroke();

  // Sun gradient
  float sunSize = 115;
  for (int i = 0; i < sunSize; i++) {
    float inter = map(i, 0, sunSize, 0, 1);
    color sunColor = lerpColor(color(255, 255, 150), color(255, 180, 0), inter);
    fill(sunColor);
    ellipse(sunX, sunY, sunSize - i, sunSize - i);
  }

  stroke(#FFD700, 190);
  strokeWeight(3);

  popStyle();
}

// Draw a single mouth
void drawMouth(float x, int yPos) {
  int partWidth = 100;
  int numTeeth = 5;
  int teethWidth = 18;
  int teethHeight = 35;

  float startX = x + (partWidth - numTeeth * teethWidth) / 2.0;
  float by = yPos + 190;
  float ty = yPos;

  // Mouth inside gradient
  float mouthTop = ty - 80;
  float mouthHeight = (by - ty) + 160;
  for (int i = 0; i < mouthHeight; i++) {
    float inter = map(i, 0, mouthHeight, 0, 1);
    color mouthColor = lerpColor(color(200, 20, 20), color(60, 0, 0), inter);
    stroke(mouthColor);
    line(x + 3, mouthTop + i, x + partWidth - 3, mouthTop + i);
  }

  noStroke();

  stroke(0);
  fill(235, 195, 165);
  rect(x, by, partWidth, 1000 - by, 20);

  fill(255);
  for (int i = 0; i < numTeeth; i++) {
    rect(startX + i * teethWidth, by, teethWidth, teethHeight, 3);
  }

  fill(235, 195, 165);
  rect(x, -200, partWidth, ty + 200, 20);

  fill(255);
  for (int i = 0; i < numTeeth; i++) {
    rect(startX + i * teethWidth, ty - teethHeight, teethWidth, teethHeight, 3);
  }

  float eyeY = ty - teethHeight - 20;
  float eyeSpacing = 25;

  fill(255);
  ellipse(x + eyeSpacing, eyeY, 25, 25);
  ellipse(x + partWidth - eyeSpacing, eyeY, 25, 25);

  fill(0);
  ellipse(x + eyeSpacing, eyeY, 12, 12);
  ellipse(x + partWidth - eyeSpacing, eyeY, 12, 12);
}

void drawBackgroundGradient() {
  color topColor = color(200, 220, 255);
  color middleColor = color(80, 190, 255);
  for (int i = 0; i < height; i++) {
    float inter = map(i, 0, height, 0, 1);
    color c = lerpColor(topColor, middleColor, inter);
    stroke(c);
    line(0, i, width, i);
  }
}

