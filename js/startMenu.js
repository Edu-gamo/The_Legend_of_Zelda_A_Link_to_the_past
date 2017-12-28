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
        
        //REGISTER PLAYER SCREEN
        zelda.game.load.image('lh','img/lineHorizontal.png');
        zelda.game.load.image('lv','img/lineVertical.png');
        zelda.game.load.image('letras','img/letrasTileSprite.png');
        zelda.game.load.image('cor','img/corIndicador.png');
        zelda.game.load.image('bCurtain','img/blackCurtain.png');
        
        //AUDIO
        zelda.game.load.audio('musicaMenu','audio/11.select_screen.mp3');
        zelda.game.load.audio('musicaLevel1','audio/03.time of the falling rain.mp3');
        zelda.game.load.audio('menuCursor','audio/LTTP_Menu_Cursor.wav');
//        zelda.game.load.audio();
        
    },
    
    create:function(){
        menuState ='main'; //'select', 'register', 'main'
        zelda.game.stage.backgroundColor = "#000000";
        curtain = zelda.game.add.image(0,0,'bCurtain');
        bg_img = zelda.game.add.image(0,0,'mainMenu');
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
        this.onCreate = true;
        this.registerOption = 0; //0,1,2,3 o 4 opcio seleccionada a la SELECT SCREEN
        this.fairy = zelda.game.add.sprite(0,0,'fairy');
        this.fairy.animations.add('fly',null,10,true);
        this.fairy.play('fly');
        this.fairy.visible = false;
        this.indicadorDePartidaGuardada_link = zelda.game.add.sprite(-50,-50,'normal_walk_stand');
        this.indicadorDePartidaGuardada_link.frame = 3;
        //this.indicadorDePartidaGuardada_link.visible = false;
        this.nomPartides = ['','','']; //els nomes de les 3 partides
        
        this.specialOption = null;
        
        //REGISTER PLAYER SCREEN
        lh = zelda.game.add.sprite(0,136,'lh');
        lv = zelda.game.add.sprite(128+4,0,'lv'); //linia horitzxontal i linia vertical
        lh.visible = false; lv.visible = false;
        virtualKeyboard = zelda.game.add.tileSprite(0,128,512,64,'letras');
        virtualKeyboard.tilePosition.x += 24+4;
        virtualKeyboard.visible = false;
        rfs = 'ABCDEFGHIJ  abcdefghij  01234   KLMNOPQRST  klmnopqrst  56789   UVWXYZ-.,   uvwxyz      !?()    ';//retrofont string
        font = zelda.game.add.retroFont('letras',16,16,rfs,32); //variable per guardar la retrofont info
        font.autoUpperCase = false;
        font.text = '      ';
        keyboardI = 6, keyboardJ = 0; // els indexos del keyboard virtual
        wordIndex = 0; //0-5 index caracters del nom del player
        word = []; // caracters del nom del player
        for(var i = 0; i < 6;++i) word[i] = ' ';
        corIndex = zelda.game.add.sprite(31,87,'cor'); //cor indicador de index
        corIndex.visible = false;
        
        //AUDIO
        bgMusicMenu = zelda.game.add.audio('musicaMenu',gameOptions.volume,true);
        bgMusicLevel1 = zelda.game.add.audio('musicaLevel1',gameOptions.volume,true);
        menuCursorSound = zelda.game.add.audio('menuCursor',gameOptions.volume);
        menuCursorSound.override = true;

        
    },
    
    update:function(){
        switch(menuState){
            case 'main':
                if((enter.isDown && enter.downDuration(1)) || (xKey.isDown && xKey.downDuration(1))){
                    menuState = 'select';
                    bg_img.destroy();
                    bgMusicMenu.play();
                    
                }
                break;
            case 'select':
                //this.intro.stop();
                if(this.onCreate){ //"Start"
                    curtain = zelda.game.add.image(0,0,'bCurtain');
                    bg_img = zelda.game.add.image(0,0,'playerSelection');
                    this.fairy.visible = true;
                    this.fairy.bringToTop();
                    this.fairy.x = 28;
                    this.fairy.y = 70;
                    
                    var auxFonts = [];
                    for(var i = 0; i < 3;++i){
                        auxFonts[i] = zelda.game.add.retroFont('letras',8,16,rfs,32,8,0,4,0);
                        auxFonts[i].autoUpperCase = false;
                        auxFonts[i].text = this.nomPartides[i];
                        var _image = zelda.game.add.image(90,71+32*i,auxFonts[i]);
                    }
                    
                    //this.indicadorDePartidaGuardada_link.x = true;
                    this.onCreate = false;
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
                    
                    if((enter.isDown && enter.downDuration(1)) || (xKey.isDown && xKey.downDuration(1))){
                        switch(this.registerOption){
                            case 3:
                                //copy player
                                console.log("case 3");
                                this.specialOption = "copy";
                                
                                break;
                            case 4:
                                //erase player
                                console.log('case4');
                                this.specialOption = "erase";
                                break;
                            default:
                                if(this.nomPartides[this.registerOption] != ''){
                                    curtain.bringToTop();
                                    bgMusicMenu.fadeOut(700);
                                    bgMusicMenu.onFadeComplete.addOnce(function(){
                                        console.log("fadeOutComplete!");
                                        bgMusicMenu.stop();
                                        bgMusicLevel1.play();
                                        zelda.game.state.start('level1');
                                        }); //comença a jugar en la primera partida
                                }else{//la partida no esta creada
                                    menuState = 'register';
                                    this.fairy.visible = false;
                                    bg_img.destroy();
                                    this.onCreate = true;
                                }
                                break;
                        }
                        
                    }
                }
                
                break;
            case 'register':
                if(this.onCreate){ //"Start"
                    bg_img.destroy();
                    
                    curtain = zelda.game.add.image(0,0,'bCurtain');
                    lh = zelda.game.add.sprite(0,136,'lh');
                    lv = zelda.game.add.sprite(128+4,0,'lv');
                    virtualKeyboard.reset(0,128);
                    virtualKeyboard.tilePosition.x += 24+4;
                    virtualKeyboard.bringToTop();
                    
                    font.text = '      ';
                    keyboardI = 6, keyboardJ = 0; // els indexos del keyboard virtual
                    wordIndex = 0; //0-5 index caracters del nom del player
                    for(var i = 0; i < 6;++i) word[i] = ' ';
                    corIndex = zelda.game.add.sprite(31,87,'cor'); //cor indicador de index
                    bg_img = zelda.game.add.image(0,0,'playerRegister');
                    this.onCreate = false;
                }else{
                    if(keyboardI == -1) keyboardI = 31;
                    if(keyboardI == 32) keyboardI = 0;
                    if(wordIndex == 6) wordIndex = 0;
                    if(wordIndex == -1) wordIndex = 5;
                    corIndex.x = 16*wordIndex+31;
        
                    if(xKey.isDown && xKey.downDuration(1)){
                        if(keyboardJ != 3){
                            var c = keyboardJ*32 + keyboardI;
                            word[wordIndex] = rfs.charAt(c);
                            wordIndex++;
                        }else{
                            if(keyboardI == 5 || keyboardI == 17 || keyboardI == 24){
                                wordIndex--;
                            }else if(keyboardI == 6 || keyboardI==18 || keyboardI==25){
                                wordIndex++;
                            }else if(keyboardI==8 || keyboardI==9 || keyboardI==20 || keyboardI==21 || keyboardI==27 || keyboardI==28){
                                if(font.text != '      '){
                                    console.log('return to playerSelect with name: ' + font.text); 
                                    this.nomPartides[this.registerOption] = font.text; //toString?
                                    menuState = 'select';
                                    this.onCreate = true;

                                    bg_img.destroy();
                                    lh.visible = false; lv.visible = false;
                                    virtualKeyboard.visible = false;
                                    corIndex.visible = false;
                                }
                                
                                
                                
                            }else{
                                word[wordIndex] = ' ';
                                wordIndex++;
                            }
                        }
                        font.text = '';
                        for(var k = 0; k < word.length;k++){
                            font.text += word[k];
                        }
                        var myText = zelda.game.add.image(28,128-16-16,font);
                    }

                    if(cursors.right.isDown){
                        if(!zelda.game.tweens.isTweening(virtualKeyboard.tilePosition)) {
                            zelda.game.add.tween(virtualKeyboard.tilePosition).to({ x:  virtualKeyboard.tilePosition.x-16}, 200, null, true);
                            keyboardI++;
                        }
                    }
                    if(cursors.left.isDown){
                        if(!zelda.game.tweens.isTweening(virtualKeyboard.tilePosition)) {
                            zelda.game.add.tween(virtualKeyboard.tilePosition).to({ x:  virtualKeyboard.tilePosition.x+16}, 200, null, true);
                            keyboardI--;
                        }
                    }
                    if(cursors.up.isDown){
                        if(!zelda.game.tweens.isTweening(lh) && keyboardJ > 0) {
                            zelda.game.add.tween(lh).to({ y: lh.y -16 }, 200, null, true);
                            keyboardJ--;
                        }           
                    }
                    if(cursors.down.isDown){
                        if(!zelda.game.tweens.isTweening(lh) && keyboardJ < 3) {
                            zelda.game.add.tween(lh).to({ y: lh.y +16 }, 200, null, true);
                            keyboardJ++;
                        }
                    }
                }
                break;
        }
        
    },
    
    placeFairyIndicator(){
        //moure fada
        
        if(this.registerOption == 0){
            this.fairy.y = 71;
        }
        if(this.registerOption == 1){
            this.fairy.y = 103;
        }if(this.registerOption == 2){
            this.fairy.y = 135;
        }if(this.registerOption == 3){
            this.fairy.y = 174;
        }
        if(this.registerOption == 4){
            this.fairy.y = 190;
        }
        
        menuCursorSound.play();
    }
    
    
};