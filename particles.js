// ===================================
// PARTICLES - Hearts Animation
// ===================================

class HeartsAnimation {
    constructor() {
        this.canvas = document.getElementById('hearts-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.hearts = [];
        this.maxHearts = 30;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < this.maxHearts; i++) {
            this.hearts.push(this.createHeart());
        }
    }

    createHeart() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 20 + 10,
            speedX: (Math.random() - 0.5) * 2,
            speedY: Math.random() * -2 - 1,
            opacity: Math.random() * 0.5 + 0.3,
            rotation: Math.random() * 360
        };
    }

    drawHeart(heart) {
        this.ctx.save();
        this.ctx.translate(heart.x, heart.y);
        this.ctx.rotate(heart.rotation * Math.PI / 180);
        this.ctx.globalAlpha = heart.opacity;

        // Gradient
        const gradient = this.ctx.createLinearGradient(-heart.size / 2, -heart.size / 2, heart.size / 2, heart.size / 2);
        gradient.addColorStop(0, '#FF1744');
        gradient.addColorStop(0.5, '#F50057');
        gradient.addColorStop(1, '#FF4081');

        this.ctx.fillStyle = gradient;
        this.ctx.font = `${heart.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('❤️', 0, 0);

        this.ctx.restore();
    }

    update(heart) {
        heart.x += heart.speedX;
        heart.y += heart.speedY;
        heart.rotation += 1;

        // Reset if out of bounds
        if (heart.y < -50) {
            heart.y = this.canvas.height + 50;
            heart.x = Math.random() * this.canvas.width;
        }
        if (heart.x < -50 || heart.x > this.canvas.width + 50) {
            heart.x = Math.random() * this.canvas.width;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.hearts.forEach(heart => {
            this.update(heart);
            this.drawHeart(heart);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on home page
if (document.getElementById('hearts-canvas')) {
    new HeartsAnimation();
}
