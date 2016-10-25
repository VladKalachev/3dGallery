var game = new Phaser.Game(800, 600, Phaser.AUTO, "game" , { preload: preload, create: create, update: update });



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
        
        game.load.image('arrow', 'assets/arrow.png');
        game.load.image('arrowup', 'assets/arrow_up.png');
        game.load.image('BoxBlue', 'assets/BoxBlue.png');

}


/*function preload() {

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        //game.scale.setScreenSize(true);
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 480;
        this.scale.minHeight = 260;
        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 768;
        //this.scale.forceLandscape = true;
        
        game.load.image('clouds', 'https://fc08.deviantart.net/fs71/f/2010/328/c/e/seamless_tiling___cracked_by_cesstrelle-d33i6by.jpg');
        game.load.image('coin', 'http://png-3.findicons.com/files/icons/1588/farm_fresh_web/32/box.png');
}*/

function create() { 
    
    worldScale=1;

    cursors = game.input.keyboard.createCursorKeys();

    stageGroup = game.add.group(); // this group will contain everything except the UI for scaling
    backgroundobjects = game.add.group();
    groundobjects = game.add.group();

    mapSizeMax = mapSizeX;
    mapSizeCurrent = mapSizeMax;
 
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
        print1 = game.add.sprite(3850,3400,'print1');
        print2 = game.add.sprite(3850,2600,'print2');
        print3 = game.add.sprite(3150,2600,'print3');
        print4 = game.add.sprite(4400,2480,'print4');

/*ass стрелки*/

    button3 = game.add.button(4000,4000, 'arrowup', actionOnClickC, this);

    button4 = game.add.button(3870,4000, 'arrowup', actionOnClickD, this);

   // button = game.add.sprite(200, 530, 'arrow');
   // button.fixedToCamera = true;


    button1 = game.add.button(200, 530, 'arrow', actionOnClickA, this);
    button1.fixedToCamera = true;

    button2 = game.add.button(270, 530, 'BoxBlue', actionOnClickB, this);
    button2.fixedToCamera = true;

    

/*события клика*/
    
    /*клик на экрна*/
   // game.input.onDown.add(changeTint, this);

    // logo2.events.onInputDown.add(destroySprite, game);

   // logo3 = game.add.sprite(200, 530, 'arrow');


   /* logo3 = game.add.sprite(300, 570, 'life');
    logo3.fixedToCamera = true;*/

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

/*добавляем объекты в игровой мир*/
/*function create() {
        worldScale=1;
        
        stageGroup = game.add.group(); // this group will contain everything except the UI for scaling
        backgroundobjects = game.add.group();
        groundobjects = game.add.group();

        mapSizeMax = mapSizeX;
        mapSizeCurrent = mapSizeMax;


        coin = game.add.sprite(4000,4000,'coin');
        coin.scale.setTo(4,4);
        coin.anchor.setTo(0.5,0.5);

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
}*/


/*обработка события клика*/

function actionOnClickA () {

  //  console.log(111);
   game.camera.x = 3600;
   game.camera.y = 3700;
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

    //console.log(444);

    game.camera.x = 3600;
    game.camera.y = 3200;
   
}

function update() {

    /*управление с клавиатуры*/

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
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





