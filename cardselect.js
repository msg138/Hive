
var CardSelect = {};

var GUI_CARDSELECTION_X = 140;
var GUI_CARDSELECTION_Y = 96;
var GUI_CARDSELECTION_HIDEX = 10*96;

CardSelect.readOnlyPanelOpen = false;
CardSelect.expandedPanelOpen = false;

CardSelect.cardPanelex = 0;

CardSelect.cards = [];
CardSelect.cardData = [];
CardSelect.cardIndex = [];
CardSelect.selected = [];// Contains the index of selected cards. maybe the name.

CardSelect.selectedHero = undefined;

CardSelect.expandButton = undefined;

CardSelect.initialized = false;

CardSelect.setupExpandButton = function(){
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
    if(CardSelect.readOnlyPanelOpen === true)
        e.set("image", "image", Lemonade.Repository.addImage("expandcpanel2", "content/images/gui/expandcpanel2.png", 32, 32));
    e.set("image","rotation", Math.PI/2);
    e.addComponent(Lemonade.Components.collide);
    e.addComponent(Lemonade.Components.tooltip);
    e.set("tooltip", "information", "Expand Card Selection Panel");

    e.addComponent(Lemonade.Components.button);
    e.set("button", "onClick", function(){
        if(Lemonade.tweenList.tweenExists("expandcardpanel") === true)
            return;
        CardSelect.expandCardPanel(false);
    });

    e.set("position", "width", GUI_CARDSIZE);
    e.set("position", "height", GUI_CARDSIZE);

    e.set("position", "x", GUI_CARDSELECTION_X - GUI_CARDSIZE - GUI_CARDSPACE);
    e.set("position", "y", GUI_CARDSELECTION_Y - GUI_CARDSIZE);
    return e;
};
CardSelect.expandCardPanel = function(expandOrRelease){
    if(GameGui.readOnlyCardPanel === true)
        return;
    if(expandOrRelease === true){
        CardSelect.expandedPanelOpen = !CardSelect.expandedPanelOpen;
        CardSelect.readOnlyPanelOpen = CardSelect.expandedPanelOpen;
        if(CardSelect.expandedPanelOpen === true){
            CardSelect.cardPanelex = GUI_CARDSELECTION_HIDEX;
            // Remove tooltips from all heroes.
            for(var i in GameData.heroes)
                GameData.heroes[i].set("tooltip", "visible", false);
        }
        else{
            CardSelect.cardPanelex = 0;
            // add tooltips back to all heroes.
            for(var i in GameData.heroes)
                GameData.heroes[i].set("tooltip", "visible", true);
        }

        if(CardSelect.readOnlyPanelOpen === true){
            CardSelect.expandButton.set("image", "image", Lemonade.Repository.addImage("expandcpanel2", "content/images/gui/expandcpanel2.png", 32, 32));
        }else{
            CardSelect.expandButton.set("image", "image", Lemonade.Repository.addImage("expandcpanel", "content/images/gui/expandcpanel.png", 32, 32));
        }

        // Reenable cards to be magnified.
        for(var i=0;i<CardSelect.cards.length;i++){
            CardSelect.cards[i].set("magnify", "mouseActivate", true);
            CardSelect.cards[i].set("tooltip", "visible", true);
        // Bring card images to the top, so that they are always visible, hidden or not.
            Lemonade.bringEntityToFront(CardSelect.cards[i].id);
        }
    }else{
        CardSelect.expandedPanelOpen = CardSelect.readOnlyPanelOpen;

        // Protect cards from being magnified while the card panel is moving.
        for(var i=0;i<CardSelect.cards.length;i++){
            CardSelect.cards[i].set("magnify", "mouseActivate", false);
            CardSelect.cards[i].set("tooltip", "visible", false);
        }

        if(CardSelect.readOnlyPanelOpen === false){
            Lemonade.tweenList.addTweenTimer("expandcardselection", CardSelect, 2.5*GUI_EXPANDCARDPANEL, function(ob, ti){
                var distance = GUI_CARDSELECTION_HIDEX;
                ob.cardPanelex = distance * this.timeRatio();
            }, function(){
                CardSelect.expandCardPanel(CardSelect.expandedPanelOpen === CardSelect.readOnlyPanelOpen);
            });
        }else{
            Lemonade.tweenList.addTweenTimer("expandcardselection", CardSelect, 2.5*GUI_EXPANDCARDPANEL, function(ob, ti){
                var distance = GUI_CARDSELECTION_HIDEX;
                ob.cardPanelex = distance - (distance * this.timeRatio());
            }, function(){
                CardSelect.expandCardPanel(CardSelect.expandedPanelOpen === CardSelect.readOnlyPanelOpen);
            });
        }
    }

};


CardSelect.getGUICardPosition = function(card, x, y, amountOfCards){ // cardPanelHeight = number of rows of cards
    var cardPanelHeight = Math.floor(amountOfCards/GUI_MAXROW);
    var cardPanelWidth = GUI_MAXROW*GUI_CARDSIZE + 4;
    var pos = {x: 0, y: 0};

    pos.x = GUI_CARDSELECTION_X + x*(GUI_CARDSIZE/2) + x*GUI_CARDSPACE + CardSelect.cardPanelex - GUI_CARDSELECTION_HIDEX;
    pos.y = GUI_CARDSPACE*1.75*y + GUI_CARDSELECTION_Y;
    return pos;
};

CardSelect.initialize = function(decklistAsset){
    decklistAsset = decklistAsset || "ASSET_PLAYERINFO";
    if(CardSelect.cards.length > 0)
    {
        CardSelect.destroy();
    }
    var dl = Data.retrieve(decklistAsset, "deck.unlocked");
    for(var i=0;i<dl.length;i++){
        var card = new CardFromList(dl[i]);
        CardSelect.cardIndex.push(dl[i]);
        CardSelect.cardData.push(card);
        var guiCard = GameGui.Card(card);
        guiCard.addComponent(Lemonade.Components.button);
        guiCard.addComponent(Lemonade.Components.data);
        guiCard.set("data", "data", {cd: dl[i], cdd: CardSelect.cardData[i]});
        guiCard.set("button", "onClick", function(e){
            if(temp.selected === undefined)
                return;
            if(!CardSelect.canSelect(temp.selected, e.get("data", "data").cdd)){
                return;
            }
            if(Lemonade.arrayContains(CardSelect.selected, e.get("data", "data").cd))
                CardSelect.selected.splice(Lemonade.arrayIndex(CardSelect.selected, e.get("data", "data").cd), 1);
            else
                CardSelect.selected.push(e.get("data", "data").cd);
        });
        CardSelect.cards.push(guiCard);
        Lemonade.addEntity(CardSelect.cards[CardSelect.cards.length - 1]);
    }
    CardSelect.expandButton = CardSelect.setupExpandButton();
    Lemonade.addEntity(CardSelect.expandButton);

    CardSelect.initialized = true;
};

CardSelect.destroy = function(){
    for(var i=0;i<CardSelect.cards.length;i++){
        Lemonade.removeEntity(CardSelect.cards[i].id);
    }
    if(CardSelect.expandButton !== undefined)
        Lemonade.removeEntity(CardSelect.expandButton.id);
    CardSelect.readOnlyPanelOpen = false;
    CardSelect.expandedPanelOpen = false;

    CardSelect.cardPanelex = 0;

    CardSelect.cards = [];
    CardSelect.cardData = [];
    CardSelect.cardIndex = [];
    CardSelect.selected = [];// Contains the index of selected cards. maybe the name.

    CardSelect.selectedHero = undefined;

    CardSelect.expandButton = undefined;

    CardSelect.initialized = false;
};

CardSelect.update = function(){
    if(CardSelect.cards.length <= 0)
        CardSelect.initialize("ASSET_PLAYERINFO");

    if(temp.selected !== CardSelect.selectedHero){
        CardSelect.selected = [];
        CardSelect.selectedHero = temp.selected;
    }

    // Update the position of the cards.
    for(var i=0;i<CardSelect.cards.length;i++){
        var position = CardSelect.getGUICardPosition(CardSelect.cards[i], i%GUI_MAXROW, Math.floor(i/GUI_MAXROW), CardSelect.cards.length);
        // Update card position if they are not being zoomed.
        if(CardSelect.cards[i].get("magnify", "progress") <= 0){
            CardSelect.cards[i].set("position", "x", position.x);
            CardSelect.cards[i].set("position", "y", position.y);
        }
        // Update the cooldown status of card or if not enough resource, red it out.
        if(temp.selected !== undefined && !CardSelect.canSelect(temp.selected, CardSelect.cardData[i]))
        {
            CardSelect.cards[i].set("cover", "color", "#dd1111");
            CardSelect.cards[i].set("cover", "height", GUI_CARDSIZE);
            CardSelect.cards[i].set("cover", "opacity", 0.5);
        }else if(Lemonade.arrayContains(CardSelect.selected, CardSelect.cardIndex[i])){
            CardSelect.cards[i].set("cover", "color", "#aaff11");
            CardSelect.cards[i].set("cover", "opacity", 0.2);
        }else{
            CardSelect.cards[i].set("cover", "color", "#ffffff");
            CardSelect.cards[i].set("cover", "opacity", 0.2);
        }
    }
};

CardSelect.canSelect = function(hero, card){
    return (FortUtils.getDiscipline(hero) === DISCIPLINE[card.discipline]);
};