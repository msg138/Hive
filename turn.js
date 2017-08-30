

// Array of Functions to run after a turn and move is done. (Resolution); 
var MoveResolution = [];
var TurnResolution = [];

function doTurn(){

    // Do move queues
    /*
    if(MarkerUtils.isEnabled(temp.moveMarker) === true){
        
        //1998
        var tx = MarkerUtils.getTileX(temp.moveMarker);
        var ty = MarkerUtils.getTileY(temp.moveMarker);
        
        DeckUtils.setCardToCast(temp.player, new CardCast(MarkerUtils.getCardCast(temp.moveMarker), {x: tx, y: ty}));
        
        MarkerUtils.disableMarker(temp.moveMarker);
    }*/
    // Decide turn order based on speed.
    GameData.heroes = decideTurnOrder(GameData.heroes);

    // Cast actions in the order that was decided.
    for(var i=0;i<GameData.heroes.length;i++)
    {
        var px = FortUtils.getTileX(GameData.heroes[i]);
        var py = FortUtils.getTileY(GameData.heroes[i]);
        
        var ccV = DeckUtils.getCardToCast(GameData.heroes[i]);
        if(ccV !== undefined){
            ccV.cardToCast.cast(GameData.heroes[i], temp.map, ccV.variables.x, ccV.variables.y);
            if(GameData.inGame())
            {
                GameData.quest.onCardActivate(GameData.heroes[i], ccV.cardToCast, ccV.variables.x, ccV.variables.y);
            }
            continue;
        }
    }
    // Refresh cooldowns.
    {
        for(var i=0;i<GameData.heroes.length;i++)
        {
            if(GameData.heroes[i].hasComponent(Lemonade.Components.caster) === false)
                continue;
            // Cooldowns in the deck
            var d = DeckUtils.getDeckFromHero(GameData.heroes[i]);
            for(var j=0;j<d.length;j++)
            {
                if(d[j].currentCooldown -1 >= 0)
                    d[j].currentCooldown--;
            }
            // Cooldowns in buffs
            var b = FortUtils.getBuffs(GameData.heroes[i]);
            for(var j=0;j<b.length;j++)
            {
                b[j].time -= 1;
                if(b[j].time <= 0)
                {
                    FortUtils.removeBuff(GameData.heroes[i], b[j]);
                    j--;
                    continue;
                }
            }
        }
    }
    // Regenerate some resources :?)
    console.log("Regenerated.");
    for(var i=0;i<GameData.heroes.length;i++)
    {
        if(FortUtils.isDead(GameData.heroes[i]) === true)
            continue;
        if(FortUtils.getHealth(GameData.heroes[i]) <= 0)
        {
            FortUtils.kill(GameData.heroes[i]);
            Lemonade.removeEntity(GameData.heroes[i].id);
        }

        //1998
        if(GameData.inGame())
        {
            GameData.quest.onRegenerate(GameData.heroes[i]);
        }
        FortUtils.modResource(GameData.heroes[i], FortUtils.getRegenerationSpeed(GameData.heroes[i]));
    }

    if(GameData.inGame()){
        GameData.quest.onTimerTurn();
    }

    GameTimer.pause();
    
    GameGui.updateCardTooltips();
    animateTurn();
};

function animateTurn(){
    var maxTime = 100;// by default to allow syncing up.
    // Get max time plus a few for animations to take place.
    for(var i=0;i<GameData.heroes.length;i++)
    {
        var ccc = DeckUtils.getCardToCast(GameData.heroes[i]);
        console.log(ccc);
        // console.log(ccc.cardToCast.getAnimationTime(GameData.heroes[i], temp.map, ccc.variables.x, ccc.variables.y));
        if(ccc !== undefined)
            maxTime +=ccc.cardToCast.getAnimationTime(GameData.heroes[i], temp.map, ccc.variables.x, ccc.variables.y);//  ccc.cardToCast.animate(GameData.heroes[i], temp.map, ccc.variables.x, ccc.variables.y);
    }
    console.log("Turn max time: " + maxTime);
    Lemonade.tweenList.addTweenTimer("turnend", {current: 0, next: true, eltime: 0, leltime: Lemonade.Timer.getCurrentTime()}, maxTime, function(o, ti){
        var ccc = DeckUtils.getCardToCast(GameData.heroes[this.object.current]);
        /*if(ti <= 0 && ccc !== undefined && ccc.cardToCast.animation !== undefined)
            ccc.cardToCast.animation.startAnimation(GameData.heroes[this.object.current], temp.map, FortUtils.getTileX(GameData.heroes[this.object.current]), 
                FortUtils.getTileY(GameData.heroes[this.object.current]), ccc.variables.x, ccc.variables.y);//*/
        if(ccc === undefined){
            next = true;
        }else if(this.object.current < GameData.heroes.length && this.object.next !== true && o.eltime >= ccc.cardToCast.getAnimationTime(GameData.heroes[this.object.current], temp.map, ccc.variables.x, ccc.variables.y)){
            this.object.current += 1;
            this.object.next = true;
            if(ccc.cardToCast.animation !== undefined){
                ccc.cardToCast.animation.finishAnimation();
            }
            resolveMove();
            o.eltime = 0;
            o.leltime = Lemonade.Timer.getCurrentTime();
            return;
        }
        if(this.object.current < GameData.heroes.length && this.object.next === true){
            ccc = DeckUtils.getCardToCast(GameData.heroes[this.object.current]);
            if(ccc !== undefined){
                this.object.next = false;
                if(ccc.cardToCast.animation !== undefined){
                    ccc.cardToCast.animation.startAnimation(GameData.heroes[this.object.current], temp.map, FortUtils.getTileX(GameData.heroes[this.object.current]), 
                        FortUtils.getTileY(GameData.heroes[this.object.current]), ccc.variables.x, ccc.variables.y);
                }
            }
        }
        if(ccc !== undefined)
            ccc.cardToCast.animate(GameData.heroes[this.object.current], temp.map, FortUtils.getTileX(GameData.heroes[this.object.current]), 
                FortUtils.getTileY(GameData.heroes[this.object.current]), ccc.variables.x, ccc.variables.y, Math.floor(ccc.cardToCast.getAnimationLength()*this.timeRatio()));
        if(this.timeLeft() <= 1 && ccc !== undefined && ccc.cardToCast.animation !== undefined){
            this.object.current = GameData.heroes.length;
            ccc.cardToCast.animation.finishAnimation();
            resolveMove();
            o.eltime = 0;
            o.leltime = Lemonade.Timer.getCurrentTime();
        }
        o.eltime = Lemonade.Timer.getCurrentTime() - o.leltime;

    }, function(){
        // Remove old, queued cards.
        for(var i=0;i<GameData.heroes.length;i++)
        {
            DeckUtils.setCardToCast(GameData.heroes[i], undefined);// Reset the card.
        }
        temp.map.set("tilemap", "updateCover", true);
        GameTimer.start();
    });
}
function animateNext(i, heroes){

}

function resolveMove(){
    for(var i=0;i<MoveResolution.length;i++)
        MoveResolution[i]();
    MoveResolution.splice(0, MoveResolution.length);
}
function resolveTurn(){
    for(var i=0;i<TurnResolution.length;i++)
        TurnResolution[i]();
    TurnResolution.splice(0, TurnResolution.length);
}

function decideTurnOrder(heroList){
    var newHeroList = [];
    var nhl = [];

    for(var j=0;j<heroList.length;j++){
        var h = heroList[j];
        // Start with the base action speed of the hero.
        var cs = FortUtils.getSpeed(h);

        var ctc = DeckUtils.getCardToCast(h);
        if(ctc !== undefined){
            cs += ctc.cardToCast.castSpeed;
        }

        if(newHeroList.length <= 0)
        {
            newHeroList.push(h);
            nhl.push(cs);
            continue;
        }
        var added = false;
        for(var i=0;i<newHeroList.length;i++){
            if(nhl[i] < cs){
                nhl.splice(i, 0, cs);
                newHeroList.splice(i, 0, h);
                added = true;
                break;
            }
        }
        if(added === false){
            newHeroList.push(h);
            nhl.push(cs);
        }
    }
    console.log("Turn order decided: ");
    for(var j=0;j<newHeroList.length;j++){
        var h = newHeroList[j];
        console.log("Hero : "+FortUtils.getName(h));
    }
    console.log("\t\t"+nhl);

    return newHeroList;
}

function constructAnimationSequence(){

}