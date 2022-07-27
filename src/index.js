import Phaser from 'phaser';
import {imgAssets} from './assets';

class MyGame extends Phaser.Scene
{
  constructor () {
    super();
    this.platforms = null;
  }

  /**
   * 预加载函数，调用Phaser的Loader加载资源
   */
  preload () {
    this.load.image('logo', imgAssets.logoImg);
    this.load.image('sky', imgAssets.skyImg);
    this.load.image('bomb', imgAssets.bombImg);
    this.load.image('ground', imgAssets.platformImg);
    this.load.image('star', imgAssets.starImg);

    // 精灵表单sprite sheet，不同于image资源
    this.load.spritesheet('dude', imgAssets.dudeImg, {
      frameWidth: 32, frameHeight: 48
    })
  }
  
  /**
   * 生成函数
   */
  create () {
    /**
     * 400, 300为image的坐标点，在Phaser3中，所有游戏对象的定位默认基于它们的中心点
     * 也可以使用setOrigin(0, 0)将原点重置为左上角的(0, 0)
     */
    const sky = this.add.image(0, 0, 'sky');
    sky.setOrigin(0, 0);

    // 按顺序后面的图层会比前面的高，添加星星
    const stars = this.add.image(400, 300, 'star');

    /**
     * 生成一个静态物理组
     * 在Arcade（游乐场）物理系统中，有动态和静态两类物体
     * 动态物体可以通过外力比如速度(velocity)、加速度(acceleration)，得以四处移动，可以跟其他对象发生反弹(bounce)、碰撞(collide)，此类碰撞受物体质量和其他因素影响
     * 静态物体只有位置和尺寸，不能设置速度，有东西跟它碰撞时也不会动，一般适用于地面
     */
    this.platforms = this.physics.add.staticGroup();
    // refreshBody()：因为我们缩放的是一个静态物体，所以必须把所做变动告诉物理世界(physics world)
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
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
