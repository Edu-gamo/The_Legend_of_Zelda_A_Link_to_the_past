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
        
        //inventari
        this.load.image('inventari','img/inventari.png');
        this.load.spritesheet('itemName','img/objecteSeleccionat_inventari.png',80,48); //lamp, bomb, boomerang, empty
        
        
               
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
        this.space = zelda.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //--------------------------------
        //inventari
        this.enter = zelda.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.showInventari = false;
        this.INVENTORY = this.game.add.group();
        this.inventory_bg = this.INVENTORY.create(0,-224,'inventari');
        //this.bombInventory = this.INVENTORY.create(0,0,'items',3); //s'ha de crear i afegir a INVENTORY quan té una bomba
        //this.lampInventory = this.INVENTORY.create(0,0,'items',1);
        //this.boomerangInventory = this.INVENTORY.create(0,0,'items',2);
        this.INVENTORY.fixedToCamera = true;
        
    },
    
    update:function(){
        
        if(this.space.isDown && this.space.downDuration(1)){
            console.log(this.camera.position);
            
            
        }
        if(this.changingZone){
            //this.camera.x -= 1; //moure la camara a on toqui
            //al cap de un segon{ camera.follow i world.setBounds}
        }else{
            this.setHudValues();
            this.HUD.frame = Number(this.HUD.isInDungeon);

            //inventari
            if(this.enter.isDown && this.enter.downDuration(1) && !this.game.tweens.isTweening(this.HUD)){
                
                if(!this.showInventari){
                    this.link.canMove = false;
                    this.showInventari = true;                    
                    //desattach el hud de la camara
                    this.HUD.fixedToCamera = false;
                    this.INVENTORY.fixedToCamera = false;

                    //tween de l'inventari i hud
                    this.game.add.tween(this.HUD).to({y: this.HUD.y+224},gameOptions.inventariSpeed,null,true);
                    this.game.add.tween(this.INVENTORY).to({y: this.HUD.y+224},gameOptions.inventariSpeed,null,true);
                    
                    //tween on complete inputs de l'inventari
                }
                else if(this.showInventari){
                    //tween de l'inventari i hud
                    this.game.add.tween(this.HUD)
                        .to({y: this.HUD.y-224},gameOptions.inventariSpeed,null,true)
                        .onComplete.add(function() {
                            arguments[0].fixedToCamera = true;
                            this.showInventari = false;
                            this.link.canMove = true;
                        },this,this.showInventari,this.link);
                  
                    this.game.add.tween(this.INVENTORY)
                        .to({y: this.HUD.y-224},gameOptions.inventariSpeed,null,true)
                        .onComplete.add(function() {
                            arguments[0].fixedToCamera = true;
                        });


                }
            }
        }
    },
    
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
        //this.imageFromFont = this.game.add.image(65, 24, this.fontItemsDisplay);
        //this.imageFromFont.fixedToCamera = true;
        
    },
    
    changeZone:function(){
        
                    
//            this.game.add.tween(this.camera)
//                        .to({x: this.camera.x-20},1000,null,true)
//                        .onComplete.add(function() {
//                            //arguments[0].fixedToCamera = true;
//                        });
        
        //console.log("out of bounds");
        //this.changingZone = true;
        this.link.canMove = false;
        this.camera.target = null;
//        this.camera.setBoundsToWorld();
        this.world.setBounds(0,0,1024,1536);
        
        
        if(this.link.position.y < 1024) {
            this.link.zone = 2;
            console.log("hola");
            //moure la camara
            this.game.add.tween(this.camera)
                        .to({y: this.camera.y-224},1000,null,true)
                        .onComplete.add(function() {
                            arguments[0].follow(this.link);
                            this.link.canMove = true;
                            this.world.setBounds(0,0,1024,1024);
                        },this,this.link);
        }
        else if(this.link.position.x < 512){
            this.link.zone = 1;
            //moure la camara
        }
        else{ 
            this.link.zone = 0;
            //moure la camara
            this.link.canMove = true;
            this.camera.target =this.link;
        }
        
        

        //aixo fora
        if(this.link.zone == 0){
            zelda.game.world.setBounds(512,1024,512,512);
        }
        if(this.link.zone == 1){
            zelda.game.world.setBounds(0,1024,512,512);
        }
//        if(this.link.zone == 2){
//            zelda.game.world.setBounds(0,0,1024,1024);
//        }
    }
    
};
