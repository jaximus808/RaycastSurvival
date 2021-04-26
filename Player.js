class Player {
    constructor(startX, startY, r, speed,angle,pi,rotSpeed, fireRate,gunDamage) {
        this.x = startX;
        this.y = startY;
        this.angle = angle;
        this.dx = cos(angle)*5;
        this.dy = sin(angle)*5;;
        this.radius = r;
        this.speed = speed;
        this.pi = pi; 
        this.tPi = 2*pi;
        this.rotSpeed = rotSpeed;
        this.shooting = false;
        this.shootAnim = false;
        this.fireRate = fireRate;
        this.curTime = 0;
        this.invulr = false; 
        this.timerInv
        this.shootCheckIntev = setInterval(this.ShootLogic, 100);
        this.gunDamage = gunDamage
        this.curHealth = PlayerHealth
        
        
    }

    TwoDRender() {
        fill(color("yellow"));
        ellipse(this.x, this.y, this.radius, this.radius);
        fill(color("gray"));
        line(this.x,this.y, this.x +this.dx*5,this.y +this.dy*5)
        
    }

    Render()
    {
        if(this.invulr)
        {
            if(this.shootAnim)
            {
                image(shootGunSpriteTrans, windowW-playerSpriteWidth,windowH-playerSpriteHeight,playerSpriteWidth,playerSpriteHeight)
            }
            else 
            {
                image(idleGunSpriteTrans, windowW-playerSpriteWidth,windowH-playerSpriteHeight,playerSpriteWidth,playerSpriteHeight)
            }
            return
        }
        if(this.shootAnim)
        {
            image(shootingGunSprite, windowW-playerSpriteWidth,windowH-playerSpriteHeight,playerSpriteWidth,playerSpriteHeight)
        }
        else 
        {
            image(idleGunSprite, windowW-playerSpriteWidth,windowH-playerSpriteHeight,playerSpriteWidth,playerSpriteHeight)
        }
    }

    TakeDamage(damage)
    {
        if(this.invulr) return; 
        console.log("uwu")
        console.log(this.invulr)
        this.curHealth -= damage; 
        if(this.curHealth <= 0 ) 
        {
            window.alert("Dead")
            window.localStorage.setItem("HighScore" , Score)
            location.reload(); // put something better here later and save highscore.
        }
        this.invulr = true; 
        this.timerInv = 0;
    }

    ShootLogic()
    {
        
        if(player.invulr)
        {
            player.timerInv += 0.1; 
            if(player.timerInv >= invulnerableDur)
            {
                
                player.invulr = false; 

            }
        }
        if(!locked) return;
        //console.log(player.shooting)
        if(!player.shooting) return; 
        
        if(player.curTime >= player.fireRate)
        {
            player.shooting = false 
        }
        
        if(player.curTime >= shootAnim)
        {
            player.shootAnim = false;
        }
        this.timerInv
        player.curTime += 0.1;

    }

    Shoot()
    {
        if(this.shooting) return;
        pistolBlast.play();
        this.shooting = true
        this.curTime = 0;
        this.shootAnim = true;  

        //Shoot detecting lord save me LOL
        let inFovEnemy = [];
        let enemyKeys = Object.keys(EnemyCollection)
        for(let i = 0; i < enemyKeys.length;i++)
        {
            let enemyInstance = EnemyCollection[enemyKeys[i]];
            let angRelPlay = getWorldAngle2D( this.x,this.y, enemyInstance.x,enemyInstance.y)
            if((this.angle*180/pi)-(angRelPlay*180/pi) > 320 && (this.angle*180/pi)-(angRelPlay*180/pi) < 360)
            {
                angRelPlay += 2*pi;
            }
            if((angRelPlay*180/pi)- (this.angle*180/pi) > 320 && (angRelPlay*180/pi)-(this.angle*180/pi) < 360)
            {
                angRelPlay -= 2*pi;
            }   
            let radFOV = rayAmount * pi/180
            let inFOV = (angRelPlay >= this.angle-radFOV/2 && angRelPlay <= this.angle+radFOV/2)
            if(inFOV)
            {
                inFovEnemy.push(enemyKeys[i]);
            }
            
        }
        let rayInfo = ShootRay(this.x, this.y, this.angle, 20);
        let InWay = [];
        for(let i = 0; i < inFovEnemy.length; i++)
        {
            let enemyInstance = EnemyCollection[inFovEnemy[i]];
            stroke(5)
            line(rayInfo[1]/8, rayInfo[2]/8, this.x/8, this.y/8)
            noStroke()
            //console.log( collideLineRect(rayInfo[1], rayInfo[2], this.x, this.y, enemyInstance.x, enemyInstance.y, enemyInstance.width, enemyInstance.width))
            if(rayInfo[0] > dist(enemyInstance.x, enemyInstance.y, this.x, this.y) && (collideLineRect(rayInfo[1], rayInfo[2], this.x, this.y, enemyInstance.x-enemyInstance.width, enemyInstance.y, enemyInstance.width, enemyInstance.width)) || collideLineRect(rayInfo[1], rayInfo[2], this.x, this.y, enemyInstance.x, enemyInstance.y-enemyInstance.width, enemyInstance.width, enemyInstance.width)) //||collideLineRect(rayInfo[1], rayInfo[2], this.x, this.y, enemyInstance.x-enemyInstance.width/2, enemyInstance.y - enemyInstance.width/2, enemyInstance.width, enemyInstance.width))
            {
                InWay.push([enemyInstance.id,dist(enemyInstance.x, enemyInstance.y, this.x, this.y)]);
            }
        }
        if(InWay.length ==0 ) return
        let closet = 2000000
        let closetid = 0;
        for(let i = 0; i < InWay.length; i++)
        {
            if(InWay[i][1] < closet)
            {
                closet = InWay[i][1]
                closetid = InWay[i][0]
            }
        }
        
        EnemyCollection[closetid].Damage(this.gunDamage);
        
        
        //console.log(closet)
        

    }

    move(mouseXMove) 
    {
        var shift = false;
        if(keyIsDown(16))
        {
            this.speed *= 2;
            shift = true;
        }
        if ( keyIsDown(68)) {
            let ang = this.angle + (pi/2);
            if(ang>this.tPi)
            {
                ang -= this.tPi;
            }
            let dx = cos(ang)*5;
            let dy = sin(ang)*5;
            let pX = this.x + dx *this.speed;
            let pY = this.y + dy * this.speed;
            let xo,yo
            if (dx < 0) {xo = -20} else {xo=20};
            if (dy < 0) {yo = -20} else {yo=20};
            let gridX = floor(this.x/64);
            let gridXOff = floor((this.x+xo)/64);
            let gridY = floor(this.y/64)
            let gridYOff = floor((this.y+yo)/64)

            if(mapLayout[gridY * mapX + gridXOff ] == 0) this.x = pX;
            if(mapLayout[gridYOff*mapX + gridX] == 0) this.y = pY
            // if(mapLayout[floor(pX/64)+floor(pY/64)*mapX] ==0) 
            // {
            //     this.x = pX;
            //     this.y = pY ;  
            // }
        }

        if (keyIsDown(65)) {
            let ang = this.angle - (pi/2);
            if(ang>this.tPi)
            {
                ang -= this.tPi;
            }
            let dx = cos(ang)*5;
            let dy = sin(ang)*5;
            document.getElementById("debug").innerHTML = `(${dx})`
            let pX = this.x + dx *this.speed;
            let pY = this.y + dy * this.speed;
            let xo,yo
            if ((dx < 0 )) {xo = -20} else {xo=20};
            if (dy < 0) {yo = -20} else {yo=20};
            let gridX = floor(this.x/64);
            let gridXOff = floor((this.x+xo)/64);
            let gridY = floor(this.y/64)
            let gridYOff = floor((this.y+yo)/64)

            if(mapLayout[gridY * mapX + gridXOff ] == 0) this.x = pX;
            if(mapLayout[gridYOff*mapX + gridX] == 0) this.y = pY

            // if(mapLayout[floor(pX/64)+floor(pY/64)*mapX] ==0) 
            // {
            //     this.x = pX;
            //     this.y = pY ;  
            // }
        }

        if ( keyIsDown(87)) {
            let pX = this.x +this.dx * this.speed ; 
            let pY = this.y + this.dy* this.speed; 
            let xo,yo;
            if (this.dx < 0) {xo = -20} else {xo=20};
            if (this.dy < 0) {yo = -20} else {yo=20};
            let gridX = floor(this.x/64);
            let gridXOff = floor((this.x+xo)/64);
            let gridY = floor(this.y/64)
            let gridYOff = floor((this.y+yo)/64)

            if(mapLayout[gridY * mapX + gridXOff ] == 0) this.x = pX;
            if(mapLayout[gridYOff*mapX + gridX] == 0) this.y = pY
            // if(mapLayout[floor(pX/64)+floor(pY/64)*mapX] ==0) 
            // {
            //     
            //     this.y = pY ;  
            // }
        }

        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
            let pX = this.x -this.dx * this.speed ; 
            let pY = this.y - this.dy* this.speed; 
            let xo,yo;
            if (this.dx < 0) {xo = 20} else {xo=-20};
            if (this.dy < 0) {yo = 20} else {yo=-20};
            let gridX = floor(this.x/64);
            let gridXOff = floor((this.x+xo)/64);
            let gridY = floor(this.y/64)
            let gridYOff = floor((this.y+yo)/64)

            if(mapLayout[gridY * mapX + gridXOff ] == 0) this.x = pX;
            if(mapLayout[gridYOff*mapX + gridX] == 0) this.y = pY
            // if(mapLayout[floor(pX/64)+floor(pY/64)*mapX] ==0) 
            // {
            //     this.x = pX;
            //     this.y = pY ;  
            // }
        }
        if(mouseXMove != 0)
        {
            if(mouseXMove > 0)
            {
                //turned right
                this.angle += 0.1 * this.rotSpeed *mouseXMove;
                if(this.angle>this.tPi)
                {
                    this.angle -= this.tPi;
                }
                this.dx = cos(this.angle)*5;
                this.dy = sin(this.angle)*5;
            }
            if(mouseXMove < 0)
            {
                //turned left
                this.angle += 0.1 * this.rotSpeed *  mouseXMove;
                if(this.angle<0)
                {
                    this.angle+= this.tPi;
                }
                this.dx = cos(this.angle)*5;
                this.dy = sin(this.angle)*5;
            }
        }
        else 
        {
            if(keyIsDown(LEFT_ARROW))
            {
                //turned left
                this.angle -= 0.1 * this.rotSpeed *  20;
                if(this.angle<0)
                {
                    this.angle+= this.tPi;
                }
                this.dx = cos(this.angle)*5;
                this.dy = sin(this.angle)*5;
            }
            if(keyIsDown(RIGHT_ARROW))
            {
                this.angle += 0.1 * this.rotSpeed *20;
                if(this.angle>this.tPi)
                {
                    this.angle -= this.tPi;
                }
                this.dx = cos(this.angle)*5;
                this.dy = sin(this.angle)*5;
            }
        }
        
        if(shift)
        {
            this.speed /= 2;
        }

    }
}