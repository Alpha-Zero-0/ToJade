const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

// Set the canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to hold each star's properties (including shooting stars)
const stars = Array(300).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1, // Random radius between 1 and 3
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    shape: Math.random() > 0.5 ? 'circle' : 'sparkle', // Randomly choose between 'circle' and 'sparkle'
    twinkleSpeed: Math.random() * 0.5 + 0.5, // Random speed for twinkling effect
    twinkleIntensity: Math.random() * 0.5 + 0.5, // Intensity of twinkling
    isShootingStar: false, // New property to track shooting stars
    shootingSpeedX: 0, // Speed for the shooting star (horizontal)
    shootingSpeedY: 0, // Speed for the shooting star (vertical)
    trail: [], // For the trail of the shooting star
    lifetime: 0 // Lifetime counter for the shooting star
}));

// Function to create shooting stars
function createShootingStar() {
    // Randomly choose to add a shooting star
    const randomChance = Math.random();
    if (randomChance < 0.02) { // 2% chance per frame to create a shooting star
        // Choose a random side to start from (top, bottom, left, or right)
        const startSide = Math.floor(Math.random() * 4);
        let xStart, yStart, angle, speed;

        // Create a new shooting star based on the side chosen
        switch (startSide) {
            case 0: // From the top
                xStart = Math.random() * canvas.width;
                yStart = 0;
                angle = Math.random() * (Math.PI / 3) - Math.PI / 6; // Random angle between -30 to 30 degrees
                break;
            case 1: // From the bottom
                xStart = Math.random() * canvas.width;
                yStart = canvas.height;
                angle = Math.random() * (Math.PI / 3) + Math.PI / 6; // Random angle between 150 to 210 degrees
                break;
            case 2: // From the left
                xStart = 0;
                yStart = Math.random() * canvas.height;
                angle = Math.random() * (Math.PI / 3) + Math.PI / 2; // Random angle between 90 to 150 degrees
                break;
            case 3: // From the right
                xStart = canvas.width;
                yStart = Math.random() * canvas.height;
                angle = Math.random() * (Math.PI / 3) - Math.PI / 2; // Random angle between -90 to -30 degrees
                break;
        }

        // Speed and direction based on angle
        speed = Math.random() * 3 + 3; // Slower shooting stars (speed between 3 and 6 pixels per frame)
        const shootingSpeedX = Math.cos(angle) * speed;
        const shootingSpeedY = Math.sin(angle) * speed;

        // Create a new shooting star with the calculated starting position and speed
        stars.push({
            x: xStart,
            y: yStart,
            radius: Math.random() * 4 + 4, // Bigger radius for shooting stars (between 4 and 8)
            speedX: shootingSpeedX,
            speedY: shootingSpeedY,
            shape: 'circle',
            isShootingStar: true,
            twinkleSpeed: 0, // No twinkle for shooting stars
            twinkleIntensity: 1,
            trail: [], // Start with an empty trail
            lifetime: 0 // Start lifetime counter at 0
        });
    }
}

// Function to draw and animate stars (including shooting stars)
function drawStars() {
    // Clear the canvas for redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through all the stars and draw them
    stars.forEach((star, index) => {
        // Apply twinkling effect based on sine function for smooth fading
        const alpha = (Math.sin(star.twinkleSpeed * Math.PI) + 1) / 2 * star.twinkleIntensity; // Create a smooth fade effect

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; // Natural color: white with twinkling alpha

        // Different shapes for stars
        ctx.beginPath();
        if (star.shape === 'circle') {
            // Draw a simple circular star
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        } else if (star.shape === 'sparkle') {
            // Draw a "sparkle" effect using a small star shape (points)
            ctx.moveTo(star.x, star.y - star.radius);
            for (let i = 0; i < 5; i++) {
                const angle = (i * 144) * Math.PI / 180; // Points spread 144 degrees apart
                const x = star.x + Math.cos(angle) * star.radius;
                const y = star.y + Math.sin(angle) * star.radius;
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();

        // If it's a shooting star, update its position and draw its trail
        if (star.isShootingStar) {
            // Store the current position in the trail (create the trail effect)
            star.trail.push({ x: star.x, y: star.y });

            // Limit trail length to 50 points (for longer, more obvious trails)
            if (star.trail.length > 50) {
                star.trail.shift(); // Remove the oldest trail point
            }

            // Draw the trail (make it a bit thicker and more visible)
            ctx.beginPath();
            ctx.moveTo(star.trail[0].x, star.trail[0].y);
            for (let i = 1; i < star.trail.length; i++) {
                ctx.lineTo(star.trail[i].x, star.trail[i].y);
            }
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // White trail with fading effect
            ctx.lineWidth = 3; // Thicker trail
            ctx.stroke();

            // Update the position of the shooting star (moving towards a random direction)
            star.x += star.speedX;
            star.y += star.speedY;

            // If the shooting star goes off-screen, remove it
            if (star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
                stars.splice(index, 1); // Remove shooting star from array
            }
        } else {
            // Move the other stars across the screen
            star.x += star.speedX;
            star.y += star.speedY;

            // Reset the position if the star goes off screen
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
        }
    });
}

// Animation loop
function animate() {
    createShootingStar(); // Check for new shooting stars
    drawStars();
    requestAnimationFrame(animate); // Loop the animation
}

// Start the animation
animate();

// Resize the canvas when the window size changes
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
