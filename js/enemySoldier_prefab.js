var zelda = zelda || {}

zelda.enemySoldier_prefab = function(game, x, y, level){
    
    Phaser.Sprite.call(this, game, x, y, 'enemySoldier');
    this.anchor.setTo(.5);
    
    this.level = level;
    this.game = game;
    this.damage = 2;
    this.state = 'search'; //'wander','search','follow'
    this.direction = 'front';
    this.speedWalk = 40;
    this.speedRun = 60; //multiplicador
    this.endMovement = false;
    this.stateTimer = 0;
    
    game.physics.arcade.enable(this);
    this.body.setSize(this.width-2, this.height/2, 1, this.height/2);
    
//    ANIMATIONS
    this.animations.add('moveFront',[0,1],3,true);//mes frames/segon
    this.animations.add('moveRight',[4,5],3,true);
    this.animations.add('moveLeft',[8,9],3,true);
    this.animations.add('moveBack',[12,13],3,true);
    
    this.animations.add('searchFront',[1,2,2,1,3,3],4,true); //no loop per onComplete?
    this.animations.add('searchRight',[5,6,6,5,7,7],4,true); //menys frames/segon
    this.animations.add('searchLeft',[9,10,10,9,11,11],4,true);
    this.animations.add('searchBack',[13,14,14,13,15,15],4,true);    
//    this.animations.add('death')
    

//    SOUND
    this.sprintSound = game.add.audio('enemySprintSound',gameOptions.volume);
    //so hit, run, death
    
};

zelda.enemySoldier_prefab.prototype = Object.create(Phaser.Sprite.prototype);
zelda.enemySoldier_prefab.prototype.constructor = zelda.enemySoldier_prefab;

zelda.enemySoldier_prefab.prototype.update = function(){
    
    //Collision
    this.game.physics.arcade.collide(this, this.level.walls,function(a,b){a.endMovement = true;});
    this.game.physics.arcade.collide(this, this.level.objects,function(a,b){a.endMovement = true;});
    
//    console.log(this.state);
    var distance = new Phaser.Point(this.level.link.centerX-this.centerX, this.level.link.centerY-this.centerY);
    var dirVec = this.dirVecFromString();
    var dotValue = (new Phaser.Point()).copyFrom(dirVec).dot(distance);
    
    if(distance.getMagnitude() < 80 && dotValue >= 0 && this.state != 'follow'){
        this.state = 'follow';
        this.endMovement = true;
        this.stateTimer = 0;
        this.sprintSound.play();
    }
    if(distance.getMagnitude() > 90 && this.state == 'follow'){
        this.state = 'search';
        this.body.velocity = new Phaser.Point(0,0);
        
    }
    //States
    switch(this.state){
        case 'wander':
            if(this.direction == 'front') this.animations.play('moveFront');
            if(this.direction == 'right') this.animations.play('moveRight');
            if(this.direction == 'left') this.animations.play('moveLeft');
            if(this.direction == 'back') this.animations.play('moveBack');
            this.stateTimer++;
            if(this.stateTimer > 120) this.endMovement = true;
            if(this.endMovement){
                this.state = 'search';
                this.stateTimer = 0;
                this.body.velocity = new Phaser.Point(0,0);
            }
            break;
        case 'search':
            if(this.direction == 'front') this.animations.play('searchFront');
            if(this.direction == 'right') this.animations.play('searchRight');
            if(this.direction == 'left') this.animations.play('searchLeft');
            if(this.direction == 'back') this.animations.play('searchBack');
            this.stateTimer++;
            if(this.stateTimer >= 160) {
                this.state = 'wander';
                var randomN = this.game.rnd.between(0,3);
                if(randomN == 0) {this.body.velocity = new Phaser.Point(0,this.speedWalk); this.direction ='front';}
                else if(randomN == 1) {this.body.velocity = new Phaser.Point(0,-this.speedWalk); this.direction = 'back';}
                else if(randomN == 2) {this.body.velocity = new Phaser.Point(this.speedWalk,0); this.direction = 'right';}
                else if(randomN == 3) {this.body.velocity = new Phaser.Point(-this.speedWalk,0); this.direction = 'left';}
                this.endMovement = false;
                this.stateTimer = 0;
            }
            break;
        case 'follow':
            this.body.velocity = new Phaser.Point(distance.normalize().x*this.speedRun,distance.normalize().y*this.speedRun);
//            console.log(this.body.velocity);
            if(Math.abs(this.body.velocity.x >= Math.abs(this.body.velocity.y))){
                if(this.body.velocity.x >= 0) {this.animations.play('moveRight');}
                else {this.animations.play('moveLeft');} //esto no lo hace nose porque
            }
            else{
                if(this.body.velocity.y >= 0) this.animations.play('moveFront');
                else {this.animations.play('moveBack');}
            }
            break;
        case 'hit':
            break;
    }
    
    this.game.physics.arcade.overlap(this,this.level.link,
        function(soldier,link){
            if(!link.invulnerable) link.getHit(soldier);
        });
}

zelda.enemySoldier_prefab.prototype.dirVecFromString = function(){
    var direction = new Phaser.Point();
    switch(this.direction){
        case 'front':
            return direction.add(0,1);
            break;
        case 'right':
            return direction.add(1,0);
            break;
        case 'left':
            return direction.add(-1,0);
            break;
        case 'back':
            return direction.add(0,-1);
            break;
        default:
            console.log('Wrong direction string');
    }
}
