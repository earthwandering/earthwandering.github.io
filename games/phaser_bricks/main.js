// Create the state that will contain the whole game
var mainState = {
  preload: function() {
    game.load.image('paddle', 'assets/paddle.png');
    game.load.image('brick', 'assets/brick_50.png');
    game.load.image('ball', 'assets/ball.png');
  },

  create: function() {
    // Set the background color to blue
    game.stage.backgroundColor = '#3598db';

    // Start the Arcade physics system (for movements and collisions)
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Add the physics engine to all the game objetcs
    game.world.enableBody = true;
    // Create the left/right arrow keys
    this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    // Add the paddle at the bottom of the screen
    this.paddle = game.add.sprite(200, 400, 'paddle');

    // Make sure the paddle won't move when it hits the ball
    this.paddle.body.immovable = true;

    // Create a group that will contain all the bricks
    this.bricks = game.add.group();

    // Add 25 bricks to the group (5 columns and 5 lines)
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        // Create the brick at the correct position
        var brick = game.add.sprite(55+i*60, 55+j*35, 'brick');

        // Make sure the brick won't move when the ball hits it
        brick.body.immovable = true;

        // Add the brick to the group
        this.bricks.add(brick);
      }
    }

    // Add the ball
    this.ball = game.add.sprite(200, 300, 'ball');

    // Give the ball some initial speed
    this.ball.body.velocity.x = 200;
    this.ball.body.velocity.y = 200;

    // Make sure the ball will bounce when hitting something
    this.ball.body.bounce.setTo(1);
    this.ball.body.collideWorldBounds = true;
  }, //end create

  update: function() {
    // Move the paddle left/right when an arrow key is pressed
    if (this.left.isDown) this.paddle.body.velocity.x = -400;
    else if (this.right.isDown) this.paddle.body.velocity.x = 400;

    // Stop the paddle when no key is pressed
    else this.paddle.body.velocity.x = 0;

    // Add collisions between the paddle and the ball
    game.physics.arcade.collide(this.paddle, this.ball);

    // Call the 'hit' function when the ball hits a brick
    game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);

    // Restart the game if the ball is below the paddle
    if (this.ball.y > this.paddle.y)
      game.state.start('main');
  }, //end update

  // New function that removes a brick from the game
  hit: function(ball, brick) {
    brick.kill();
  },
};

// Initialize the game and start our state
var game = new Phaser.Game(400, 450);
game.state.add('main', mainState);
game.state.start('main');