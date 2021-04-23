class Enemy
{
    constructor(x, y,imageArray, FOV,colorIndex,width, speed, rotSpeed,rayDist)
    {
        this.speed = speed;
        this.x = x;
        this.y = y;
        // this.sprite = enemySprite1;
        this.FOV = FOV*pi/180;
        this.spriteX = 360;
        //console.log(this.spriteX)
        this.spriteY = 960;
        this.colorIndex = colorIndex;
        this.angle = getWorldAngle2D(this.x,this.y,player.x ,player.y); 
        this.dx = cos(this.angle) * 5;
        this.dy = sin(this.angle) * 5; 
        //.log(this.angle)
        this.width = width;
        this.rayDetectLength = rayDist;
        this.rotSpeed = rotSpeed;
        this.movingRotateToPoint = 0;
        this.currRotated = 0;
        this.rotating = false;
    }

    Render()
    {
        //fourth attempt

        // let distX = player.x -this.x;
        // let distY = player.y -this.y;

        // let angRelPlay =  atan2(distX, distY) +pi/2
        // if(angRelPlay >= 0)
        // {
        //     angRelPlay = ((3*pi/2 - angRelPlay) + pi/2) * -1;
        // }
        
        // angRelPlay *= -1;
        // if((player.angle*180/pi)-(angRelPlay*180/pi) > 320 && (player.angle*180/pi)-(angRelPlay*180/pi) < 360)
        // {
        //     angRelPlay += 2*pi;
        // }
        // if((angRelPlay*180/pi)- (player.angle*180/pi) > 320 && (angRelPlay*180/pi)-(player.angle*180/pi) < 360)
        // {
        //     angRelPlay -= 2*pi;
        // }
        let angRelPlay = getWorldAngle2D( player.x,player.y, this.x,this.y)
        if((player.angle*180/pi)-(angRelPlay*180/pi) > 320 && (player.angle*180/pi)-(angRelPlay*180/pi) < 360)
        {
            angRelPlay += 2*pi;
        }
        if((angRelPlay*180/pi)- (player.angle*180/pi) > 320 && (angRelPlay*180/pi)-(player.angle*180/pi) < 360)
        {
            angRelPlay -= 2*pi;
        }   
        let radFOV = rayAmount * pi/180
        let inFOV = (angRelPlay >= player.angle-radFOV/2 && angRelPlay <= player.angle+radFOV/2) //make sure to check for dist later
        //dist(player.x, player.y, xXS, xYS)
        let distan = dist(player.x, player.y, this.x, this.y)/16 //sqrt((distX*distX) + (distY*distY))/16;
        // //console.log(distY)
        //document.getElementById("debug").innerHTML = `(${floor((renderXPos-objectWidth/2+(8*i))/8)}, ${quad}, ${player.angle}, ${inFOV},${this.x},${this.y},${dist})`
        //console.log(angRelPlay1)
        let renderXPos = 0;
        if(distan*16 >= 0.8 && inFOV)
        {
            let objectCeiling = windowH/2 - windowH/distan;
            let objectFloor = windowH - objectCeiling;
            let objectHeight = objectFloor - objectCeiling;
            let objectAspectRatio = this.spriteY/ this.spriteX
            let objectWidth = objectHeight / objectAspectRatio * 2;

            // let renderXPos = abs(((angRelPlay-)/radFOV) * windowW);
            let distanceInFOV = angRelPlay - (player.angle-radFOV/4);
            let ratioOfDist = distanceInFOV/(radFOV/2)
            renderXPos = ratioOfDist * windowW
            //create an array that is (x+y-1)^2
            //let curImage = createImage(objectWidth,objectHeight);

            // var renderImg = createImage(objectWidth*2,objectHeight*2)
            // var pixelsOfCur = [];

            //console.log(ratioOfDist)
            //curImage.loadPixels();
            // console.log(curImage.width)
            let x = 0;
            noStroke()
            for(let i=0; i<objectWidth; i++)
            {
                let sampleX = i;
                let objectColumn = abs(floor((renderXPos-objectWidth+(2*i))/8))
                
                if(zDepthBuffer[ objectColumn] > distan*16)
                {
                    //var lineH = (mapS*windowW)/distT
                    x++;
                    fill(color(spriteColors[this.colorIndex-1]))
                    rect( floor(sampleX*2+renderXPos-objectWidth),objectCeiling-objectHeight/2,2,(mapS*windowW)/(distan*16))
                
                    
                }
            
            }
            //document.getElementById("debug").innerHTML = `(${abs(floor((renderXPos-objectWidth/2+(2))/8))},${floor(sqrt(DepthBuffer[abs(floor((renderXPos-objectWidth/2+(8))/8))]))*8},${floor(distan)*8})`
           // console.log(x)
            stroke(5)
            //document.getElementById("debug").innerHTML = `(${abs(floor((renderXPos-objectWidth/2+(2))/8))},${floor(distan*16)},${floor(zDepthBuffer[ abs(floor((renderXPos-objectWidth/2+(2))/8))])})`
            //document.getElementById("debug").innerHTML = `(${(16 + 1*16)*4})`
            
            //curImage.updatePixels();
            
            // curImage.resize(objectWidth,objectHeight*2);
            
            //image(curImage, renderXPos-objectWidth/2, windowH/2 - objectHeight)
            
            //document.getElementById("debug").innerHTML = `(${renderXPos}`
            
        }
        document.getElementById("debug").innerHTML = `(${player.angle*180/pi},${angRelPlay*180/pi}, ${abs((player.angle*180/pi)-(angRelPlay*180/pi))},${angRelPlay*180/pi},${renderXPos},${inFOV})`
       
    }

    Move()
    {
        
        if(this.rotating)
        {
            let rotate = this.rotSpeed * (this.movingRotateToPoint/abs(this.movingRotateToPoint))
            this.angle += 0.1* rotate;
            if(this.angle>2*pi)
            {
                this.angle -= 2*pi;
            }
            else if(this.angle<0)
            {
                this.angle += 2*pi;
            }
            this.dx = cos(this.angle) * 5;
            this.dy = sin(this.angle) * 5;
            this.currRotated += abs(rotate);
            //console.log(this.currRotated> abs(this.movingRotateToPoint))
            if(this.currRotated > abs(this.movingRotateToPoint))this.rotating = false; 
            return; 
        }
        let hitDistance = ShootRay(this.x+this.width/2, this.y+this.width/2,this.angle,10)/8;
        
        if(hitDistance <= this.rayDetectLength)
        {
            
            this.currRotated = 0;
            this.rotating = true;
            this.movingRotateToPoint = random(-90,90)
            console.log(this.movingRotateToPoint)
            return;
        }
        let pX = this.x +this.dx * this.speed ; 
        let pY = this.y + this.dy* this.speed; 
        if(mapLayout[floor((pX+this.width)/64)+floor((pY+this.width)/64)*mapX] ==0 && mapLayout[floor((pX-this.width)/64)+floor((pY-this.width)/64)*mapX] ==0) 
        {
            this.x = pX;
            this.y = pY;  
        }
    }
}