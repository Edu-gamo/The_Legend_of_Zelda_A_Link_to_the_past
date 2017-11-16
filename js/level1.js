var zelda = zelda || {};

zelda.level1 = {
    
    init:function(){
        
        this.game.world.setBounds(0, 0, gameOptions.gameWidth, gameOptions.gameHeight);
        
    },
    
    preload:function(){
        
        //background
        this.load.image('bg','img/link_house.png');
        
        //walk spritesheets
        this.load.spritesheet('linkWalk_noShield','img/link_normal_walk_spritesheet.png',23.28,29);
        this.load.spritesheet('linkWalk_Shield','img/link_shield_walk_spritesheet.png',23.28,29);
        
        //house objects
        this.load.image('mesa','img/mesa.png');
        this.load.image('silla','img/silla.png');
        this.load.image('gerro','img/gerro.png');
        this.load.image('cofre','img/cofre.png');
        
    },
    
    create:function(){
        
        //Bg
        bg = zelda.game.add.sprite(0,0,'bg');
        bg.scale.setTo(2);
        
        /*//Link
        link = zelda.game.add.sprite(0,0,'linkWalk_noShield',3);
        //link.anchor.setTo(.5);
        link.scale.setTo(2);
        zelda.game.physics.arcade.enable(link);
        link.direction = 3; //front=3,back=10,right=17,left=24;
        link.hasWeapon = false;
        link.attacking = false;
        if(link.hasWeapon) link.loadTexture('linkWalk_Shield'); //una condicion con callback
        link.animations.add('linkWalk_front',[0,1,2,3,4,5,6,5,4,3,2,1],30,true);
        link.animations.add('linkWalk_back',[7,8,9,10,11,12,13,12,11,10,9,8],30,true);
        link.animations.add('linkWalk_right',[14,15,16,17,18,19,20,19,18,17,16,15],30,true);
        link.animations.add('linkWalk_left',[21,22,23,24,25,26,27,26,25,24,23,22],30,true);*/

        
        //control keys
        //cursors = zelda.game.input.keyboard.createCursorKeys();
        //xKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.X);
        //xKey.onDown.add(zelda.level1.xKeyPressed,this);
        
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
        
    },
    
    update:function(){
        
        
        
    }
    
};