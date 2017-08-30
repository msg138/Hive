Lemonade.include("cardselect.js");

var readOnlyGameLoaded = false;

function GUI(){
    
}

var GUI_CARDSIZE = 64;
var GUI_CARDSPACE = 64;
var GUI_LEFTSPACE = 64*4;
var GUI_MAXROW = 6;

var GUI_CHARHEALTHPX = 63;
var GUI_CHARHEALTHPY = 7;
var GUI_CHARENERGYPX = 71;
var GUI_CHARENERGYPY = 9;
var GUI_CHARHEALTHPH = 54;
var GUI_CHARENERGYPH = 52;
var GUI_CHARHEALTHPW = 5;
var GUI_CHARENERGYPW = 5;
var GUI_CHARIMAGEPX = 3;
var GUI_CHARIMAGEPY = 4;
var GUI_CHARIMAGEPH = 57;

var GUI_CHARINFOSCALE = 2.25;

var GUI_EXPANDCARDPANEL = 200;

var GameGui = {};

GameGui.cardToCast = undefined;

GameGui.previouslySelected = undefined;

GameGui.timerTopImage = undefined;
GameGui.guiTopImage = undefined;

GameGui.expandCardPanelButton = undefined;
GameGui.characterInformation = undefined;

GameGui.expandedCardPanel = false;
GameGui.readOnlyCardPanel = false;

GameGui.cardPanelex = 0;
GameGui.cardPaneley = 0;

GameGui.cardSelection = false;

GameGui.activate = function(firstTime, cardSelection){
    firstTime = firstTime || true;
    if(cardSelection !== undefined)
        GameGui.cardSelection = cardSelection;
    else
        GameGui.cardSelection = GameGui.cardSelection || false;
    readOnlyGameLoaded = true;
    GameGui.destroy();
    
    GameGui.characterInformation = GameGui.setupCharacterInfo();

    if(temp.selected !== undefined){
        var b = DeckUtils.getDeckFromHero(temp.selected);
        for(var i=0;i<b.length;i++)
        {
            GameGui.cards.push(GameGui.Card(b[i]));
            Lemonade.addEntity(GameGui.cards[GameGui.cards.length - 1]);
        }

        GameGui.characterInformation.charImage.set("image", "image", temp.selected.get("image", "image"));
    }
    
    GameGui.pointerCard = new Lemonade.Entity();
    GameGui.pointerCard.addComponent(Lemonade.Components.visible);
    GameGui.pointerCard.addComponent(Lemonade.Components.position);
    GameGui.pointerCard.set("position", "width", 10);
    GameGui.pointerCard.set("position", "height", 15);
    GameGui.pointerCard.addComponent(Lemonade.Components.image);
    
    Lemonade.addEntity(GameGui.pointerCard);

    GameGui.guiTopImage = GameGui.setupTopImage();
    Lemonade.addEntity(GameGui.guiTopImage);
    GameGui.timerTopImage = GameGui.setupTimer();
    Lemonade.addEntity(GameGui.timerTopImage);

    GameGui.expandCardPanelButton = GameGui.setupExpandCardPanelButton();
    Lemonade.addEntity(GameGui.expandCardPanelButton);

    Lemonade.addEntity(GameGui.characterInformation.panel);
    Lemonade.addEntity(GameGui.characterInformation.energybar);
    Lemonade.addEntity(GameGui.characterInformation.healthbar);
    Lemonade.addEntity(GameGui.characterInformation.charImage);

    PauseMenu.initPauseMenu();

    if(GameGui.cardSelection === true){
        CardSelect.initialize();
    }
};

GameGui.destroy = function(){
    for(var i=0;i<GameGui.cards.length;i++)
        Lemonade.removeEntity(GameGui.cards[i].id);
    GameGui.cards = [];
    if(GameGui.timerTopImage !== undefined)
        Lemonade.removeEntity(GameGui.timerTopImage.id);
    if(GameGui.guiTopImage !== undefined)
        Lemonade.removeEntity(GameGui.guiTopImage.id);
    if(GameGui.pointerCard !== undefined)
        Lemonade.removeEntity(GameGui.pointerCard.id);
    if(GameGui.expandCardPanelButton !== undefined)
        Lemonade.removeEntity(GameGui.expandCardPanelButton.id);
    if(GameGui.characterInformation !== undefined){
        Lemonade.removeEntity(GameGui.characterInformation.panel.id);
        Lemonade.removeEntity(GameGui.characterInformation.healthbar.id);
        Lemonade.removeEntity(GameGui.characterInformation.energybar.id);
        Lemonade.removeEntity(GameGui.characterInformation.charImage.id);
    }
    // Destroy the card selection as well.
    CardSelect.destroy();
    PauseMenu.destroyMenu();
};

GameGui.updateCardTooltips = function(){
    MarkerUtils.disableMarker(temp.moveMarker);
    if(temp.selected === undefined)
        return;
    for(var i=0;i<GameGui.cards.length;i++)
    {
        GameGui.cards[i].set("tooltip", "information", DeckUtils.getDeckFromHero(temp.selected)[i].getTooltip());
    }
};

GameGui.update = function(){

    // GameGui.expandCardPanel(GameGui.readOnlyCardPanel === GameGui.expandedCardPanel);

    if(temp.selected === undefined || GameGui.cards.length <= GUI_MAXROW)
        GameGui.expandCardPanelButton.set("visible", "isVisible", false);
    else{
        GameGui.expandCardPanelButton.set("visible", "isVisible", true);
    }

    // Update information if we need to.
    if(GameGui.previouslySelected !== temp.selected && temp.selected !== undefined){
        GameGui.activate(false);

        var ccc = DeckUtils.getCardToCast(temp.selected);
        if(ccc !== undefined){
            MarkerUtils.setMarker(temp.moveMarker, ccc.variables.x, ccc.variables.y, ccc.variables.x * GLB_TILE_SIZE + GLB_TILE_SIZE/2, ccc.variables.y * GLB_TILE_SIZE + GLB_TILE_SIZE/2, ccc.cardToCast);
        }else
            MarkerUtils.disableMarker(temp.moveMarker);

        temp.map.set("tilemap", "updateCover", true);

        GameGui.previouslySelected = temp.selected;
    }

    if(temp.selected !== undefined){
        GameGui.characterInformation.healthbar.set("position", "y", 720 - 64*GUI_CHARINFOSCALE + GUI_CHARHEALTHPY*GUI_CHARINFOSCALE + 
            (1.0 - (FortUtils.getHealth(temp.selected) / FortUtils.getMaxHealth(temp.selected)))*GUI_CHARHEALTHPH*GUI_CHARINFOSCALE);
            
        GameGui.characterInformation.healthbar.set("position", "height", ((FortUtils.getHealth(temp.selected) / FortUtils.getMaxHealth(temp.selected)))*GUI_CHARHEALTHPH*GUI_CHARINFOSCALE);

        GameGui.characterInformation.energybar.set("position", "y", 720 - 64*GUI_CHARINFOSCALE + GUI_CHARENERGYPY*GUI_CHARINFOSCALE + 
            (1.0 - (FortUtils.getResource(temp.selected) / FortUtils.getMaxResource(temp.selected)))*GUI_CHARENERGYPH*GUI_CHARINFOSCALE);
            
        GameGui.characterInformation.energybar.set("position", "height", ((FortUtils.getResource(temp.selected) / FortUtils.getMaxResource(temp.selected)))*GUI_CHARENERGYPH*GUI_CHARINFOSCALE);
    
        GameGui.characterInformation.healthbar.set("tooltip", "information", "Health: " + FortUtils.getHealth(temp.selected) + " / " + FortUtils.getMaxHealth(temp.selected));
        GameGui.characterInformation.energybar.set("tooltip", "information", "Energy: " + FortUtils.getResource(temp.selected) + " / " + FortUtils.getMaxResource(temp.selected));
    }

    // Update pointer card position
    GameGui.pointerCard.set("position", "x", Lemonade.mouse.x - 5);
    GameGui.pointerCard.set("position", "y", Lemonade.mouse.y - 7.5);
    
    // If right is clicked, remove current card queue
    if(Lemonade.mouse.rightPressed === true && GameGui.cardToCast !== undefined){
        GameGui.cardToCast = undefined;
        Lemonade.mouse.rightPressed = false;
    }
    
    // Update position of card images 
    //      and check if any are clicked.
    for(var i=0;i<GameGui.cards.length;i++)
    {
        if(temp.selected === undefined){
            GameGui.cards[i].set("visible", "isVisible", false);
            continue;
        }else
            GameGui.cards[i].set("visible", "isVisible", true);
        var position = GameGui.getCardPosition(GameGui.cards[i], i%GUI_MAXROW, Math.floor(i/GUI_MAXROW), Math.ceil(GameGui.cards.length/GUI_MAXROW));
        // Update card position if they are not being zoomed.
        if(GameGui.cards[i].get("magnify", "progress") <= 0){
            GameGui.cards[i].set("position", "x", position.x);
            GameGui.cards[i].set("position", "y", position.y);
        }
        // Update the cooldown status of card or if not enough resource, red it out.
        if(DeckUtils.getDeckFromHero(temp.selected)[i].enoughResource(temp.selected) === false ||
            DeckUtils.getDeckFromHero(temp.selected)[i].onCooldown() ||
            DeckUtils.getDeckFromHero(temp.selected)[i].disabled === true)
        {
            GameGui.cards[i].set("cover", "color", "#dd1111");
        }else{
            GameGui.cards[i].set("cover", "color", "#ffffff");
            GameGui.cards[i].set("cover", "opacity", 0.2);
        }
        if(DeckUtils.getDeckFromHero(temp.selected)[i].onCooldown() === true){
            GameGui.cards[i].set("cover", "height", 
            (1 - DeckUtils.getDeckFromHero(temp.selected)[i].currentCooldown/DeckUtils.getDeckFromHero(temp.selected)[i].cooldown)*
             GameGui.cards[i].get("position", "height"));
        }else if(DeckUtils.getDeckFromHero(temp.selected)[i].enoughResource(temp.selected) === false)
        {
            GameGui.cards[i].set("cover", "height", GameGui.cards[i].get("position", "height"));
        }else
            GameGui.cards[i].set("cover", "height", 0);
        
        if(Lemonade.CompVar.MAGNIFY_ACTIVE === GameGui.cards[i].id && 
            Lemonade.Event.eventExists(EVENT_COLLIDE + 'mouse', GameGui.cards[i].id, true, true) === true)
        {
            if(Lemonade.mouse.leftPressed === true)
            {
                if(DeckUtils.getDeckFromHero(temp.selected)[i].canCast(temp.selected) === true)
                {
                    GameGui.cardToCast = DeckUtils.getDeckFromHero(temp.selected)[i];
                    GameGui.pointerCard.set("image", "image", GameGui.cards[i].get("image", "image"));
                    // Close the card panel if it's open
                    if(GameGui.readOnlyCardPanel === true){
                        GameGui.expandCardPanel(false);
                    }
                }else
                {
                    addChat("|Cannot cast spell.");
                }
                Lemonade.mouse.leftPressed = false;
            }
        }
    }
    
    if(GameGui.cardToCast === undefined)
    {
        GameGui.pointerCard.set("visible", "isVisible", false);
    }else{
        GameGui.pointerCard.set("visible", "isVisible", true);
        
        // was going to make it be auto cast if self cast. if(GameGui.cardToCast.)
        if(GameGui.cardToCast.castingRange == CAST_SELF){
            var xx = FortUtils.getTileX(temp.selected);
            var yy = FortUtils.getTileY(temp.selected);
            DeckUtils.setCardToCast(temp.selected, new CardCast(GameGui.cardToCast, {x: xx, y: yy}));
            MarkerUtils.setMarker(temp.moveMarker, xx, yy, (xx+1)*GLB_TILE_SIZE - GLB_TILE_SIZE/2, (yy+1)*GLB_TILE_SIZE - GLB_TILE_SIZE/2, GameGui.cardToCast);
            GameGui.cardToCast = undefined;
        }
        
        // Handle the things that do with playing a card.
        if(Lemonade.mouse.leftPressed === true)
        {
            Lemonade.mouse.leftPressed = false;
            var x = Lemonade.mouse.x - Lemonade.Camera.getX();
            var y = Lemonade.mouse.y - Lemonade.Camera.getY();
            var xx = Math.floor(x / GLB_TILE_SIZE);
            var yy = Math.floor(y / GLB_TILE_SIZE);
            DeckUtils.setCardToCast(temp.selected, new CardCast(GameGui.cardToCast, {x: xx, y: yy}));
            MarkerUtils.setMarker(temp.moveMarker, xx, yy, x, y, GameGui.cardToCast);
            GameGui.cardToCast = undefined;
        }
    }


    // Update the game timer.
    var ttime = GameTimer.interval - (GameTimer.time % GameTimer.interval);
    GameGui.timerTopImage.set("image", "sprite", ttime);

    GameGui.timerTopImage.set("tooltip", "information", "Turn: " + GameTimer.getTurns() + "|Objective: " + GameData.quest.description);

    PauseMenu.keepItemsUp();

    // Update the card seleciton panel if needed.
    if(CardSelect.initialized === true)
        CardSelect.update();
};

GameGui.cards = [];

GameGui.Card = function(c){
    var e = new Lemonade.Entity();
    e.addComponent(Lemonade.Components.visible);
    e.addComponent(Lemonade.Components.position);
    e.addComponent(Lemonade.Components.keeporder);
    e.addComponent(Lemonade.Components.circle);
    e.set("circle", "radius", GUI_CARDSIZE/2 +1);
    e.set("circle", "offsetX", GUI_CARDSIZE/2);
    e.set("circle", "offsetY", GUI_CARDSIZE/2);

    e.addComponent(Lemonade.Components.image);
    e.set("image", "image", Lemonade.Repository.addImage(c.imageName, c.imageName, 32, 32));
    
    e.set("position", "width", GUI_CARDSIZE);
    e.set("position", "height", GUI_CARDSIZE);
    
    e.addComponent(Lemonade.Components.tooltip);
    e.set("tooltip", "information", c.getTooltip());
    
    e.addComponent(Lemonade.Components.collide);
    e.addComponent(Lemonade.Components.magnify);
    e.set("magnify", "nx", -6);
    e.set("magnify", "ny", -6);
    e.set("magnify", "nw", 12);
    e.set("magnify", "nh", 12);

    e.set("magnify", "cr", 6);
    
    e.set("magnify", "speed", 4);
    
    e.addComponent(Lemonade.Components.cover);
    
    return e;
};

GameGui.setupTimer = function(){
    var e = new Lemonade.Entity();
    e.addComponent(Lemonade.Components.visible);
    e.addComponent(Lemonade.Components.position);
    e.addComponent(Lemonade.Components.keeporder);
    e.addComponent(Lemonade.Components.image);
    e.set("image", "image", Lemonade.Repository.getImage("GUI_TIMER"));

    e.addComponent(Lemonade.Components.collide);
    e.addComponent(Lemonade.Components.tooltip);
    e.set("tooltip", "information", "&TU\n&OBJ");

    //e.get("image", "image").origin

    e.set("position", "width", 64);
    e.set("position", "height",64);

    e.set("position", "x", Lemonade.Canvas.canvasWidth / 2 - 64);
    e.set("position", "y", 0);
    return e;
};
GameGui.setupTopImage = function(){
    var e = new Lemonade.Entity();
    e.addComponent(Lemonade.Components.visible);
    e.addComponent(Lemonade.Components.position);
    e.addComponent(Lemonade.Components.image);
    e.addComponent(Lemonade.Components.keeporder);
    e.set("image", "image", Lemonade.Repository.getImage("GUI_TOPBAR"));

    //e.addComponent(Lemonade.Components.collide);
    //e.addComponent(Lemonade.Components.tooltip);
    //e.set("tooltip", "information", "&TU\n&OBJ");

    //e.get("image", "image").origin

    e.set("position", "width", Lemonade.Canvas.canvasWidth);
    e.set("position", "height",64);

    e.set("position", "x", 0);
    e.set("position", "y", 0);
    return e;
};

GameGui.setupExpandCardPanelButton = function(){
    var e = new Lemonade.Entity();
    e.addComponent(Lemonade.Components.visible);
    e.addComponent(Lemonade.Components.position);
    e.addComponent(Lemonade.Components.keeporder);

    e.addComponent(Lemonade.Components.circle);
    e.set("circle", "radius", GUI_CARDSIZE/2 +1);
    e.set("circle", "offsetX", GUI_CARDSIZE/2);
    e.set("circle", "offsetY", GUI_CARDSIZE/2);

    e.addComponent(Lemonade.Components.image);
    e.set("image", "image", Lemonade.Repository.addImage("expandcpanel", "content/images/gui/expandcpanel.png", 32, 32));
    Lemonade.Repository.addImage("expandcpanel2", "content/images/gui/expandcpanel2.png", 32, 32);
    if(GameGui.readOnlyCardPanel === true)
        e.set("image", "image", Lemonade.Repository.addImage("expandcpanel2", "content/images/gui/expandcpanel2.png", 32, 32));

    e.addComponent(Lemonade.Components.collide);
    e.addComponent(Lemonade.Components.tooltip);
    e.set("tooltip", "information", "Expand Card Panel");

    e.addComponent(Lemonade.Components.button);
    e.set("button", "onClick", function(){
        if(Lemonade.tweenList.tweenExists("expandcardpanel") === true)
            return;
        GameGui.expandCardPanel(false);
    });

    e.set("position", "width", GUI_CARDSIZE);
    e.set("position", "height", GUI_CARDSIZE);

    e.set("position", "x",  GUI_LEFTSPACE + GUI_MAXROW*(GUI_CARDSIZE/2) + GUI_MAXROW*GUI_CARDSPACE + GameGui.cardPanelex);
    e.set("position", "y", Lemonade.Canvas.canvasHeight - GUI_CARDSIZE*1.5);
    return e;
};


GameGui.getCardPosition = function(card, x, y, cardPanelHeight){ // cardPanelHeight = number of rows of cards
    var pos = {x: 0, y: 0};

    pos.x = GUI_LEFTSPACE + x*(GUI_CARDSIZE/2) + x*GUI_CARDSPACE + GameGui.cardPanelex;
    pos.y = Lemonade.Canvas.canvasHeight - GUI_CARDSIZE*1.5 + GUI_CARDSPACE*1.75*y + GameGui.cardPaneley;

    if(GameGui.readOnlyCardPanel === true)
    {
        pos.y -= cardPanelHeight * GUI_CARDSIZE*1.5;
    }
    return pos;
};

GameGui.expandCardPanel = function(expandOrRelease){
    if(CardSelect.initialized && CardSelect.readOnlyPanelOpen === true)
        return;
    if(expandOrRelease === true){
        GameGui.expandedCardPanel = !GameGui.expandedCardPanel;
        GameGui.readOnlyCardPanel = GameGui.expandedCardPanel;
        GameGui.cardPanelex = 0;
        GameGui.cardPaneley = 0;

        if(GameGui.readOnlyCardPanel === true){
            GameGui.expandCardPanelButton.set("image", "image", Lemonade.Repository.addImage("expandcpanel2", "content/images/gui/expandcpanel2.png", 32, 32));
        }else{
            GameGui.expandCardPanelButton.set("image", "image", Lemonade.Repository.addImage("expandcpanel1", "content/images/gui/expandcpanel.png", 32, 32));
        }

        // Reenable cards to be magnified.
        for(var i=0;i<GameGui.cards.length;i++){
            GameGui.cards[i].set("magnify", "mouseActivate", true);
        // Bring card images to the top, so that they are always visible, hidden or not.
            Lemonade.bringEntityToFront(GameGui.cards[i].id);
        }
    }else{
        GameGui.expandedCardPanel = GameGui.readOnlyCardPanel;

        // Protect cards from being magnified while the card panel is moving.
        for(var i=0;i<GameGui.cards.length;i++){
            GameGui.cards[i].set("magnify", "mouseActivate", false);
        }

        if(GameGui.readOnlyCardPanel === false){
            Lemonade.tweenList.addTweenTimer("expandcardpanel", GameGui, GUI_EXPANDCARDPANEL, function(ob, ti){
                var distance = Math.ceil(ob.cards.length/GUI_MAXROW) * GUI_CARDSIZE*1.5;
                ob.cardPaneley = -distance * this.timeRatio();
            }, function(){
                GameGui.expandCardPanel(GameGui.expandedCardPanel === GameGui.readOnlyCardPanel);
            });
        }else{
            Lemonade.tweenList.addTweenTimer("expandcardpanel", GameGui, GUI_EXPANDCARDPANEL, function(ob, ti){
                var distance = Math.ceil(ob.cards.length/GUI_MAXROW) * GUI_CARDSIZE*1.5;
                ob.cardPaneley = distance * this.timeRatio();
            }, function(){
                GameGui.expandCardPanel(GameGui.expandedCardPanel === GameGui.readOnlyCardPanel);
            });
        }
    }

};

GameGui.setupCharacterInfo = function(){
    // TODO setup character information using the characterreview.png image.
    /**
     * The player image, health and energy bars all use a specific position. If image changes, so 
     * must the values of where these are located in the code.
     */
    var ret = {};
    {
        var e = new Lemonade.Entity();
        e.addComponent(Lemonade.Components.visible);
        e.addComponent(Lemonade.Components.position);

        e.addComponent(Lemonade.Components.image);
        e.set("image", "image", Lemonade.Repository.addImage("charview", "content/images/gui/characterview.png", 96, 64));

        e.set("position", "y", 720 - 64*GUI_CHARINFOSCALE);
        e.set("position", "width", 96*GUI_CHARINFOSCALE);
        e.set("position", "height", 64*GUI_CHARINFOSCALE);

        ret.panel = e;
    }{ // Healthbar first
        var e = new Lemonade.Entity();
        e.addComponent(Lemonade.Components.visible);
        e.addComponent(Lemonade.Components.position);
        e.addComponent(Lemonade.Components.collide);

        e.set("position", "x", GUI_CHARHEALTHPX*GUI_CHARINFOSCALE);
        e.set("position", "width", GUI_CHARHEALTHPW*GUI_CHARINFOSCALE);

        e.addComponent(Lemonade.Components.rectangle);

        e.addComponent(Lemonade.Components.color);
        e.set("color", "red", 100);
        e.set("color", "green", 0);
        e.set("color", "blue", 0);

        e.addComponent(Lemonade.Components.tooltip);
        e.set("tooltip", "information", "Health:");
        
        ret.healthbar = e;
    }{ // EnergyBar next
        var e = new Lemonade.Entity();
        e.addComponent(Lemonade.Components.visible);
        e.addComponent(Lemonade.Components.position);
        e.addComponent(Lemonade.Components.collide);

        e.set("position", "x", GUI_CHARENERGYPX*GUI_CHARINFOSCALE);
        e.set("position", "width", GUI_CHARENERGYPW*GUI_CHARINFOSCALE);

        e.addComponent(Lemonade.Components.rectangle);
        e.addComponent(Lemonade.Components.tooltip);
        e.set("tooltip", "information", "Energy:");

        e.addComponent(Lemonade.Components.color);
        e.set("color", "red", 255);
        e.set("color", "green", 255);
        e.set("color", "blue", 0);

        ret.energybar = e;
    }{ // Character image last.
        var e = new Lemonade.Entity();
        e.addComponent(Lemonade.Components.visible);
        e.addComponent(Lemonade.Components.position);
        e.addComponent(Lemonade.Components.collide);

        e.addComponent(Lemonade.Components.image);
        e.addComponent(Lemonade.Components.tooltip);
        e.set("tooltip", "information", "Champion:");

        e.set("position", "x", GUI_CHARIMAGEPX*GUI_CHARINFOSCALE)
        e.set("position", "y", 720 - 64*GUI_CHARINFOSCALE + GUI_CHARIMAGEPY*GUI_CHARINFOSCALE);
        e.set("position", "width", GUI_CHARIMAGEPH * GUI_CHARINFOSCALE);
        e.set("position", "height", GUI_CHARIMAGEPH * GUI_CHARINFOSCALE);

        ret.charImage = e;
    }
    return ret;
};

/**
 * Handle the pause menu, when the button is pressed.
 */

var PauseMenu = {};

PauseMenu.initialized = false;

PauseMenu.initPauseMenu = function(){
    if(PauseMenu.initialized === true)
        return;
    PauseMenu.button = new Lemonade.Entity();
    PauseMenu.button.addComponent(Lemonade.Components.collide);
    PauseMenu.button.addComponent(Lemonade.Components.position);
    PauseMenu.button.addComponent(Lemonade.Components.visible);
    PauseMenu.button.addComponent(Lemonade.Components.tooltip);
    PauseMenu.button.set("tooltip", "information", "Menu");
    PauseMenu.button.addComponent(Lemonade.Components.image);
    PauseMenu.button.set("image", "image", Lemonade.Repository.addImage("PAUSEBUTTON", "content/images/gui/pausemenu.png", 16, 16));
    PauseMenu.button.set("position", "width", 32);
    PauseMenu.button.set("position", "height", 32);
    PauseMenu.button.set("position", "y", 5);
    PauseMenu.button.set("position", "x", Lemonade.Canvas.canvasWidth - 37);
    PauseMenu.button.addComponent(Lemonade.Components.button);
    PauseMenu.button.set("button", "onClick", function(){
        if(GameTimer.paused === false){
            GameTimer.pause();
            PauseMenu.showMenu();
        }else{
            GameTimer.start();
            PauseMenu.hideMenu();
        }
    });

    PauseMenu.mainMenuButton = new Button("Main Menu", function(){
        GameTimer.reset();
        GameData.destroy();
        changeMenu(MENU_MAIN);
    }, Lemonade.Canvas.canvasWidth -170, 55, 30, "Courier New", "#000000");

    Lemonade.addEntity(PauseMenu.button);

    PauseMenu.initialized = true;
};

PauseMenu.keepItemsUp = function(){
    Lemonade.bringEntityToFront(PauseMenu.button.id);

    if(GameTimer.paused === true){
        PauseMenu.mainMenuButton.bringEntitiesUp();
    }
};

PauseMenu.showMenu = function(){
    PauseMenu.animateSlideButton(PauseMenu.mainMenuButton, true);
};

PauseMenu.hideMenu = function(){
    PauseMenu.animateSlideButton(PauseMenu.mainMenuButton, false);
};

PauseMenu.destroyMenu = function(){
    if(PauseMenu.initialized === false)
        return;
    if(PauseMenu.button !== undefined)
    {
        Lemonade.removeEntity(PauseMenu.button.id);
        PauseMenu.button = undefined;
    }
    if(PauseMenu.mainMenuButton !== undefined)
    {
        PauseMenu.mainMenuButton.removeEntity();
        PauseMenu.mainMenuButton = undefined;
    }

    PauseMenu.initialized = false;
};

PauseMenu.animateDropDownButton = function(button, opening){
    if(opening === undefined)
        opening = true;
    if(opening === true){
        button.addEntity();
        Lemonade.tweenList.addTween("dropdown"+button.e.id, button, 200, function(o){
            o.setPosition(o.getX(), this.curTicks / this.ticks * 145 - 100);
        }, function(o){
            o.setPosition(o.getX(), 45);
        });
    }else{
        Lemonade.tweenList.addTween("dropdown"+button.e.id, button, 200, function(o){
            o.setPosition(o.getX(), -this.curTicks / this.ticks * 145 + 45);
        }, function(o){
            o.setPosition(o.getX(), -100);
            o.removeEntity();
        });
    }
};

PauseMenu.animateSlideButton = function(button, opening){
    if(opening === undefined)
        opening = true;
    if(opening === true){
        button.addEntity();
        Lemonade.tweenList.addTween("dropdown"+button.e.id, button, 75, function(o){
            o.setPosition(Lemonade.Canvas.canvasWidth - this.curTicks / this.ticks * (o.name.length * o.fontSize * 0.6 - 5), o.getY());
        }, function(o){
            o.setPosition(Lemonade.Canvas.canvasWidth - (o.name.length * o.fontSize * 0.6) - 5, o.getY());
        });
    }else{
        Lemonade.tweenList.addTween("dropdown"+button.e.id, button, 75, function(o){
            o.setPosition(Lemonade.Canvas.canvasWidth - (o.name.length * o.fontSize * 0.6 -5) + this.curTicks / this.ticks * (o.name.length * o.fontSize * 0.6), o.getY());
        }, function(o){
            o.setPosition(-200, o.getY());
            o.removeEntity();
        });
    }
};