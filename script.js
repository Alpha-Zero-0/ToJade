const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

// Set the canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to hold each star's properties (background stars)
const stars = Array(300).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    twinkleSpeed: Math.random() * 0.5 + 0.5,
    twinkleIntensity: Math.random() * 0.5 + 0.5
}));

// Coordinates for the Scorpio constellation (scaled proportions for the "M" with arrow tail)
const scorpioConstellation = [
    //{x:0.26,y:0.36},
    {x:0.37,y:0.38},
    {x:0.38,y:0.37},
    {x:0.39,y:0.38},
    {x:0.4,y:0.4},
    {x:0.4,y:0.6},
    {x:0.4,y:0.5},
    {x:0.4,y:0.4},
    {x:0.42,y:0.36},
    {x:0.44,y:0.34},
    {x:0.46,y:0.33},
    {x:0.48,y:0.34},
    {x:0.5,y:0.36},
    {x:0.52,y:0.4},
    {x:0.52,y:0.5},
    {x:0.52,y:0.6},
    {x:0.52,y:0.4}, 
    {x:0.54,y:0.36},
    {x:0.56,y:0.34},
    {x:0.58,y:0.33},
    {x:0.6,y:0.34},
    {x:0.62,y:0.36},
    {x:0.64,y:0.4},
    {x:0.64,y:0.5},
    {x:0.64,y:0.6},

    {x:0.65,y:0.62},
    {x:0.66,y:0.63},
    {x:0.67,y:0.62},
    {x:0.68,y:0.6},
    {x:0.67,y:0.59},
    {x:0.695,y:0.57},
    {x:0.69,y:0.61},
    {x:0.68,y:0.6},
];

// Function to draw the Scorpio constellation
function drawScorpio() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    // Draw connecting lines
    ctx.beginPath();
    scorpioConstellation.forEach((point, index) => {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw individual stars
    scorpioConstellation.forEach(point => {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });
}

// Function to draw and animate stars
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background stars
    stars.forEach(star => {
        const alpha = (Math.sin(star.twinkleSpeed * Math.PI) + 1) / 2 * star.twinkleIntensity;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Move the stars
        star.x += star.speedX;
        star.y += star.speedY;

        // Reset position if the star moves off-screen
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
    });

    // Draw the Scorpio constellation on top
    drawScorpio();
}

// Animation loop
function animate() {
    drawStars();
    requestAnimationFrame(animate);
}

// Start the animation
animate();

// Resize the canvas when the window size changes
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
