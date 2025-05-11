
    
    const canvas = document.getElementById("designCanvas");
    const ctx = canvas.getContext("2d");

    const MM_TO_PX = 3.78;

    let shapeType = "rectangle";
    let shapeWidthMM = 100;
    let shapeHeightMM = 100;

    let shapeBounds = { x: 50, y: 50, width: 0, height: 0 }; // to clip folds

    document.getElementById("shapeSelect").addEventListener("change", e => {
      shapeType = e.target.value;
    });

    document.getElementById("drawBtn").addEventListener("click", () => {
      shapeWidthMM = parseFloat(document.getElementById("width").value) || 100;
      shapeHeightMM = parseFloat(document.getElementById("height").value) || 100;
      drawShape();
      update3DPreview();    // New: show 3D version
    });

    document.getElementById("addFold").addEventListener("click", () => {
      const posMM = parseFloat(document.getElementById("foldPos").value);
      const dir = document.getElementById("foldDir").value;
      if (!isNaN(posMM)) {
        foldLines.push({ position: posMM * MM_TO_PX, direction: dir });
        drawShape();
      }
    });

    document.getElementById("clearFolds").addEventListener("click", () => {
      foldLines = [];
      drawShape();
    });

 let foldLines = []; // Store fold lines
let scale = 1;
let offsetX = 0, offsetY = 0; // For positioning and centering the sheet
let scaledWidth = 0, scaledHeight = 0;

// Function to draw the shape and the fold lines
function drawShape() {
  const shape = document.getElementById("shapeSelect").value;
  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);

  if (!width || !height) {
    alert("Please enter width and height.");
    return;
  }

  const canvas = document.getElementById("designCanvas");
  const ctx = canvas.getContext("2d");

  // Clear canvas before drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the container (sheet)
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Calculate center for the shape
const centerX = canvas.width / 2 + panOffsetX;
const centerY = canvas.height / 2 + panOffsetY;


  // Draw the selected shape inside the container
  ctx.fillStyle = "#aedfff";
  ctx.strokeStyle = "#007acc";

  if (shape === "rectangle") {
    ctx.beginPath();
    ctx.rect(centerX - width / 2, centerY - height / 2, width, height);
    ctx.fill();
    ctx.stroke();
  } else if (shape === "circle") {
    const radius = Math.min(width, height) / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  } else if (shape === "pentagon") {
    const radius = Math.min(width, height) / 2;
    const sides = 5;
    const angle = (2 * Math.PI) / sides;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const x = centerX + radius * Math.cos(i * angle - Math.PI / 2);
      const y = centerY + radius * Math.sin(i * angle - Math.PI / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Draw fold lines
ctx.strokeStyle = 'red';
ctx.lineWidth = 1;
ctx.setLineDash([5, 5]); // Dash pattern: 5px dash, 5px gap

foldLines.forEach(fold => {
  ctx.beginPath();
  if (fold.dir === 'vertical') {
    const x = centerX - width / 2 + fold.pos * scale;
    if (x >= centerX - width / 2 && x <= centerX + width / 2) {
      ctx.moveTo(x, centerY - height / 2);
      ctx.lineTo(x, centerY + height / 2);
    }
  } else {
    const y = centerY - height / 2 + fold.pos * scale;
    if (y >= centerY - height / 2 && y <= centerY + height / 2) {
      ctx.moveTo(centerX - width / 2, y);
      ctx.lineTo(centerX + width / 2, y);
    }
  }
  ctx.stroke();
});

ctx.setLineDash([]); // Reset to solid lines after drawing


// Adding fold lines
document.getElementById('addFold').addEventListener('click', () => {
  const pos = parseFloat(document.getElementById('foldPos').value);
  const dir = document.getElementById('foldDir').value;

  if (isNaN(pos) || pos < 0) {
    alert("Enter a valid fold position.");
    return;
  }

  foldLines.push({ pos, dir });
  drawShape();
});

// Clear fold lines
document.getElementById('clearFolds').addEventListener('click', () => {
  foldLines = [];
  drawShape();
});
}
function downloadPNG() {
  const canvas = document.getElementById('designCanvas');
  if (!canvas) return alert("Canvas not found!");

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'design.png';
  link.click();
}



function downloadSVG() {
  const canvas = document.getElementById('designCanvas');
  const ctx = canvas.getContext('2d');

  // Get width and height from canvas
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const shapeWidth = parseInt(document.getElementById("width").value);
  const shapeHeight = parseInt(document.getElementById("height").value);

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Create SVG content for the shape (rectangle example)
  let shapeSvg = '';
  const shapeType = document.getElementById("shapeSelect").value;

  if (shapeType === "rectangle") {
    shapeSvg = `<rect x="${-shapeWidth / 2}" y="${-shapeHeight / 2}" width="${shapeWidth}" height="${shapeHeight}" fill="#aedfff" stroke="#007acc" stroke-width="2" />`;
  } else if (shapeType === "circle") {
    const radius = Math.min(shapeWidth, shapeHeight) / 2;
    shapeSvg = `<circle cx="0" cy="0" r="${radius}" fill="#aedfff" stroke="#007acc" stroke-width="2" />`;
  } else if (shapeType === "pentagon") {
    const radius = Math.min(shapeWidth, shapeHeight) / 2;
    const sides = 5;
    const angle = (2 * Math.PI) / sides;
    let points = '';
    for (let i = 0; i < sides; i++) {
      const x = radius * Math.cos(i * angle - Math.PI / 2);
      const y = radius * Math.sin(i * angle - Math.PI / 2);
      points += `${x},${y} `;
    }
    shapeSvg = `<polygon points="${points}" fill="#aedfff" stroke="#007acc" stroke-width="2" />`;
  }

  // Create fold lines
  let foldsSvg = '';
  ctx.setLineDash([5, 5]); // Dotted lines

  foldLines.forEach(fold => {
    if (fold.dir === "vertical") {
      const x = (fold.pos - shapeWidth / 2);  // Fold position relative to shape origin
      foldsSvg += `<line x1="${x}" y1="${-shapeHeight / 2}" x2="${x}" y2="${shapeHeight / 2}" stroke="red" stroke-width="1" stroke-dasharray="5,5" />`;
    } 
  
  });

  // Combine all SVG content
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}">
      <rect width="${canvasWidth}" height="${canvasHeight}" fill="#f0f0f0" />
      <g transform="translate(${centerX}, ${centerY})">
        ${shapeSvg}
        ${foldsSvg}
      </g>
    </svg>
  `;

  // Create a Blob and download the SVG file
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const link = document.createElement('a');
  link.download = 'design.svg';
  link.href = URL.createObjectURL(blob);
  link.click();
}

// Function to save the design to localStorage
function saveDesignToLocalStorage() {
  const canvas = document.getElementById('designCanvas');
  const ctx = canvas.getContext('2d');

  // Get the SVG content as a string (similar to the previous download function)
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const shapeWidth = parseInt(document.getElementById("width").value);
  const shapeHeight = parseInt(document.getElementById("height").value);

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  let shapeSvg = '';
  const shapeType = document.getElementById("shapeSelect").value;

  if (shapeType === "rectangle") {
    shapeSvg = `<rect x="${-shapeWidth / 2}" y="${-shapeHeight / 2}" width="${shapeWidth}" height="${shapeHeight}" fill="#aedfff" stroke="#007acc" stroke-width="2" />`;
  } else if (shapeType === "circle") {
    const radius = Math.min(shapeWidth, shapeHeight) / 2;
    shapeSvg = `<circle cx="0" cy="0" r="${radius}" fill="#aedfff" stroke="#007acc" stroke-width="2" />`;
  } else if (shapeType === "pentagon") {
    const radius = Math.min(shapeWidth, shapeHeight) / 2;
    const sides = 5;
    const angle = (2 * Math.PI) / sides;
    let points = '';
    for (let i = 0; i < sides; i++) {
      const x = radius * Math.cos(i * angle - Math.PI / 2);
      const y = radius * Math.sin(i * angle - Math.PI / 2);
      points += `${x},${y} `;
    }
    shapeSvg = `<polygon points="${points}" fill="#aedfff" stroke="#007acc" stroke-width="2" />`;
  }

  let foldsSvg = '';
  ctx.setLineDash([5, 5]);

  foldLines.forEach(fold => {
    if (fold.dir === "vertical") {
      const x = (fold.pos - shapeWidth / 2);
      foldsSvg += `<line x1="${x}" y1="${-shapeHeight / 2}" x2="${x}" y2="${shapeHeight / 2}" stroke="red" stroke-width="1" stroke-dasharray="5,5" />`;
    } else {
      const y = (fold.pos - shapeHeight / 2);
      foldsSvg += `<line x1="${-shapeWidth / 2}" y1="${y}" x2="${shapeWidth / 2}" y2="${y}" stroke="red" stroke-width="1" stroke-dasharray="5,5" />`;
    }
  });

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}">
      <rect width="${canvasWidth}" height="${canvasHeight}" fill="#f0f0f0" />
      <g transform="translate(${centerX}, ${centerY})">
        ${shapeSvg}
        ${foldsSvg}
      </g>
    </svg>
  `;

  // Save to localStorage
  localStorage.setItem('design', svgContent);
  alert("Design saved to local storage!");
}


// Function to load the design from localStorage
function loadDesignFromLocalStorage() {
  // Retrieve the SVG content from localStorage
  const savedDesign = localStorage.getItem('design');

  if (savedDesign) {
    const canvas = document.getElementById('designCanvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas before rendering the loaded design
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Parse the SVG content and render it (simple method, you can embed it as a data URL)
    const img = new Image();
    const svgBlob = new Blob([savedDesign], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;

    img.onload = function () {
      ctx.drawImage(img, 0, 0);  // Draw the loaded SVG image onto the canvas
    };
  } else {
    alert("No design found in local storage.");
  }
}

let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = 30;
let rotationY = 45;

function update3DPreview() {
  const shapeType = document.getElementById("shapeSelect").value;
  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);
  const container = document.getElementById("shape3d");
  container.innerHTML = "";
  container.style.animation = "rotate3d 60s linear infinite";

  // Normalize size using scale (max size ~100px visually)
  const maxPreviewSize = 100;
  const scaleX = maxPreviewSize / width;
  const scaleY = maxPreviewSize / height;
  const scale = Math.min(scaleX, scaleY, 1); // avoid enlarging small shapes

  let shape;
  if (shapeType === "rectangle") {
    shape = document.createElement("div");
    shape.style.width = `${width}px`;
    shape.style.height = `${height}px`;
    shape.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
    shape.style.border = "1px solid #007acc";
  } else if (shapeType === "circle") {
    shape = document.createElement("div");
    shape.style.width = `${width}px`;
    shape.style.height = `${width}px`;
    shape.style.borderRadius = "50%";
    shape.style.background = "radial-gradient(circle, #4facfe, #00f2fe)";
  } else if (shapeType === "pentagon") {
    shape = document.createElement("div");
    shape.style.width = `${width}px`;
    shape.style.height = `${width}px`;
    shape.style.background = "#00f2fe";
    shape.style.clipPath = "polygon(50% 0%, 95% 35%, 77% 90%, 23% 90%, 5% 35%)";
  }

  shape.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
  shape.style.transform = `scale(${scale})`; // 👈 Apply scale transform
  shape.style.transformOrigin = "center center";

  container.appendChild(shape);
}


// 🖱️ Mouse movement rotation
const container = document.getElementById("preview3d-container");
const shape3d = document.getElementById("shape3d");

container.addEventListener("mousedown", (e) => {
  isDragging = true;
  previousX = e.clientX;
  previousY = e.clientY;
  shape3d.style.animation = "none"; // Pause auto-rotation while dragging
  container.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  shape3d.style.animation = "rotate3d 10s linear infinite"; // Resume
  container.style.cursor = "grab";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - previousX;
  const deltaY = e.clientY - previousY;
  previousX = e.clientX;
  previousY = e.clientY;

  rotationY += deltaX * 0.5;
  rotationX -= deltaY * 0.5;

  shape3d.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
});


let dragStartX = 0;
let dragStartY = 0;
let panOffsetX = 0;
let panOffsetY = 0;

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStartX = e.offsetX - panOffsetX;
  dragStartY = e.offsetY - panOffsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    panOffsetX = e.offsetX - dragStartX;
    panOffsetY = e.offsetY - dragStartY;
    drawShape(); // redraw shape with new pan offset
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

let isDraggingFold = false;
let draggingIndex = null;

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  foldLines.forEach((fold, index) => {
    let hit = false;
    if (fold.direction === "vertical") {
      const x = centerX - width / 2 + fold.position;
      if (Math.abs(mouseX - x) < 5 && mouseY >= centerY - height / 2 && mouseY <= centerY + height / 2) {
        hit = true;
      }
    } else if (fold.direction === "horizontal") {
      const y = centerY - height / 2 + fold.position;
      if (Math.abs(mouseY - y) < 5 && mouseX >= centerX - width / 2 && mouseX <= centerX + width / 2) {
        hit = true;
      }
    }

    if (hit) {
      isDraggingFold = true;
      draggingIndex = index;
    }
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDraggingFold) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const fold = foldLines[draggingIndex];
  if (fold.direction === "vertical") {
    const x = mouseX - (centerX - width / 2);
    fold.position = Math.max(0, Math.min(x, width));
  } else if (fold.direction === "horizontal") {
    const y = mouseY - (centerY - height / 2);
    fold.position = Math.max(0, Math.min(y, height));
  }

  drawShape();
});

canvas.addEventListener("mouseup", () => {
  isDraggingFold = false;
  draggingIndex = null;
});

