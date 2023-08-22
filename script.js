let gameInstance;

const defaultGameConfig = {
  objects: [],
  initialState: {},
};

class Game {
  /** @type {CanvasRenderingContext2D} */
  #ctx;
  /** @type {number} */
  #lastRender;
  /** @type {object[]} */
  #objects;
  /** @type {object} */
  #state;
  /** @type {Set<string>} */
  #pressedKeys;

  constructor(ctx, config) {
    const cfg = {
      ...structuredClone(defaultGameConfig),
      ...structuredClone(config),
    };
    this.#ctx = ctx;
    this.#lastRender = 0;
    this.#pressedKeys = new Set();

    // Apply config
    this.#objects = cfg.objects;
    this.#state = cfg.initialState;

    // Add listeners
    this.#addEventListeners();
  }

  /**
   * @param {number} progress
   */
  update(progress) {
    throw new Error(
      "ImplementationError: Game::update(progress) is unimplemeted"
    );
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    throw new Error("ImplementationError: Game::render(ctx) is unimplemeted");
  }

  start() {
    // Start loop
    window.requestAnimationFrame(this.#loop.bind(this));
  }

  #loop(timestamp) {
    this.update(timestamp - this.#lastRender);
    this.render(this.#ctx);
    this.#lastRender = timestamp;
    window.requestAnimationFrame(this.#loop.bind(this));
  }

  #addEventListeners() {
    console.log("Adding listeners...");
    window.addEventListener("keydown", this.#keydown.bind(this), false);
    window.addEventListener("keyup", this.#keyup.bind(this), false);
  }

  /**
   * @param {KeyboardEvent} event
   */
  #keydown(event) {
    event.preventDefault();
    this.pressedKeys.add(event.key);
  }

  /**
   * @param {KeyboardEvent} event
   */
  #keyup(event) {
    event.preventDefault();
    this.pressedKeys.delete(event.key);
  }

  get pressedKeys() {
    return this.#pressedKeys;
  }

  get objects() {
    return this.#objects;
  }

  addObject(obj) {
    if (obj) {
      this.#objects.push(obj);
    }
  }

  removeObject(uuid) {
    const index = this.#objects.findIndex((obj) => obj.uuid === uuid);
    return index !== -1 ? this.#objects.splice(index, 1) : null;
  }

  get state() {
    return this.#state;
  }

  applyState(state) {
    this.#state = { ...structuredClone(this.#state), ...state };
  }
}

class Vector3D {
  /** @type {number} */
  x;
  /** @type {number} */
  y;
  /** @type {number} */
  z;
  constructor(x, y, z) {
    if (typeof x === "object") {
      this.x = x.x ?? 0;
      this.y = x.y ?? 0;
      this.z = x.z ?? 0;
    } else {
      this.x = x ?? 0;
      this.y = y ?? 0;
      this.z = z ?? 0;
    }
  }
  static div() {}
}
class GameObject {
  /** @type {string} */
  #uuid;
  /** @type {Vector3D} */
  position;
  /**
   * @param {Vector3D} initialPosition
   */
  constructor(initialPosition) {
    this.#uuid = self.crypto.randomUUID();
    this.position = initialPosition ?? new Vector3D();
  }

  /**
   * @param {number} progress
   */
  update(progress) {
    throw new Error(
      "ImplementationError: GameObject::update(progress) is unimplemeted"
    );
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    throw new Error(
      "ImplementationError: GameObject::render(ctx) is unimplemeted"
    );
  }
}

class Snake extends GameObject {
  /** @type {number} */
  #width;
  /**
   *
   * @param {Vector3D} initialPosition
   * @param {number} width
   */
  constructor(initialPosition, width) {
    super(initialPosition);
    this.#width = width;
  }

  /**
   * @param {number} progress
   */
  update(progress) {}

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    const radius = Math.max(1, Math.floor(this.#width / 2));

    ctx.save();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
}

class SnakeGame extends Game {
  constructor(ctx, config) {
    super(ctx, config);

    const x = ctx.canvas.width / 2;
    const y = ctx.canvas.height / 2;

    this.addObject(new Snake(new Vector3D(x, y), 10));
  }

  /**
   * @override
   */
  update(progress) {
    for (let obj of this.objects) {
      obj.update(progress);
    }
  }

  /**
   * @override
   */
  render(ctx) {
    ctx.fillStyle = "#EEE";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let obj of this.objects) {
      obj.render(ctx);
    }

    ctx.font = "bold 16px monospace";
    ctx.fillStyle = "red";
    ctx.fillText(JSON.stringify([...this.pressedKeys]), 16, 32);
  }
}

const WIDTH = 600,
  HEIGHT = 400;

const onLoad = async () => {
  const ctx = document.querySelector("#game").getContext("2d");

  ctx.canvas.width = WIDTH;
  ctx.canvas.height = HEIGHT;

  gameInstance = new SnakeGame(ctx, {});

  gameInstance.start();
};

document.addEventListener("DOMContentLoaded", onLoad);
