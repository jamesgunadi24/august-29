// ... inside initScratchOff() ...

let scratchedPixels = 0;
const totalPixels = canvas.width * canvas.height;

const scratch = (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = (touch.clientX - rect.left);
    const y = (touch.clientY - rect.top);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2); // Slightly larger brush for iPhone
    ctx.fill();

    // Check progress every 20th stroke to save performance
    scratchedPixels++;
    if (scratchedPixels % 20 === 0) {
        checkProgress();
    }
};

const checkProgress = () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearCount = 0;
    // Loop through alpha channel
    for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) clearCount++;
    }

    const percentage = (clearCount / (imageData.data.length / 4)) * 100;

    if (percentage > 50) {
        // Fade the canvas out entirely once she's done enough
        canvas.style.transition = "opacity 1s ease";
        canvas.style.opacity = "0";
        setTimeout(() => canvas.remove(), 1000);
    }
};