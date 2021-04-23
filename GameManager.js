var borderWidth = 2;

var windowH = window.innerHeight*0.95;

var xColors = [[255,0,0],[0,0,255],[214, 116, 211]]
var yColors = [[180,0,0],[0,0,180],[171, 92, 168]]
var spriteColors = [[53, 242, 60],[0, 0, 0],[120, 8, 8]]



var windowW = windowH;
var FOVAng = Math.floor(windowW/32);
//1009
//922
console.log(windowW)
console.log(windowH)
// var GameScreenX = 1080;
// var GameScreenY = 640;

var pi;
var DR;

var player;
var enemy;
var locked = false;
var called = false;
var rayAmount = Math.floor(windowH/8);
var canvOb;
var mapX = 20;
var mapY = 20;
var mapS = 64;

var enemy1 = [];

var mouseXMove = 0;
var mouseYMove = 0; 

var zDepthBuffer = [];

//zero represents empty spaces, 1 represeants a square.
var mapLayout = [
    1, 1, 1, 1, 1, 1, 1, 1,1,1,1, 1, 1, 1, 1, 1, 1, 1,1,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 0, 2, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 2 ,2, 0,0,0,0, 0, 3, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 2, 2, 0,0,0,0, 0, 3, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 0, 3, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 2, 0, 0, 0,0,0,0, 0, 3, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 2, 2, 2, 2, 2, 2,2,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 3, 3, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 3, 3, 0, 0, 0, 0, 0,0,1,
    1, 0, 2, 0, 0, 0, 0, 0,3,3,0, 3, 3, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 2 ,2, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 2, 2, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 2, 0, 0, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 1, 1, 1, 1, 1, 1, 1,1,1,1, 1, 1, 1, 1, 1, 1, 1,1,1,
]


function preload()
{
    enemy1[0] = loadImage("./Assets/TestEnemySprite.png")
}

function setup() 
{
    
    pi = PI;
    DR = 0.0174533
    angleMode(RADIANS);
    
    player = new Player(161,300, 2, 1,90*pi/180,pi,0.01)
    enemy = new Enemy(813,615,enemy1,FOVAng ,2,20,1,1,10);
    createCanvas(windowW, windowH,enemy1);
    canvOb = document.getElementById("defaultCanvas0")
    canvOb.addEventListener("mousemove", e =>
    {
        const {
            movementX,
            movementY
        } = e;
        called= true;
        mouseXMove = movementX;
        mouseYMove = movementY;
       ;
    })
}



function draw() 
{
    //collideRectRect(x, y, width, height, x2, y2, width2, height2 )
    clear();
    if(!called)
    {
        mouseXMove = 0;
    }
    called = false;
    
    //player.TwoDRender();
    drawRays3D()
    document.getElementById("state").innerHTML = "Status: InGame (MouseLocked)"
    document.getElementById("coords").innerHTML = `Coords:(${floor(player.x)},${floor(player.y)}) Tile:(${floor(player.x/64)+1},${floor(player.y/64)+1})`
    enemy.Render()
    enemy.Move()
    drawMap2D();
    if(!locked) return;
    
    player.move(mouseXMove);
    
    
   
}

function ToggleLockMouse()
{
    //make a play button that starts everything
    if(!locked)
    {
        document.getElementById("state").innerHTML = "Status: InGame (MouseLocked)"
        requestPointerLock();
        locked = true;
    }
    else 
    {
        document.getElementById("state").innerHTML = "Status: Paused (MouseUnlocked)"
        exitPointerLock()
        locked = false;;
    }
}

function keyPressed()
{
    if(keyCode ==49 )
    {
        ToggleLockMouse()
    }
    if(keyCode == 27)
    {
        document.getElementById("state").innerHTML = "Status: Paused (MouseUnlocked)"
        locked = false;;
    }
}

function getWorldAngle2D(x1,y1,x2,y2)
{
    // let distX = player.x -this.x;
    // let distY = player.y -this.y;

    let distX = x1 - x2;
    let distY = y1 - y2;

    let angRelPlay =  atan2(distX, distY) +pi/2
    if(angRelPlay >= 0)
    {
        angRelPlay = ((3*pi/2 - angRelPlay) + pi/2) * -1;
    }
    
    angRelPlay *= -1;
    return angRelPlay;
}

function drawMap2D()
{
    noStroke()
    let x,y;
    for(y = 0;y<mapY;y++)
    {
        
        for(x = 0; x<mapX; x++)
        {
            if(mapLayout[y*mapX+x] >= 1 )
            {
                fill(color("red"));
                rect(8*x, y*8, 8,8);
            }
            else 
            {
                fill(color("white"));
                rect(8*x, y*8, 8,8);
            }
            
        }
    }
    
    fill(color("black"))
    ellipse(player.x/8,player.y/8,4,4)
    ellipse(enemy.x/8,enemy.y/8,4,4)
    stroke(5)
    //console.log(enemy.dx)
    line(enemy.x/8,enemy.y/8, (enemy.x + enemy.dx*8)/8, (enemy.y + enemy.dy*8)/8);
    
    
}

function ShootRay(x1,y1, angle,rayDist)
{
        var mx,my,mp,dof,rx,ry,xo,yo,distT = 0;
        distY = 1000000;
        distX = 1000000; 
        //vertical line check
        dof = 0;
        let ra = angle;
        let aTan = -1/tan(ra);
        if(ra >pi)//looking down 
        {
            ry = floor(y1/64)*64- 0.0001;
            rx = (y1 - ry) * aTan+x1;
            yo = -64;
            xo = -yo * aTan;
        }
         if(ra <pi)//looking up 
        {
            ry = floor(y1/64)*64 +64;
            rx = (y1 - ry) * aTan+x1;
            
            yo = 64;
            xo = -yo * aTan;
        }
         if(ra ==0 || ra == pi)
        {
            rx = x1;
            ry = y1;
            dof = rayDist; 
        }
        var hit = false; 
        //console.log("vertical")
        
        while( dof < rayDist)
        {
            mx = floor(rx/64);
            my = floor(ry / 64);
            mp = my * mapX + mx;
            if(mp > 0 &&mp < mapX * mapY && mapLayout[mp] > 0)
            {
                colorYId = mapLayout[mp]-1;
                //console.log(`(${rx},${ry})`)
                yXS = rx; 
                yYS = ry;
                dof = rayDist;
                
                hit = true;
                //hit wall;
            }
            
            else  
            {
                rx += xo; 
                ry += yo;
                dof += 1;
            }
            
        }
        if(!hit)
        {
            distY = 1000000;
        }
        else 
        {
            distY = dist(x1, y1, yXS, yYS);
        }
        
        //horizontal line check
        dof = 0;
        let nTan = -tan(ra);

        if(ra >pi/2 && ra < 3*pi/2)//looking left  
        {
            rx = floor(x1/64)*64- 0.0001;
            ry = (x1 - rx) * nTan+y1;
            xo = -64;
            yo = -xo * nTan;
        }
        if(ra <pi/2 || ra > 3*pi/2)//looking right 
        {
            rx = floor(x1/64)*64 +64;
            ry = (x1 - rx) * nTan+y1;
            
            xo = 64;
            yo = -xo * nTan;
        }
         if(ra == pi/2 || ra == 3*pi/2)
        {
            ry = x1;
            rx = y1;
            dof = rayDist; 
        }
        
        hit = false;
        //console.log("horizontal")
        while( dof < rayDist)
        {
            mx = floor(rx/64);
            my = floor(ry / 64);
            mp = my * mapX + mx;
            if(mp > 0 && mp < mapX * mapY && mapLayout[mp] > 0)
            {
                colorXId = mapLayout[mp]-1;
                hit = true;
                xXS = rx; 
                xYS = ry;
                //console.log(`(${rx},${ry}`)
                //ellipse(xXS, xYS, 5, 5);
                dof = rayDist;
                //hit wall;
            }
            
            else 
            {
                rx += xo; 
                ry += yo;
                dof += 1;
            }
            
        }
        if(!hit)
        {
            distX = 1000000;
        }
        else 
        {
            distX = dist(x1, y1 , xXS, xYS);
        }
        //render horizontal side 
        if(distX < distY)
        {
            //line(player.x, player.y, xXS, xYS)
            //console.log(`ray ${r} has pos of: ${xXS}, ${xYS}`)
            // fill(color(xColors[colorXId][0],xColors[colorXId][1],xColors[colorXId][2]));
            distT = distX;
        }
        //render vertical
        else if(distX>distY)
        {
            // fill(color(yColors[colorYId][0],yColors[colorYId][1],yColors[colorYId][2]));
            //line(player.x, player.y, yXS, yYS)
            //console.log(`ray ${r} has pos of: ${yXS}, ${yYS}`)
            distT = distY;
        }
        return distT;
}





function drawRays3D()
{
    var r,mx,my,mp,dof,rx,ry,ra,xo,yo, distT;
    ra = player.angle - DR*FOVAng
    if(ra < 0)
    {
        ra += 2*pi;
    } 
    if(ra > 2*pi)
    {
        ra -= 2*pi;
    }
    var distY;
    var distX;
    var xXS,xYS, yXS, yYS;
    for(r=0; r < rayAmount*2; r++)
    {
        var colorYId = 0;
        var colorXId = 0;
        mx,my,mp,dof,rx,ry,xo,yo = 0;
        distY = 1000000;
        distX = 1000000; 
        //vertical line check
        dof = 0;
        let aTan = -1/tan(ra);
        if(ra >pi)//looking down 
        {
            ry = floor(player.y/64)*64- 0.0001;
            rx = (player.y - ry) * aTan+player.x;
            yo = -64;
            xo = -yo * aTan;
        }
         if(ra <pi)//looking up 
        {
            ry = floor(player.y/64)*64 +64;
            rx = (player.y - ry) * aTan+player.x;
            
            yo = 64;
            xo = -yo * aTan;
        }
         if(ra ==0 || ra == pi)
        {
            rx = player.x;
            ry = player.y;
            dof = 10; 
        }
        var hit = false; 
        //console.log("vertical")
        
        while( dof < mapX)
        {
            mx = floor(rx/64);
            my = floor(ry / 64);
            mp = my * mapX + mx;
            if(mp > 0 &&mp < mapX * mapY && mapLayout[mp] > 0)
            {
                colorYId = mapLayout[mp]-1;
                //console.log(`(${rx},${ry})`)
                yXS = rx; 
                yYS = ry;
                dof = mapX;
                
                hit = true;
                //hit wall;
            }
            
            else  
            {
                rx += xo; 
                ry += yo;
                dof += 1;
            }
            
        }
        if(!hit)
        {
            distY = 10000000;
        }
        else 
        {
            distY = dist(player.x, player.y, yXS, yYS);
        }
        
        //horizontal line check
        dof = 0;
        let nTan = -tan(ra);

        if(ra >pi/2 && ra < 3*pi/2)//looking left  
        {
            rx = floor(player.x/64)*64- 0.0001;
            ry = (player.x - rx) * nTan+player.y;
            xo = -64;
            yo = -xo * nTan;
        }
        if(ra <pi/2 || ra > 3*pi/2)//looking right 
        {
            rx = floor(player.x/64)*64 +64;
            ry = (player.x - rx) * nTan+player.y;
            
            xo = 64;
            yo = -xo * nTan;
        }
         if(ra == pi/2 || ra == 3*pi/2)
        {
            ry = player.y;
            rx = player.x;
            dof = 10; 
        }
        
        hit = false;
        //console.log("horizontal")
        while( dof < mapY)
        {
            mx = floor(rx/64);
            my = floor(ry / 64);
            mp = my * mapX + mx;
            if(mp > 0 && mp < mapX * mapY && mapLayout[mp] > 0)
            {
                colorXId = mapLayout[mp]-1;
                hit = true;
                xXS = rx; 
                xYS = ry;
                //console.log(`(${rx},${ry}`)
                //ellipse(xXS, xYS, 5, 5);
                dof = mapY;
                //hit wall;
            }
            
            else 
            {
                rx += xo; 
                ry += yo;
                dof += 1;
            }
            
        }
        if(!hit)
        {
            distX = 10000000;
        }
        else 
        {
            distX = dist(player.x, player.y, xXS, xYS);
        }
        //render horizontal side 
        if(distX < distY)
        {
            //line(player.x, player.y, xXS, xYS)
            //console.log(`ray ${r} has pos of: ${xXS}, ${xYS}`)
            fill(color(xColors[colorXId][0],xColors[colorXId][1],xColors[colorXId][2]));
            distT = distX;
        }
        //render vertical
        else if(distX>distY)
        {
            fill(color(yColors[colorYId][0],yColors[colorYId][1],yColors[colorYId][2]));
            //line(player.x, player.y, yXS, yYS)
            //console.log(`ray ${r} has pos of: ${yXS}, ${yYS}`)
            distT = distY;
        }
        zDepthBuffer[r] = distT;
        //Drawing 3D scene 
        var ca = player.angle-ra;
        if(ca< 0) { ca += 2*pi;}
        if(ca>2*pi) {ca -= 2*pi;}
        distT *=  cos(ca)
        var lineH = (mapS*windowW)/distT;
        if(lineH>windowW)
        {
            lineH = windowW;
        }
        var lineO = lineH/2;
        //maybe make ymouse movement by changing yoffset 
        noStroke()
        
        //p5 image for textures?

        // //draw each wall pixel by pixel for textures
        // for(let y =0; y < lineH; y++)
        // {
        //     beginShape();
        //     vertex(floor((r*8),windowH/2-lineO))
        //     vertex(floor((r*8),windowH/2-lineO+y))
        //     vertex(floor((r*8)+8,windowH/2-lineO+y))
        //     vertex(floor((r*8)+8,windowH/2-lineO))
        //     endShape()
        //     //rect(floor((r*8)), windowH/2-lineO, 8,y+lineO)
        // }

        //text(r,(r*8), windowH/2-lineO-random(0,50))
        rect(floor((r*8)), windowH/2-lineO, 8,lineH)
        
        ra += DR/2; 
        if(ra < 0) {ra += 2*pi;} if(ra > 2*pi){ra -= 2*pi;}
        
        
    }
    stroke(5)
    
}