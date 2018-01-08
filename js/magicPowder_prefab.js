var zelda = zelda || {}

zelda.magicPowder_prefab = function(game, x, y, level){
    
    Phaser.Sprite.call(this, game, x, y, 'magicPickup');
    this.anchor.setTo(.5);
    this.level = level;
    
    game.physics.arcade.enable(this);
    
    this.pickMagicSound = game.add.audio('magicPowderSound',gameOptions.volume);
    
};

zelda.magicPowder_prefab.prototype = Object.create(Phaser.Sprite.prototype);
zelda.magicPowder_prefab.prototype.constructor = zelda.magicPowder_prefab;

zelda.magicPowder_prefab.prototype.update = function(){
    
    this.game.physics.arcade.collide(this,this.level.link,
        function(powder,link){
            powder.destroy();
//            console.log(rupee);
            powder.pickMagicSound.play();
            link.magic += 4;
            if (link.magic > 16) link.magic =16;
        })
}