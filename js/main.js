var zelda = zelda || {};

var gameOptions = {
    gameWidth:256,
    gameHeight:224,
    linkSpeed:100,
    inventariSpeed:500,//400,
    volume: 0.2
    
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
zelda.game.state.add('world', zelda.world);
zelda.game.state.add('bossMap', zelda.bossMap);
zelda.game.state.start('level1');
