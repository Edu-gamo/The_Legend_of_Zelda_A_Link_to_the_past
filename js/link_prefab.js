var zelda = zelda || {};

zelda.link_prefab = function(game, x, y, level){
    
    Phaser.Sprite.call(this, game, x, y, 'linkWalk_noShield');
    this.anchor.setTo(.5);
    
    game.physics.arcade.enable(this);
    //this.body.collideWorldBounds = true;
    this.body.setSize(this.width, this.height/2, 0, this.height/2);
    
    this.direction = 3; //front=3,back=10,right=17,left=24;
    this.hasWeapon = false;
    this.attacking = false;
    this.itemSelected = null; //lamp=1, boomerang=2, bomb=3
    this.itemsAvailable = ["lamp","boomerang","bomb"]; //bomb, lamp, boomerang
    this.hearts = 3;
    this.health = 6; //cada enter es mig cor
    this.magic = 16; //de 0 a 16
    this.rupees = 0;
    this.bombs = 0;
    this.arrows = 0;
    this.keys = 0;
    this.object = null; //objeto recogido del entorno
    this.throwForce = 150; //velocidad con la que lanza el objeto
    
    //game.load.spritesheet('linkWalk_Shield','img/link_shield_walk_spritesheet.png',23.28,29);
    if(this.hasWeapon) this.loadTexture('linkWalk_Shield'); //canviarho a un overlap amb les armes
    
    this.animations.add('linkWalk_front',[0,1,2,3,4,5,6,5,4,3,2,1],30,true);
    this.animations.add('linkWalk_back',[7,8,9,10,11,12,13,12,11,10,9,8],30,true);
    this.animations.add('linkWalk_right',[14,15,16,17,18,19,20,19,18,17,16,15],30,true);
    this.animations.add('linkWalk_left',[21,22,23,24,25,26,27,26,25,24,23,22],30,true);
    
    //this.game = game;
    this.level = level
    
    game.camera.follow(this,Phaser.Camera.FOLLOW_LOCKON);
    
    //INPUT
    this.cursors = game.input.keyboard.createCursorKeys();
    this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z); //interactuar
    this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X); //atacar
    this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A); //mapa
    this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S); //inventari
    
    this.canGetObject = true;
    this.canMove = true; //para forzar que link no se pueda mover (pausa)
    
};

zelda.link_prefab.prototype = Object.create(Phaser.Sprite.prototype);
//zelda.link_prefab.prototype.constructor = zelda.link_prefab;

zelda.link_prefab.prototype.update = function(){
    
    if(this.zKey.isUp) this.canGetObject = true;

    if(this.object != null){
        if(this.object.state == 1){
            this.object.position.setTo(this.position.x-this.object.width/2, this.position.y-this.height);
        }else if(Math.abs(this.object.x - this.x)+Math.abs(this.object.y - this.y) > this.width*4){
            //Pintar efecto de destruccion
            this.object.kill();
            this.object = null;
        }
    }

    if(!this.attacking){
        this.movement();
        if(((this.zKey.isDown && this.zKey.downDuration(1)) || (this.xKey.isDown && this.xKey.downDuration(1))) && this.object != null){
            this.throwObject();
            this.canGetObject = false;
        }else if(this.xKey.isDown && this.xKey.downDuration(1)){
            this.attack();
        }
    }

    //Collide with walls
    this.game.physics.arcade.collide(this, this.level.walls);

    //Collide with objects
    //this.game.physics.arcade.collide(this, this.level.objects);
    this.game.physics.arcade.overlap(this, this.level.objects, function(link, object){
        if(object.state == 0){
            if(link.zKey.isDown && link.zKey.downDuration(1) && link.object == null && link.canGetObject){
                link.object = object;
                object.state = 1;
                object.bringToTop();
                object.frame = 2;
            }/*else{
                zelda.game.physics.arcade.collide(link, object);
            }*/
            zelda.game.physics.arcade.collide(link, object.collider);
        }
    });

    //Collide with cofres
    this.game.physics.arcade.overlap(this, this.level.cofres, function(link, cofre){
        if(link.zKey.isDown && link.zKey.downDuration(1) && link.canGetObject){
            cofre.frame = 1;
        }
        zelda.game.physics.arcade.collide(link, cofre.collider);
    });

    //Overlap with exit
    this.game.physics.arcade.overlap(this, this.level.exit, function(){
        zelda.game.state.start('world');
    });
        
}

zelda.link_prefab.prototype.movement = function(){
    if(this.canMove){
        
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

    }else{//canMove =false
        this.body.velocity.set(0);
        this.frame = this.direction;
    }
}

zelda.link_prefab.prototype.attack = function(){
    if(this.canMove){
        this.attacking = true;
        this.body.velocity.setTo(0, 0);
        this.animations.stop(true);
        this.visible = false;

        var sprAttack;

        switch(this.direction){
            case 3:
                sprAttack = this.game.add.sprite(this.centerX,this.centerY,'attack_front');
                break;

            case 10:
                sprAttack = this.game.add.sprite(this.centerX,this.centerY,'attack_back');
                break;

            case 17:
            case 24:
                sprAttack = this.game.add.sprite(this.centerX,this.centerY,'attack_right');
                break;

        }
        sprAttack.anchor.setTo(.5);
        var animAttack = this.direction == 3 ? sprAttack.animations.add('shortAttack',[0,1,2,3,4,5]) : sprAttack.animations.add('shortAttack',[0,1,2,3,4,5,6,7,8]);

        if(this.direction == 24) sprAttack.scale.x *= -1;
        //sprAttack.anchor.setTo(.5);
        sprAttack.animations.play('shortAttack',50,false, true);
        animAttack.onComplete.add(function(){
            this.attacking = false;
            this.visible = true;
        }, this);
    }
}

zelda.link_prefab.prototype.throwObject = function(){
    if(this.canMove){
        this.object.state = 2;

        switch(this.direction){
            case 3: //front=3
                this.object.body.velocity.setTo(0,this.throwForce);
                break;
            case 10: //back=10
                this.object.body.velocity.setTo(0,-this.throwForce);
                break;
            case 17: //right=17
                this.object.body.velocity.setTo(this.throwForce,0);
                break;
            case 24: //left=24
                this.object.body.velocity.setTo(-this.throwForce,0);
                break;
        }

        //this.object = null;
    }
}