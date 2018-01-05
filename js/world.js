var zelda = zelda || {};

zelda.world = {
    
    init:function(){
        
        zelda.game.world.setBounds(512,1024,512,512);
        this.scale.setUserScale(2,2);
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE; //or SHOW_ALL
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
    },
    
    preload:function(){
        //walk spritesheets
        this.load.spritesheet('linkWalk_noShield','img/link_normal_walk_spritesheet.png',23.28,29); this.load.spritesheet('linkWalk_Shield','img/link_shield_walk_spritesheet.png',23.28,29);
        //attack spritesheets
        this.load.spritesheet('attack_front','img/link_ataque_basico_frontal_spritesheet.png',39.83,40);
        this.load.spritesheet('attack_right','img/link_ataque_basico_lateral_spritesheet.png',48,48);
        this.load.spritesheet('attack_back','img/link_ataque_basico_trasero_spritesheet.png',40,60);
        
        //bg
        //this.load.image('bg','img/fondoZelda.png');
        
        //hud
        this.load.spritesheet('HUD','img/HUD_2types.png',256,224);
        this.load.spritesheet('items','img/items.png',16,16); //empty, lampara, boomerang, bomba
        this.load.spritesheet('health','img/hearts.png',7,7,4,0,1);
        this.load.spritesheet('magicBar','img/magicMeter.png',8,2);
        this.load.image('hudNumbersFont','img/HUDnumbers.png');
        
        //inventari
        this.load.image('inventari','img/inventari.png');
        this.load.spritesheet('itemName','img/objecteSeleccionat_inventari.png',80,48); //lamp, bomb, boomerang, empty
        this.load.spritesheet('greenCircle_inv','img/cercleVerd.png',32,32);
        this.load.spritesheet('lampFire','img/lampFire.png',16,16);
        this.load.image('boomerang','img/boomerang.png');
        
        //Tilemap
        this.load.tilemap('exterior', 'EXTERIOR/exterior.json', null, Phaser.Tilemap.TILED_JSON);
        
        //Patrones tilemap
        //this.load.image('CasaLink_bush', 'EXTERIOR/patrones/CasaLink_bush.png');
        this.load.spritesheet('Bushes','EXTERIOR/patrones/Bushes.png',16,16);
        this.load.image('CasaLink_collisions', 'EXTERIOR/patrones/CasaLink_collisions.png');
        this.load.image('CasaLink_fondo', 'EXTERIOR/patrones/CasaLink_fondo.png');
        this.load.image('CasaLink_top', 'EXTERIOR/patrones/CasaLink_top.png');
        //this.load.image('Castillo_bush', 'EXTERIOR/patrones/Castillo_bush.png');
        //this.load.image('Castillo_collisions', 'EXTERIOR/patrones/Castillo_collisions.png');
        this.load.image('Castillo_fondo', 'EXTERIOR/patrones/Castillo_fondo.png');
        this.load.image('Castillo_top', 'EXTERIOR/patrones/Castillo_top.png');
        this.load.image('LateralCasa_fondo', 'EXTERIOR/patrones/LateralCasa_fondo.png');
        
               
    },
    
    create:function(){
        //this._bg = zelda.game.add.sprite(0,0,'bg');//----------------------------------------
        
        //Tilemap
        this.map = this.game.add.tilemap('exterior');
        //this.map.addTilesetImage('CasaLink_bush');
        this.map.addTilesetImage('CasaLink_collisions');
        this.map.addTilesetImage('CasaLink_fondo');
        this.map.addTilesetImage('CasaLink_top');
        //this.map.addTilesetImage('Castillo_bush');
        //this.map.addTilesetImage('Castillo_collisions');
        this.map.addTilesetImage('Castillo_fondo');
        this.map.addTilesetImage('Castillo_top');
        this.map.addTilesetImage('LateralCasa_fondo');
        
        this.walls = this.map.createLayer('collisions2');
        this.map.setCollisionBetween(4097 ,4097, true, 'collisions2');
        
        this.map.createLayer('fondo_layer');
        //this.map.createLayer('bushes');
        
        //Objetos del exterior
        this.objects = this.game.add.group();
        this.map.createFromObjects('bushes2', 85505, 'Bushes', 0, true, false, this.objects);
        console.log(this.objects.length);
        this.objects.forEach(function(obj){
            zelda.game.physics.arcade.enable(obj);
            obj.body.immovable = true;
            obj.state = 0; //0 = en suelo, 1 = recogido, 2 = lanzado
            ////////////////////////////////////////////////////
            obj.collider = zelda.game.add.sprite(0, 0, null);
            zelda.game.physics.arcade.enable(obj.collider);
            obj.collider.body.setSize(obj.width*0.75, obj.height*0.75, obj.x+obj.width*0.125, obj.y+obj.height*0.125);
            obj.collider.body.immovable = true;
            ////////////////////////////////////////////////////
        }, this);
        
        
        //Link
        this.link = new zelda.link_prefab(this.game, (256+512-64),(256+1024+16), this);
        this.game.add.existing(this.link);
        
        this.map.createLayer('top');//Pinta la layer top por encima de link
        
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
        //this.link.events.onEnterBounds.add(this.changeZone,this);
        
        this.space = zelda.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //--------------------------------
        //inventari
        this.enter = zelda.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.showInventari = false;
        this.INVENTORY = this.game.add.group();
        this.inventory_bg = this.INVENTORY.create(0,-224,'inventari');
        this.INVENTORY.fixedToCamera = true;
        this.greenCircle = this.INVENTORY.create(32-8,79-224-8,'greenCircle_inv');
//        this.greenCircle.anchor.setTo(0.5);
        this.greenCircle.animations.add('intermitent',[0,1],2,true);
        this.greenCircle.animations.play('intermitent');
        this.circleIndex = 0;
        this.lampInv = this.INVENTORY.create(32,79-224,'items',1);
        this.boomerangInv = this.INVENTORY.create(56,31-224,'items',3);
        this.bombInv = this.INVENTORY.create(104,31-224,'items',2);     
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.itemNameInv = this.INVENTORY.create(168,15-224,'itemName',3);
        
        
    },
    
    update:function(){
        
        if(this.space.isDown && this.space.downDuration(1)){
            console.log(this.camera.position);
            
            
        }
            this.changeZone();
            this.setHudValues();
            this.HUD.frame = Number(this.HUD.isInDungeon);

            //inventari
            this.inventoryManager();
        
    },
    
    setHudValues:function(){ //set magic bar, item Selected, number of rupies etc, hp...
        //item
//        this.item.frame = 0;//this.link.itemSelected;
        
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
        var newLinkZone;
        var boundsRect = this.world.bounds;
        
        
        //comprova outOfBounds
        if(this.link.top <= boundsRect.y){
            console.log("top collides");
            this.link.canMove = false;
            this.camera.target = null;
            this.world.setBounds(0,0,1024,1536);
            this.game.add.tween(this.camera)
                        .to({y: this.camera.y-224},1000,null,true)
                        .onComplete.add(function() {
                            arguments[0].follow(this.link);
                            this.link.canMove = true;
                            this.world.setBounds(0,0,1024,1024);
                        },this,this.link);
            this.game.add.tween(this.link).to({y: this.link.y-this.link.height},500,null,true,200);
        }
        else if(this.link.bottom >= boundsRect.y+boundsRect.height){
            console.log("bot collides");
            this.link.canMove = false;
            this.camera.target = null;
            this.world.setBounds(0,0,1024,1536);
            this.game.add.tween(this.camera)
                        .to({y: this.camera.y+224},1000,null,true)
                        .onComplete.add(function() {
                            arguments[0].follow(this.link);
                            this.link.canMove = true;
                            if(this.link.x <512) zelda.game.world.setBounds(0,1024,512,512);
                            else zelda.game.world.setBounds(512,1024,512,512);                            
                        },this,this.link);
            this.game.add.tween(this.link).to({y: this.link.y+this.link.height},500,null,true,200);
        }
        else if(this.link.right>= boundsRect.x+boundsRect.width){
            console.log("right collides");
            this.link.canMove = false;
            this.camera.target = null;
            this.world.setBounds(0,0,1024,1536);
            this.game.add.tween(this.camera)
                        .to({x: this.camera.x+256},1000,null,true)
                        .onComplete.add(function() {
                            arguments[0].follow(this.link);
                            this.link.canMove = true;
                            this.world.setBounds(512,1024,512,512);
                        },this,this.link);
            this.game.add.tween(this.link).to({x: this.link.x+this.link.width},500,null,true,200);
        }
        else if(this.link.left <= boundsRect.x){
            console.log("left collides");
            this.link.canMove = false;
            this.camera.target = null;
            this.world.setBounds(0,0,1024,1536);
            this.game.add.tween(this.camera)
                        .to({x: this.camera.x-256},1000,null,true)
                        .onComplete.add(function() {
                            arguments[0].follow(this.link);
                            this.link.canMove = true;
                            this.world.setBounds(0,1024,512,512);
                        },this,this.link);
            this.game.add.tween(this.link).to({x: this.link.x-this.link.width},500,null,true,200);
        }
        
    },
    
    inventoryManager:function(){
//        if(this.link.itemSelected == null) this.greenCircle.visible=false;
//        else this.greenCircle.visible = true;
        
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
        
        //events de teclat
        if(this.showInventari){
            if(this.link.itemsAvailable.length >0){
                if(this.cursors.right.isDown && this.cursors.right.downDuration(1)){
                    this.circleIndex ++;
                    if(this.circleIndex == 3) this.circleIndex = 0;
                    this.greenCircle.animations.stop();
                    this.greenCircle.animations.play('intermitent');
                }
                if(this.cursors.left.isDown && this.cursors.left.downDuration(1)){
                    this.circleIndex --;
                    if(this.circleIndex == -1) this.circleIndex = 2;
                    this.greenCircle.animations.stop();
                    this.greenCircle.animations.play('intermitent');
                }
                
                switch(this.circleIndex){
                    case 0:
                        this.greenCircle.x = this.lampInv.x-8;
                        this.greenCircle.y = this.lampInv.y-8;
                        if(this.enter.isDown && this.enter.downDuration(1)){
                            this.link.itemSelected = "lamp";
                            this.item.frame = 1;
                        }
                        this.itemNameInv.frame = 0;
                        
                        break;
                    case 1:
                        this.greenCircle.x = (this.boomerangInv.x-8);
                        this.greenCircle.y = (this.boomerangInv.y-8);
                        if(this.enter.isDown && this.enter.downDuration(1)) {
                            this.link.itemSelected = "bomb";
                            this.item.frame = 3;
                        }
                        this.itemNameInv.frame = 1;
                        break;
                    case 2:
                        this.greenCircle.x = (this.bombInv.x-8);
                        this.greenCircle.y = (this.bombInv.y-8);
                        if(this.enter.isDown && this.enter.downDuration(1)) {
                            this.link.itemSelected = "boomerang";
                            this.item.frame = 2;
                        }
                        this.itemNameInv.frame = 2;
                        break;
                }
            }
        }
    }
    
};
