import Phaser from 'phaser';
import {imgAssets} from './assets';

class MyGame extends Phaser.Scene
{
  constructor () {
    super();
    this.platforms = null;
    this.player = null;
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

    // 生成一个物理精灵
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    // 在精灵上模拟重力的效果
    this.player.body.setGravityY(300);

    /**
     * 玩家与地面的碰撞
     * 利用碰撞器(Collider)
     * 它接收两个对象，检测二者之间的碰撞，并使二者分开
     */
    this.physics.add.collider(this.player, this.platforms);

    /**
     * 在Phaser 3 中，动画管理器（Animation Manager）是全局系统。
     * 其中生成的动画是全局变量，所有游戏对象都能用到它们。
     * 它们分享基础的动画数据，同时管理自己的时间轴（timeline）。
     * 这就使我们能够在某时定义一个动画，却可以应用到任意多的游戏对象上。
     * 这有别于Phaser 2，那时动画只属于据以生成动画的特定游戏对象。
     */
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 0, end: 3 // left动画使用精灵表单dude的0-3帧
      }),
      frameRate: 10, // 帧率，每秒10帧
      repeat: -1, // 动画循环播放
    });
    this.anims.create({
      key: 'turn',
      frames: [{
        key: 'dude', frame: 4
      }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    })
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
