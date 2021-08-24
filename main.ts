type R2 = { x: number, y: number };

const GAME_WIDTH: number = 200;
const GAME_HEIGHT: number = 100;
const GAME_ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;
const PLAYER_MAX_SPEED: number = 0.4; // maximum horizontal speed
const PLAYER_ACCELERATION: number = 0.03; // horizontal acceleration

type Player = {
  direction: Direction;
  position: R2;
  velocity: R2;
};

type GameState = {
  player1: Player;
  player2: Player;
};

type Direction = "left" | "right" | null;

type PlayerInput = {
  direction: Direction;
  jumping: boolean;
};

type GameInput = {
  player1: PlayerInput;
  player2: PlayerInput;
};

let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let gameScale: number = 1.0;

// Rescale the canvas according to the viewport size, returning the new scale factor
function rescaleCanvas() {
  let viewportWidth = document.body.clientWidth;
  let viewportHeight = document.body.clientHeight;
  let viewportAspectRatio = viewportWidth / viewportHeight;
  if (GAME_ASPECT_RATIO > viewportAspectRatio) {
    // Limited by width
    gameScale = viewportWidth / GAME_WIDTH;
    canvas.setAttribute('width', viewportWidth.toString());
    canvas.setAttribute('height', (viewportWidth / GAME_ASPECT_RATIO).toString());
  } else {
    // limited by height
    gameScale = viewportHeight / GAME_HEIGHT;
    canvas.setAttribute('height', viewportHeight.toString());
    canvas.setAttribute('width', (viewportHeight * GAME_ASPECT_RATIO).toString());
  }
}
window.addEventListener('resize', rescaleCanvas);
rescaleCanvas();

// Clamp a value into the range [-limit, limit] (assuming limit is positive)
function absclamp(value: number, limit: number): number {
  return Math.min(Math.max(-limit, value), limit)
}

function desiredDirection(leftKey: boolean, rightKey: boolean, currentDirection: Direction): Direction {
  if (!leftKey && !rightKey) {
    return null;
  } else if (!leftKey && rightKey) {
    return "right";
  } else if (leftKey && !rightKey) {
    return "left";
  } else {
    return currentDirection;
  }
}

function handleEvents(state: GameState, input: GameInput): void {
  state.player1.direction = desiredDirection(keyboardState['a'], keyboardState['d'], state.player1.direction);
  handleHorizontalMovement(state.player1);
  state.player2.direction = desiredDirection(keyboardState['ArrowLeft'], keyboardState['ArrowRight'], state.player2.direction);
  handleHorizontalMovement(state.player2);
}

function handleHorizontalMovement(player: Player) {
  // First update velocities
  let desiredVelocity;
  switch (player.direction) {
    case 'left':
      desiredVelocity = player.velocity.x - PLAYER_ACCELERATION;
      break;
    case 'right':
      desiredVelocity = player.velocity.x + PLAYER_ACCELERATION;
      break;
    case null:
      desiredVelocity = player.velocity.x - Math.sign(player.velocity.x) * Math.min(PLAYER_ACCELERATION, Math.abs(player.velocity.x))
      break;
  }
  player.velocity.x = absclamp(desiredVelocity, PLAYER_MAX_SPEED);

  // Then update positions
  player.position.x += player.velocity.x
}

function renderPlayer(ctx: CanvasRenderingContext2D, position: R2, fillStyle: string): void {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(gameScale * position.x, gameScale * position.y, gameScale * 5, gameScale * 10);
}

function render(state: GameState, ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, gameScale * GAME_WIDTH, gameScale * GAME_HEIGHT);
  renderPlayer(ctx, state.player1.position, 'red');
  renderPlayer(ctx, state.player2.position, 'blue');
}

type KeyboardState = {
  a: boolean;
  d: boolean;
  w: boolean;
  ArrowUp: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
};
let keyboardState: KeyboardState = {
  a: false,
  d: false,
  w: false,
  ArrowUp: false,
  ArrowLeft: false,
  ArrowRight: false
};

document.addEventListener('keydown', (ev) => {
  let key = ev.key;
  if (key in keyboardState) {
    let key_ = key as keyof KeyboardState;
    keyboardState[key_] = true;
  }
});
document.addEventListener('keyup', (ev) => {
  let key = ev.key;
  if (key in keyboardState) {
    let key_ = key as keyof KeyboardState;
    keyboardState[key_] = false;
  }
});

function startGame(): void {
  let gameState: GameState = {
    player1: {
      position: { x: 50, y: 80 },
      velocity: { x: 0, y: 0 },
      direction: null
    },
    player2: {
      position: { x: 150, y: 80 },
      velocity: { x: 0, y: 0 },
      direction: null
    }
  };
  let gameInput: GameInput = {
    player1: { direction: null, jumping: false },
    player2: { direction: null, jumping: false }
  }
  let ctx = canvas.getContext('2d') || (function () { throw new Error("Unable to get canvas context"); })();
  function gameLoop(_timestamp: number) {
    requestAnimationFrame(gameLoop);
    handleEvents(gameState, gameInput);
    render(gameState, ctx);
  }
  requestAnimationFrame(gameLoop);
}

startGame();