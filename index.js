window.addEventListener("DOMContentLoaded", function () {

    /* Variables ***********************************************************************************/
    const forestNoises = new Audio('./sounds/forest_ambiance_01.mp3')
    const timerSound = new Audio('./sounds/timer.mp3')
    const victorySound = new Audio('./sounds/victory_sound.mp3')
    const loseSound = new Audio('./sounds/lose_sound.mp3')
    const btnFFSound = new Audio('./sounds/FF_button_sound_01.mp3')
    const btnFFSoundTwo = new Audio('./sounds/FF_button_sound_02.mp3')
    const btnFFSoundThree = new Audio('./sounds/FF_button_sound_03.mp3')
    const themeSong = new Audio('./sounds/theme_song.mp3')
    const earthQuakeSound = new Audio('./sounds/earth_quake_sound.mp3')
    const btnStart = document.getElementById('btn-start-01')
    const btnStartTwo = document.getElementById('btn-start-02')
    const btnWin = document.getElementById('btn-win-01')
    const btnLose = document.getElementById('btn-lose-01')
    const overlay = document.getElementById('overlay')
    const modalIntro = document.getElementById('modal-intro-01')
    const modalIntroTwo = document.getElementById('modal-intro-02')
    const modalWin = document.getElementById('modal-win-01')
    const modalWinTwo = document.getElementById('modal-win-02')
    const modalLose = document.getElementById('modal-lose')
    const canvas = document.getElementById("canvas");
    const bgImage = createImage('./img/bg_01.jpg')
    const ctx = canvas.getContext("2d");
    const gravity = 1;
    const keys = {
      right: {
        pressed: false,
        alwaysPressed: false
      },
      left: {
        pressed: false,
        alwaysPressed: false
      },
      up: {
        pressed: false,
        nbOfUp : 0
      },
    }
    let gameStarted = false;
    let lockControl = true;
    let lastKey = 'right';
    let time = 60
    let timerHtml = document.querySelector('.timer')
    timerHtml. innerHTML = 'Timer : ' + time + 's'
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    /* Variables ***********************************************************************************/

    /* Fonctions ***********************************************************************************/

    function timer(){
      if(time > 0) {
        setTimeout(timer, 1000) 
          time--
          timerHtml.innerHTML = 'Timer : ' + time + 's'
          if(time < 11) {
            timerHtml.style.color = 'red';
            timerSound.play()
            if(time < 1) {
              setTimeout(() => {victorySound.play(), themeSong.pause()}, 2000)
            }
          }
      } else {
        setTimeout(() => {player.playerWin = true}, 500)
      }
    }

    function createImage(imgSrc) {
      const imageGenereted = new Image();
      imageGenereted.src = imgSrc;
      return imageGenereted;
    }

    function playAmbianceSongs(){
      forestNoises.play()
      forestNoises.loop = true
    }

    /* Fonction ***********************************************************************************/


    /* Événement d'écoute ***********************************************************************************/

    btnStart.addEventListener('click', function(){
      btnFFSoundThree.play()
      playAmbianceSongs()
      earthQuakeSound.volume = 0.7
      setTimeout(() => {earthQuakeSound.play()}, 200)
      modalIntro.classList.add('d-none')
      modalIntroTwo.classList.remove('d-none')
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
    })

    btnStartTwo.addEventListener('mouseover', function(){
      btnFFSound.currentTime = 0
      btnFFSound.play()
    })

    btnStartTwo.addEventListener('click', function(){
      themeSong.play()
      themeSong.volume = 0.2
      timer()
      btnFFSoundTwo.play()
      overlay.classList.add('d-none')
      modalIntroTwo.classList.add('d-none')
      lockControl = false
      setTimeout(() => {gameStarted = true},1000)
    })

    btnWin.addEventListener('mouseover', function(){
      btnFFSound.currentTime = 0
      btnFFSound.play()
    })

    btnWin.addEventListener('click', function(){
      btnFFSoundTwo.play()
      modalWin.classList.add('d-none')
      modalWinTwo.classList.remove('d-none')
    })

    btnLose.addEventListener('mouseover', function(){
      btnFFSound.currentTime = 0
      btnFFSound.play()
    })

    btnLose.addEventListener('click', function(){
      btnFFSoundTwo.play()
      setTimeout(() => {location.reload()}, 500)
    })

    /* Événement d'écoute ***********************************************************************************/

    /* Classe du joueur **************************************************************************************/

    class Player {
      constructor() {
        this.position = {
          x: canvas.width/2 -64,
          y: canvas.height -148
        }
        this.moving = {
          x: 0,
          y: 2
        }
        this.sprites = {
          idle: {
            right: createImage('./sprites/Idle_Right.png'),
            left: createImage('./sprites/Idle_Left.png'),
            frameSpeed: 0.1,
            frameLimit: 5,
            width: 640 
          },
          run: {
            right: createImage('./sprites/Run_Right.png'),
            left: createImage('./sprites/Run_Left.png'),
            frameSpeed: 0.2,
            frameLimit: 7,
            width: 896,  
          },
          jump: {
            right: createImage('./sprites/Jump_Right.png'),
            left: createImage('./sprites/Jump_Left.png')
          }
        }
        this.hitBox = {
          ctx: ctx,
          position: {
            x: this.position.x +45,
            y: this.position.y +46
          },
          width: 30,
          height: 80
        }
        this.width = 128;
        this.height = 128;
        this.frames = 0
        this.playerHit = false
        this.invulnerabilityTime = 0
        this.playerLose = false
        this.playerWin = false
        this.hurtSound = new Audio('./sounds/hurt_sound_01.mp3')
        this.walkingSound = new Audio('./sounds/walking_sound.mp3')
        this.currentSprite = this.sprites.idle.right;
        this.currentFrameSpeed = this.sprites.idle.frameSpeed;
        this.currentWitdthForDrawLeft = this.sprites.idle.width;
      }

      walkingSoundPlay(){
        this.walkingSound.volume = 0.5
        this.walkingSound.play()
      }

      hurtSoundPlay(){
        this.hurtSound.play()
      }
      
      drawMovingRight() {
        this.hitBox.position.x = this.position.x +45;
        this.hitBox.position.y = this.position.y +46;
        this.hitBox.ctx.fillRect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height);
        ctx.drawImage(
          this.currentSprite,
          128 * Math.round(this.frames),
          0,
          129,
          129, 
          this.position.x, 
          this.position.y, 
          this.width, 
          this.height
        )
      }
      drawMovingLeft() {
        this.hitBox.position.x = this.position.x +51;
        this.hitBox.position.y = this.position.y +46;
        this.hitBox.ctx.fillRect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height);
        ctx.drawImage(
          this.currentSprite,
          this.currentWitdthForDrawLeft - (128 * Math.round(this.frames)),
          0,
          129,
          129, 
          this.position.x, 
          this.position.y, 
          this.width, 
          this.height
        )
      }

      drawJumpRight(){        
        this.hitBox.position.x = this.position.x +45;
        this.hitBox.position.y = this.position.y +46;
        this.hitBox.ctx.fillRect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height);
        ctx.drawImage(
          this.currentSprite,
          128 * 3,
          0,
          129,
          129, 
          this.position.x, 
          this.position.y, 
          this.width, 
          this.height
        )
      }
      drawJumpLeft(){        
        this.hitBox.position.x = this.position.x +45;
        this.hitBox.position.y = this.position.y +46;
        this.hitBox.ctx.fillRect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height);
        ctx.drawImage(
          this.currentSprite,
          128*6,
          0,
          129,
          129, 
          this.position.x, 
          this.position.y, 
          this.width, 
          this.height
        )
      }

      update() {
        this.frames += this.currentFrameSpeed
        
        if(keys.up.pressed && lastKey === 'right') {  
          this.currentSprite = this.sprites.jump.right
        } else if(keys.up.pressed && lastKey === 'left') {
          this.currentSprite = this.sprites.jump.left
        }
        // Condition lié au framerate des animations, elle permet de ralentir ou accélérer les mouvements --->
        if
        (
        this.frames >= this.sprites.idle.frameLimit && 
        (this.currentSprite === this.sprites.idle.right ||
        this.currentSprite === this.sprites.idle.left)
        ) {
          this.frames = 0
        } 
        
        else if
        (
        this.frames >= this.sprites.run.frameLimit &&
        (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
        ) {
          this.frames = 0
        } 
              
        // Condition lié au framerate des animations, elle permet de ralentir ou accélérer les mouvements ---> 

        if(lastKey === 'left' && !keys.up.pressed){
          this.drawMovingLeft()
        } else if(lastKey === 'right' && !keys.up.pressed) {
          this.drawMovingRight()
        }
        
        if(this.currentSprite === this.sprites.jump.right) {
          this.drawJumpRight()
        } 
        
        else if(this.currentSprite === this.sprites.jump.left) {
          this.drawJumpLeft()
        }

        // Met à jour la position du personnage dans le canvas --->
        this.position.x += this.moving.x;
        this.position.y += this.moving.y;
        // Met à jour la position du personnage dans le canvas --->

        // Permet d'appliquer et de gérer l'effet de gravité sur le personnage --->
        if(this.position.y + this.height + this.moving.y <= canvas.height -20) {
          this.moving.y += gravity;
        } else {
          this.moving.y = 0;
          keys.up.nbOfUp = 0
          keys.up.pressed = false;
          if(this.currentSprite === this.sprites.jump.right) {
            this.currentSprite = this.sprites.idle.right
          } else if(this.currentSprite === this.sprites.jump.left) {
            this.currentSprite = this.sprites.idle.left
          }
        }
        // Permet d'appliquer et de gérer l'effet de gravité sur le personnage --->

        // Gère les collisions entre le personnage et la plateforme pour déterminer jusqu'où le personnage peut marcher dessus avant de tomber --->
        if(
          player.position.y + player.height <= platform.position.y +80 &&
          player.position.y + player.height + player.moving.y >= platform.position.y +80 &&
          player.position.x + player.width >= platform.position.x +80 &&
          player.position.x <= platform.position.x -80 + platform.width
          ) {
          player.moving.y = 0
          keys.up.nbOfUp = 0
          keys.up.pressed = false;
          if(this.currentSprite === this.sprites.jump.right) {
            this.currentSprite = this.sprites.idle.right
          } else if(this.currentSprite === this.sprites.jump.left) {
            this.currentSprite = this.sprites.idle.left
          }
        }
        // Gère les collisions entre le personnage et la plateforme pour déterminer jusqu'où le personnage peut marcher dessus avant de tomber --->

        // Gère les animations aux mouvements du personnage --->

        if(
          keys.right.pressed &&
          lastKey === 'right' &&
          player.currentSprite !== player.sprites.run.right
          ) {
          player.currentSprite = player.sprites.run.right;
          player.currentFrameSpeed = player.sprites.run.frameSpeed;    
        } 
        
        else if(
          keys.left.pressed &&
          lastKey === 'left' &&
          player.currentSprite !== player.sprites.run.left
          ) {     
          player.currentSprite = player.sprites.run.left;
          player.currentFrameSpeed = player.sprites.run.frameSpeed;
          player.currentWitdthForDrawLeft = player.sprites.run.width;        
        } 
        
        else if(
          !keys.left.pressed &&
          lastKey === 'left' &&
          player.currentSprite !== player.sprites.idle.left
          ) {
          player.currentSprite = player.sprites.idle.left;
          player.currentFrameSpeed = player.sprites.idle.frameSpeed;
          player.currentWitdthForDrawLeft = player.sprites.idle.width;
        } 
        
        else if(
          !keys.right.pressed &&
          lastKey === 'right' && 
          player.currentSprite !== player.sprites.idle.right
          ) {
          player.currentSprite = player.sprites.idle.right;
          player.currentFrameSpeed = player.sprites.idle.frameSpeed;
        }

        if(this.playerHit){
          if(this.invulnerabilityTime < 500) {
            this.sprites.idle.frameLimit = 6
            this.sprites.run.frameLimit = 8
            this.invulnerabilityTime++
            this.hitBox.position.x = -500
          } else {
            this.sprites.idle.frameLimit = 5
            this.sprites.run.frameLimit = 7
            this.invulnerabilityTime = 0
            this.playerHit = false
          }
        }
      
        // Gère les animations aux mouvements du personnage --->
      }
    }
    const player = new Player()

    /* Classe du joueur **************************************************************************************/

    /* Classe de la plateforme **************************************************************************************/

    class Platform {
      constructor() {
        this.position = {
          x: canvas.width / 2 - 250,
          y: canvas.height / 2 + 50,
        }
        this.width = 500,
        this.height = 200,
        this.platformImage = createImage('./img/platform_01.png')
      }

      draw() {
        ctx.drawImage(
          this.platformImage, 
          this.position.x, 
          this.position.y, 
          this.width, 
          this.height)
      }
    }
    const platform = new Platform()

    /* Classe de la plateforme **************************************************************************************/

    /* Classe des pierres ********************************************************/

    class Stone {
      constructor(){
        this.id = Math.round(Math.random() * 100)
        this.position = {
          x: Math.random() * canvas.width,
          y: -300,
        }
        this.moving = {
          x: 0,
          y: Math.random() * 10
        }
        this.speedFall = 0.3
        this.reboundPower = -7
        this.width = 160
        this.height = 150
        this.stoneImage = createImage('./img/rocher.png')
        this.stoneImpactSound = new Audio('./sounds/stone_impact_01.mp3')
        this.groundSoundImpact = new Audio('./sounds/stone_impact_02.mp3')
        this.touchGround = false
        this.stopToFall = false
        this.hitBox = {
          ctx: ctx,
          position: {
            x: this.position.x,
            y: this.position.y
          },
          width: 110,
          height: 110
        }
        this.stonePool = [] 
        this.max = 5
        this.angle = 0
        this.va = Math.random() * 0.2 - 0.1
      }

      soundImpactPlay() {
        this.stoneImpactSound.play()
      }

      soundGroundImpactPlay() {
        this.groundSoundImpact.currentTime = 0
        this.groundSoundImpact.volume = 0.3
        this.groundSoundImpact.play()
      }

      createStonePool(){
          for(let i = this.stonePool.length; i < this.max; i++) {
              this.stonePool.push(new Stone())
          }
      }

      drawStone() { 
        ctx.save()
        this.hitBox.position.x = this.position.x + 30;
        this.hitBox.position.y = this.position.y + 20;
        this.hitBox.ctx.fillRect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height);
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        ctx.rotate(this.angle)
        ctx.drawImage(
          this.stoneImage, 
          -this.width * 0.5, 
          -this.height * 0.5, 
          this.width, 
          this.height
        )
        ctx.restore()
      }

      update(){
        this.angle += this.va
        this.position.y += this.moving.y;
        
        if(this.touchGround) {
          this.hitBox.position.x = 0
          this.hitBox.position.y = 0
        }
        
        if(this.position.y + this.height + this.moving.y <= canvas.height -20) {
          this.moving.y += this.speedFall   
        } 
        
        else if(this.position.y + this.height + this.moving.y > canvas.height +400 && this.touchGround) {
          this.touchGround = false
          this.stopToFall = true
          this.position.y = -150
          this.moving.y = Math.random() * 10
          this.position.x = Math.random() * canvas.width
        }
        
        else if(this.position.y + this.height + this.moving.y > canvas.height -20 && this.touchGround) {
          this.moving.y += this.speedFall            
        } 
        
        else if(!this.stopToFall) {
          this.moving.y = this.reboundPower;
          this.touchGround = true
          this.soundGroundImpactPlay()
        } else {
          this.stonePool.pop()
          this.stopToFall = false
        }

        if(
          this.hitBox.position.y + this.hitBox.height >= player.hitBox.position.y &&
          this.hitBox.position.y <= player.hitBox.position.y + player.hitBox.height && 
          this.hitBox.position.x + this.hitBox.width >= player.hitBox.position.x &&
          this.hitBox.position.x <= player.hitBox.position.x + player.hitBox.width     
          ) {
          smoke.position.x = this.position.x
          smoke.position.y = this.position.y
          stone.stonePool = stone.stonePool.filter((el) => el.id !== this.id)
          this.soundImpactPlay()
          player.hurtSoundPlay()

          if(lastKey === 'right') {
            player.position.x = player.position.x - 20
            player.position.y = player.position.y - 25
          } else {
            player.position.x = player.position.x + 20
            player.position.y = player.position.y - 25
          }

          player.playerHit = true
          smoke.triggerSmokeAnimation = true
          smoke.spriteSmoke.frameX = 0

          playerLifeArr.pop()
          if(playerLifeArr.length === 0) {
            player.playerLose = true
          }
        }    
        if(stone.stonePool.length <= this.max) {     
          stone.createStonePool()
        }
        this.drawStone()
      }
    }

    const stone = new Stone()
    stone.createStonePool()
    
    /* Classe des pierres **************************************************/

    class Smoke {
      constructor(){
        this.position = {
          x: 0,
          y: 0
        }
        this.smokeImage = createImage('./sprites/Smoke.png')
        this.spriteSmoke = {
          width: 152,
          height: 163.5,
          frameSpeed: 0.1,
          frameX: 0,
          frameY: 1
        }
        this.triggerSmokeAnimation = false
        
      }

      drawSmoke() {
        ctx.drawImage(
          this.smokeImage, 
          this.spriteSmoke.width * Math.round(this.spriteSmoke.frameX), 
          this.spriteSmoke.height * this.spriteSmoke.frameY,
          this.spriteSmoke.width,
          this.spriteSmoke.height,
          this.position.x,
          this.position.y, 
          this.spriteSmoke.width, 
          this.spriteSmoke.height
        )
      }

      update() {
        this.drawSmoke()
        if(this.spriteSmoke.frameX >= 4) {
          this.spriteSmoke.frameX = 0
          smoke.triggerSmokeAnimation = false
        } else {
          this.spriteSmoke.frameX += this.spriteSmoke.frameSpeed
        }
      }
    }

    const smoke = new Smoke()


    /* Classe vie du personnage **************************************************************************************/

    class PlayerLife {
      constructor() {
        this.lifeImage = createImage('./sprites/Idle_Right.png')
        this.position = {
          x:0,
          y:0
        }
      }

      drawPlayerLife(){
        ctx.drawImage(this.lifeImage, 50, 3, 60, 70, this.position.x, this.position.y, 100, 100)
      }

      update(){        
        this.drawPlayerLife()
      }
    }
    
    const playerLife1 = new PlayerLife()
    const playerLife2 = new PlayerLife()
    const playerLife3 = new PlayerLife()
    playerLife2.position.x = 50
    playerLife3.position.x = 100
    const playerLifeArr = [playerLife1, playerLife2, playerLife3]
    
    /* Classe vie du personnage **************************************************************************************/

    /* Animations et mise en place des images **************************************************************************************/
    
    function animate() {
      if(!player.playerLose && !player.playerWin) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'rgb(255,255,255, 0)';
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
  
        platform.draw()        
        player.update()
  
        if(gameStarted) {
            stone.stonePool.forEach(stone => {
              stone.update()
            })
        }
  
        playerLifeArr.forEach(life => {
          life.update()
        })
  
        if(smoke.triggerSmokeAnimation) {
          smoke.update()
        }
  
        ctx.imageSmoothingEnabled = false;
        requestAnimationFrame(animate)
      // Logique de déplacement du personnage ----->
        if(
            keys.right.pressed &&
            player.position.x < canvas.width -80
            ) {
            player.moving.x = 5;
          } else if(
            keys.left.pressed &&
            player.position.x > -45
            ) {
              player.moving.x = - 5;
            } else {
              player.moving.x = 0;
            }
        } else if(player.playerWin) {
          overlay.classList.remove('d-none')
          modalWin.classList.remove('d-none')
        }else {
          loseSound.play()
          themeSong.pause()
          time = 0
          overlay.classList.remove('d-none')
          modalLose.classList.remove('d-none')
        }
      }
      // Logique de déplacement du personnage ----->
     
      /* Logique déclanchée par les touches du clavier quand elles sont appuyées ***********************************************/

    window.addEventListener('keydown', function(event) {
      if(!lockControl){
        switch(event.key) {
          case 'd':
            if(keys.left.alwaysPressed){
              lastKey = 'left';
            } else {
              keys.right.pressed = true
              keys.right.alwaysPressed = true             
              lastKey = 'right';
              player.walkingSoundPlay()    
            }   
            break
          case 'q':     
              if(keys.right.alwaysPressed){
                lastKey = 'right';
              } else {
                keys.left.pressed = true
                keys.left.alwaysPressed = true
                lastKey = 'left';
                player.walkingSoundPlay()    
              }     
            break
          case 'z':
            if(!keys.up.pressed && keys.up.nbOfUp === 0){
              player.moving.y -= 25;
              keys.up.nbOfUp++
            }
            keys.up.pressed = true;
            break
          case 's':
            break
        }
      }
    })

    /* Logique déclanchée par les touches du clavier quand elles sont appuyées ***********************************************/

    /* Logique déclanchée par les touches du clavier quand elles sont relâchées ***********************************************/

    window.addEventListener('keyup', function(event) {
      if(!lockControl){
        switch(event.key) {
          case 'd':
            keys.right.pressed = false;
            keys.right.alwaysPressed = false
            break
          case 'q':
            keys.left.pressed = false;
            keys.left.alwaysPressed = false
            break
          case 'z':
            if(player.moving.y !== 0) {
              player.moving.y += 5;
            }      
            break
          case 's':
            break
        }
      }
    })
    animate()
  });