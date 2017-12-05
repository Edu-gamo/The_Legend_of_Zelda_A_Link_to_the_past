var zelda = zelda || {};

zelda.level1 = {
    
    init:function(){
        
        this.game.world.setBounds(-200, -200, gameOptions.gameWidth+200, gameOptions.gameHeight+200); //depen del fondo
        
        this.scale.setUserScale(2,2);
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE; //or SHOW_ALL
        
    },
    
    preload:function(){
        
        //background
        this.load.image('bg','img/link_house.png');
        
        //walk spritesheets
        this.load.spritesheet('linkWalk_noShield','img/link_normal_walk_spritesheet.png',23.28,29);
        this.load.spritesheet('linkWalk_Shield','img/link_shield_walk_spritesheet.png',23.28,29);
        
        //attack spritesheets
        zelda.game.load.spritesheet('attack_front','img/link_ataque_basico_frontal_spritesheet.png',39.83,40);
        zelda.game.load.spritesheet('attack_right','img/link_ataque_basico_lateral_spritesheet.png',40,60);
        zelda.game.load.spritesheet('attack_back','img/link_ataque_basico_trasero_spritesheet.png',40,60);
        
        //house objects
        this.load.image('mesa','img/mesa.png');
        this.load.image('silla','img/silla.png');
        /*this.load.image('gerro','img/gerro.png');
        this.load.image('cofre','img/cofre.png');*/
        this.load.image('cama','img/cama.png');
        
        zelda.game.load.spritesheet('gerro','img/spr_gerro.png',16,16);
        zelda.game.load.spritesheet('cofre','img/spr_cofre.png',16,16);
        
        this.load.image('wall','img/invisible_wall.png');
        
        //HUD sprites
        this.load.spritesheet('HUD','img/HUD_2types.png',256,224);
        this.load.spritesheet('items','img/items.png',16,16); //empty, lampara, boomerang, bomba
        this.load.spritesheet('health','img/hearts.png',7,7,4,0,1);
        this.load.spritesheet('magicBar','img/magicMeter.png',8,2);
        this.load.image('hudNumbersFont','img/HUDnumbers.png');
        
    },
    
    create:function(){
        
        //Bg
        bg = zelda.game.add.sprite(0,0,'bg');
        //bg.scale.setTo(2);
        
        //house level
        //s = silla, m = mesa pequeña, M = mesa grande, c = cofre, g=gerro, X = muro, L i R = muro puerta, e = exit
        this.level = [
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
                        this.exit.add(out);
                        break;
                }
            }
        }
        
        //Link prefab
        this.link = new zelda.link_prefab(this.game, 100, 50, this);
        this.game.add.existing(this.link);
        
        //HUD
        this.HUD = this.game.add.sprite(0,0,'HUD',0);
        this.HUD.fixedToCamera = true;
        this.HUD.isInDungeon = false;
        this.HUD.item = this.game.add.sprite(40,23,'items',0);
        this.HUD.item.fixedToCamera = true;
        //this.HUD.item.scale.setTo(2);
        this.HUD.health = this.game.add.group();
        this.HUD.health.fixedToCamera = true;
        //Here we'll create 10 of them evenly spaced apart
        for (var i = 0; i < 10; i++){
            //  Create a heart inside of the 'health' group
            var heart = this.HUD.health.create(i*8+161, 24, 'health',0);
            //heart.scale.setTo(2);
        }
        this.HUD.magicBar = this.game.add.group();
        this.HUD.magicBar.fixedToCamera = true;
        for (var i = 0; i < 16; i++){
            //  Create a piece of magic inside of the 'magicBar' group
            var magicPortion = this.HUD.magicBar.create(24, 53-i*2, 'magicBar',0);
        }
        this.HUD.font = this.game.add.retroFont('hudNumbersFont',7,7,'0123456789',5,1,1);
        
    },
    
    update:function(){
        this.setHudValues();
        this.HUD.frame = Number(this.HUD.isInDungeon);
        
    },
    setHudValues:function(){ //set magic bar, item Selected, number of rupies etc, hp...
        //item
        this.HUD.item.frame = this.link.itemSelected;
        
        //health
        for(var i = 0; i < this.HUD.health.children.length; ++i){
            if(i < this.link.hearts){//pinta algun cor
                if(i < this.link.health/2){
                    this.HUD.health.children[i].frame = 0;
                    if(this.link.health%2 != 0){ //health is odd
                        if(i+1 == (this.link.health+1)/2){
                            this.HUD.health.children[i].frame = 1;
                        }
                    }
                }else{
                    this.HUD.health.children[i].frame = 2;
                }
            }else{
                this.HUD.health.children[i].frame = 3;//no cor
            } 
        }
        
        //magic bar
        for(var i = 0; i < this.HUD.magicBar.children.length; ++i){
            if(i < this.link.magic){
                if(i == this.link.magic-1){
                    this.HUD.magicBar.children[i].frame = 0;
                }else{
                    this.HUD.magicBar.children[i].frame = 1;
                }
            }else{
                this.HUD.magicBar.children[i].frame = 2;
            }
        }
        
        //Number of objects (count)
        //rupees
        var auxString = String(this.link.rupees);
        while(auxString.length < 3) auxString = '0'+auxString;
        this.HUD.font.text = auxString;
        //bombs
        auxString = String(this.link.bombs);
        while(auxString.length < 2) auxString = '0'+auxString;
        this.HUD.font.text += (' ' +auxString);
        //Arrows
        auxString = String(this.link.arrows);
        while(auxString.length < 2) auxString = '0'+auxString;
        this.HUD.font.text += (' ' +auxString);
        //Keys
        if(this.HUD.isInDungeon){
            auxString = String(this.link.keys);
            this.HUD.font.text += (' ' +auxString);
        }
        this.HUD.font.customSpacingX = 1;
        var i = this.game.add.image(65, 24, this.HUD.font);
        //i.scale.setTo(2);
        i.fixedToCamera = true;
        
    }
    
};