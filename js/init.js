

var GameStates = {}; 

document.addEventListener("DOMContentLoaded", function()  {

    var width = 1000;
    var height = 480;

    var game = new Phaser.Game(width, height, Phaser.CANVAS, "game");
  
    game.state.add('Game', GameStates.Game);             // <-- Game loop (a.k.a the actual game).

    game.state.start('Game');

});