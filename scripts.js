// Initialize variables
const container = document.querySelector(".container");
const resetButton = document.querySelector(".reset");
const colorPicker = document.querySelector(".color-picker");
const randomButton = document.querySelector(".random");
const eraserButton = document.querySelector(".eraser");
const slider = document.querySelector(".slider");
const saveButton = document.querySelector(".save");
const indicator = document.querySelector(".indicator");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let color = colorPicker.value;
let useRandomColor = false;
let eraser = false;
let gridSize = slider.value;
let drawing = false;

// Create grid
function createGrid(size) {
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  container.innerHTML = ""; // Clear existing cells

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("mouseover", changeColor);
    container.appendChild(cell);
  }
}

// Clear grid
function clearGrid() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.style.backgroundColor = "white";
  });
}

// Generate random color
function generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
}

// Change cell color on hover
function changeColor(e) {
  if (drawing) {
    if (eraser) {
      e.target.style.backgroundColor = "white";
    } else if (useRandomColor) {
      e.target.style.backgroundColor = generateRandomColor();
    } else {
      e.target.style.backgroundColor = color;
    }
  }
}

// Check if any cell is not empty
function isGridDirty() {
  const cells = document.querySelectorAll(".cell");
  return Array.from(cells).some((cell) => cell.style.backgroundColor !== "");
}

// Update grid size with confirmation if grid is dirty
function changeGridSize() {
  if (isGridDirty()) {
    const confirmation = confirm(
      "Changing the grid size will clear your current drawing. Do you want to proceed?"
    );
    if (!confirmation) {
      slider.value = gridSize; // Reset slider to previous value
      return;
    }
  }
  gridSize = slider.value;
  createGrid(gridSize);
}

// Toggle drawing mode
function toggleDrawingMode() {
  drawing = !drawing;
  indicator.textContent = `Drawing Mode: ${drawing ? "ON" : "OFF"}`;
  indicator.style.color = drawing ? "green" : "red";
}

// Save the drawing as an image
function saveDrawing() {
  const cells = document.querySelectorAll(".cell");
  const cellSize = container.clientWidth / gridSize;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    ctx.fillStyle = cell.style.backgroundColor || "white";
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
  });

  const link = document.createElement("a");
  link.download = "etch-a-sketch.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Event listeners
resetButton.addEventListener("click", clearGrid);
colorPicker.addEventListener("input", () => {
  color = colorPicker.value;
  useRandomColor = false;
  eraser = false;
});
randomButton.addEventListener("click", () => {
  useRandomColor = true;
  eraser = false;
});
eraserButton.addEventListener("click", () => {
  eraser = true;
});
slider.addEventListener("input", changeGridSize);
saveButton.addEventListener("click", saveDrawing);
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // Prevent spacebar from scrolling the page
    toggleDrawingMode();
  }
});

// Initialize grid on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  createGrid(gridSize);
  indicator.textContent = `Drawing Mode: OFF`;
  indicator.style.color = "red";
});
