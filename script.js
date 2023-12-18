canvas=document.getElementById("canvas1");
canvas.width=1250;
canvas.height=500;
context=canvas.getContext('2d');
class player{
    constructor(game){
        this.game=game;
        this.height=190;
        this.luckypointmax=1;
        this.luckypoint=0;
        this.levelup=false;
        this.levelupmaxtime=10000;
        this.leveluptime=0;
        this.width=120;
        this.x=25;
        this.y=0.3*this.game.height;
        this.miny=60;//this tells what is the limit of palyer to go to up 
        this.frameX=0;
        this.frameY=0;
        this.framemax=37;
        this.speed=5;
        this.collision=0;
        this.life=5;
        this.image=document.getElementById("player");
        this.score=0;
        this.enemyEscape=0;
        this.enemyEscapeMaxLimit=5;
        this.numberOfParticles=50;
        this.initalParticles=0;
    }
    draw(context){
        if(this.game.debug===true)context.strokeRect(this.x,this.y,this.width,this.height);
        context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,
            this.x,this.y,this.width,this.height);
    }
    update(deltatime){
        this.playermove();
        this.playercollision();
        this.levelupcheck(deltatime);
        this.checkDestruction();
    }
    playermove(){
        if(this.game.keys===-1)
            if((this.y+this.height)<this.game.height)
                this.y+=this.speed;
        if(this.game.keys===1)
            if(this.y>this.miny)
                this.y-=this.speed; 
        if(this.frameX<this.framemax)
            this.frameX++;
        else
            this.frameX=0;
    }
    playercollision(){
        this.game.enemy.enemies.forEach(enem=>{
            if(this.game.enemy.checkCollision(this,enem)){
                this.game.enemy.destroy(enem);
                if(enem.type==="whale")this.collision+=2;
                else this.collision++;
            }
        })
    }
    levelupcheck(deltatime){
        this.frameY=(this.levelup===true)?1:0;
        if(this.levelup===true){
            this.leveluptime+=deltatime;
        }
        if(this.leveluptime>=this.levelupmaxtime){
            this.speed-=3;
            this.leveluptime=0;
            this.levelup=false;
        }
        if(this.luckypoint>=this.luckypointmax){
            this.speed+=3;;
            this.levelup=true;
            this.luckypoint=0;
        }
    }
    checkDestruction(){
        if(this.collision>=this.life||this.enemyEscape>=this.enemyEscapeMaxLimit){
            this.game.gameover=true;
            this.selfDestroy();
            this.game.enemy.selfDestroy();
            this.game.start=false;
        }

    }
    selfDestroy(){
        while(this.initalParticles<this.numberOfParticles){
            this.game.particles.push(new particle(this.game,this.x,this.y,this.width,this.height))
            this.initalParticles++;
        }
    }
    initilize(){
        this.x=25;
        this.y=100;
        this.frameX=0;
        this.score=0;
        this.enemyEscape=0;
        this.collision=0;
        this.destroy=false;
        this.initalParticles=0;
    }
}
class bulletrem{
    constructor(game){
        this.game=game;
        this.x=50;
        this.y=40;
        this.width=5;
        this.height=20;
        this.bulletremaining=15;
        this.timer=500;
        this.bulletmax=20;
        this.time=0;
        this.imgBullet=document.getElementById("bullet");
    }
    draw(context){
        var i=0;
        for(i=0;i<this.bulletremaining;i++){
            context.drawImage(this.imgBullet,this.x+i*5,this.y,this.width,this.height); 
        }

    }
    update(deltatime){
        this.time+=deltatime;
        if(this.time>this.timer){
            this.time=0; 
            if(this.bulletremaining<this.bulletmax)
                this.bulletremaining++;
        }
    }
}
class bullet{
    constructor(game){
        this.game=game;
        this.levelup=(this.game.player.levelup===true)?true:false;
        this.shot=0;
        this.height=(this.game.player.levelup===true)?40:20;
        this.width=(this.game.player.levelup===true)?80:40;
        this.speed=(this.game.player.levelup===true)?14:7;
        this.x=this.game.player.x+this.game.player.width-35;
        this.y=this.game.player.y+25;
        this.imgBullet=document.getElementById("bullet");
    }
    update(){         
        this.x+=this.speed;
        this.game.bullets.forEach(bullet=>{
            if(bullet.x>this.game.width)this.game.bullets.splice(this.game.bullets.indexOf(bullet),1);
        })
    }
    draw(context){
        if(this.game.debug===true)context.strokeRect(this.x,this.y,this.width,this.height);
        context.drawImage(this.imgBullet,this.x,this.y,this.width,this.height); 
    }
    destroy(){
        this.game.bullets.splice(this.game.bullets.indexOf(this),1);
    }
}
class particle{
    constructor(game,x,y,width,height){
        this.game=game;
        this.image=document.getElementById("gears");
        this.x=x+0.5*width;
        this.y=y+0.5*height;
        this.size=50;
        this.imagesize=Math.random()*30+20;
        this.framex=Math.floor(Math.random()*3);
        this.framey=Math.floor(Math.random()*3);
        this.speedx=Math.floor(Math.random()*10)-5;
        this.speedy=Math.floor(Math.random()*10)-8;
        this.gravity=0.5;
        this.antigravity=(this.game.height-height)*0.03;
        this.angle=0;
        this.dangle=this.speedx*0.01;
    }
    update(){
        this.x+=this.speedx;
        this.y=this.y+this.gravity+this.speedy;
        this.gravity+=0.4;
        this.bouncing();
        if(this.y>this.game.height-90){
            this.destroy();
        }
        this.angle+=this.dangle;
    }
    draw(context){
        context.save();
        context.translate(this.x,this.y)
        context.rotate(this.angle);
        if(this.game.debug===true)context.strokeRect(this.x,this.y,this.imagesize,this.imagesize);
        context.drawImage(this.image,this.framex*this.size,this.framey*this.size,this.size,this.size,
            -0.5*this.size,-0.5*this.size,this.imagesize,this.imagesize);
        context.restore();    
    }
    bouncing(){
        if(this.y>=this.game.height-100){
            this.gravity=-this.antigravity;
            this.speedy=Math.random()*3;
            this.antigravity-=3;
        }
    }
    destroy(){
        this.game.particles.splice(this.game.particles.indexOf(this),1);
    }
}
class enemy{
    constructor(game){
        this.game=game;
        this.enemies=[];
        this.x=this.game.width;
        this.y=0;
        this.time=0;
        this.timeInterval=2000;
    }
    update(deltatime){
        this.time+=deltatime;
        if(this.time>this.timeInterval){
            this.time=0;
            this.addEnemy();
        }
        this.enemiesUpdate(deltatime);
        this.enemiesCheckDestroy();
        
    }
    draw(context){
        this.enemies.forEach(enemy=>{
            if(this.game.debug===true)context.strokeRect(enemy.x,enemy.y,enemy.width,enemy.height);
            context.drawImage(enemy.image,enemy.framex*enemy.width,enemy.framey*enemy.height,
                enemy.width,enemy.height,enemy.x,enemy.y,enemy.width,enemy.height);
        })
    }
    enemiesUpdate(deltatime){
        this.enemies.forEach(enemy=>{
            enemy.x-=enemy.speed;
            if(enemy.framex===enemy.framemax)
                enemy.framex=0
            else
                enemy.framex++;
        })
    }
    enemiesCheckDestroy(){
        this.enemies.forEach(enemy=>{
            this.game.bullets.forEach(bullet=>{
                if(this.checkCollision(bullet,enemy)){
                    bullet.destroy();
                    this.game.particles.push(new particle(this.game,enemy.x,enemy.y,enemy.width,enemy.height));
                    enemy.collision++;
                }
                if(bullet.levelup===true){
                    if(enemy.collision>=1){
                        this.destroy(enemy);
                        this.game.player.score++;
                    }
                }
            })
            if(enemy.collision>=enemy.collisionlimit){
                if(enemy.type==="lucky"){
                    if(enemy.level===0)this.game.bulletrem.bulletremaining=this.game.bulletrem.bulletmax;
                    else this.game.player.luckypoint++;
                }
                if(enemy.type==="whale")this.game.player.score++;
                this.destroy(enemy);
                this.game.player.score++;
            }
            if(enemy.x<-enemy.width){
                this.destroy(enemy);
                this.game.player.enemyEscape++;
            }
        })
    }

    addEnemy(){
        var x=Math.random();
        if(x<0.2)
            this.enemies.push(new enemy1());
        else if(x<0.4)
            this.enemies.push(new enemy2());
        else if(x<0.6)
            this.enemies.push(new drone());
        else if(x<0.8)
            this.enemies.push(new whale());
        else
            this.enemies.push(new lucky());
    }
    destroy(enemy){
        for(var i=0;i<enemy.numberOfParticles;i++){
            this.game.particles.push(new particle(this.game,enemy.x,enemy.y,enemy.width,enemy.height));
        }
        this.enemies.splice(this.enemies.indexOf(enemy),1);
    }
    checkCollision(rect1,rect2){
        return(rect1.y<rect2.y+rect2.height&&rect1.y+rect1.height>rect2.y
            &&rect1.x<rect2.x+rect2.width&&rect1.x+rect1.width>rect2.x);
    }
    selfDestroy(){
        var i;
        this.enemies.forEach(enemy=>{
            for(i=0;i<enemy.numberOfParticles;i++)
                this.game.particles.push(new particle(this.game,enemy.x,enemy.y,enemy.width,enemy.height));
                this.enemies=[];
        })
    }
}
class enemy1 extends enemy{
    constructor(){
        super(game);
        this.v=Math.random();
        if(this.v<0.5)this.y=this.v*this.game.height+this.game.player.miny;
        else this.y=this.v*this.game.height*0.7-this.game.player.miny;
        this.height=169;
        this.width=228;
        this.framex=0;
        this.framemax=37;
        this.framey=(this.v<0.3)?0:((this.v<0.6)?1:2);
        this.collision=0;
        this.collisionlimit=3;
        this.speed=3;
        this.image=document.getElementById("enemy1");
        this.numberOfParticles=3;
        this.type="enemy1";
    }
}
class enemy2 extends enemy{
    constructor(){
        super(game);
        this.v=Math.random();
        if(this.v<0.5)this.y=this.v*this.game.height+this.game.player.miny;
        else this.y=this.v*this.game.height*0.8-this.game.player.miny;
        this.width=213;
        this.height=165;
        this.framex=0;
        this.framemax=37;
        this.framey=(Math.random()>0.5)?0:1;
        this.collision=0;
        this.collisionlimit=3;
        this.speed=(this.framey==0)?2:3;
        this.image=document.getElementById("enemy2");
        this.numberOfParticles=3;
        this.type="enemy2";
    }
}
class drone extends enemy{
    constructor(){
        super(game);
        this.v=Math.random();
        if(this.v<0.5)this.y=this.v*this.game.height+this.game.player.miny;
        else this.y=this.v*this.game.height*0.8-this.game.player.miny;
        this.width=115;
        this.height=95;
        this.framex=0;
        this.framemax=37;
        this.framey=(Math.random()>0.5)?0:1;
        this.collision=0;
        this.collisionlimit=1;
        this.speed=(this.framey==0)?4:3;
        this.image=document.getElementById("drone");
        this.numberOfParticles=1;
        this.type="drone";
    }
}
class whale extends enemy{
    constructor(){
        super(game);
        this.v=Math.random();
        if(this.v<0.5)this.y=this.v*this.game.height+this.game.player.miny;
        else this.y=this.v*this.game.height*0.8-this.game.player.miny;
        this.width=400;
        this.height=227;
        this.framex=0;
        this.framemax=37;
        this.framey=0;
        this.collision=0;
        this.collisionlimit=10;
        this.speed=2;
        this.image=document.getElementById("whale");
        this.numberOfParticles=20;
        this.type="whale";
    }
}
class lucky extends enemy{
    constructor(){
        super(game);
        this.v=Math.random();
        if(this.v<0.5)this.y=this.v*this.game.height+this.game.player.miny;
        else this.y=this.v*this.game.height*0.7-this.game.player.miny;
        this.height=95;
        this.width=99;
        this.framex=0;
        this.framemax=37;
        this.framey=(this.v<0.3)?0:((this.v<0.6)?0:1);
        this.collision=0;
        this.collisionlimit=3;
        this.speed=3;
        this.image=document.getElementById("lucky");
        this.numberOfParticles=3;
        this.type="lucky";
        this.level=this.framey;
    }
}
class backGround{
    constructor(game){
        this.game=game;
        this.layers=[];
        this.particles=[];
        this.layer1=document.getElementById("layer1");
        this.layer2=document.getElementById("layer2");
        this.layer3=document.getElementById("layer3");
        this.layer4=document.getElementById("layer4");
        this.layers.push(new layer(this.game,this.layer1,0.2));
        this.layers.push(new layer(this.game,this.layer2,0.5));
        this.layers.push(new layer(this.game,this.layer3,1));
        this.layer4=new layer(this.game,this.layer4,1.5);
    }
    update(){
        this.layers.forEach(layer=>{
            layer.update();
        })
    }
    draw(context){
        this.layers.forEach(layer=>{
            layer.draw(context);
        })
    }

}
class layer{
    constructor(game,image,speed){
        this.game=game;
        this.image=image;
        this.speed=speed;
        this.x=0;
        this.y=0;
        this.framex=0;
        this.framey=0
    }
    update(){
        if(this.x<=(-this.image.width)){
          this.x=0;
       }
        this.x-=this.speed;
    }
    draw(context){
        context.drawImage(this.image,this.x,this.y,this.image.width,this.image.height);
        context.drawImage(this.image,this.x+this.image.width,this.y,this.image.width,this.image.height);
    }
}
