class Enemy
{
    constructor(x, y, FOV,colorIndex,width, speed, rotSpeed,rayDist, id, health)
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
        this.angle = getWorldAngle2D(this.x,this.y,player.x ,player.y) + (random(-30,30) * pi/180); 
        this.dx = cos(this.angle) * 5;
        this.dy = sin(this.angle) * 5; 
        //.log(this.angle)
        this.width = width;
        this.rayDetectLength = rayDist;
        this.rotSpeed = rotSpeed;
        this.movingRotateToPoint = 0;
        this.currRotated = 0;
        this.rotating = false;
        this.id = id;
        this.health = health;
        this.setMaxHealth = health;
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

            noStroke()
            for(let i=0; i<objectWidth; i++)
            {
                let sampleX = i;
                let objectColumn = abs(floor((renderXPos-objectWidth+(2*i))/8))
                
                if(zDepthBuffer[ objectColumn] > distan*16)
                {
                    //var lineH = (mapS*windowW)/distT
                    
                    if(sampleX/objectWidth <=  this.health/this.setMaxHealth)
                    {
                        fill(color(spriteColors[this.colorIndex-1]))
                    }
                    else 
                    {
                        fill(color(0,127.5))
                    }
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
        
       
    }
    
    ForwardMove(multiplierSpeed,playerSee)
    {
        let pX = this.x +this.dx * (this.speed*multiplierSpeed) ; 
        let pY = this.y + this.dy* (this.speed*multiplierSpeed)

        // //point 1 check
        // if(mapLayout[floor((pX+this.width/2)/64)+floor((pY)/64)*mapX] > 1)
        // {
        //     this.y = pY;
        // } 
        // //point 2 check
        // else if(mapLayout[floor((pX+this.width/2)/64)+floor((pY)/64)*mapX] > 1)
        // {
        //     this.x = pX;
        // }
        // //point 3 check
        // else if(mapLayout[floor((pX)/64)+floor((pY+this.width/2)/64)*mapX] > 1)
        // {
        //     this.y = pY;
        // }
        // //point 4 check
        // else if(mapLayout[floor((pX+this.width/2)/64)+floor((pY+this.width)/64)*mapX] > 1)
        // {
        //     this.x = pX;
        // }
        // //corners 
        // else if(mapLayout[floor((pX+this.width/2)/64)+floor((pY+this.width/2)/64)*mapX] ==0 && mapLayout[floor((pX-this.width/2)/64)+floor((pY-this.width/2)/64)*mapX] ==0&&mapLayout[floor((pX-this.width/2)/64)+floor((pY+this.width/2)/64)*mapX] ==0 && mapLayout[floor((pX+this.width/2)/64)+floor((pY-this.width/2)/64)*mapX] ==0)
        // {
        //     this.x = pX;
        //     this.y = pY;  
        // }
        // else 
        // {
        //     this.currRotated = 0;
        //     this.rotating = true;
        //     this.movingRotateToPoint = random(-45,45)
        // }
        if(mapLayout[floor((pX+this.width)/64)+floor((pY+this.width)/64)*mapX] <=0 && mapLayout[floor((pX-this.width)/64)+floor((pY-this.width)/64)*mapX] <=0&&mapLayout[floor((pX-this.width)/64)+floor((pY+this.width)/64)*mapX] <=0 && mapLayout[floor((pX+this.width)/64)+floor((pY-this.width)/64)*mapX] <=0) 
        {
            this.x = pX;
            this.y = pY;  
        }
        else 
        {
            
            this.currRotated = 0;
            this.rotating = true;
            this.movingRotateToPoint = random(-45,45)
            
        }
        
        
        //console.log( collideRectCircle(this.x, this.y, this.width,this.width, player.x, player.x, 32) )
    }

    Move()
    {

        if( collideRectRect(this.x, this.y, this.width,this.width, player.x, player.y, player.radius,player.radius) )
        {
            player.TakeDamage(10)
        }
        let canSee = false;
        //check for player relative to enemy.
        let angRelPlay = getWorldAngle2D( this.x,this.y,player.x,player.y);
        if((this.angle*180/pi)-(angRelPlay*180/pi) > 320 && (this.angle*180/pi)-(angRelPlay*180/pi) < 360)
        {
            angRelPlay += 2*pi;
        }
        if((angRelPlay*180/pi)- (this.angle*180/pi) > 320 && (angRelPlay*180/pi)-(this.angle*180/pi) < 360)
        {
            angRelPlay -= 2*pi;
        }   
        

        let inFOV = (angRelPlay >= this.angle-(30*pi/180) && angRelPlay <= this.angle+(30*pi/180))
        //console.log( this.dx +1)
        if(inFOV)
        {
            let hitDistance = ShootRay(this.x+this.width/2, this.y+this.width/2,angRelPlay,20)[0];
            if(hitDistance > dist(this.x, this.y, player.x, player.y))
            {
                canSee = true; 
                // this.currRotated = 0;
                // this.rotating = true;
                // this.movingRotateToPoint = this.angle- this.angRelPlay
                //document.getElementById("debug").innerHTML = `(${this.angle},${angRelPlay},${hitDistance})`
                let rotate;
                if(angRelPlay-this.angle == 0)
                {
                    rotate = 0;
                }
                else 
                {
                    
                    rotate = this.rotSpeed * (((angRelPlay-this.angle)/abs(angRelPlay-this.angle)))
                }
                
                this.angle += 0.05 * rotate;
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

                this.ForwardMove(1.5);
                return
            }
           
        }
        
        if(this.rotating)
        {
            let rotate = this.rotSpeed * (this.movingRotateToPoint/abs(this.movingRotateToPoint))
            this.angle += 0.05* rotate;
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
        
        this.ForwardMove(1);
        
        
        
    }

    Damage(amount)
    {
        let enemyKeys = Object.keys(EnemyCollection);
        for(let i = 0; i <enemyKeys.length; i++)
        {
            let index = enemyKeys[i];
            if(radiusSound > dist( EnemyCollection[index].x,EnemyCollection[index].y,player.x,player.y) || this.id == index)
            {
                let angRelPlay = getWorldAngle2D( EnemyCollection[index].x,EnemyCollection[index].y,player.x,player.y);
                EnemyCollection[index].angle = angRelPlay
                EnemyCollection[index].dx = cos(EnemyCollection[index].angle) * 5;
                EnemyCollection[index].dy = sin(EnemyCollection[index].angle) * 5;
            }
            
        }

        
        
        
        this.health -= amount;
        console.log(`Enemy with id: ${this.id} has ${this.health} health`)
        if(this.health <= 0)
        {
            enemyDeleteBuffer.push(this.id);
        }

        
    }
}