var borderWidth = 2;

var windowH = window.innerHeight*0.95;

var xColors = [[255,0,0],[0,0,255],[214, 116, 211]]
var yColors = [[180,0,0],[0,0,180],[171, 92, 168]]

var windowW = windowH;
//1009
//922
console.log(windowW)
console.log(windowH)
// var GameScreenX = 1080;
// var GameScreenY = 640;

var pi;
var DR;

var player;
var locked = false;
var called = false;
var rayAmount = Math.floor(windowH/8);
var canvOb;
var mapX = 20;
var mapY = 20;
var mapS = 64;

var mouseXMove = 0;
var mouseYMove = 0; 

//zero represents empty spaces, 1 represeants a square.
var mapLayout = [
    1, 1, 1, 1, 1, 1, 1, 1,1,1,1, 1, 1, 1, 1, 1, 1, 1,1,1,
    1, 0, 1, 0, 0, 0, 0, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 1, 0, 0, 0, 0, 0,0,0,0, 0, 0, 0, 0, 0, 0, 0,0,1,
    1, 0, 1, 0, 0, 0, 0, 0,0,0,0, 0, 2, 0, 0, 0, 0, 0,0,1,
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
function setup() 
{
   
    pi = PI;
    DR = 0.0174533
    angleMode(RADIANS);
    player = new Player(96,96, 5, 1,90*pi/180,pi,0.01)
    createCanvas(windowW, windowH);
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
    //drawMap2D();
    //player.TwoDRender();
    drawRays3D()
    document.getElementById("state").innerHTML = "Status: InGame (MouseLocked)"
    document.getElementById("coords").innerHTML = `Coords:(${floor(player.x)},${floor(player.y)}) Tile:(${floor(player.x/64)},${floor(player.y/64)})`
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
    ra = player.angle - DR*floor(windowW/32)
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
    for(r=0; r < rayAmount*2; r++)
    {
        var colorYId = 0;
        var colorXId = 0;
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
            dof = 10; 
        }
        var hit = false; 
        //console.log("vertical")
        while( dof < 20)
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
                dof = 20;
                //ellipse(rx, ry, 5, 5);
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
        while( dof < 20)
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
                dof = 20;
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
        else if(distX == distY&& (distY == 10000000||distY ==10000000))
        {
            fill(color("white"))
        }
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
        rect(floor((r*8)), windowH/2-lineO, 8,lineH)
        
        ra += DR/2; 
        if(ra < 0) {ra += 2*pi;} if(ra > 2*pi){ra -= 2*pi;}
        
        
    }
    stroke(5)
}