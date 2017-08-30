Lemonade.include("card.js");

var DECK_MAX_SIZE = 8;

var DeckUtils = {};

DeckUtils.removeDeckFromHero = function(e){
    e.set("caster", "deck", []);
    return true;
};

DeckUtils.insertCardForHero = function(e, index, card){
    return e.get("caster", "deck").splice(index, 0, card);
};

DeckUtils.getDeckFromHero = function(e){
    return e.get("caster", "deck");
};

DeckUtils.addCard = function(e, card){
    return e.get("caster", "deck").push(card);
};

DeckUtils.removeCardIndex = function(e, cardIndex){
    return e.get("caster", "deck").splice(cardIndex, 1);
};

DeckUtils.getCardToCast = function(e){
    return e.get("caster", "cardToCast");
};
DeckUtils.setCardToCast = function(e, c){
    return e.set("caster", "cardToCast", c);
}

DeckUtils.getCardIndex = function(e, card){
    
};