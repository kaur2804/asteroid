   const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Player {
      constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
      }

      draw() {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);

        // red dot center
        c.beginPath();
        c.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        c.fillStyle = 'red';
        c.fill();
        c.closePath();

        // triangle ship
        c.beginPath();
        c.moveTo(this.position.x + 30, this.position.y);
        c.lineTo(this.position.x - 10, this.position.y - 10);
        c.lineTo(this.position.x - 10, this.position.y + 10);
        c.closePath();
        c.strokeStyle = 'white';
        c.stroke();

        c.restore();
      }

      update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      }
    }

    const player = new Player({
      position: { x: canvas.width / 2, y: canvas.height / 2 },
      velocity: { x: 0, y: 0 }
    });

    function animate() {
      requestAnimationFrame(animate);
      c.fillStyle = 'black';
      c.fillRect(0, 0, canvas.width, canvas.height);

      player.update();
    }

    animate();
