let video;
let classifier;
let label = "";
let currentFilter = 'none';
let pixelSize = 10;
let modelURL = 'https://teachablemachine.withgoogle.com/models/8CtgCIdJT/';

function preload() {
  
  
  classifier = ml5.imageClassifier(modelURL + "model.json");
}

// function setup() {
//   createCanvas(640, 480);
//   video = createCapture(VIDEO);
//   video.size(width, height);
//   video.hide();
//   classifyVideo();

  
// }
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  video.elt.onloadedmetadata = () => {
    console.log("🎥 ");
  };

  classifyVideo();
}


function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  console.log("识别结果：", results); // ✅ 打印识别输出
  label = results[0].label;
  console.log("🧠 识别结果 label:", label);


  // 根据 label 切换滤镜类型（从上到下顺序为：2fingers, 1finger, openhand, fist, nohand）
  if (label === '✌️') {
    currentFilter = 'memory';
  } else if (label === '☝️') {
    currentFilter = 'thermal';
  } else if (label === '🖐️') {
    currentFilter = 'pinkblue';
  } else if (label === '✊') {
    currentFilter = 'shadow';
  } else {
    currentFilter = 'none';
  }
  classifyVideo();
}

function draw() {
  background(0);

  if (currentFilter === 'pinkblue') {
    drawPinkBlueFilter();
  } else if (currentFilter === 'thermal') {
    drawThermalFilter();
  } else if (currentFilter === 'memory') {
    drawMemoryFilter();
  } else if (currentFilter === 'shadow') {
    drawShadowFilter();
  } else {
    image(video, 0, 0, width, height);
  }

  // 显示当前识别标签
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Gesture: " + label, 10, 10);
}

function drawPinkBlueFilter() {
  video.loadPixels();
  if (video.pixels.length > 0) {
    for (let y = 0; y < video.height; y += pixelSize) {
      for (let x = 0; x < video.width; x += pixelSize) {
        let i = 4 * (y * video.width + x);
        let r = video.pixels[i];
        let g = video.pixels[i + 1];
        let b = video.pixels[i + 2];
        let brightness = (r + g + b) / 3;
        let pink = color(255, 200, 255);
        let blue = color(150, 200, 255);
        let c = lerpColor(blue, pink, brightness / 255);
        fill(c);
        noStroke();
        rect(x, y, pixelSize, pixelSize);
      }
    }
  } else {
    image(video, 0, 0, width, height);
  }
}

function drawThermalFilter() {
  video.loadPixels();
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let brightness = (r + g + b) / 3;
      let heat = color(map(brightness, 0, 255, 0, 255), 0, map(brightness, 255, 0, 0, 255));
      pixels[index] = red(heat);
      pixels[index + 1] = green(heat);
      pixels[index + 2] = blue(heat);
      pixels[index + 3] = 255;
    }
  }
  updatePixels();
}

function drawMemoryFilter() {
  video.loadPixels();
  tint(255, 180);
  image(video, 0, 0, width, height);
  noFill();
  stroke(255, 100);
  strokeWeight(2);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    rect(x, y, random(5, 20), random(5, 20));
  }
}

function drawShadowFilter() {
  video.loadPixels();
  loadPixels();
  if (video.pixels.length > 0) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let index = (x + y * width) * 4;
        let r = video.pixels[index];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        let avg = (r + g + b) / 3;
        let shade = avg > 127 ? 255 : 0;
        pixels[index] = shade;
        pixels[index + 1] = shade;
        pixels[index + 2] = shade;
        pixels[index + 3] = 255;
      }
    }
    updatePixels();
  } else {
    image(video, 0, 0, width, height);
  }
}


