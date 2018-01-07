var zelda = zelda || {};

zelda.level1 = {
    
    init:function(){
        
        this.game.world.setBounds(-200, -200, gameOptions.gameWidth+200, gameOptions.gameHeight+200); //depen del fondo
        
        this.scale.setUserScale(2,2);
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE; //or SHOW_ALL
        
    },
    
    preload:function(){
        
        //background
        //this.load.image('bg','img/link_house.png');
        
        //walk spritesheets
        this.load.spritesheet('linkWalk_noShield','img/link_normal_walk_spritesheet.png',23.28,29);
        this.load.spritesheet('linkWalk_Shield','img/link_shield_walk_spritesheet.png',23.28,29);
        
        //attack spritesheets
        zelda.game.load.spritesheet('attack_front','img/link_ataque_basico_frontal_spritesheet.png',39.83,40);
        zelda.game.load.spritesheet('attack_right','img/link_ataque_basico_lateral_spritesheet.png',48,48);
        zelda.game.load.spritesheet('attack_back','img/link_ataque_basico_trasero_spritesheet.png',40,60);
        
        //house objects
        //this.load.image('mesa','img/mesa.png');
        //this.load.image('silla','img/silla.png');
        /*this.load.image('gerro','img/gerro.png');
        this.load.image('cofre','img/cofre.png');*/
        //this.load.image('cama','img/cama.png');
        
        //zelda.game.load.spritesheet('gerro','img/spr_gerro.png',16,16);
        //zelda.game.load.spritesheet('cofre','img/spr_cofre.png',16,16);
        
        //this.load.image('wall','img/invisible_wall.png');
        
        //HUD sprites
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
        this.load.tilemap('casa_link', 'Interior_CasaLink/casa_link.json', null, Phaser.Tilemap.TILED_JSON);
        
        //Patrones tilemap
        this.load.spritesheet('Exit','Interior_CasaLink/patrones/Exit.png',16,16);
        this.load.spritesheet('spr_cofre','Interior_CasaLink/patrones/spr_cofre.png',16,16);
        this.load.spritesheet('spr_gerro','Interior_CasaLink/patrones/spr_gerro.png',16,16);
        this.load.image('Collision','Interior_CasaLink/patrones/Collision.png');
        this.load.image('fondo', 'Interior_CasaLink/patrones/fondo.png');
        
        //pickups
        this.load.spritesheet('rupeePickup','img/rupeePickup.png',8,16);
        
        //audio
        zelda.game.load.audio('attackSound','audio/LTTP_Sword1.wav');
        zelda.game.load.audio('rupeeSound','audio/LTTP_Rupee1.wav');
        zelda.game.load.audio('itemSound','audio/LTTP_Item.wav');
        
    },
    
    create:function(){
        
        //Bg
        //bg = zelda.game.add.sprite(0,0,'bg');
        //bg.scale.setTo(2);
        
        //house level
        //s = silla, m = mesa pequeña, M = mesa grande, c = cofre, g=gerro, X = muro, L i R = muro puerta, e = exit
        /*this.level = [
            'XXXXXXXXXXXXX',
            'Xgc         X',
            'Xg       s  X',
            'Xg      M   X',
            'X           X',
            'X        s CX',
            'X m         X',
            'X           X',
            'XXXXXL RXXXXX',
            '     eee     '
        ];
        
        this.exit = this.game.add.group();
        this.walls = this.game.add.group();
        this.objects = this.game.add.group();
        this.cofres = this.game.add.group();
        for(var i = 0; i < this.level.length; i++){
            for(var j = 0; j < this.level[i].length; j++){
                switch(this.level[i][j]){
                    case 'X':
                        wall = this.game.add.sprite(16*j+8, 16*i+8, 'wall');
                        //wall.scale.setTo(2);
                        this.game.physics.arcade.enable(wall);
                        wall.body.immovable = true;
                        this.walls.add(wall);
                        break;
                    case 'L':
                        wall = this.game.add.sprite(16*j+8, 16*i+8, 'wall');
                        wall.scale.x = 0.5
                        this.game.physics.arcade.enable(wall);
                        wall.body.immovable = true;
                        this.walls.add(wall);
                        break;
                    case 'R':
                        wall = this.game.add.sprite(16*j+16, 16*i+8, 'wall');
                        wall.scale.x = 0.5
                        this.game.physics.arcade.enable(wall);
                        wall.body.immovable = true;
                        this.walls.add(wall);
                        break;
                    case 's':
                        silla = this.game.add.sprite(16*j+8, 16*i+8, 'silla');
                        //silla.scale.setTo(1.75);
                        this.game.physics.arcade.enable(silla);
                        silla.body.immovable = true;
                        this.walls.add(silla);
                        break;
                    case 'M':
                        mesa = this.game.add.sprite(16*j+8, 16*i+8, 'mesa');
                        //mesa.scale.setTo(1.75);
                        this.game.physics.arcade.enable(mesa);
                        mesa.body.immovable = true;
                        this.walls.add(mesa);
                        break;
                    case 'm':
                        mesa = this.game.add.sprite(16*j+8, 16*i+8, 'mesa');
                        mesa.scale.setTo(0.75);
                        this.game.physics.arcade.enable(mesa);
                        mesa.body.immovable = true;
                        this.walls.add(mesa);
                        break;
                    case 'c':
                        cama = this.game.add.sprite(16*j+12, 16*i+8, 'cama');
                        this.game.physics.arcade.enable(cama);
                        cama.body.setSize(cama.width*0.75, cama.height, 0+cama.width*0.125, 0);
                        cama.body.immovable = true;
                        this.walls.add(cama);
                        break;
                    case 'C':
                        cofre = this.game.add.sprite(16*j+8, 16*i+8, 'cofre');
                        //cofre.scale.setTo(1.75);
                        this.game.physics.arcade.enable(cofre);
                        cofre.body.immovable = true;
                        ////////////////////////////////////////////////////
                        cofre.collider = this.game.add.sprite(0, 0, null);
                        this.game.physics.arcade.enable(cofre.collider);
                        cofre.collider.body.setSize(cofre.width*0.75, cofre.height*0.75, cofre.x+cofre.width*0.125, cofre.y+cofre.height*0.125);
                        cofre.collider.body.immovable = true;
                        ////////////////////////////////////////////////////
                        this.cofres.add(cofre);
                        break;
                    case 'g':
                        gerro = this.game.add.sprite(16*j+8, 16*i+8, 'gerro');
                        //gerro.scale.setTo(2);
                        this.game.physics.arcade.enable(gerro);
                        gerro.body.immovable = true;
                        gerro.state = 0; //0 = en suelo, 1 = recogido, 2 = lanzado
                        ////////////////////////////////////////////////////
                        gerro.collider = this.game.add.sprite(0, 0, null);
                        this.game.physics.arcade.enable(gerro.collider);
                        gerro.collider.body.setSize(gerro.width*0.75, gerro.height*0.75, gerro.x+gerro.width*0.125, gerro.y+gerro.height*0.125);
                        gerro.collider.body.immovable = true;
                        ////////////////////////////////////////////////////
                        this.objects.add(gerro);
                        break;
                    case 'e':
                        out = this.game.add.sprite(16*j+8, 16*i+16, 'wall');
                        //out.scale.setTo(2);
                        this.game.physics.arcade.enable(out);
                        out.body.immovable = true;
                        out.go = function(){
                            zelda.game.state.start('world');
                        }
                        this.exit.add(out);
                        break;
                }
            }
        }*/
        
        //Tilemap
        this.map = this.game.add.tilemap('casa_link');
        this.map.addTilesetImage('Collision');
        this.map.addTilesetImage('fondo');
        
        this.walls = this.map.createLayer('collision');
        this.map.setCollisionBetween(566 ,566, true, 'collision');
        
        //Salida
        this.exit = this.game.add.group();
        this.map.createFromObjects('exit', 561, 'Exit', 0, true, false, this.exit);
        this.exit.forEach(function(out){
            zelda.game.physics.arcade.enable(out);
            out.body.immovable = true;
            out.go = function(){
                zelda.game.state.start('world');
            }
        }, this);
        
        this.map.createLayer('fondo');
        
        //Objetos
        this.objects = this.game.add.group();
        this.map.createFromObjects('objects', 564, 'spr_gerro', 0, true, false, this.objects);
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
        
        //Cofre
        this.cofres = this.game.add.group();
        this.map.createFromObjects('chests', 562, 'spr_cofre', 0, true, false, this.cofres);
        this.cofres.forEach(function(chest){
            this.game.physics.arcade.enable(chest);
            chest.body.immovable = true;
            ////////////////////////////////////////////////////
            chest.collider = this.game.add.sprite(0, 0, null);
            this.game.physics.arcade.enable(chest.collider);
            chest.collider.body.setSize(chest.width*0.75, chest.height*0.75, chest.x+chest.width*0.125, chest.y+chest.height*0.125);
            chest.collider.body.immovable = true;
            ////////////////////////////////////////////////////
        }, this);
        
        //Link prefab
        this.link = new zelda.link_prefab(this.game, 100, 50, this);
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
        
        //inventari
        this.enter = zelda.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.showInventari = false;
        this.INVENTORY = this.game.add.group();
        this.inventory_bg = this.INVENTORY.create(0,-224,'inventari');
        //this.bombInventory = this.INVENTORY.create(0,0,'items',3); //s'ha de crear i afegir a INVENTORY quan té una bomba
        //this.lampInventory = this.INVENTORY.create(0,0,'items',1);
        //this.boomerangInventory = this.INVENTORY.create(0,0,'items',2);
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
        this.setHudValues();
        this.HUD.frame = Number(this.HUD.isInDungeon);
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
    
    inventoryManager:function(){
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