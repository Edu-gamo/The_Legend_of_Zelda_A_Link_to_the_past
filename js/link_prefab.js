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
    this.itemSelected = 0; //lantern=1, boomerang=2, bomb=3
    this.hearts = 3;
    this.health = 6; //cada enter es mig cor
    this.magic = 16; //de 0 a 16
    this.rupees = 0;
    this.bombs = 0;
    this.arrows = 0;
    this.keys = 0;
    
    //game.load.spritesheet('linkWalk_Shield','img/link_shield_walk_spritesheet.png',23.28,29);
    if(this.hasWeapon) this.loadTexture('linkWalk_Shield'); //canviarho a un overlap amb les armes
    
    this.animations.add('linkWalk_front',[0,1,2,3,4,5,6,5,4,3,2,1],30,true);
    this.animations.add('linkWalk_back',[7,8,9,10,11,12,13,12,11,10,9,8],30,true);
    this.animations.add('linkWalk_right',[14,15,16,17,18,19,20,19,18,17,16,15],30,true);
    this.animations.add('linkWalk_left',[21,22,23,24,25,26,27,26,25,24,23,22],30,true);
    
    //this.game = game;
    //this.level = level
    
    game.camera.follow(this,Phaser.Camera.FOLLOW_LOCKON);
    
    //INPUT
    this.cursors = game.input.keyboard.createCursorKeys();
    this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z); //interactuar
    this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X); //atacar
    this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A); //mapa
    this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S); //inventari
    
    
    
};

zelda.link_prefab.prototype = Object.create(Phaser.Sprite.prototype);
//zelda.link_prefab.prototype.constructor = zelda.link_prefab;

zelda.link_prefab.prototype.update = function(){
    
    /*
    //Collide with walls
    this.game.physics.arcade.collide(this, this.level.walls);
    
    //Collide with objects
    this.game.physics.arcade.collide(this, this.level.objects);
    */
    
    if(!this.attacking){
        this.movement();
        if(this.xKey.isDown && this.xKey.downDuration(1)) this.attack();
    }
}

zelda.link_prefab.prototype.movement = function(){
    
    //Vertical Axis Movement
    if(this.cursors.down.isDown){
        this.body.velocity.y = gameOptions.linkSpeed;
        if(this.body.velocity.x == 0 || this.direction == 10) this.direction = 3;
    } else if(this.cursors.up.isDown){
        this.body.velocity.y = -gameOptions.linkSpeed;
        if(this.body.velocity.x == 0 || this.direction == 3) this.direction = 10;
    }else{
        this.body.velocity.y = 0;
    }
    
    //Horizontal Axis Movement
    if(this.cursors.right.isDown){
        this.body.velocity.x = gameOptions.linkSpeed;
        if(this.body.velocity.y == 0 || this.direction == 24) this.direction = 17;
    }else if(this.cursors.left.isDown){
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

zelda.link_prefab.prototype.attack = function(){
    
    this.attacking = true;
    this.body.velocity.setTo(0, 0);
    this.animations.stop(true);
    this.visible = false;
    
    var sprAttack;
    
    switch(this.direction){
        case 3:
            sprAttack = this.game.add.sprite(this.body.center.x,this.body.center.y,'attack_front');
            break;
        
        case 10:
            sprAttack = this.game.add.sprite(this.body.center.x,this.body.center.y,'attack_back');
            break;
        
        case 17:
        case 24:
            sprAttack = this.game.add.sprite(this.body.center.x,this.body.center.y,'attack_right');
            break;
            
    }
    
    var animAttack = this.direction == 10 ? sprAttack.animations.add('shortAttack',[0,1,2,3,4,5,6,7,8]) : sprAttack.animations.add('shortAttack',[0,1,2,3,4,5]);
    sprAttack.scale.setTo(2);
    if(this.direction == 24) sprAttack.scale.x *= -1;
    sprAttack.anchor.setTo(.5);
    sprAttack.animations.play('shortAttack',50,false, true);
    animAttack.onComplete.add(function(){
        this.attacking = false;
        this.visible = true;
    }, this);
    
}