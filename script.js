let ctx, lastRender, state;

const WIDTH = 600,
  HEIGHT = 400;

const update = (progress) => {
  // Update the state of the world for the elapsed time since last render
};

const draw = () => {
  ctx.fillStyle = "#EEE";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.font = "bold 32px monospace";
  ctx.fillStyle = "red";
  ctx.fillText(JSON.stringify([...state.pressedKeys]), 16, 48);
};

const loop = (timestamp) => {
  const progress = timestamp - lastRender;

  update(progress);
  draw();

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
};

// Event handlers

const keydown = ({ key }) => {
  state.pressedKeys.add(key);
};

const keyup = ({ key }) => {
  state.pressedKeys.delete(key);
};

const onLoad = async () => {
  ctx = document.querySelector("#game").getContext("2d");
  lastRender = 0;
  state = {
    pressedKeys: new Set(),
    objects: [],
  };

  ctx.canvas.width = WIDTH;
  ctx.canvas.height = HEIGHT;

  // Start loop
  window.requestAnimationFrame(loop);
};

document.addEventListener("DOMContentLoaded", onLoad);
window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);
