import { Tool } from './Tool.js';
import { ParticleFactory } from '../particles/ParticleFactory.js';

export class IceTool extends Tool {
  constructor() {
    super();
    this.dragging = false;
    this.spawnSize = 3;
  }

  onMouseDown(grid, x, y) {
    this.dragging = true;
    this.spawnIce(grid, x, y);
  }

  onMouseMove(grid, x, y) {
    if (this.dragging) {
      this.spawnIce(grid, x, y);
    }
  }

  onMouseUp(grid, x, y) {
    this.dragging = false;
  }

  spawnIce(grid, x, y) {
    const size = this.spawnSize;
    for (let i = -size; i <= size; i++) {
      for (let j = -size; j <= size; j++) {
        const tx = x + i;
        const ty = y + j;
        if (
          tx >= 0 && tx < grid.width &&
          ty >= 0 && ty < grid.height &&
          Math.random() < 0.5
        ) {
          grid.set(tx, ty, ParticleFactory.createIce());
        }
      }
    }
  }
}