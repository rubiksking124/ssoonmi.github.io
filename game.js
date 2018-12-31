const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const canvasPos = canvas.getBoundingClientRect();
const canvasLeft = canvasPos.x;
const canvasTop = canvasPos.y;

const toolBarHeight = 60;

const mapWidth = canvasWidth;
const mapHeight = canvasHeight - toolBarHeight;


const cropsImg = new Image();
cropsImg.src = "./crops.png";
const outdoorsSpringImg = new Image();
outdoorsSpringImg.src = "./outdoors_spring.png";
const hoeImg = new Image();
hoeImg.src = './hoe.png';
const wateringCanImg = new Image();
wateringCanImg.src = './watering_can.png';

const money = 500;

const toolBar = new ToolBar();
const player = new Player(toolBar);
const tiles = [];

const inventory = {};
const inventoryOrd = [];

const toolsOrd = ['hoe', 'watering_can', 'parsnip_seed', 'parsnip'];
const tools = { 
  'hoe': {
    img: hoeImg,
    quantity: 1,
    isTool: true,
    x: 0,
    y: 0,
    width: 48,
    height: 48
  },
  'watering_can': {
    quantity: 1, 
    img: wateringCanImg, 
    x: 0, 
    y: 0, 
    width: 48, 
    height: 48, 
    isTool: true
  }, 
  'parsnip_seed': {
    quantity: 10, 
    img: cropsImg, 
    x: 248, 
    y: 426, 
    width: 16, 
    height: 18, 
    isTool: false
  }, 
  'parsnip': {
    quantity: 0, 
    img: cropsImg, 
    x: 99, 
    y: 12, 
    width: 16, 
    height: 18, 
    isTool: false
  },
};

const keyDownHandler = () => {
  return (e) => {
    switch (e.keyCode) {
      case 87: // w
        player.moveByKey('up', true);
        break;
      case 65: // a
        player.moveByKey('left', true);
        break;
      case 83: // s
        player.moveByKey('down', true);
        break;
      case 68: // d
        player.moveByKey('right', true);
        break;
      case 32: // space
        player.startHoeing();
        e.preventDefault();
        break;
      default:
        break;
    }
  };
};

const keyUpHandler = () => {
  return (e) => {
    switch (e.keyCode) {
      case 87: // w
        player.moveByKey('up', false);
        break;
      case 65: // a
        player.moveByKey('left', false);
        break;
      case 83: // s
        player.moveByKey('down', false);
        break;
      case 68: // d
        player.moveByKey('right', false);
        break;
      case 32: // space
        player.stopHoeing();
        e.preventDefault();
        break;
      default:
        break;
    }
  };
};

const mouseHandler = () => {
  return (e) => {
    if (e.clientX > canvasLeft &&
      e.clientX < canvasLeft + canvasWidth && 
      e.clientY > canvasTop && 
      e.clientY < canvasTop + canvasHeight) {
        if (e.clientY <= canvasTop + mapHeight) {
          player.moveByMouse(e.clientX - canvasLeft, e.clientY - canvasTop);
        } else {
          toolBar.selectTool(e.clientX - canvasLeft);
        }
    }
  };
};

const keyDown = document.addEventListener("keydown", keyDownHandler(), false);
const keyUp = document.addEventListener("keyup", keyUpHandler(), false);

document.addEventListener("click", mouseHandler());

const renderCanvas = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  tiles.forEach((tile) => {
    tile.render();
    // ctx.beginPath();
    // ctx.rect(x - width + canvasWidth, y - height + canvasHeight, width, height);
    // ctx.fillStyle = "#FFFFFF";
    // ctx.fill();
    // ctx.closePath();
  });
  player.render();
  toolBar.render();
};

setInterval(renderCanvas, 10);
