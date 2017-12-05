var zelda = zelda || {};

zelda.menu = {
    
    init:function(){
        
        this.scale.setUserScale(2,2);
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE; //or SHOW_ALL
        
    },
    
    preload:function(){
        zelda.game.load.image('mainMenu','img/mainMenu_image.png');
        zelda.game.load.image('playerSelection','img/playerSelectMenu_bg.png');
        zelda.game.load.image('playerRegister','img/registerMenu_bg.png');
        //intro video
        //zelda.game.load.video('introScreen','img/introVideo.mp4');
        
        //PLAYER SELECT SCREEN
        zelda.game.load.spritesheet('fairy','img/fada_menu.png',18,18);
        zelda.game.load.spritesheet('normal_walk_stand','img/link_normal_walk_spritesheet.png',23.28,29);
    },
    
    create:function(){
        menuState ='main'; //'select', 'register'
        this.bg_img = zelda.game.add.image(0,0,'mainMenu');
        //controls
        cursors = zelda.game.input.keyboard.createCursorKeys();
        enter = zelda.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        space = zelda.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        zKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        xKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.X);
        aKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.A);
        sKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.S);
        
        
        //main screen and intro
        //this.intro = this.game.add.video('introScreen');
        //var introSprite = this.intro.addToWorld(this.game.width/2, this.game.height/2,0.5,0.5,0.5,0.5);
        //var introSprite = this.intro.addToWorld(this.game.width/2, this.game.height/2,0.5,0.5,0.35,0.35);
        //this.intro.play(true);
        
        //SELECT PLAYER SCREEN
        this.selectScreenCreated = false;
        this.registerOption = 0; //0,1,2,3 o 4
        this.fairy = zelda.game.add.sprite(0,0,'fairy');
        this.fairy.animations.add('fly',null,10,true);
        this.fairy.play('fly');
        this.fairy.visible = false;
        this.indicadorDePartidaGuardada_link = zelda.game.add.sprite(-50,-50,'normal_walk_stand');
        this.indicadorDePartidaGuardada_link.frame = 3;
        //this.indicadorDePartidaGuardada_link.visible = false;
    },
    
    update:function(){
        switch(menuState){
            case 'main':
                if(enter.isDown && enter.downDuration(1)){
                    menuState = 'select';
                    bg_img = zelda.game.add.image(0,0,'playerSelection');
                }
                break;
            case 'select':
                //this.intro.stop();
                if(!this.selectScreenCreated){ //"Start"
                    this.fairy.visible = true;
                    this.fairy.bringToTop();
                    this.fairy.x = 28;
                    this.fairy.y = 70;
                    
                    //this.indicadorDePartidaGuardada_link.x = true;
                    this.selectScreenCreated = true;
                }else{ //"update"
                    //moures entre les opcions
                    if(cursors.up.isDown && cursors.up.downDuration(1)){
                        this.registerOption -= 1;
                        if(this.registerOption < 0) this.registerOption = 4;
                    }else if(cursors.down.isDown && cursors.down.downDuration(1)){
                        this.registerOption += 1;
                        if(this.registerOption > 4) this.registerOption = 0;
                    }
                    this.placeFairyIndicator(); //moure fada
                    
                    if(enter.isDown && enter.downDuration(1)){
                        
                        menuState = 'register';
                        bg_img = zelda.game.add.image(0,0,'playerRegister');
                    }
                }
                
                break;
            case 'register':
                if(enter.isDown && enter.downDuration(1)){
                    
                    zelda.game.state.start('level1');
                }
                
                break;
        }
        
        
    },
    
    placeFairyIndicator(){
        //moure fada
        
        if(this.registerOption == 0){
            this.fairy.y = 70;
        }
        if(this.registerOption == 1){
            this.fairy.y = 102;
        }if(this.registerOption == 2){
            this.fairy.y = 134;
        }if(this.registerOption == 3){
            this.fairy.y = 174;
        }
        if(this.registerOption == 4){
            this.fairy.y = 190;
        }
    }
    
    
};