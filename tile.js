class Tile {

  static closestTile(pos) {
    const x = pos[0];
    const y = pos[1];
    const diffX = (Math.abs(x) % farmTileWidth);
    const diffY = (Math.abs(y) % farmTileHeight);
    const farmTileX = (Math.floor(x / farmTileWidth)) * farmTileWidth;
    const farmTileY = (Math.floor(y / farmTileHeight) - 2) * farmTileHeight;
    return [farmTileX, farmTileY];
  }
  constructor(pos) {
    this.pos = pos;
  }
}