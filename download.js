const finalCanvas = document.getElementById("finalCanvas");
const ctx = finalCanvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const colorButtons = document.querySelectorAll(".color-btn");

let selectedFrameColor = "img/nude.png"; // Default frame

let capturedPhotos = JSON.parse(sessionStorage.getItem("capturedPhotos")) || [];

if (capturedPhotos.length === 0) {
    console.error("No photos found in sessionStorage.");
}

// Canvas dimensions
const canvasWidth = 240;
const imageHeight = 160;
const spacing = 10;
const framePadding = 10;
const logoSpace = 100;

finalCanvas.width = canvasWidth;
finalCanvas.height = framePadding + (imageHeight + spacing) * capturedPhotos.length + logoSpace;

// Function to draw the collage
function drawCollage() {
    const background = new Image();
    background.src = selectedFrameColor;

    background.onload = () => {
        ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(background, 0, 0, finalCanvas.width, finalCanvas.height);

        let loadedImages = 0;

        capturedPhotos.forEach((photo, index) => {
            const img = new Image();
            img.src = photo;

            img.onload = () => {
                const x = framePadding;
                const y = framePadding + index * (imageHeight + spacing);
                ctx.drawImage(img, x, y, canvasWidth - 2 * framePadding, imageHeight);
                
                loadedImages++;
                if (loadedImages === capturedPhotos.length) {
                    // All images are loaded, draw the logo
                    drawLogo();
                }
            };

            img.onerror = () => console.error(`Failed to load image ${index + 1}`);
        });
    };

    background.onerror = () => console.error("Failed to load background image.");
}

// Function to draw the logo
function drawLogo() {
    const logo = new Image();
    logo.src = "img/logo.png";

    logo.onload = () => {
        const logoWidth = 80;
        const logoHeight = 20;
        const logoX = (canvasWidth - logoWidth) / 2;
        const logoY = finalCanvas.height - logoSpace + 35;
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

        // Enable the download button once everything is drawn
    
    };

    logo.onerror = () => console.error("Failed to load logo image.");
}

// Change frame color and redraw instantly
colorButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        selectedFrameColor = event.target.getAttribute("data-color");
        drawCollage();
    });
});

// Disable download button until everything is loaded

// Download the final image
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = finalCanvas.toDataURL("image/png");
    link.download = "photobooth.png";
    link.click();
});

// Initial drawing
drawCollage();
