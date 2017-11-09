var zelda = zelda || {};

var gameOptions = {
    gameWidth:960,
    gameHeight:540
};

zelda.game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.AUTO, null, this, false, false);

WebFontConfig = {
    active:function(){
        game.time.events.add(Phaser.Timer.SECOND, createText, this);
    },
    google:{
        families:['Press Start 2P']
    }
};

zelda.game.state.add('main', zelda.menu);
zelda.game.state.add('level1', zelda.level1);
zelda.game.state.start('main');