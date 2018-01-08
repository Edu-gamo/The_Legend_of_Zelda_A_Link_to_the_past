var zelda = zelda || {};

zelda.link_prefab = function(game, x, y, level){
    
    Phaser.Sprite.call(this, game, x, y, 'linkWalk_noShield');
    this.anchor.setTo(.5);
    
    game.physics.arcade.enable(this);
    //this.body.collideWorldBounds = true;
    this.body.setSize(this.width-6, this.height/2-4, 3, this.height/2+1);
    
    this.direction = 3; //front=3,back=10,right=17,left=24;
    this.hasWeapon = false;
    this.attacking = false;
    this.itemSelected = null; //lamp, boomerang, bomb
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
    this.invulnerable = false;
    
    
    //game.load.spritesheet('linkWalk_Shield','img/link_shield_walk_spritesheet.png',23.28,29);
    if(this.hasWeapon) this.loadTexture('linkWalk_Shield'); //canviarho a un overlap amb les armes
    
    this.animations.add('linkWalk_front',[0,1,2,3,4,5,6,5,4,3,2,1],30,true);
    this.animations.add('linkWalk_back',[7,8,9,10,11,12,13,12,11,10,9,8],30,true);
    this.animations.add('linkWalk_right',[14,15,16,17,18,19,20,19,18,17,16,15],30,true);
    this.animations.add('linkWalk_left',[21,22,23,24,25,26,27,26,25,24,23,22],30,true);
    this.animations.add('voltesAlMorir',[3,24,10,17,3,24,10,17,3,24,10,17,3,24,10,17],5);
    
//    this.deathSpriteAux = game.add.sprite(-50,-50,'linkWalk_noShield');
//    this.deathSpriteAux.animations.add('voltesAlMorir',[3,24,10,17,3,24,10,17,3,24,10,17,3,24,10,17],5);
    
    this.falling = false; //animation flag when exit
    
    this.game = game;
    this.level = level
    
    //items...
    this.isBoomerangReady = true;
    this.boomerang;
    this.boomerangReturning = false;
    
    game.camera.follow(this,Phaser.Camera.FOLLOW_LOCKON);
    
    //INPUT
    this.cursors = game.input.keyboard.createCursorKeys();
    this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z); //interactuar
    this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X); //atacar
    this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A); //mapa
    this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S); //item
    
    this.canGetObject = true;
    this.canMove = true; //para forzar que link no se pueda mover (pausa)
    
    //audio
    this.attackSound = game.add.audio('attackSound',gameOptions.volume);
    this.lampSound = game.add.audio('lampSound',gameOptions.volume);
    this.menuCursorSound = game.add.audio('menuCursor',gameOptions.volume);
    this.pauseOpenSound = game.add.audio('openInventory',gameOptions.volume);
    this.pauseCloseSound = game.add.audio('closeInventory',gameOptions.volume);
    this.boomerangSound = game.add.audio('boomerangSound',gameOptions.volume,true);
    this.getHitSound = game.add.audio('linkHurt',gameOptions.volume);
    this.grabObjectSound = game.add.audio('grabObjectSound',gameOptions.volume);
    this.throwObjectSound= game.add.audio('throwObjectSound',gameOptions.volume);
    this.linkDyingSound = game.add.audio('linkDyingSound',gameOptions.volume);
    
};

zelda.link_prefab.prototype = Object.create(Phaser.Sprite.prototype);
//zelda.link_prefab.prototype.constructor = zelda.link_prefab;

zelda.link_prefab.prototype.update = function(){
    
    //use item
    if(this.sKey.isDown && this.sKey.downDuration(1)&&this.canMove){
        this.useItem();
    }
    if(this.boomerangReturning){
        var boomLinkDist = new Phaser.Point(this.centerX-this.boomerang.x,this.centerY-this.boomerang.y);
        if(boomLinkDist.getMagnitude() < 10){
            this.boomerang.destroy();
            this.isBoomerangReady = true;
            this.boomerangReturning = false;
            this.boomerangSound.stop();
            
        }else{
            boomLinkDist.normalize();
            boomLinkDist.multiply(4,4);
            this.boomerang.x += boomLinkDist.x;
            this.boomerang.y += boomLinkDist.y;
        }
    }
    
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
        if(((this.zKey.isDown && this.zKey.downDuration(1)) || (this.xKey.isDown && this.xKey.downDuration(1))) && this.object != null && this.object.state == 1){
            this.throwObject();
            this.canGetObject = false;
        }else if(this.xKey.isDown && this.xKey.downDuration(1)){
            this.attack();
        }
    }

    //Collide with walls
    this.game.physics.arcade.collide(this, this.level.walls);

    //Collide with objects
    this.game.physics.arcade.overlap(this, this.level.objects, function(link, object){
        if(object.state == 0){
            switch(link.direction){
                case 3:
                    if(object.body.hitTest(link.x, link.y+link.height/2)){
                        link.getObject(object);
                    }
                    break;
                case 10:
                    if(object.body.hitTest(link.x, link.y-link.height/4)){
                        link.getObject(object);
                    }
                    break;
                case 17:
                    if(object.body.hitTest(link.x+link.width/2, link.y)){
                        link.getObject(object);
                    }
                    break;
                case 24:
                    if(object.body.hitTest(link.x-link.width/2, link.y)) {
                        link.getObject(object);
                    }
                    break;
            }
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
    this.game.physics.arcade.overlap(this, this.level.exit, function(link, exit){
        //zelda.game.state.start('world');
        if(this.level == zelda.world){
            if(!this.falling){
                this.falling = true;
                this.visible = false;
                var fallSprite = this.game.add.sprite(exit.centerX,exit.centerY,'fall_entrance');
                fallSprite.anchor.setTo(0.5);
                var fallAnim = fallSprite.animations.add('fall_anim',[0,1,2,3,4],4,false);
                fallAnim.onComplete.add(function(){ exit.go(); },this);
                fallSprite.animations.play('fall_anim');
            }
        }else{
//            console.log('toWorld');
            exit.go();
        }
        
        
        
    },null, this);
        
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
    this.die();
    if(this.canMove){
        this.attacking = true;
        this.body.velocity.setTo(0, 0);
        this.animations.stop(true);
        this.visible = false;
        this.attackSound.play();

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
        
        switch(this.direction){ //Crea un area de ataque dependiendo de la direccion
            case 3:
                this.attackArea = this.addChild(this.game.add.sprite(this.x-this.width/4, this.y+this.height/2.5, null));
                this.game.physics.arcade.enable(this.attackArea);
                this.attackArea.body.setSize(this.width/2, this.height/3);
                break;
            case 10:
                this.attackArea = this.addChild(this.game.add.sprite(this.x-this.width/4, this.y-this.height/2.5, null));
                this.game.physics.arcade.enable(this.attackArea);
                this.attackArea.body.setSize(this.width/2, this.height/2.25);
                break;
            case 17:
                this.attackArea = this.addChild(this.game.add.sprite(this.x+this.width/3, this.y+this.height/12, null));
                this.game.physics.arcade.enable(this.attackArea);
                this.attackArea.body.setSize(this.width/2, this.height/3);
                break;
            case 24:
                this.attackArea = this.addChild(this.game.add.sprite(this.x-this.width/1.25, this.y+this.height/12, null));
                this.game.physics.arcade.enable(this.attackArea);
                this.attackArea.body.setSize(this.width/2, this.height/3);
                break;
        }
        //this.game.debug.body(this.attackArea);
        
        //Destruye los objetos que esten dentro del area de ataque
        this.game.physics.arcade.overlap(this.attackArea, this.level.objects, function(link, object){
            link.parent.generatePickup(object.x+object.width/2,object.y+object.height/2);
            object.kill();
        });
        
    }
}

zelda.link_prefab.prototype.generatePickup = function(posX, posY){
    var item = zelda.game.rnd.between(0,19);
    if(item >= 1 && item<=5){
        rupee = new zelda.rupee_prefab(this.game, posX, posY, this.level);
        this.game.add.existing(rupee);
    }
    else if(item >=6 && item <=7){
        heart = new zelda.heart_prefab(this.game, posX, posY, this.level);
        this.game.add.existing(heart);
    }
    else if(item == 8){
        powder = new zelda.magicPowder_prefab(this.game, posX, posY, this.level);
        this.game.add.existing(powder);
    }
}

zelda.link_prefab.prototype.throwObject = function(){
    if(this.canMove){
        this.object.state = 2;
        this.throwObjectSound.play();

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

zelda.link_prefab.prototype.getObject = function(object){
    if(this.zKey.isDown && this.zKey.downDuration(1) && this.object == null && this.canGetObject){
        this.object = object;
        object.state = 1;
        object.bringToTop();
        object.frame = 1;
        this.grabObjectSound.play();
        this.generatePickup(object.x+object.width/2,object.y+object.height/2);
    }
}

zelda.link_prefab.prototype.useItem = function(){
    //this.itemSelected = null; //lamp=1, boomerang=2, bomb=3
    var magicCost;
    if(!this.attacking && this.object == null){
        if (this.itemSelected == 'lamp'){
            magicCost = 2;
            if(this.magic >= magicCost){
                this.magic -= magicCost;
                
                var flameSprite = this.game.add.sprite(this.centerX, this.centerY, 'lampFire');
                flameSprite.anchor.setTo(.5);
                // 3fonrt,10back,17rght,24 left
                var fireSpriteSeparation = 19;
                if(this.direction==3) flameSprite.y += fireSpriteSeparation;
                if(this.direction==10) flameSprite.y -= fireSpriteSeparation;
                if(this.direction==17) flameSprite.x += fireSpriteSeparation;
                if(this.direction==24) flameSprite.x -= fireSpriteSeparation;
                flameSprite.animations.add('fireAnim',[0,1,2]);
                flameSprite.animations.play('fireAnim',7,false,true);
                
                this.lampSound.play();
                //llum
                //encen antorches
                
            }
        }
        if(this.itemSelected == 'boomerang'){
            if(this.isBoomerangReady){
                this.isBoomerangReady = false;
                this.boomerang = this.game.add.sprite(this.centerX,this.centerY,'boomerang');
                this.boomerang.anchor.setTo(.5);
                this.game.physics.arcade.enable(this.boomerang);
                this.boomerangSound.play();
//                boomerang.scale.setTo(0.8);
                boomerangTweenRotation = this.game.add.tween(this.boomerang);
                boomerangTweenRotation.to({angle: this.boomerang.angle + 360}, 600,null,true, 0,-1);
                boomerangTweenPosition = this.game.add.tween(this.boomerang);
                if(this.direction==3) boomerangTweenPosition.to({y: this.boomerang.y +100},450,null, true,10);
                if(this.direction==10) boomerangTweenPosition.to({y: this.boomerang.y -100},450,null, true,10);
                if(this.direction==17) boomerangTweenPosition.to({x: this.boomerang.x +100},450,null, true,10);
                if(this.direction==24) boomerangTweenPosition.to({x: this.boomerang.x -100},450,null, true,10);
                boomerangTweenPosition.onComplete.add(function() {
                            this.boomerangReturning = true;
                        },this);
                
            }
            
        }
    }
}

zelda.link_prefab.prototype.getHit = function(enemy){
    this.health = this.health-enemy.damage;//perd vida
    this.getHitSound.play(); //sound
    if(this.health <= 0){
        this.die();
    }else{
        this.invulnerable = true;
        //tween fade with bucle
        fadeTween = this.game.add.tween(this);
        fadeTween.to({alpha: 0},100,null,true,0,5,true);
        fadeTween.onComplete.addOnce(function(){ this.invulnerable = false;},this);

    //    knockbackTween = this.game.add.tween(this);
    //    knockbackTween.to({x: this.x-50},150,null,true);
    //    knockbackTween.onUpdateCallback(function(){
    //        this.game.physics.arcade.overlap(this, this.level.walls,function(a,b){knockbackTween.stop();});
    //        this.game.physics.arcade.overlap(this, this.level.objects, function(a, b){knockbackTween.stop();});
    //    },this);

        //move colliding
    }
}

zelda.link_prefab.prototype.die = function(){
//    this.animations.stop();
//    this.visible = false;
//    this.deathSpriteAux.x = this.x;
//    this.deathSpriteAux.y = this.y;
//    this.deathSpriteAux.anchor.setTo(.5);
//    this.deathSpriteAux.animations.play('voltesAlMorir',10);
    this.animations.play('voltesAlMorir',10);
    console.log(this.animations.currentAnim.isPlaying);
    
    this.linkDyingSound.play();

//    var deathSprite = this.game.add.sprite(this.centerX,this.centerY,'link_death');
//    deathSprite.visible =false;
//    deathSprite.anchor.setTo(.5);
//    var deathAnim = deathSprite.animations.add('link_dying',[0,1],2);
//    deathAnim.onComplete.add(function(){
//        this.reset((256+512-64),(256+1024+16));
//        this.health = this.hearts*2;
//    },this);
    
    
//    onComplete.add(function(){
//            this.visible = false;
//        deathSprite.visible = true;
//            deathSprite.animations.play('link_dying');
//        },this);
}