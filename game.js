Lemonade.include("initialize.js");
Lemonade.include("selectionbox.js");
Lemonade.include("map.js");
Lemonade.include("gui.js");
Lemonade.include("layout.js");
Lemonade.include("hero.js");
Lemonade.include("gamedata.js");
Lemonade.include("hero.js");
Lemonade.include("character.js");
Lemonade.include("chat.js");
Lemonade.include("serverhandle.js");
Lemonade.include("gametimer.js");

Lemonade.include ("data.js");

Lemonade.include("banner.js");

Lemonade.include("tutorial.js");
Lemonade.include("gamemode.js");

Lemonade.include("movemarker.js");

Lemonade.include("debug.js");

var MENU_LOGIN = -1;
var MENU_MAIN = 0;
var MENU_INGAME = 1;
var MENU_GAMEOVER = 2;
var MENU_LOADING = 3;
var MENU_GOINGINTOGAME = 4;

// Global variables
var loading = true;
var menuId = 0;
var loggedIn = false;

var GLB_CAMERA_SPEED_1 = 1;

var serverHandle;

var temp = {};

var layout;

var BACKBACKGROUND;

var gameVersion = "Pre Alpha V1.0.9.?";
var socket;
var connected = false;

var aboutInfo = "Hive - Created by Michael George, under the name of THeOneStone. Currently a solo project. To contact them, you can email: streetbard16@hotmail.com. Checked daily.";

function init() {
    Lemonade.initialize(1080, 720, "game", true, false);

    loadGameComponents();

    Lemonade.Canvas.context.imageSmoothingEnabled = false;

    menuId = MENU_LOADING;
    // Load Assets and such
    if (!loggedIn) {
        menuId = MENU_LOADING;
        document.getElementById("LOG").innerHTML += "NOT LOGGED IN!<br>";
    } else
        document.getElementById("LOG").innerHTML += "Logged in.<br>";

    BACKBACKGROUND = Lemonade.addEntity(new Lemonade.Entity());
    BACKBACKGROUND.addComponent(Lemonade.Components.visible);
    BACKBACKGROUND.addComponent(Lemonade.Components.rectangle);
    BACKBACKGROUND.addComponent(Lemonade.Components.color);
    BACKBACKGROUND.set("color", "red", "#ffffff");
    BACKBACKGROUND.addComponent(Lemonade.Components.position);
    BACKBACKGROUND.set("position", "width", 1080);
    BACKBACKGROUND.set("position", "height", 720);

    changeMenu(menuId);

    /*socket = new io.Socket('localhost', {
      port: 9808
    });*/
    socket = io.connect("http://localhost:9808");
    serverHandle = new ServerHandle();

    socket.on('connect', function () {
        connected = true;
    });
    socket.on('message', serverHandle.handleMessage);
    socket.on('disconnect', function () {
        connected = false;
    });
}

function loop() {
    switch (menuId) {
        case MENU_INGAME:
            ingame();
            break;
        case MENU_MAIN:
            mainMenu();
            break;
        case MENU_LOADING:
            loadAssets();
            menuId = MENU_LOGIN;
            break;
        case MENU_GOINGINTOGAME:
            loadingMatchOnline();
            break;
        case MENU_LOGIN:
            loginMenu();
            break;
        default:
            loginMenu();
            break;
    }
}

function changeMenu(newMenu) {
    loading = true;

    Lemonade.tweenList.tweens.splice(0);
    Banner.reset();

    menuId = newMenu;
    GameData.destroy();

    GameGui.destroy();

    MAGNIFY_ACTIVE = undefined; // Need to find a better way to reset this.

    Lemonade.EntityHandler.entities.splice(0);
    Lemonade.mouse.leftPressed = false;

    BACKBACKGROUND.set("color", "red", "#FFFFFF");

    Lemonade.addEntity(BACKBACKGROUND);

    // Only used to store temporary things in menus.
    temp = {};

    temp.versionInfo = Lemonade.addEntity(new Lemonade.Entity());
    temp.versionInfo.addComponent(Lemonade.Components.visible);
    temp.versionInfo.addComponent(Lemonade.Components.color);
    temp.versionInfo.set("color", "red", "#000000");
    temp.versionInfo.addComponent(Lemonade.Components.label);
    temp.versionInfo.set("label", "text", gameVersion + " M: " + menuId);
    temp.versionInfo.set("label", "style", "20px Courier New");
    temp.versionInfo.addComponent(Lemonade.Components.position);
    temp.versionInfo.set("position", "x", 0);
    temp.versionInfo.set("position", "y", 700); // No need to set height and width, since we are only displaying text.
}

function loadingMatchOnline() {
    if (loading) {
        loading = false;

        temp.status = new LoadingText(["Connecting", "Getting match details", "Waiting for other player", "Finishing up"], UI_LOAD_DEFAULT, 200, "DONE!");
        temp.status.addEntity();

        temp.exitButton = new Button("QUIT", function () {
            changeMenu(MENU_MAIN);
        }, 400, 200);
        temp.exitButton.addEntity();

        temp.matchData = {};
        temp.matchData.complete = false;
        temp.matchData.fail = false;

        var queryTime = 500; // Every half a second.
        temp.interval = setInterval(function () {
            socket.emit('message', "GETMATCHDATA")
        }, queryTime);

    }

    if (temp.matchData !== undefined && temp.matchData.complete === true) {
        clearInterval(temp.interval);
        var tmpMD = temp.matchData;
        changeMenu(MENU_INGAME);
        temp.matchData = tmpMD;
    }
}

function loginMenu() {
    if (loading) {
        loading = false;

        temp.title = Lemonade.addEntity(new Lemonade.Entity());
        temp.title.addComponent(Lemonade.Components.visible);
        temp.title.addComponent(Lemonade.Components.image);
        temp.title.set("image", "image", Lemonade.Repository.getImage("TITLESCREENIMAGE"));
        temp.title.addComponent(Lemonade.Components.position);
        temp.title.set("position", "x", Lemonade.Canvas.canvasWidth / 2 - 500);
        temp.title.set("position", "y", 50); // No need to set height and width, since we are only displaying text.


        temp.userInput = new TextInput(undefined, 16, false, "", 20, "Courier New", 220, 407, "Username");
        temp.userInput.addEntity();
        // Password entry
        temp.passInput = new TextInput(undefined, 16, true, "", 20, "Courier New", 220, 440, "Password");
        temp.passInput.addEntity();


        temp.loginButton = new Button("Login", function () {
            socket.emit('message', "LOGIN " + temp.userInput.textValue + " " + temp.passInput.textValue);
            setTimeout(function () {
                if (loggedIn == true)
                    changeMenu(MENU_MAIN);
                else if (connected === false) {
                    alert("NOT CONNECTED!");
                    changeMenu(MENU_MAIN);
                }
            }, 2000);
        }, 250, 480);
        temp.loginButton.addEntity();

        temp.guestButton = new Button("Guest", function () {
            changeMenu(MENU_MAIN);
        }, 400, 480);
        temp.guestButton.addEntity();

    }
}

function mainMenu() {
    if (loading) {
        loading = false;

        // load the card list.
        loadCardList();
        loadHeroList();
        loadPlayerInfo();

        temp.title = Lemonade.addEntity(new Lemonade.Entity());
        temp.title.addComponent(Lemonade.Components.visible);
        temp.title.addComponent(Lemonade.Components.image);
        temp.title.set("image", "image", Lemonade.Repository.getImage("TITLESCREENIMAGE_1"));
        temp.title.addComponent(Lemonade.Components.position);
        temp.title.set("position", "x", Lemonade.Canvas.canvasWidth / 2 - 500);
        temp.title.set("position", "y", -25);

        // Option to play tutorial.
        temp.playTutorial = new ImageButton(function () {
            changeMenu(MENU_INGAME);
            QuestSelected = TutorialQuest0;
            GameData.flags.firstTime = true;
        }, 100, 350, "BUTTON_TUTORIAL", 114 * 3, 14 * 3);
        temp.playTutorial.addEntity();

        temp.playOffline = new ImageButton(function () {
            changeMenu(MENU_INGAME);
            if (GameData.user.lastPlay === undefined) { // We will set this on a complete match.
                GameData.flags.firstTime = true;
            }
        }, 100, 425, "BUTTON_QUICKPLAY", 144 * 3, 13 * 3);
        temp.playOffline.addEntity();

        temp.chatBox = new ChatBox();
        temp.chatBox.hide(1);

        if (loggedIn === true) {
            temp.playOnline = new Button("Play Online (Multiplayer)", function () {
                changeMenu(MENU_GOINGINTOGAME);
            }, 100, 200);
            temp.playOnline.addEntity();
        } else
            temp.chatBox.addText("|Not logged in.");

        temp.about = new ImageButton(function () {
            alert(aboutInfo);
        }, 100, 500, "BUTTON_ABOUT", 137 * 3, 14 * 3);
        temp.about.addEntity();

        temp.kingBosh = new KingBosh();
        //temp.kingBosh.speak(["Welcome to my Domain. You will be fighting for me. But not now.", "You can fight for me later. First try out the tutorial.", "Or you can play an offline game. Wouldn't recommend online. YET.","Until Next time, Hero."], undefined, 400);
    }
}

function charSelect(newQuest) {
    // Should always be first, because it resets loadedAssets.
    Lemonade.load(Lemonade.loadScreen(function () {}, function () {}, ["ASSET_PLAYERINFO", "ASSET_CARDLIST", "ASSET_HEROLIST"], ["content/images/map/cave1.png", "GUI_TIMER", "GUI_TOPBAR"], 0));


    temp.map = new SelectionMap();
    Lemonade.addEntity(temp.map);

    var hl = HeroList();
    for (var i = 0; i < hl.length; i++) {
        var tmphero = new HeroFromList(hl[i], 0);
        DeckUtils.insertCardForHero(tmphero, 0, new CARD_FUNCTION.CardHeroSelect(hl[i], newQuest));
        DeckUtils.insertCardForHero(tmphero, 0, new CARD_FUNCTION.CardInformation(hl[i], "Moves", "Expand card panel to see moves", "cgeneral.png"));
        DeckUtils.insertCardForHero(tmphero, 0, new CARD_FUNCTION.CardInformation(hl[i], "Resource", FortUtils.getMaxResource(tmphero) + "|Regeneration - " + FortUtils.getRegenerationSpeed(tmphero), "energy1.png"));
        DeckUtils.insertCardForHero(tmphero, 0, new CARD_FUNCTION.CardInformation(hl[i], "Discipline", FortUtils.getDiscipline(tmphero), "discipline.png"));
        DeckUtils.insertCardForHero(tmphero, 0, new CARD_FUNCTION.CardInformation(hl[i], "Move Range", FortUtils.getMoveRange(tmphero), "movespeed.png"));
        DeckUtils.insertCardForHero(tmphero, 0, new CARD_FUNCTION.CardInformation(hl[i], "Health", FortUtils.getMaxHealth(tmphero), "health1.png"));
        FortUtils.setTileX(tmphero, 1 + i % 8);
        FortUtils.setTileY(tmphero, 2 + Math.floor(i / 8));
        Lemonade.addEntity(tmphero);
        GameData.heroes.push(tmphero);

        var deck = DeckUtils.getDeckFromHero(tmphero);
        for (var j = 0; j < deck.length; j++) {
            if (deck[j].name !== FortUtils.getName(tmphero))
                deck[j].disabled = true;

        }
    }
    temp.player = 0;

    // Initialize the interface
    GameGui.activate(true, true);

    temp.timeLabel = new Lemonade.Entity();
    temp.timeLabel.addComponent(Lemonade.Components.visible).
    addComponent(Lemonade.Components.label);
    temp.timeLabel.set("label", "text", "timer");
    Lemonade.addEntity(temp.timeLabel);

    temp.moveMarker = new MoveMarker();
    Lemonade.addEntity(temp.moveMarker);

    GameData.quest = new CharacterSelectionQuest();
    GameTimer.start();


    temp.chatBox = new ChatBox();
    temp.chatBox.hide(1);
}

function ingame() {
    if (loading) {
        loading = false;

        GameData.flags.inProgress = true;
        if (HeroSelected === undefined || QuestSelected === undefined) {
            charSelect(QuestSelected || GameModeFightSolo);
            return;
        }

        temp.map = new TestingMap();
        Lemonade.addEntity(temp.map);

        temp.player = new HeroFromList(HeroSelected, 1);
        FortUtils.setTileX(temp.player, 2);
        FortUtils.setTileY(temp.player, 2);
        Lemonade.addEntity(temp.player);
        GameData.heroes.push(temp.player);
        temp.selected = temp.player; // Always select the player first, so they know who they are.

        // Add the selected cards to the player.
        if(SelectedCards !== undefined)
            for(var i=0;i<SelectedCards.length;i++){
                var ccl = CardFromList(SelectedCards[i]);
                if(CardSelect.canSelect(temp.player, ccl))
                    DeckUtils.addCard(temp.player, ccl);
            }
        temp.player = 1;


        temp.enemy = new HeroFromList("Jester", 0);
        FortUtils.setTileX(temp.enemy, 6);
        FortUtils.setTileY(temp.enemy, 6);
        Lemonade.addEntity(temp.enemy);
        GameData.heroes.push(temp.enemy);
        temp.enemy = 0;

        temp.moveMarker = new MoveMarker();
        Lemonade.addEntity(temp.moveMarker);

        temp.timeLabel = new Lemonade.Entity();
        temp.timeLabel.addComponent(Lemonade.Components.visible).
        addComponent(Lemonade.Components.label);
        temp.timeLabel.set("label", "text", "timer");
        Lemonade.addEntity(temp.timeLabel);

        // Moving map with right click variables.
        temp.startX = 0;
        temp.startY = 0;
        temp.stmx = 0;
        temp.stmy = 0;
        temp.started = false;

        // Change the background color to black. its cleaner.
        BACKBACKGROUND.set("color", "red", "#6495ED");

        // Initialize the interface
        GameGui.activate(true, false);

        temp.chatBox = new ChatBox();
        temp.chatBox.hide(1);

        /*/1998
        if(GameData.flags.firstTime === true)
        {
            GameData.quest = new TutorialQuest0();
        }else{
            GameData.quest = new GameModeFightSolo();
            GameTimer.start();
        }*/
        GameData.quest = new QuestSelected();
        GameTimer.start();

        // Reset the heroselected and questselected for use in the future.
        HeroSelected = undefined;
        QuestSelected = undefined;
        SelectedCards = undefined;

        return;
    }
    // Update the interface.
    GameGui.update();

    // Update the timer display
    temp.timeLabel.set("label", "text", "Time: " + GameTimer.time);

    // Move map with right click.
    if (Lemonade.mouse.middlePressed === true) {
        if (temp.started === false) {
            temp.startX = Lemonade.mouse.x;
            temp.startY = Lemonade.mouse.y;

            temp.stmx = Lemonade.Camera.getX();
            temp.stmy = Lemonade.Camera.getY();
            temp.started = true;
        }
        Lemonade.Camera.setX(temp.stmx - (temp.startX - Lemonade.mouse.x));
        Lemonade.Camera.setY(temp.stmy - (temp.startY - Lemonade.mouse.y));

        if (Lemonade.Camera.getX() > Lemonade.Canvas.canvasWidth - temp.map.get("tilemap", "width") * GLB_TILE_SIZE)
            Lemonade.Camera.setX(Lemonade.Canvas.canvasWidth - temp.map.get("tilemap", "width") * GLB_TILE_SIZE);
        if (Lemonade.Camera.getX() < 0)
            Lemonade.Camera.setX(0);
        if (Lemonade.Camera.getY() < (Lemonade.Canvas.canvasHeight - temp.map.get("tilemap", "height") * GLB_TILE_SIZE))
            Lemonade.Camera.setY((Lemonade.Canvas.canvasHeight - temp.map.get("tilemap", "height") * GLB_TILE_SIZE));
        if (Lemonade.Camera.getY() > 0)
            Lemonade.Camera.setY(0);
    } else
        temp.started = false;

    if (Lemonade.mouse.rightPressed === true) {
        var x = Lemonade.mouse.x - Lemonade.Camera.getX();
        var y = Lemonade.mouse.y - Lemonade.Camera.getY();
        var tx = Math.floor(x / GLB_TILE_SIZE);
        var ty = Math.floor(y / GLB_TILE_SIZE);

        MarkerUtils.disableMarker(temp.moveMarker);

        if (temp.selected !== undefined) {
            DeckUtils.setCardToCast(temp.selected, undefined);
        }

        Lemonade.mouse.rightPressed = false;
    }
    if (Lemonade.Event.eventExists(EVENT_KEYDOWN + Lemonade.Keyboard.keyCode.escape, true, false)) {}
    if (Lemonade.Event.eventExists(EVENT_KEYDOWN + Lemonade.Keyboard.keyCode.E, true, false)) {
        MapUtils.updateMap(temp.map);
    }
    // Move camera
    if (Lemonade.Event.eventExists(EVENT_KEYDOWN + Lemonade.Keyboard.keyCode.W, true, false) === true) {
        Lemonade.Camera.moveY(GLB_CAMERA_SPEED_1);
    }
    if (Lemonade.Event.eventExists(EVENT_KEYDOWN + Lemonade.Keyboard.keyCode.S, true, false) === true) {
        Lemonade.Camera.moveY(-GLB_CAMERA_SPEED_1);
    }
    if (Lemonade.Event.eventExists(EVENT_KEYDOWN + Lemonade.Keyboard.keyCode.A, true, false) === true) {
        Lemonade.Camera.moveX(GLB_CAMERA_SPEED_1);
    }
    if (Lemonade.Event.eventExists(EVENT_KEYDOWN + Lemonade.Keyboard.keyCode.D, true, false) === true) {
        Lemonade.Camera.moveX(-GLB_CAMERA_SPEED_1);
    }
    if (Lemonade.Event.eventExists(EVENT_KEYDOWN + Lemonade.Keyboard.keyCode.space, true, false) === true) {
        if (GameTimer.paused === false) {
            GameTimer.time = GameTimer.interval - 1;
        }
    }

}
// TODO move to gameData


loopRender = function () {
    // Graphically show possible moves
    if (menuId == MENU_INGAME && GameTimer.paused == false && temp.selected !== undefined) {

        if (GameGui.cardToCast !== undefined) {
            var img = Lemonade.Repository.getImage("selectioncard");
            for (var x = -GameGui.cardToCast.castingRange - 4; x <= GameGui.cardToCast.castingRange + 4; x++) {
                for (var y = -GameGui.cardToCast.castingRange - 4; y <= GameGui.cardToCast.castingRange + 4; y++) {
                    var tx = FortUtils.getTileX(temp.selected) + x;
                    var ty = FortUtils.getTileY(temp.selected) + y;
                    if (GameGui.cardToCast.canCastRange(temp.selected, temp.map, tx, ty) === false)
                        continue;

                    Lemonade.Canvas.context.save();
                    Lemonade.Canvas.context.globalAlpha = 0.2;
                    img.draw(tx * GLB_TILE_SIZE + Lemonade.Camera.getX(), ty * GLB_TILE_SIZE + Lemonade.Camera.getY(),
                        GLB_TILE_SIZE, GLB_TILE_SIZE, MapUtils.NeighborAwareness.getTileIDwalkhero(temp.map, tx, ty, 2, temp.selected, GameGui.cardToCast.castingRange), Lemonade.Canvas.context, 0);
                    Lemonade.Canvas.context.restore();
                }
            }
        }
        /*else{    
                    var img = Lemonade.Repository.getImage("selection");   
                    for(var x=-FortUtils.getMoveRange(temp.player)-3; x<= FortUtils.getMoveRange(temp.player)+3; x++)
                    {
                        for(var y=-FortUtils.getMoveRange(temp.player)-3; y<= FortUtils.getMoveRange(temp.player)+3; y++)
                        {
                            var tx = FortUtils.getTileX(temp.player) + x;
                            var ty = FortUtils.getTileY(temp.player) + y;
                            if(MapUtils.canHeroMove(temp.player, temp.map, tx, ty) === false)
                                continue;
                            
                            Lemonade.Canvas.context.save();
                            Lemonade.Canvas.context.globalAlpha = 0.2;
                            img.draw(tx * GLB_TILE_SIZE + Lemonade.Camera.getX(), ty * GLB_TILE_SIZE + Lemonade.Camera.getY(),
                                GLB_TILE_SIZE, GLB_TILE_SIZE, MapUtils.NeighborAwareness.getTileIDwalkhero(temp.map, tx, ty, 2, temp.player, FortUtils.getMoveSpeed(temp.player)), Lemonade.Canvas.context, 0);
                            Lemonade.Canvas.context.restore();
                        }
                    }
                }*/
    }
    // END~~
};

function CreateOffline() {
    temp.player = new Valkyrie();
    temp.player.number = 1;
    Lemonade.addEntity(temp.player.e);

    temp.enemy = new Valkyrie();
    temp.enemy.tileX = 6;
    temp.enemy.number = 2;
    Lemonade.addEntity(temp.enemy.e);

    temp.maxTime = 10;
    temp.time = temp.maxTime;
    // Just for debug
    temp.enemy.tileX = 3;

    // Activate the timer
    activateOfflineTimer(true);
}

function CreateOnline() {
    temp.player = new Valkyrie();
    temp.player.number = 1;
    Lemonade.addEntity(temp.player.e);

    if (temp.matchData === undefined || temp.matchData.fail === true) {
        alert("Could not get match data.");
        changeMenu(MENU_MAIN);
        return;
    }

    activateOnlineTimer(true);
}

function loadCardList(){
    Lemonade.readTextFile("content/files/card_list.json", function(t){
        Lemonade.Repository.addAsset(new Lemonade.Asset("ASSET_CARDLIST",JSON.parse(t), ASSET_JSON_OBJECT), true);
    });
}

function loadHeroList(){
    Lemonade.readTextFile("content/files/hero_list.json", function(t){
        Lemonade.Repository.addAsset(new Lemonade.Asset("ASSET_HEROLIST",JSON.parse(t), ASSET_JSON_OBJECT), true);
    });
}
function loadPlayerInfo(){
    // Todo, possibly load from an online resource to have data be saved.
    Lemonade.readTextFile("content/files/offline_save.json", function(t){
        Lemonade.Repository.addAsset(new Lemonade.Asset("ASSET_PLAYERINFO",JSON.parse(t), ASSET_JSON_OBJECT), true);
    });
}