  const canvas= document.querySelector('canvas');
  const c = canvas.getContext('2d');

  // Load sounds
  const shootSound = new Audio('./sounds/hit.mp3');
  
//   const explosionSound = new Audio('path/to/explosion-sound.mp3');
//   const gameOverSound = new Audio('path/to/game-over-sound.mp3');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  c.fillStyle= 'black'; // change color of shape

  // creating a rectangle 
   //        (x,y,width,heigth)
  c.fillRect(0,0,canvas.width,canvas.height);

  class Player{
    constructor({position, velocity, rotation}){

        this.position = position; // x,y
        this.velocity = velocity;
        this.rotation = 0;
         
    }
   // draw a player
    draw(){

        c.save(); 
        c.translate(this.position.x,this.position.y)
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y,5,0,Math.PI*2, false);
        c.fillStyle='red';
        c.fill();
        c.closePath()
       /*  c.fillStyle='red';
        c.fillRect(this.p osition.x,this.position.y ,100,100);*/
        // as we want to create a triangle so we have to create lines
        c.beginPath();

        // where in the coorinate we should begin to draw our triangle
        c.moveTo(this.position.x +30 , this.position.y) ;
        c.lineTo(this.position.x -10 , this.position.y -10); // from where we want to start drwimg line
         c.lineTo(this.position.x -10 , this.position.y + 10);
        c.closePath();

        c.strokeStyle='white';
        c.stroke();
        c.restore();

    }
    update(){
        if (this.position.x > canvas.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = canvas.width;
        }
        if (this.position.y > canvas.height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = canvas.height;
        }
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y +=this.velocity.y
    }

    getVertices(){
        const cos = Math.cos(this.rotation)
        const sin = Math.sin(this.rotation)

        return [
            {
                x: this.position.x + cos * 30 - sin * 0 ,
                y: this.position.y + sin * 30 + cos * 0,
            },
            {
                x: this.position.x + cos * -10 - sin * 10 ,
                y: this.position.y + sin * -10 + cos * 10,
            },
            {
                x: this.position.x + cos * -10 - sin * -10 ,
                y: this.position.y + sin * -10 + cos * -10,
            }
        ]
    }
  }

  class Projectile{
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }

    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI *2, false)
        c.closePath()
        c.fillStyle='white'
        c.fill()
    }



    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
  }

  const player = new Player({
    position:{x:canvas.width/2, y:canvas.height / 2},
    velocity:{x:0,y:0}
});
   
class Asteriods{
    constructor({position, velocity,radius}){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }

    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI *2, false)
        c.closePath()
        c.strokeStyle='white'
        c.stroke()
    }

    

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
  }

   
 
 
   const keys ={
    >:{
        pressed:false
    },
    <:{
        pressed:false
    },
    ^:{
        pressed:false
    }
   }

   const SPEED= 3;
   const ROTATIONL_SPEED = 0.05;
    const FRICTION = 0.97;
    const PROJECTILE_SPEED = 3;

    const projectiles = []
    const asteriods=[]

    const intervalId = window.setInterval(() => {
        const index = Math.floor(Math.random() * 4) 

        let x,y;
        let vx,vy;
        let radius = 50 * Math.random() + 10;

        switch(index){
            
            case 0: // left side of the screen
                x = 0 -  radius
                y = Math.random() * canvas.height
                vx=1,
                vy=0
                break
                case 1:// bottom of the screen
                x = Math.random() * canvas.width
                y = canvas.height + radius
                vx=0,
                vy=-1
                break
                case 2: // right side of the screen
                x = canvas.width+ radius
                y = Math.random() * canvas.height
                vx=-1,
                vy=0
                break
                case 3: // top side of the screen
                x = Math.random() * canvas.width
                y = 0- radius
                vx=0,
                vy=1
                break

        }
        asteriods.push(new Asteriods({
            position:{
            x:x,
            y:y,
            },
            velocity:{
                x:vx,
                y:vy
            },
            radius

        }))
    }, 3000)

    function circleCollision(circle1, circle2){
        const xDifference = circle2.position.x - circle1.position.x
        const yDifference =  circle2.position.y - circle1.position.y
        const distance = Math.sqrt(xDifference * xDifference + yDifference* yDifference)
            if(distance <= circle1.radius + circle2.radius){
                return true;
            }
            return false
       
    }

    function circleTriangleCollision(circle, triangle) {
        // Check if the circle is colliding with any of the triangle's edges
        for (let i = 0; i < 3; i++) {
            let start = triangle[i];
            let end = triangle[(i + 1) % 3];
            let dx = end.x - start.x;
            let dy = end.y - start.y;
            let length = Math.sqrt(dx * dx + dy * dy);
            let dot = ((circle.position.x - start.x) * dx + (circle.position.y - start.y) * dy) / Math.pow(length, 2);
            let closestX = start.x + dot * dx;
            let closestY = start.y + dot * dy;
            
            if (!isPointOnLineSegment(closestX, closestY, start, end)) {
                closestX = closestX < start.x ? start.x : end.x;
                closestY = closestY < start.y ? start.y : end.y;
            }
            
            dx = closestX - circle.position.x;
            dy = closestY - circle.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= circle.radius) {
                return true;
            }
        }
        return false;
    }
    
    function isPointOnLineSegment(x, y, start, end) {
        // Check if the point (x, y) is on the line segment from start to end
        return (x >= Math.min(start.x, end.x) && x <= Math.max(start.x, end.x) &&
                y >= Math.min(start.y, end.y) && y <= Math.max(start.y, end.y));
    }
    

   function animate(){
    const animateId = window.requestAnimationFrame(animate)
    c.fillStyle= 'black'; // change color of shape 
   //        (x,y,width,heigth)
  c.fillRect(0,0,canvas.width,canvas.height);
    player.update();

    for(let i = projectiles.length -1; i>=0; i--){
        const projectile = projectiles[i]
        projectile.update()

        // garbage collection for projectiles
        if(projectile.position.x + projectile.radius < 0 ||
            projectile.position.x - projectile.radius > canvas.width || 
            projectile.position.y - projectile.radius >canvas.height ||
            projectile.position.y + projectile.radius < 0
        ){
            projectiles.splice(i, 1);
        }
    }
    
  // asteriods management
    for(let i = asteriods.length -1; i>=0; i--){
        const asteriod  = asteriods[i]
        asteriod.update()

        if(circleTriangleCollision(asteriod,player.getVertices())){
            shootSound.play()
        
                console.log('GAME OVER');
                // Display GAME OVER message
                c.fillStyle = 'black';
                //c.fillRect(0, 0, canvas.width, canvas.height);
                c.font = '50px Arial';
                c.fillStyle = 'white';
                c.textAlign = 'center';
                c.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
                window.cancelAnimationFrame(animateId);
                clearInterval(intervalId);
             
        }
        

        if(
           asteriod.position.x +asteriod.radius < 0 ||
           asteriod.position.x -asteriod.radius > canvas.width || 
           asteriod.position.y -asteriod.radius >canvas.height ||
           asteriod.position.y +asteriod.radius < 0
        ){
          asteriods.splice(i, 1);
        }

        for(let j = projectiles.length -1; j>=0; j--){
            const projectile = projectiles[j]
            if( circleCollision(asteriod, projectile)){
                
                asteriods.splice(i, 1);
                projectiles.splice(j, 1);
                break;
            }
        }

    }

    if(keys.>.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED
        player.velocity.y = Math.sin(player.rotation) * SPEED
    }
    else if(!keys.>.pressed){
        player.velocity.x *= FRICTION
        player.velocity.y *= FRICTION
    }
    if(keys.^.pressed) player.rotation +=ROTATIONL_SPEED
    else if(keys.<.pressed) player.rotation -=ROTATIONL_SPEED
   
   
   }

   animate();
   
   window.addEventListener('keydown',(event) =>{
    switch(event.code){
        case 'KeyA':
             
            keys.>.pressed=true;
        break;

        case 'KeyA':
             
            keys.<.pressed=true;
        break;
        case 'KeyD':
             
            keys.^.pressed=true;
        break;
        case 'Space':
             
            projectiles.push(
                new Projectile({
                position:{
                    x: player.position.x + Math.cos(player.rotation) * 30,
                    y:player.position.y + Math.sin(player.rotation) * 30,
                },
                velocity:{
                    x:Math.cos(player.rotation) * PROJECTILE_SPEED,
                    y:Math.sin(player.rotation)*PROJECTILE_SPEED,
                },
            })
        )
        break
    }
   
   })

   window.addEventListener('keyup',(event) =>{
    switch(event.code){
        case 'KeyW':
             
            keys.>.pressed=false;
        break;

        case 'KeyA':
             
            keys.<.pressed=false;
        break;
        case 'KeyD':
             
            keys.^.pressed=false;
        break;
    }
   
   });
   



