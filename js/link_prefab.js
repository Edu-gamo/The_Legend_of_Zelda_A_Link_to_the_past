var zelda = zelda || {};

zelda.link_prefab = function(game, x, y, level){
    
    Phaser.Sprite.call(this, game, x, y, 'linkWalk_noShield');
    
    this.anchor.setTo(.5);
    this.scale.setTo(2);
    
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    
    this.direction = 3; //front=3,back=10,right=17,left=24;
    this.hasWeapon = false;
    this.attacking = false;
    //if(this.hasWeapon) this.loadTexture('linkWalk_Shield');
    
    this.animations.add('linkWalk_front',[0,1,2,3,4,5,6,5,4,3,2,1],30,true);
    this.animations.add('linkWalk_back',[7,8,9,10,11,12,13,12,11,10,9,8],30,true);
    this.animations.add('linkWalk_right',[14,15,16,17,18,19,20,19,18,17,16,15],30,true);
    this.animations.add('linkWalk_left',[21,22,23,24,25,26,27,26,25,24,23,22],30,true);
    
    this.level = level
    
};

zelda.link_prefab.prototype = Object.create(Phaser.Sprite.prototype);
zelda.link_prefab.prototype.constructor = zelda.link_prefab;

zelda.link_prefab.prototype.update = function(){
    
    /*
    //Collide with walls
    this.game.physics.arcade.collide(this, this.level.walls);
    
    //Collide with objects
    this.game.physics.arcade.collide(this, this.level.objects);
    */
    
}

zelda.link_prefab.prototype.movement = function(cursors){
    
    //Vertical Axis Movement
    if(cursors.down.isDown){
        this.body.velocity.y = gameOptions.linkSpeed;
        if(this.body.velocity.x == 0 || this.direction == 10) this.direction = 3;
    } else if(cursors.up.isDown){
        this.body.velocity.y = -gameOptions.linkSpeed;
        if(this.body.velocity.x == 0 || this.direction == 3) this.direction = 10;
    }else{
        this.body.velocity.y = 0;
    }
    
    //Horizontal Axis Movement
    if(cursors.right.isDown){
        this.body.velocity.x = gameOptions.linkSpeed;
        if(this.body.velocity.y == 0 || this.direction == 24) this.direction = 17;
    }else if(cursors.left.isDown){
        this.body.velocity.x = -gameOptions.linkSpeed;
        if(this.body.velocity.y == 0 || this.direction == 17) this.direction = 24;
    }else{
        this.body.velocity.x = 0;
    }
    
    //No movement
    if(this.body.velocity.x == 0 && this.body.velocity.y == 0){
        this.frame = this.direction;
    }else{
        //Play animations
        switch(this.direction){
            case 3:
                this.animations.play('linkWalk_front');
                break;
            case 10:
                this.animations.play('linkWalk_back');
                break;
            case 17:
                this.animations.play('linkWalk_right');
                break;
            case 24:
                this.animations.play('linkWalk_left');
                break;
        }
    }
    
}