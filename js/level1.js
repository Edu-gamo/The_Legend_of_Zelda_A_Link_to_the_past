var zelda = zelda || {};

zelda.level1 = {
    
    init:function(){
        
        this.game.world.setBounds(-200, -200, gameOptions.gameWidth+200, gameOptions.gameHeight+200); //depen del fondo
        
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
        this.load.image('gerro','img/gerro.png');
        this.load.image('cofre','img/cofre.png');
        
        //this.load.image('bg', 'cuadroOtono.jpg'); //mapa fondo
        
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
        bg.scale.setTo(2);
        
        //house level
        //s = silla. m = mesa, c = cofre, g=gerro
        this.level = [
            'XXXXXXXXXXXXX',
            'Xg          X',
            'Xg          X',
            'Xg          X',
            'X           X',
            'X           X',
            'X           X',
            'X           X',
            'X           X',
            'X           X',
            'XXXXXXXXXXXXX'           
        ];
        
        //Link prefab
        this.link = new zelda.link_prefab(this.game, 100, 100, this);
        this.game.add.existing(this.link);
        
        //HUD
        this.HUD = this.game.add.sprite(0,0,'HUD',0);
        this.HUD.scale.setTo(2);
        this.HUD.fixedToCamera = true;
        this.HUD.isInDungeon = false;
        this.HUD.item = this.game.add.sprite(40*2,23*2,'items',0);
        this.HUD.item.fixedToCamera = true;
        this.HUD.item.scale.setTo(2);
        this.HUD.health = this.game.add.group();
        this.HUD.health.fixedToCamera = true;
        //Here we'll create 10 of them evenly spaced apart
        for (var i = 0; i < 10; i++){
            //  Create a heart inside of the 'health' group
            var heart = this.HUD.health.create(i*16+161*2, 24*2, 'health',0);
            heart.scale.setTo(2);
        }
        this.HUD.magicBar = this.game.add.group();
        this.HUD.magicBar.fixedToCamera = true;
        for (var i = 0; i < 16; i++){
            //  Create a piece of magic inside of the 'magicBar' group
            var magicPortion = this.HUD.magicBar.create(24*2, 53*2-i*4, 'magicBar',0);
            magicPortion.scale.setTo(2);
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
        var i = this.game.add.image(65*2, 24*2, this.HUD.font);
        i.scale.setTo(2);
        i.fixedToCamera = true;
        
    }
    
};