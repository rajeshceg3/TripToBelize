class Constellation {
    constructor(canvasId, map, locations) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error("Canvas element not found!");
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.canvas.width = this.W;
        this.canvas.height = this.H;
        this.map = map;
        this.locations = locations;
        this.activeLocation = null;
        this.init();
    }

    init() {
        const numStars = this.W * this.H / 10000;
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.W,
                y: Math.random() * this.H,
                radius: Math.random() * 1 + 1,
                vx: Math.random() - 0.5,
                vy: Math.random() - 0.5,
                originalRadius: Math.random() * 1 + 1,
            });
        }
        window.addEventListener('resize', () => this.resize());

        // Performance: Pause when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.paused = true;
            } else {
                this.paused = false;
                this.animate();
            }
        });

        // Accessibility: Check for reduced motion
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotion = mediaQuery.matches;
        mediaQuery.addEventListener('change', () => {
             this.reducedMotion = mediaQuery.matches;
        });
    }

    resize() {
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.canvas.width = this.W;
        this.canvas.height = this.H;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.W, this.H);
        this.ctx.globalCompositeOperation = "lighter";

        for (let i = 0; i < this.stars.length; i++) {
            let s = this.stars[i];
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgba(127, 255, 212, 0.5)";
            this.ctx.fill();
        }

        this.drawConstellation();
    }

    drawConstellation() {
        if (!this.activeLocation || !this.map) return;

        const relatedLocations = this.locations.filter(l =>
            l.type_category === this.activeLocation.type_category && l.name !== this.activeLocation.name
        );

        if (relatedLocations.length === 0) return;

        // Try catch for projection errors if map is not ready
        try {
            const activePoint = this.map.latLngToContainerPoint(this.activeLocation.coords);

            this.ctx.strokeStyle = "rgba(127, 255, 212, 0.3)";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();

            relatedLocations.forEach(loc => {
                const point = this.map.latLngToContainerPoint(loc.coords);
                this.ctx.moveTo(activePoint.x, activePoint.y);
                this.ctx.lineTo(point.x, point.y);
            });

            this.ctx.stroke();
        } catch (e) {
            // Map might be zooming or invalid state, skip frame
        }
    }

    setActiveLocation(location) {
        this.activeLocation = location;
    }

    update() {
        // Skip update if reduced motion is on
        if (this.reducedMotion) return;

        for (let i = 0; i < this.stars.length; i++) {
            let s = this.stars[i];
            s.x += s.vx / 4;
            s.y += s.vy / 4;

            if (s.x < 0 || s.x > this.W) s.vx = -s.vx;
            if (s.y < 0 || s.y > this.H) s.vy = -s.vy;
        }
    }

    animate() {
        if (this.paused) return;

        this.draw();
        this.update();
        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.animate();
    }
}
