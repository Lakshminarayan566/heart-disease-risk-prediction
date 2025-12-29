// Particle animation for heart health app
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    const container = document.querySelector('.floating-shapes');
    
    if (!container) return;
    
    canvas.id = 'particle-canvas';
    canvas.classList.add('particle-canvas');
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = this.getRandomColor();
        this.opacity = Math.random() * 0.5 + 0.1;
        this.growing = Math.random() > 0.5;
      }
      
      getRandomColor() {
        const colors = [
          'rgba(255, 8, 68, alpha)',    // red
          'rgba(255, 177, 153, alpha)', // salmon
          'rgba(79, 172, 254, alpha)',  // blue
          'rgba(0, 242, 254, alpha)',   // cyan
          'rgba(67, 233, 123, alpha)'   // green
        ];
        
        return colors[Math.floor(Math.random() * colors.length)].replace('alpha', this.opacity);
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Size oscillation
        if (this.growing) {
          this.size += 0.03;
          if (this.size > 6) this.growing = false;
        } else {
          this.size -= 0.03;
          if (this.size < 1) this.growing = true;
        }
        
        // Check if off screen
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }
    
    // Create particles
    const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive count
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections between nearby particles
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
  });