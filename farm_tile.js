const farmTileWidth = 30;
const farmTileHeight = 30;

const parsnipHeight = 18;
const parsnipWidth = 16;
const parsnipY = 12;
const parsnip0 = 0;
const parsnip1 = 16;
const parsnip2 = 31;
const parsnip3 = 48;
const parsnip4 = 64;
const parsnip5 = 80;
const parsnipPicked = 99;

const types = {
  parsnip: {
    height: 18,
    width: 16,
    Y: 12,
    0: 0,
    1: 16,
    2: 31,
    3: 48,
    4: 64,
    5: 80,
    picked: 99,
    maxStage: 5,
  },
  hoedGround: {
    X: 192,
    Y: 336,
    height: 16,
    width: 16,
  },
};

class FarmTile extends Tile {
  static hoe(pos) {
    const tile = new FarmTile(pos, false);
    tiles.push(tile);
    return tile;
  }

  static has(pos) {
    let tile = null;
    tiles.forEach((el) => {
      if (el.pos[0] == pos[0] && el.pos[1] == pos[1]) {
        tile = el;
      }
    });
    return tile;
  }

  constructor(pos, isCrop, type = null,  stage = 0){
    super(pos);
    this.type = type;
    this.stage = stage;
    this.isCrop = isCrop;
    this.watered = false;
    this.plantable = true;
    if (isCrop && this.stage != types[this.type].maxStage) {
      this.grow();
    }
  }

  pick() {
    this.plantable = false;
    inventory[this.type] = inventory[this.type] ? inventory[this.type] + 1 : 1; 
    tools[this.type].quantity += 1;
    this.isCrop = false;
    setTimeout(() => this.plantable = true, 2);
  }

  pickable() {
    if (this.isCrop && this.stage == types[this.type].maxStage) {
      return true;
    }
    return false;
  }

  plant() {
    if (this.plantable) {
      this.type = 'parsnip';
      this.stage = 0;
      this.isCrop = true;
      if (this.watered) {
        this.grow();
      }
    }
  }

  water() {
    if (!this.watered) {
      this.watered = true;
      if (this.isCrop) {
        this.grow();
      }
    }
  }

  grow() {
    setTimeout(() => {
      this.stage += 1;
      this.watered = false;
    }, 500);
  }

  pos() {
    return this.pos;
  }

  render() {
    
    const x = this.pos[0];
    const y = this.pos[1];
    const width = farmTileWidth;
    const height = farmTileHeight;
    const ground = types.hoedGround;
    ctx.drawImage(outdoorsSpringImg,
      ground.X,
      ground.Y,
      ground.width,
      ground.height,
      x - width + mapWidth,
      y - height + mapHeight,
      farmTileWidth,
      farmTileHeight);
    if (this.watered) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(
        x - width + mapWidth,
        y - height + mapHeight,
        farmTileWidth, 
        farmTileHeight);
    }
    if (this.isCrop) {
      const type = types[this.type];
      ctx.drawImage(cropsImg, 
        type[this.stage], 
        type.Y,
        type.width, 
        type.height, 
        x - width + mapWidth, 
        y - height + mapHeight, 
        farmTileWidth, 
        farmTileHeight);
    }
  }
}