var zelda = zelda || {};

zelda.world = {
    
    init:function(){
        
        zelda.game.world.setBounds(512,1024,512,512);
        this.scale.setUserScale(2,2);
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE; //or SHOW_ALL
        
        
        
    },
    
    preload:function(){
        //walk spritesheets
        this.load.spritesheet('linkWalk_noShield','img/link_normal_walk_spritesheet.png',23.28,29); this.load.spritesheet('linkWalk_Shield','img/link_shield_walk_spritesheet.png',23.28,29);
        //attack spritesheets
        this.load.spritesheet('attack_front','img/link_ataque_basico_frontal_spritesheet.png',39.83,40);
        this.load.spritesheet('attack_right','img/link_ataque_basico_lateral_spritesheet.png',40,60);
        this.load.spritesheet('attack_back','img/link_ataque_basico_trasero_spritesheet.png',40,60);
        
        //bg
        this.load.image('bg','img/fondoZelda.png');
        
        //hud
        this.load.spritesheet('HUD','img/HUD_2types.png',256,224);
        this.load.spritesheet('items','img/items.png',16,16); //empty, lampara, boomerang, bomba
        this.load.spritesheet('health','img/hearts.png',7,7,4,0,1);
        this.load.spritesheet('magicBar','img/magicMeter.png',8,2);
        this.load.image('hudNumbersFont','img/HUDnumbers.png');
        
        
               
    },
    
    create:function(){
        this._bg = zelda.game.add.sprite(0,0,'bg');//----------------------------------------
        //Link
        this.link = new zelda.link_prefab(this.game, (256+512-64),(256+1024+16), this);
        this.game.add.existing(this.link);
        
        //HUD
        this.HUD = this.game.add.group();
        this.hud_bg = this.HUD.create(0,0,'HUD',0);
        this.hud_bg.isInDungeon = false;
        this.item = this.HUD.create(40,23,'items',0);
        this.healthDisplay = this.game.add.group();
        //Here we'll create 10 of them evenly spaced apart
        for (var i = 0; i < 10; i++){
            //  Create a heart inside of the 'health' group
            //var heart = 
            this.healthDisplay.create(i*8+161, 24, 'health',0);
        }
        this.HUD.add(this.healthDisplay);
        this.magicBar = this.game.add.group();
        for (var i = 0; i < 16; i++){
            //  Create a piece of magic inside of the 'magicBar' group
            //var magicPortion = 
            this.magicBar.create(24, 53-i*2, 'magicBar',0);
        }
        this.HUD.add(this.magicBar);
        this.fontItemsDisplay = this.game.add.retroFont('hudNumbersFont',7,7,'0123456789',5,1,1);
        this.imageFromFont = this.game.add.image(65, 24, this.fontItemsDisplay);
        this.HUD.add(this.imageFromFont);
        this.HUD.fixedToCamera = true;
        
        //------------------------------TESTING---------------------------------
        this.link.checkWorldBounds=true;
        this.link.events.onOutOfBounds.add(this.changeZone,this,0);
        this.link.zone = 0; //0 = house, 1 = left, 2 = castle
        this.changingZone = false;
        //--------------------------------
        //inventari
        this.enter = zelda.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.showInventari = false;
        
    },
    
    update:function(){
       
        if(this.changingZone){
            //this.camera.x -= 1; //moure la camara a on toqui
            //al cap de un segon{ camera.follow i world.setBounds}
        }else{
            this.setHudValues();
            this.HUD.frame = Number(this.HUD.isInDungeon);

            //inventari
            if(this.enter.isDown && this.enter.downDuration(1) /*&& hud.isTweening = false*/){
                this.showInventari = !this.showInventari;
                console.log(this.showInventari);
                if(this.showInventari){
                    //pause

                    //desattach el hud de la camara
                    this.HUD.fixedToCamera = false;

                    //tween de l'inventari i hud
                    this.game.add.tween(this.HUD).to({y: this.HUD.y+224},200,null,true);
                    //inventari--> this.game.add.tween();
                    //tween on complete inputs de l'inventari
                }
                if(!this.showInventari){
                    //tween de l'inventari i hud
                    var hudTween = this.game.add.tween(this.HUD).to({y: this.HUD.y-224},200,null,true);
                    //resume on complete
                    hudTween.onComplete.add(function() {
                        arguments[0].fixedToCamera = true;
                    });



                }
            }
        }
    },
    
    /*xKeyPressed:function(){
        if(!link.attacking){
        link.attacking = true;
        
        if(link.direction == 3){
            linkA_front = zelda.game.add.sprite(link.body.center.x,link.body.center.y,'attack_front');
            //linkA_front.scale.setTo(2);
            linkA_front.anchor.setTo(.5);
            atckAnim_front = linkA_front.animations.add('shortAttack',[0,1,2,3,4,5]);
            linkA_front.animations.play('shortAttack',50,false, true);
            atckAnim_front.onComplete.add(zelda.level1.endAttack, this);
        } else if(link.direction == 10){ 
            linkA_back = zelda.game.add.sprite(link.body.center.x,link.body.center.y,'attack_back');
            //linkA_back.scale.setTo(2);
            linkA_back.anchor.setTo(.5);
            atckAnim_back = linkA_back.animations.add('shortAttack',[0,1,2,3,4,5,6,7,8]);
            linkA_back.animations.play('shortAttack',50,false,true);
            atckAnim_back.onComplete.add(zelda.level1.endAttack, this);
        } else{
            linkA_right = zelda.game.add.sprite(link.body.center.x,link.body.center.y,'attack_right');
            linkA_right.anchor.setTo(.5);
            atckAnim_right = linkA_right.animations.add('shortAttack',[0,1,2,3,4,5,6,7,8]);
            atckAnim_right.onComplete.add(zelda.level1.endAttack, this);
            if(link.direction == 17){
                //linkA_right.scale.setTo(2);
                linkA_right.animations.play('shortAttack',50,false,true);
            }else if(link.direction == 24){
                linkA_right.scale.setTo(-1,1);
                linkA_right.animations.play('shortAttack',50,false,true);
            }
        } 
        }
        
        //afegir un boolean que pari la velocity: true quan entra aqui, false quan s'acaba l'animacio
        //calculate attack hitbox
        
    },
    
    endAttack:function(){
        link.attacking = false;
        link.visible = true;
    },*/
    
    setHudValues:function(){ //set magic bar, item Selected, number of rupies etc, hp...
        //item
        this.item.frame = 1//;this.link.itemSelected;
        
        //health
        for(var i = 0; i < this.healthDisplay.children.length; ++i){
            if(i < this.link.hearts){//pinta algun cor
                if(i < this.link.health/2){
                    this.healthDisplay.children[i].frame = 0;
                    if(this.link.health%2 != 0){ //health is odd
                        if(i+1 == (this.link.health+1)/2){
                            this.healthDisplay.children[i].frame = 1;
                        }
                    }
                }else{
                    this.healthDisplay.children[i].frame = 2;
                }
            }else{
                this.healthDisplay.children[i].frame = 3;//no cor
            } 
        }
        
        //magic bar
        for(var i = 0; i < this.magicBar.children.length; ++i){
            if(i < this.link.magic){
                if(i == this.link.magic-1){
                    this.magicBar.children[i].frame = 0;
                }else{
                    this.magicBar.children[i].frame = 1;
                }
            }else{
                this.magicBar.children[i].frame = 2;
            }
        }
        
        
        //Number of objects (count)
        //rupees
        var auxString = String(this.link.rupees);
        while(auxString.length < 3) auxString = '0'+auxString;
        this.fontItemsDisplay.text = auxString;
        //bombs
        auxString = String(this.link.bombs);
        while(auxString.length < 2) auxString = '0'+auxString;
        this.fontItemsDisplay.text += (' ' +auxString);
        //Arrows
        auxString = String(this.link.arrows);
        while(auxString.length < 2) auxString = '0'+auxString;
        this.fontItemsDisplay.text += (' ' +auxString);
        //Keys
        if(this.hud_bg.isInDungeon){
            auxString = String(this.link.keys);
            this.fontItemsDisplay.text += (' ' +auxString);
        }
        this.fontItemsDisplay.customSpacingX = 1;
        this.imageFromFont = this.game.add.image(65, 24, this.fontItemsDisplay);
        //i.fixedToCamera = true;
        
    },
    
    changeZone:function(){
        //console.log("out of bounds");
        //this.changingZone = true;
        this.link.body.velocity.set(0);
        //this.camera.unfollow();
        
        if(this.link.position.y < 1024) {
            this.link.zone = 2;
            //moure la camara
            //for(var i = 0; i < 300; ++i) this.camera.y -= 1;
        }
        else if(this.link.position.x < 512){
            this.link.zone = 1;
            //moure la camara
        }
        else{ 
            this.link.zone = 0;
            //moure la camara
        }
        
        
        
        
        //aixo fora
        if(this.link.zone == 0){
            zelda.game.world.setBounds(512,1024,512,512);
        }
        if(this.link.zone == 1){
            zelda.game.world.setBounds(0,1024,512,512);
        }
        if(this.link.zone == 2){
            zelda.game.world.setBounds(0,0,1024,1024);
        }
    }
    
};
