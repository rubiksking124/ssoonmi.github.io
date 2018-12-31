class Player {
  constructor(toolBar) {
    this.position = [0, 0];
    this.moveDiff = [0, 0];
    this.moveDiffIncr = [3, 3];
    this.size = [30, 50];
    this.toolBar = toolBar;

    this.movingByMouse = false;
    this.mousePos = [0, 0];
    this.pauseMoving = false;
    this.holdingSpaceDown = false;
    this.prevHighlightTile = [null, null];
  }

  moveByKey(dir, isMoving) {
    const incrX = this.moveDiffIncr[0];
    const incrY = this.moveDiffIncr[1];
    switch (dir) {
      case 'up':
        this.moveDiff[1] = isMoving ? -incrY : 0;
        break;
      case 'down':
        this.moveDiff[1] = isMoving ? incrY : 0;
        break;
      case 'left':
        this.moveDiff[0] = isMoving ? -incrX : 0;
        break;
      case 'right':
        this.moveDiff[0] = isMoving ? incrX : 0;
        break;
      default:
        break;
    }
    this.movingByMouse = false;
  }

  moveByMouse(x, y) {
    const incrX = this.moveDiffIncr[0];
    const incrY = this.moveDiffIncr[1];
    const width = this.size[0];
    const height = this.size[1];
    this.movingByMouse = true;
    const pos = [x - mapWidth + width/2, y - mapHeight + (5* height/4)];
    this.mousePos = pos;
    this.moveDiff[0] = pos[0] < this.position[0] ? -incrX : incrX;
    this.moveDiff[1] = pos[1] < this.position[1] ? -incrY : incrY;
  }

  highlightTile() {
    const x = this.position[0];
    const y = this.position[1];
    const width = this.size[0];
    const height = this.size[1];
    return Tile.closestTile([x + width / 2, y + height / 2]);
  }

  sameHighlightTile() {
    const highlightTile = this.highlightTile();
    const prevHighlightTile = this.prevHighlightTile;
    return (prevHighlightTile[0] == highlightTile[0] && prevHighlightTile[1] == highlightTile[1]);
  }

  startHoeing() {
    this.hoeing = true;
  }

  stopHoeing() {
    this.hoeing = false;
    this.holdingSpaceDown = false;
  }

  hoeTile() {
    if (this.holdingSpaceDown || !this.pauseMoving) {
      const closestTile = this.highlightTile();
      const tile = FarmTile.has(closestTile);
      const currentTool = toolsOrd[this.toolBar.currentTool];
      if (currentTool == 'hoe' && tile == null) {
        FarmTile.hoe(closestTile);
      } else if (tile != null && tile.pickable()) {
        tile.pick();
        this.pauseMoving = true;
        setTimeout(() => this.pauseMoving = false, 300);
      } else if (tile != null && currentTool == 'watering_can') {
        tile.water();
      } else if (tile != null && currentTool == 'parsnip_seed' && !tile.isCrop) {
        if (tools[currentTool].quantity > 0) {
          tile.plant(closestTile);
          tools[currentTool].quantity += -1;
        }
      }
      if (!this.sameHighlightTile()) {
        this.prevHighlightTile = closestTile;
        this.pauseMoving = true;
        setTimeout(() => this.pauseMoving = false, 300);
      }
      this.holdingSpaceDown = true;
    }
  }

  render() {
    const x = this.position[0];
    const y = this.position[1];
    const width = this.size[0];
    const height = this.size[1];

    ctx.beginPath();
    ctx.rect(x - width + mapWidth, y - height + mapHeight, width, height);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();

    if (!this.pauseMoving) {
      const dx = this.moveDiff[0];
      const dy = this.moveDiff[1];
      let newX = x + dx;
      let newY = y + dy;
      if (newX < width - mapWidth) {
        newX = width - mapWidth;
      } else if (newX > 0) {
        newX = 0;
      }

      if (newY < height - mapHeight) {
        newY = height - mapHeight;
      } else if (newY > 0) {
        newY = 0;
      }

      if (this.movingByMouse) {
        if (Math.abs(x - this.mousePos[0]) < this.moveDiffIncr[0]) {
          this.moveDiff[0] = 0;
          newX = this.mousePos[0];
        }
        if (Math.abs(y - this.mousePos[1]) < this.moveDiffIncr[1]) {
          this.moveDiff[1] = 0;
          newY = this.mousePos[1];
        }
      }

      this.position = [newX, newY];
    }

    const closestTile = this.highlightTile();
    ctx.beginPath();
    ctx.rect(closestTile[0] - farmTileWidth + mapWidth, closestTile[1] - farmTileHeight + mapHeight, farmTileWidth, farmTileHeight);
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.closePath();
    
    if (this.hoeing && !this.pauseMoving) {
      this.hoeTile();
    }
  }
}