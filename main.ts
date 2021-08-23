type R2 = { x: number, y: number };

const gameWidth: number = 200;
const gameHeight: number = 100;
const playerMaxSpeed: number = 0.2; // maximum horizontal speed
const playerAcceleration: number = 0.03; // horizontal acceleration

type Player = {
  position: R2;
  velocity: R2;
};

type GameState = {
  player1: Player;
  player2: Player;
};

type PlayerInput = {
  direction: "left" | "right" | null;
  jumping: boolean;
};

type GameInput = {
  player1: PlayerInput;
  player2: PlayerInput;
};

let canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.setAttribute('width', gameWidth.toString());
canvas.setAttribute('height', gameHeight.toString());

// Clamp a value into the range [-limit, limit] (assuming limit is positive)
function absclamp(value: number, limit: number): number {
  return Math.min(Math.max(-limit, value), limit)
}

function handleEvents(state: GameState, input: GameInput): void {
  // First update velocities
  let desiredVelocity;
  switch (input.player1.direction) {
    case 'left':
      desiredVelocity = state.player1.velocity.x - playerAcceleration;
      break;
    case 'right':
      desiredVelocity = state.player1.velocity.x + playerAcceleration;
      break;
    case null:
      desiredVelocity = state.player1.velocity.x - Math.sign(state.player1.velocity.x) * Math.min(playerAcceleration, Math.abs(state.player1.velocity.x))
      break;
  }
  state.player1.velocity.x = absclamp(desiredVelocity, playerMaxSpeed);
  
  // Then update positions
  state.player1.position.x += state.player1.velocity.x
}

function renderPlayer(ctx: CanvasRenderingContext2D, position: R2, fillStyle: string): void {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(position.x, position.y, 10, 10);
}

function render(state: GameState, ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, gameWidth, gameHeight);
  renderPlayer(ctx, state.player1.position, 'red');
  renderPlayer(ctx, state.player2.position, 'blue');
}

function startGame(): void {
  let gameState: GameState = {
    player1: {
      position: { x: 50, y: 80 },
      velocity: { x: 0, y: 0 }
    },
    player2: {
      position: { x: 150, y: 80 },
      velocity: { x: 0, y: 0 }
    }
  };
  let gameInput: GameInput = {
    player1: { direction: null, jumping: false },
    player2: { direction: null, jumping: false }
  }
  document.addEventListener('keydown', (ev) => {
    console.log('keydown: ', ev);
    switch (ev.key) {
      case 'a':
        gameInput.player1.direction = 'left';
        break;
      case 'd':
        gameInput.player1.direction = 'right';
        break;
    }
  });
  document.addEventListener('keyup', (ev) => {
    //console.log('keyup', ev);
    switch (ev.key) {
      case 'a':
        gameInput.player1.direction = null;
        break;
      case 'd':
        gameInput.player1.direction = null;
        break;
    }
  })
  let ctx = canvas.getContext('2d') || (function() { throw new Error("Unable to get canvas context"); })();
  function gameLoop(_timestamp: number) {
    requestAnimationFrame(gameLoop);
    handleEvents(gameState, gameInput);
    render(gameState, ctx);
  }
  requestAnimationFrame(gameLoop);
}

startGame();