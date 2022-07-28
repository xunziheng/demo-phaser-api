import Phaser from 'phaser';
import { imgAssets, jsonAssets } from './assets';

class MyGame extends Phaser.Scene
{
  constructor () {
    super();
    this.platforms = null;
    this.player = null;
    this.cursors = null;
    this.score = 0;
    this.scoreText = null;
    this.stars = null;
    this.bombs = null;

    this.move = 0;
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
    });

    this.load.atlas('atlas', imgAssets.vegImg, jsonAssets.vegJson);
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

    /**
     * 未指定fontfamily，使用Phaser默认的，即Courier
     */
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#000',
    });

    /**
     * 创建一组星星
     */
    this.stars = this.physics.add.group({
      key: 'star', // 纹理，使用星星image的key
      repeat: 11, // 再重复11次，即12颗星星
      setXY: {
        x: 12,
        y: 0, // 第一颗星星的位置
        stepX: 70, // 步长，从第二颗星星开始距离前一颗的移动位置
      }
    });
    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

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
    this.physics.add.collider(this.stars, this.platforms);
    // 判断星星与玩家是否重叠
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    /**
     * 创建一组反派
     */
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

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
    });

    /**
     * 键盘管理函数
     * 这里把四个属性：up, down, left, right植入光标(cursor)对象
     */
    this.cursors = this.input.keyboard.createCursorKeys();

    /**
     * 练习Phaser.Actions
     */
    const gridAlign = this.add.group({
      key: 'dude',
      frame: [0, 1, 2, 3, 4, 5, 6, 7 ,8], // 精灵图中有几帧
      frameQuantity: 9, // 每个精灵重复几个帧数
    });
    Phaser.Actions.GridAlign(gridAlign.getChildren(), {
      width: 9,
      height: 9,
      cellWidth: 32,
      cellHeight: 48,
      x: 100,
      y: 100,
    });

    this.groupA = this.add.group();
    this.groupB = this.add.group();
    for (let i = 0; i < 1000; i++) {
      this.groupA.create(100 + Math.random() * 800, 100 + Math.random() * 600, 'atlas', 'veg0' + Math.floor(1 + Math.random() * 9));
    }
    for (var i = 0; i < 1000; i++) {
      this.groupB.create(100 + Math.random() * 600, 100 + Math.random() * 400, 'atlas', 'veg0' + Math.floor(1 + Math.random() * 9));
    }
  }

  /**
   * 更新函数，是一个循环
   */
  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }

    Phaser.Actions.IncX(this.groupA.getChildren(), Math.cos(this.move));
    Phaser.Actions.IncY(this.groupA.getChildren(), Math.cos(this.move));
    Phaser.Actions.Rotate(this.groupA.getChildren(), -0.01);

    Phaser.Actions.IncX(this.groupB.getChildren(), -Math.cos(this.move));
    Phaser.Actions.IncY(this.groupB.getChildren(), -Math.sin(this.move));
    Phaser.Actions.Rotate(this.groupB.getChildren(), 0.01);

    this.move += 0.01;
  }

  /**
   * 星星和玩家重叠检测回调方法
   */
  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    // group.countActive()方法检测还剩多少星星
    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(child => {
        child.enableBody(true, child.x, 0, true, true);
      });
      let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      let bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  /**
   * 当玩家与反派碰撞检测
   */
  hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
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
