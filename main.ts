type R2 = { x: number, y: number };

const gameWidth: number = 200;
const gameHeight: number = 100;

type Player = {
  position: R2;
  velocity: R2;
};

type GameState = {
  player1: Player;
  player2: Player;
};

let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let initialState: GameState = {
  player1: {
    position: {x: 50, y: 90},
    velocity: {x: 0, y: 0}
  },
  player2: {
    position: {x: 150, y:90},
    velocity: {x: 0, y: 0}
  }
};

function gameLoop(state: GameState): void {
  
}
