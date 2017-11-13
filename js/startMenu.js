var zelda = zelda || {};

zelda.menu = {
    
    init:function(){
        
        
        
    },
    
    preload:function(){
        zelda.game.load.image('mainMenu','img/mainMenu_image.png');
        zelda.game.load.image('playerSelection','img/playerSelectMenu_bg.png');
        zelda.game.load.image('playerRegister','img/registerMenu_bg.png');
        
        
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
        
    },
    
    update:function(){
        switch(menuState){
            case 'main':
                //main menu animated
                bg_img = zelda.game.add.image(0,0,'mainMenu');
                bg_img.scale.setTo(2);
                
                //if(X seconds in time) video;
                break;
            case 'select':
                bg_img = zelda.game.add.image(0,0,'playerSelection');
                bg_img.scale.setTo(2);
                break;
            case 'register':
                bg_img = zelda.game.add.image(0,0,'playerRegister');
                bg_img.scale.setTo(2);
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