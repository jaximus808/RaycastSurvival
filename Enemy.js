class Enemy
{
    constructor(x, y,imageArray, FOV,enemySprite1)
    {
        this.x = x;
        this.y = y;
        this.sprite = enemySprite1;
        this.FOV = FOV*pi/180;
        this.spriteX = 480;
        console.log(this.spriteX)
        this.spriteY = 960;
    }

    Render(DepthBuffer)
    {
        //fourth attempt

        let distX = player.x -this.x;
        let distY = player.y -this.y ;


        let quad = 0;
        let angRelPlay =  atan2(distX, distY) +pi/2
        if(angRelPlay > 0)
        {
            angRelPlay = ((3*pi/2 - angRelPlay) + pi/2) * -1;
        }
        angRelPlay *= -1;
        let radFOV = rayAmount * pi/180
        let inFOV = (angRelPlay > player.angle-radFOV/3 && angRelPlay < player.angle+radFOV/3) //make sure to check for dist later
        
        let dist = sqrt((distX*distX) + (distY*distY))/16;
        // //console.log(distY)
        // document.getElementById("debug").innerHTML = `(${angRelPlay*180/pi}, ${quad}, ${player.angle}, ${inFOV},${this.x},${this.y},${dist})`
        if(dist >= 1 && inFOV)
        {
            let objectCeiling = windowH/2 - windowH/dist;
            let objectFloor = windowH - objectCeiling;
            let objectHeight = objectFloor - objectCeiling;
            let objectAspectRatio = this.spriteY/ this.spriteX
            let objectWidth = objectHeight / objectAspectRatio * 2;

            // let renderXPos = abs(((angRelPlay-)/radFOV) * windowW);
            let distanceInFOV = angRelPlay - (player.angle-radFOV/4);
            let ratioOfDist = distanceInFOV/(radFOV/2)
            let renderXPos = ratioOfDist * windowW
            //create an array that is (x+y-1)^2
            let curImage = createImage(8,8);

            // var renderImg = createImage(objectWidth*2,objectHeight*2)
            // var pixelsOfCur = [];
            var test = 0;
            //console.log(ratioOfDist)
            curImage.loadPixels();
            // console.log(curImage.width)
            
            for(let i=0; i<16; i++)
            {
                for(let y =0; y <16;y++)
                {
                    var index = (i + y*16)*4
                    console.log(index)
                    if(this.sprite[index] > 0)
                    {//spriteColors[this.sprite[index]][0]
                        curImage.pixels[index] = spriteColors[this.sprite[index]-1][0];
                        curImage.pixels[index+1] = spriteColors[this.sprite[index]-1][1];
                        curImage.pixels[index+2] = spriteColors[this.sprite[index]-1][2];
                        curImage.pixels[index+3] = 255;
                        
                    }
                    else 
                    {
                        pixels[index+3] = 0;
                    }
                    test = index/4;
                    
                }
            }
            document.getElementById("debug").innerHTML = `(${(16 + 1*16)*4},${test})`
            
            curImage.updatePixels();
            
            curImage.resize(objectWidth,objectHeight*2);
            // for(let x = 0; x < curImage.width; x++)
            // {
            //     for(let y = 0; y < curImage.height; y++ )
            //     {
            //         let xPosition = renderXPos-objectWidth/2 + x; 
            //         let yPosition = windowH/2 - objectHeight + y;
            //         let pixelIndex = (xPosition + yPosition * windowW) * 4;
                    
            //         document.getElementById("debug").innerHTML = `(${xPosition}, ${yPosition})`
            //         pixels[pixelIndex] = 255;
            //         pixels[pixelIndex+1] = 255;
            //         pixels[pixelIndex+2] = 0;
            //         pixels[pixelIndex+3] = 255;
            //     }
            // }
            //updatePixels();
            image(curImage, renderXPos-objectWidth/2, windowH/2 - objectHeight)
            
            //document.getElementById("debug").innerHTML = `(${renderXPos}`
            
        }
        // if(distX < 0 && distY < 0)
        // {
        //     quad = 1;
        //     angRelPlay = atan2(distX, distY) ;
        // }
        // else if(distX > 0 && distY > 0)
        // {
        //     quad = 3;
        //     angRelPlay = atan2(distX, distY) *-1 + pi;
        // }
        // else if(distX > 0 && distY < 0)
        // {
        //     quad = 2;
            
        //     angRelPlay = atan2(distX, distY) + pi/2;
        // }
        // else 
        // {
        //     quad = 4;
        //     angRelPlay = atan2(distX, distY) + (3*pi/2)
        // }
        //third attempt

        // document.getElementById("debug").innerHTML = `(${player.angle})`
        // let curImage = this.sprite;
        // let fVecX = this.x - player.x;
        // let fVecY = player.y -this.y 
        // let fDistanceFromPlayer = sqrt(fVecX*fVecX + fVecY*fVecY);

        // let fEyeX = sin(player.angle);
        // let fEyeY = cos(player.angle);

        // let enemyAngle =  atan2(fVecY,fVecX) -atan2(fEyeY, fEyeX)
        // //console.log(enemyAngle);
        
        // // if(enemyAngle < -pi) enemyAngle += 2*pi;
        // // if(enemyAngle > pi) enemyAngle -= 2*pi;
        
        // // if(enemyAngle<0)
        // // {
        // //     enemyAngle = pi + (pi+enemyAngle);  
        // // }
        // // enemyAngle -= 3*pi/2
        // // if(enemyAngle<0)
        // // {
        // //     enemyAngle += 2*pi;
        // // }
        // //console.log(enemyAngle);
        // let inPlayerFov = (enemyAngle) < (FOVAng*pi/180);
        // //console.log(abs(fDistanceFromPlayer) > 0.5);
        // //console.log(inPlayerFov)
        // console.log(enemyAngle)
        // if(inPlayerFov && abs(fDistanceFromPlayer) >= 0.5 )
        // {
        //     console.log(":)")
        //     let objectCeiling = windowH/2 - windowH/fDistanceFromPlayer;
        //     let objectFloor = windowH - objectCeiling;
        //     let objectHeight = objectFloor - objectCeiling;
        //     let objectAspectRatio = this.spriteY/ this.spriteX
        //     let objectWidth = objectHeight / objectAspectRatio;
            
        //     let positionOnScreenX =  (0.5 * ((enemyAngle)/((FOVAng*pi/180)/2))+0.5) * windowW
        //     //console.log(positionOnScreenX)
        //     //maybe try calculathis myself
        //     //console.log(windowW)
        //     curImage.resize(objectWidth,objectHeight);
        //     image(curImage, positionOnScreenX, windowH/2 - objectHeight)

        // }

        //second attempt

        // console.log(this.FOV)
        // //lol redo this shit fast
        // let ang = atan2(this.player.x - this.x, this.player.y-this.y) + player.angle
        // ang -= pi;
        // if(ang<0)
        // {
        //     ang = pi + (pi+ang);  
        // }
        // ang -= 3*pi/2
        // if(ang<0)
        // {
        //     ang += 2*pi;
        // }
       
        // document.getElementById("debug1").innerHTML = `(${this.x},${this.y}, ${this.player.angle})`
        // document.getElementById("debug").innerHTML = `(${ang })`
        
        // let thet1 = player.angle;
        // let thet2 = ang;
        // let thet3 = thet1 - this.FOV;
        // if(thet1 - this.FOV < thet2 && thet1+this.FOV > thet2)
        // {
        //     console.log("looking")
        // } 
        //let inFOV = (atan2(this.player.x - this.x, this.player.y - this.y));
        // let inFOV = createVector(this.player.x,this.player.y).angleBetween(createVector(this.x,this.y))*(180/pi) +(this.player.angle)*(180/pi) 
        // if(inFOV > 2*pi)
        // {
        //     inFOV -= 2*pi;
        // }
        // else if(inFOV < 0)
        // {
        //     inFOV = inFOV*-1 + (180);
        // }
        // //  console.log(inFOV   )
        // //  console.log((this.FOV-(this.FOV/2))/180 + this.player.angle)
        // //  console.log((this.FOV+(this.FOV/2))/180 + this.player.angle)
        //document.getElementById("debug").innerHTML = `(${inFOV}, ${(this.FOV-(this.FOV/2)) + this.player.angle*(180/pi)},${(this.FOV+(this.FOV/2)) + this.player.angle*(180/pi)})`
        

        //first attempt 

        // if((this.FOV-(this.FOV/2))+ this.player.angle*(180/pi)< inFOV &&(this.FOV+(this.FOV/2)) + this.player.angle*(180/pi) >inFOV)
        // {
        //     //draw enemy
            
        //     let distCur = dist(this.x,this.y,this.player.x,this.player.y);
        //     let sizeX = this.spriteX * distCur/100
        //     let sizeY = this.spriteY * distCur/100
        //     console.log((windowW/2)+(this.player.x - this.x))
        //     console.log( windowH - sizeY/2)
        //     console.log("w")
        //     console.log(sizeX);
        //     console.log(sizeY)
        //     let currentSprite = this.sprite;
        //     currentSprite.resize(sizeX,sizeY);
        //     image(currentSprite, windowW/2, 50)
        //     // (windowW/2)+(this.player.x - this.x) +(sizeX/2)
        //}
    }
}