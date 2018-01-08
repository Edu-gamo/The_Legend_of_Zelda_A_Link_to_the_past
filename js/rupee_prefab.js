var zelda = zelda || {}

zelda.rupee_prefab = function(game, x, y, level){
    
    Phaser.Sprite.call(this, game, x, y, 'rupeePickup');
    this.anchor.setTo(.5);
    this.animations.add('shine',[0,1,2,3,0,0,0],10,true);
    this.animations.play('shine');
    this.level = level;
    
    game.physics.arcade.enable(this);
    this.body.setSize(6,14,1,1);
    
    this.pickRupeeSound = game.add.audio('rupeeSound',gameOptions.volume);
    
};

zelda.rupee_prefab.prototype = Object.create(Phaser.Sprite.prototype);
zelda.rupee_prefab.prototype.constructor = zelda.rupee_prefab;

zelda.rupee_prefab.prototype.update = function(){
    
    this.game.physics.arcade.collide(this,this.level.link,
        function(rupee,link){
            rupee.destroy();
//            console.log(rupee);
            rupee.pickRupeeSound.play();
            link.rupees++;
        })
}