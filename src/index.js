import Phaser from 'phaser';
import './css/index.css';

class MyGame extends Phaser.Scene
{
  constructor () {
    super();
  }

  /**
   * 预加载函数，调用Phaser的Loader加载资源
   */
  preload () {
    
  }
  
  /**
   * 生成函数
   */
  create () {

  }

  /**
   * 更新函数，是一个循环
   */
  update() {

  }
}


const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: window.innerWidth,
  height: window.innerHeight,
  scene: MyGame,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300,
      },
      debug: false,
    }
  }
};

const game = new Phaser.Game(config);

window.addEventListener('resize', function (event) {
  game.scale.resize(window.innerWidth, window.innerHeight);
}, false);