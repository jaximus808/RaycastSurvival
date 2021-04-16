class Player {
    constructor(startX, startY, r, speed,angle,pi,rotSpeed) {
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
    }

    render() {
        fill(color("yellow"));
        ellipse(this.x, this.y, this.radius, this.radius);
        fill(color("gray"));
        line(this.x,this.y, this.x +this.dx*5,this.y +this.dy*5)
    }
    move(mouseXMove) 
    {
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            let ang = this.angle + (pi/2);
            if(ang>this.tPi)
            {
                ang -= this.tPi;
            }
            let dx = cos(ang)*5;
            let dy = sin(ang)*5;
            this.x += dx *this.speed;
            this.y += dy * this.speed;
        }

        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            let ang = this.angle - (pi/2);
            if(ang>this.tPi)
            {
                ang -= this.tPi;
            }
            let dx = cos(ang)*5;
            let dy = sin(ang)*5;
            this.x += dx *this.speed;
            this.y += dy * this.speed;
        }

        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
            this.x += this.dx * this.speed ; 
            this.y += this.dy* this.speed; 
        }

        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
            this.x -= this.dx* this.speed; 
            this.y -= this.dy* this.speed; 
        }

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
}