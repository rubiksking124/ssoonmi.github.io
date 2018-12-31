class ToolBar {
  constructor() {
    this.currentTool = 0;
  }

  selectTool(posX) {
    this.currentTool = Math.floor(posX / 60);
  }

  render() {
    ctx.beginPath();
    ctx.rect(1, mapHeight + 1, canvasWidth - 2, toolBarHeight - 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
    const size = 60;
    let X = 1;
    let Y = mapHeight;

    ctx.font = "bold 16px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "black";
    toolsOrd.forEach((tool, idx) => {
      const quantity = tools[tool].quantity;
      if (quantity > 0) {
        ctx.beginPath();
        ctx.rect(X + 1, Y + 3, size - 2, size - 6);
        ctx.strokeStyle = (this.currentTool == idx) ? "red" : "black";
        ctx.stroke();
        ctx.closePath();
        ctx.drawImage(
          tools[tool].img,
          tools[tool].x,
          tools[tool].y,
          tools[tool].width,
          tools[tool].height,
          X + 12,
          Y + 6,
          size - 24,
          size - 24);
        if (!tools[tool].isTool) {
          ctx.fillText(quantity.toString(), X + 55, Y + 55);
        }
        X += size;
      }
    });

    ctx.font = "24px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "#000000";
    ctx.fillText(money.toString() + "G", canvasWidth - 24, Y + 38);
  }
}