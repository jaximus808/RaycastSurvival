var borderWidth = 2;

var windowW = window.innerWidth;
var windowH = window.innerHeight + 150;

var GameScreenX = 1080;
var GameScreenY = 640;

var pi;
var DR;

var player;
var locked = false;
var called = false;
var rayAmount = 60;
var canvOb;
var mapX = 10;
var mapY = 10;
var mapS = 64;

var mouseXMove = 0;
var mouseYMove = 0; 

//zero represents empty spaces, 1 represeants a square.
var mapLayout = [
    1, 1, 1, 1, 1, 1, 1, 1,1,1,
    1, 0, 1, 0, 0, 0, 0, 0,0,1,
    1, 0, 1, 0, 0, 0, 0, 0,0,1,
    1, 0, 1, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 1 ,1, 0,0,1,
    1, 0, 0, 0, 0, 1, 1, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 0, 0, 1, 0, 0, 0,0,1,
    1, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 1, 1, 1, 1, 1, 1, 1,1,1
]
function setup() 
{
   
    pi = PI;
    DR = 0.0174533
    angleMode(RADIANS);
    player = new Player(96,96, 5, 1,90*pi/180,pi,0.01)
    createCanvas(GameScreenX, GameScreenY);
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
    drawMap2D();
    player.render();
    
    player.move(mouseXMove);
    if(!locked) return;
    drawRays3D()
    
   
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
}

function drawMap2D()
{
    
    let x,y;
    for(y = 0;y<mapY;y++)
    {
        
        for(x = 0; x<mapX; x++)
        {
            if(mapLayout[y*mapX+x] == 1 )
            {
                fill(color("red"));
                rect(64*x, y*64, 64,64);
            }
            else 
            {
                fill(color("white"))
                rect(64*x, y*64, 64,64);
            }
        }
    }
}



function drawRays3D()
{
    var r,mx,my,mp,dof,rx,ry,ra,xo,yo, distT;
    ra = player.angle - DR*30
    if(ra < 0)
    {
        ra += 2*pi;
    } 
    if(ra > 2*pi)
    {
        ra -= 2*pi;
    }
    var distY = 10000000;
    var distX = 10000000; 
    var xXS,xYS, yXS, yYS;
    var p = player.angle - DR*30;
    for(r=0; r < rayAmount; r++)
    {
        mx,my,mp,dof,rx,ry,xo,yo = 0;
        distY = 10000000;
        distX = 10000000; 
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
            dof = 8; 
        }
        fill(color("yellow"));
        var hit = false; 
        //console.log("vertical")
        while( dof < 8)
        {
            mx = floor(rx/64);
            my = floor(ry / 64);
            mp = my * mapX + mx;
            if(mp > 0 &&mp < mapX * mapY && mapLayout[mp] == 1)
            {
                //console.log(`(${rx},${ry})`)
                yXS = rx; 
                yYS = ry;
                dof = 8;
                ellipse(rx, ry, 5, 5);
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
            dof = 8; 
        }
        
        hit = false;
        //console.log("horizontal")
        while( dof < 8)
        {
            mx = floor(rx/64);
            my = floor(ry / 64);
            mp = my * mapX + mx;
            if(mp > 0 && mp < mapX * mapY && mapLayout[mp] == 1)
            {
                hit = true;
                xXS = rx; 
                xYS = ry;
                fill(color("red"));
                //console.log(`(${rx},${ry}`)
                ellipse(xXS, xYS, 5, 5);
                dof = 8;
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

        if(distX < distY)
        {
            line(player.x, player.y, xXS, xYS)
            //console.log(`ray ${r} has pos of: ${xXS}, ${xYS}`)
            distT = distX;
        }
        else if(distX>distY)
        {
            line(player.x, player.y, yXS, yYS)
            //console.log(`ray ${r} has pos of: ${yXS}, ${yYS}`)
            distT = distY;
        }
        else 
        {
            line(player.x, player.y, yXS, yYS)
        }
        //Drawing 3D scene 
        
        ra += DR; 
        
        if(ra < 0) {ra += 2*pi;} if(ra > 2*pi){ra -= 2*pi;}
        
        p = ra;
    }
}