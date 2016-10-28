var widt = $(window).width(),
 heigh = $(window).height();

var game = new Phaser.Game(widt, heigh, Phaser.AUTO, "game" , { 
    preload: preload, 
    create: create, 
    update: update 
});

var wi1 = $(window).width() - 100;
var hi1 = $(window).height() - 100;

var wi2 = $(window).width() - 200;
var hi2 = $(window).height() - 100;

/*var game = new Phaser.Game(worldwidth, worldheight, Phaser.CANVAS, "game", {});
game.state.add('menu', Menu, true);*/

/*переменные и константы*/

var oldcamera;
var worldScale = 1;
var currentBounds;
var mapSizeMax;

var worldwidth=600;
var worldheight=600;

var mapSizeX = 8000;
var mapSizeY = 8000; 
var prevScale ={};
var nextScale={};
var zoompoint={};
var mapSizeCurrent;
var distance =0;
var olddistance =0;
var distancedelta=0;
var easing=0.1;


/*попап*/
var popup;
var tween = null;

/*подгрузка всех ресурсов*/

function preload() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.setScreenSize(true);
    
    /*добавляем адаптив в канвас*/
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = 480;
    this.scale.minHeight = 260;
    this.scale.maxWidth = 1324;
    this.scale.maxHeight = 768;
    this.scale.forceLandscape = true;
        
        game.load.image('clouds', 'assets/seamles.jpg');
        game.load.image('coin', 'assets/box.png');



/*описание*/

        game.load.image('cut_16', 'assets/cut_16_20.jpg');

/*дым*/
        game.load.image('snog3', 'assets/snog3.png');
        game.load.image('smoke', 'assets/smoke.png');

/*тату*/
        
        game.load.image('print1', 'assets/print1.jpg');
        game.load.image('print2', 'assets/print2.jpg');
        game.load.image('print3', 'assets/print3.jpg');
        game.load.image('print4', 'assets/print4.jpg');

/*интерфейс*/
        
        game.load.spritesheet('arrow', 'assets/arrow.png', 55, 55);
        game.load.image('arrowup', 'assets/arrow_up.png');
        game.load.image('BoxBlue', 'assets/BoxBlue.png');

        game.load.spritesheet('buttonA', 'assets/button_sprite_sheet.png', 193, 71);

/*попапы*/


    game.load.image('background', 'assets/bubble-on.png');
    game.load.image('close', 'assets/orb-red.png');


}



function create() { 
    
    worldScale=1;

    cursors = game.input.keyboard.createCursorKeys();

    stageGroup = game.add.group(); // this group will contain everything except the UI for scaling
    backgroundobjects = game.add.group();
    groundobjects = game.add.group();

    mapSizeMax = mapSizeX;
    mapSizeCurrent = mapSizeMax;
 
/*задаецм ввет фона*/
game.stage.backgroundColor = "#1BDCFF";

game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
/*добовляем фон для паралакса с движением, как в играх*/
    var skyl = game.add.tileSprite(0, 0, this.game.width, this.game.height, 'clouds');
    skyl.autoScroll(540, 10);
    skyl.scale.setTo(10,10);

/*add статический объект*/
        coin = game.add.sprite(4000,4000,'coin');
        coin.scale.setTo(4,4);
        coin.anchor.setTo(0.5,0.5);


/*add описание*/
        
        snog3 = game.add.sprite(3780,4000,'cut_16');

/*add дым*/


        s1 = game.add.sprite(3850,3400,'snog3');
        s2 = game.add.sprite(3850,2900,'snog3');
        s3 = game.add.sprite(3850,2900,'smoke');
        s3 = game.add.sprite(3350,2900,'smoke');
        s4 = game.add.sprite(3050,2900,'smoke');

/*add тату*/
 s1w1 = 4000;
 s1h1 = 3400;

/*папап*/

    popup = game.add.button(s1w1,s1h1,'print1', openWindow, this);
  
  /*прозрачность*/
    //popup.alpha = 0.8;
    popup.anchor.set(0.5);

    var pw = (popup.width / 2) - 48;
    var ph = (popup.height / 2) - 8;

    //  And click the close button to close it down again
    
    var closeButton = game.make.sprite(pw, -ph, 'close');
    closeButton.inputEnabled = true;
    closeButton.input.priorityID = 1;
    closeButton.input.useHandCursor = true;
    closeButton.events.onInputDown.add(closeWindow, this);
    //closeButton.scale.set(0);

    closeButton.visible = false;

    //  Add the "close button" to the popup window image
    popup.addChild(closeButton);

    //  Hide it awaiting a click
    popup.scale.set(1);

        print2 = game.add.sprite(3850,2600,'print2');
        print3 = game.add.sprite(3150,2600,'print3');
        print4 = game.add.sprite(4400,2480,'print4');

/*ass стрелки*/

    button3 = game.add.button(4000,4000, 'arrowup', actionOnClickC, this);

    button4 = game.add.button(3870,4000, 'arrowup', actionOnClickD, this);

    button1 = game.add.button(wi1, hi1, 'arrow', actionOnClickA, this, 1, 0);
    button1.fixedToCamera = true;



/*0- ховер 1- обычное состояние 2- при клике*/
  //  button = game.add.button(270, 130, 'buttonA', actionOnClickB1, this, 1, 2, 0);
  //  button.fixedToCamera = true;




function openWindow() {

    if ((tween !== null && tween.isRunning) || popup.scale.x === 1.5)
    {
        return;
    }
    
    //  Create a tween that will pop-open the window, but only if it's not already tweening or open
    tween = game.add.tween(popup.scale).to( { x: 1.5, y: 1.5 }, 1000, Phaser.Easing.Elastic.Out, true);
            //game.add.tween(closeButton.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
            closeButton.visible = true;
}

function closeWindow() {

    if (tween && tween.isRunning || popup.scale.x === 1)
    {
        return;
    }

    //  Create a tween that will close the window, but only if it's not already tweening or closed
    tween = game.add.tween(popup.scale).to( { x: 1, y: 1 }, 500, Phaser.Easing.Elastic.In, true);
            //game.add.tween(closeButton.scale).to( { x: 0, y: 0 }, 500, Phaser.Easing.Elastic.In, true);
            closeButton.visible = false;
}


/*добавляем бэкграунд */
        background1=game.add.tileSprite(0, 0, mapSizeX,mapSizeY ,'clouds');


        backgroundobjects.add(background1);
        backgroundobjects.add(coin);
        stageGroup.add(backgroundobjects);
        stageGroup.add(groundobjects);
        currentBounds = new Phaser.Rectangle(-mapSizeX, -mapSizeY, mapSizeX*2, mapSizeY*2); 
        
        game.camera.bounds=currentBounds;
        game.camera.focusOnXY(4000,4000);

        game.input.mouse.mouseWheelCallback = function (event) {
            var wheelDelt = game.input.mouse.wheelDelta;
            if (wheelDelt < 0)  {   mapSizeCurrent -= 400;  mapSizeCurrent = Phaser.Math.clamp(mapSizeCurrent, worldwidth , mapSizeMax);}
            else                {   mapSizeCurrent += 400;  mapSizeCurrent = Phaser.Math.clamp(mapSizeCurrent, worldwidth , mapSizeMax);}
            worldScale = (mapSizeCurrent/mapSizeMax);
    };
}

/*обработка события клика*/

function actionOnClickB1 () {

    console.log(111);
  // game.camera.x = 3600;
  // game.camera.y = 3700;
}

function actionOnClickA () {

/*фокусируется на конекретный коррдинатах!*/
   game.camera.focusOnXY(4000,4000);
}

function actionOnClickB () {

 console.log(222);
 if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }
    
}

function actionOnClickC () {

    //console.log(333);

    game.camera.x = 3600;
    game.camera.y = 2450;
   
}

function actionOnClickD () {

    game.camera.focusOnXY(4000,3400);
    console.log(444);
   
}

function update() {

    /*управление с клавиатуры*/

    if (cursors.up.isDown)
    {
        game.camera.y -= 10;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 10;
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 10;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 10;
    }
        

/*управление мышью*/


        if(game.input.pointer1.isDown && game.input.pointer2.isDown){
            olddistance = distance;
            distance = Phaser.Math.distance(game.input.pointer1.x, game.input.pointer1.y, game.input.pointer2.x, game.input.pointer2.y);
            distancedelta = Math.abs(olddistance - distance);

            if (olddistance > distance && distancedelta > 4 ){ mapSizeCurrent -= 200;  }
            else if (olddistance < distance && distancedelta > 4 ){  mapSizeCurrent += 200;}
            mapSizeCurrent = Phaser.Math.clamp(mapSizeCurrent, worldwidth , mapSizeMax); //prevent odd scalefactors - set a minimum and maximum scale value
            worldScale = (mapSizeCurrent/mapSizeMax);

            //calculate point between fingers (zoompoint.x and zoompoint.y)
            if (game.input.pointer1.x < game.input.pointer2.x) { zoompoint.x =  game.input.pointer1.worldX + (Math.abs(game.input.pointer1.worldX - game.input.pointer2.worldX)/2); }
            else {zoompoint.x =  game.input.pointer2.worldX + (Math.abs(game.input.pointer1.worldX - game.input.pointer2.worldX)/2);  }
            if (game.input.pointer1.y < game.input.pointer2.y) { zoompoint.y =  game.input.pointer1.worldY + (Math.abs(game.input.pointer1.worldY - game.input.pointer2.worldY)/2); }
            else {zoompoint.y =  game.input.pointer2.worldY + (Math.abs(game.input.pointer1.worldY - game.input.pointer2.worldY)/2);  }
        }
        else {  // wheelzoom
            zoompoint.x = game.input.mousePointer.worldX;
            zoompoint.y = game.input.mousePointer.worldY;
        }

         // move camera / pan
        if(game.input.activePointer.isDown && !game.input.pointer2.isDown){
            if (oldcamera) { // if moving the world always continue from the last position
                game.camera.x += oldcamera.x - game.input.activePointer.position.x; 
                game.camera.y += oldcamera.y - game.input.activePointer.position.y; 
            }
            oldcamera = game.input.activePointer.position.clone();
        }
        // adjust camera center and zoom here
      else { 
            oldcamera = null; 
            rescalefactorx = mapSizeX / (mapSizeX * stageGroup.scale.x); // multiply by rescalefactor to get original world value
            rescalefactory = mapSizeY / (mapSizeY * stageGroup.scale.y);

            prevScale.x = stageGroup.scale.x;
            prevScale.y = stageGroup.scale.y;

            nextScale.x = prevScale.x + (worldScale-stageGroup.scale.x)*easing;
            nextScale.y = prevScale.y + (worldScale-stageGroup.scale.y)*easing;
 
     /*         var xAdjust = (zoompoint.x - game.camera.position.x) * (nextScale.x - prevScale.x);
            var yAdjust = (zoompoint.y - game.camera.position.y) * (nextScale.y - prevScale.y);
*/
}
            //Only move screen if we're not the same scale
            if (prevScale.x != nextScale.x || prevScale.y != nextScale.y) {
                var scaleAdjustX = nextScale.x / prevScale.x;
                var scaleAdjustY = nextScale.y / prevScale.y;
                var focusX = (game.camera.position.x * scaleAdjustX) + xAdjust*(rescalefactorx);
                var focusY = (game.camera.position.y * scaleAdjustY) + yAdjust*(rescalefactory);
                game.camera.focusOnXY(focusX, focusY);
            }

            //now actually scale the stage
            stageGroup.scale.x += (worldScale-stageGroup.scale.x)*easing;   //easing
            stageGroup.scale.y += (worldScale-stageGroup.scale.y)*easing;
       

}


// цикл игры
/*function update() {

        //touch zoom
        if(game.input.pointer1.isDown && game.input.pointer2.isDown){
            olddistance = distance;
            distance = Phaser.Math.distance(game.input.pointer1.x, game.input.pointer1.y, game.input.pointer2.x, game.input.pointer2.y);
            distancedelta = Math.abs(olddistance - distance);

            if (olddistance > distance && distancedelta > 4 ){ mapSizeCurrent -= 200;  }
            else if (olddistance < distance && distancedelta > 4 ){  mapSizeCurrent += 200;}
            mapSizeCurrent = Phaser.Math.clamp(mapSizeCurrent, worldwidth , mapSizeMax); //prevent odd scalefactors - set a minimum and maximum scale value
            worldScale = (mapSizeCurrent/mapSizeMax);

            //calculate point between fingers (zoompoint.x and zoompoint.y)
            if (game.input.pointer1.x < game.input.pointer2.x) { zoompoint.x =  game.input.pointer1.worldX + (Math.abs(game.input.pointer1.worldX - game.input.pointer2.worldX)/2); }
            else {zoompoint.x =  game.input.pointer2.worldX + (Math.abs(game.input.pointer1.worldX - game.input.pointer2.worldX)/2);  }
            if (game.input.pointer1.y < game.input.pointer2.y) { zoompoint.y =  game.input.pointer1.worldY + (Math.abs(game.input.pointer1.worldY - game.input.pointer2.worldY)/2); }
            else {zoompoint.y =  game.input.pointer2.worldY + (Math.abs(game.input.pointer1.worldY - game.input.pointer2.worldY)/2);  }
        }
        else {  // wheelzoom
            zoompoint.x = game.input.mousePointer.worldX;
            zoompoint.y = game.input.mousePointer.worldY;
        }

        // move camera / pan
        if(game.input.activePointer.isDown && !game.input.pointer2.isDown){
            if (oldcamera) { // if moving the world always continue from the last position
                game.camera.x += oldcamera.x - game.input.activePointer.position.x; 
                game.camera.y += oldcamera.y - game.input.activePointer.position.y; 
            }
            oldcamera = game.input.activePointer.position.clone();
        }
        // adjust camera center and zoom here
        else { 
            oldcamera = null; 
            rescalefactorx = mapSizeX / (mapSizeX * stageGroup.scale.x); // multiply by rescalefactor to get original world value
            rescalefactory = mapSizeY / (mapSizeY * stageGroup.scale.y);

            prevScale.x = stageGroup.scale.x;
            prevScale.y = stageGroup.scale.y;

            nextScale.x = prevScale.x + (worldScale-stageGroup.scale.x)*easing;
            nextScale.y = prevScale.y + (worldScale-stageGroup.scale.y)*easing;

            var xAdjust = (zoompoint.x - game.camera.position.x) * (nextScale.x - prevScale.x);
            var yAdjust = (zoompoint.y - game.camera.position.y) * (nextScale.y - prevScale.y);


            //Only move screen if we're not the same scale
            if (prevScale.x != nextScale.x || prevScale.y != nextScale.y) {
                var scaleAdjustX = nextScale.x / prevScale.x;
                var scaleAdjustY = nextScale.y / prevScale.y;
                var focusX = (game.camera.position.x * scaleAdjustX) + xAdjust*(rescalefactorx);
                var focusY = (game.camera.position.y * scaleAdjustY) + yAdjust*(rescalefactory);
                game.camera.focusOnXY(focusX, focusY);
            }

            //now actually scale the stage
            stageGroup.scale.x += (worldScale-stageGroup.scale.x)*easing;   //easing
            stageGroup.scale.y += (worldScale-stageGroup.scale.y)*easing;
        }
}*/





