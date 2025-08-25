 const canvas= document.querySelector('canvas');
const c = canvas.getContext('2d');

// canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// constants
const SPEED= 3;
const ROTATION_SPEED = 0.05;
const FRICTION = 0.97;
const PROJECTILE_SPEED = 3;

// key state
const keys = {
  f: { pressed: false },
  l: { pressed: false },
  r: { pressed: false }
};

// classes
class Player {
  constructor({position, velocity}) {
    this.position = position;
    this.velocity = velocity;
    this.rotation = 0;
  }
  draw() {
    c.save();
    c.translate(this.position.x,this.position.y)
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y)
    // red dot
    c.beginPath();
    c.arc(this.position.x, this.position.y,5,0,Math.PI*2, false);
    c.fillStyle='red';
    c.fill();
    // ship triangle
    c.beginPath();
    c.moveTo(this.position.x +30 , this.position.y);
    c.lineTo(this.position.x -10 , this.position.y -10);
    c.lineTo(this.position.x -10 , this.position.y +10);
    c.closePath();
    c.strokeStyle='white';
    c.stroke();
    c.restore();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Projectile {
  constructor({position, velocity}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5;
  }
  draw(){
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI *2, false)
    c.fillStyle='white';
    c.fill();
  }
  update(){
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// objects
const player = new Player({
  position:{x:canvas.width/2, y:canvas.height/2},
  velocity:{x:0,y:0}
});
const projectiles = [];

// game loop
function animate(){
  requestAnimationFrame(animate);
  c.fillStyle= 'black';
  c.fillRect(0,0,canvas.width,canvas.height);

  player.update();

  // apply controls
  if(keys.forward.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED;
    player.velocity.y = Math.sin(player.rotation) * SPEED;
  } else {
    player.velocity.x *= FRICTION;
    player.velocity.y *= FRICTION;
  }
  if(keys.right.pressed) player.rotation += ROTATION_SPEED;
  if(keys.left.pressed) player.rotation -= ROTATION_SPEED;

  // projectiles
  projectiles.forEach((p) => p.update());
}
animate();

// controls
window.addEventListener('keydown',(event) =>{
  switch(event.code){
    case 'KeyW':
      keys.f.pressed=true;
      break;
    case 'KeyA':
      keys.l.pressed=true;
      break;
    case 'KeyD':
      keys.r.pressed=true;
      break;
    case 'Space':
      projectiles.push(
        new Projectile({
          position:{
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity:{
            x: Math.cos(player.rotation) * PROJECTILE_SPEED,
            y: Math.sin(player.rotation) * PROJECTILE_SPEED,
          },
        })
      );
      break;
  }
});

window.addEventListener('keyup',(event) =>{
  switch(event.code){
    case 'KeyW':
      keys.f.pressed=false;
      break;
    case 'KeyA':
      keys.l.pressed=false;
      break;
    case 'KeyD':
      keys.r.pressed=false;
      break;
  }
});

