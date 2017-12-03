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
        zelda.game.load.video('introScreen','img/introVideo.mp4');
        
    },
    
    create:function(){
        menuState ='main'; //'select', 'register'
        
        //controls
        cursors = zelda.game.input.keyboard.createCursorKeys();
        enter = zelda.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        space = zelda.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        zKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        xKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.X);
        aKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.A);
        sKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.S);
        
        enter.onDown.add(zelda.menu.changeMenuScreen,this);
        
        //main screen and intro
        this.intro = this.game.add.video('introScreen');
        //var introSprite = this.intro.addToWorld(this.game.width/2, this.game.height/2,0.5,0.5,0.5,0.5);
        var introSprite = this.intro.addToWorld(this.game.width/2, this.game.height/2,0.5,0.5,0.35,0.35);
        this.intro.play(true);
    },
    
    update:function(){
        switch(menuState){
            case 'main':                
                //if(key pressed) goTo SELECT;
                break;
            case 'select':
                this.intro.stop();
                bg_img = zelda.game.add.image(0,0,'playerSelection');
                //bg_img.scale.setTo(2);
                break;
            case 'register':
                bg_img = zelda.game.add.image(0,0,'playerRegister');
                //bg_img.scale.setTo(2);
                break;
            case 'game':
                zelda.game.state.start('level1');
                break;
        }
        
        
    },
    
    changeMenuScreen:function(){
        if(menuState == 'main') menuState = 'select';
        else if (menuState == 'select') menuState = 'register';
        else if(menuState == 'register') menuState = 'game';
    }
    
};