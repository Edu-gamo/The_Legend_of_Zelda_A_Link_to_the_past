var zelda = zelda || {}

zelda.heart_prefab = function(game, x, y, level){
    
    Phaser.Sprite.call(this, game, x, y, 'heartPickup');
    this.anchor.setTo(.5);
    this.level = level;
    
    
    game.physics.arcade.enable(this);
    
    
    this.pickHeartSound = game.add.audio('pickupItemSound',gameOptions.volume);
    
};

zelda.heart_prefab.prototype = Object.create(Phaser.Sprite.prototype);
zelda.heart_prefab.prototype.constructor = zelda.heart_prefab;

zelda.heart_prefab.prototype.update = function(){
    
    this.game.physics.arcade.collide(this,this.level.link,
        function(heart,link){
            heart.destroy();
            
            heart.pickHeartSound.play();
            heart.game.math.wrapValue(link.health,1,link.hearts/2);
        })
}