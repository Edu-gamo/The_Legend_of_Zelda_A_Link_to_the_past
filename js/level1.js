var zelda = zelda || {};

zelda.level1 = {
    
    init:function(){
        
        
        
    },
    
    preload:function(){
        //walk spritesheets
        this.load.spritesheet('linkWalk_noShield','img/link_normal_walk_spritesheet.png',23.28,29); this.load.spritesheet('linkWalk_Shield','img/link_shield_walk_spritesheet.png',23.28,29);
        //attack spritesheets
        this.load.spritesheet('attack_front','img/link_ataque_basico_frontal_spritesheet.png',39.83,40);
        this.load.spritesheet('attack_right','img/link_ataque_basico_lateral_spritesheet.png',40,60);
        this.load.spritesheet('attack_back','img/link_ataque_basico_trasero_spritesheet.png',40,60);
               
    },
    
    create:function(){
        //Link
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
        link.animations.add('linkWalk_left',[21,22,23,24,25,26,27,26,25,24,23,22],30,true);

        
        //control keys
        cursors = zelda.game.input.keyboard.createCursorKeys();
        xKey = zelda.game.input.keyboard.addKey(Phaser.Keyboard.X);
        xKey.onDown.add(zelda.level1.xKeyPressed,this);
    },
    
    update:function(){
        
        
        //movement   
        link.body.velocity.set(0);
        if(cursors.down.isDown){
            link.body.velocity.y = gameOptions.linkSpeed;
            link.animations.play('linkWalk_front');
            link.direction = 3;
        } else if(cursors.up.isDown){
            link.body.velocity.y = -gameOptions.linkSpeed;
            link.animations.play('linkWalk_back');
            link.direction = 10;
        }else if(cursors.right.isDown){
            link.body.velocity.x = gameOptions.linkSpeed;
            link.animations.play('linkWalk_right');
            link.direction = 17;
        }else if(cursors.left.isDown){
            link.body.velocity.x = -gameOptions.linkSpeed;
            link.animations.play('linkWalk_left');
            link.direction = 24;
        }else {
            link.frame = link.direction;
        }
             
        //attack
        if(link.attacking){
            link.body.velocity.set(0);
            link.animations.stop(true);
            //link sprite invisible
            
        }
        
    },
    
    xKeyPressed:function(){
        
        link.attacking = true;
        
        if(link.direction == 3){
            linkA_front = zelda.game.add.sprite(link.body.center.x,link.body.center.y,'attack_front');
            linkA_front.scale.setTo(2);
            linkA_front.anchor.setTo(.5);
            atckAnim_front = linkA_front.animations.add('shortAttack',[0,1,2,3,4,5]);
            linkA_front.animations.play('shortAttack',50,false, true);
            atckAnim_front.onComplete.add(zelda.level1.endAttack, this);
        } else if(link.direction == 10){ 
            linkA_back = zelda.game.add.sprite(link.body.center.x,link.body.center.y,'attack_back');
            linkA_back.scale.setTo(2);
            linkA_back.anchor.setTo(.5);
            atckAnim_back = linkA_back.animations.add('shortAttack',[0,1,2,3,4,5,6,7,8]);
            linkA_back.animations.play('shortAttack',50,false,true);
            atckAnim_back.onComplete.add(zelda.level1.endAttack, this);
        } else{
            linkA_right = zelda.game.add.sprite(link.body.center.x,link.body.center.y,'attack_right');
            linkA_right.anchor.setTo(.5);
            atckAnim_right = linkA_right.animations.add('shortAttack',[0,1,2,3,4,5,6,7,8]);
            atckAnim_right.onComplete.add(zelda.level1.endAttack, this);
            if(link.direction == 17){
                linkA_right.scale.setTo(2);
                linkA_right.animations.play('shortAttack',50,false,true);
            }else if(link.direction == 24){
                linkA_right.scale.setTo(-2,2);
                linkA_right.animations.play('shortAttack',50,false,true);
            }
        } 
        
        //afegir un boolean que pari la velocity: true quan entra aqui, false quan s'acaba l'animacio
        //calculate attack hitbox
        
    },
    
    endAttack:function(){
        link.attacking = false;
    }
    
};
/*

    this.game.input.keyboard.onDownCallback = function(e) {   
      
        console.log(e.keyCode);   
  
*/