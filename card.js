Lemonade.include("skillanimation.js");


var CAST_INSTANT = 0;

var CAST_SELF = -1;
var CAST_ENEMY = -2;
var CAST_ALLY = -3;
var CAST_ANY = -4;

// List of functions that can be used to create cards.
// Used in the json where the string version of the function is stored
var CARD_FUNCTION = {};

function CardCast(card, vars){
    return {cardToCast: card, variables: vars};
}

// Data not an entity.
function Card()
{
    this.name = "";
    this.description = "";
    
    this.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;
    
    this.imageName = "";
    
    this.castingCost = 0;
    this.castingTime = 0;
    this.cooldown = 0;
    this.currentCooldown = 0;

    this.move = false;

    // Used in determining turn order.
    this.castSpeed = 0;

//Todo use this in move calculation
    this.castTime = 0;
    this.channelTime = 0;
    
    this.castingRange = 0;
    
    this.ableToCast = true;
    
    this.disabled = false;
    
    // Not used yet.
    this.cooldownTimer = 0;
    
    this.putOnCooldown = function(){
        this.currentCooldown = this.cooldown;
        
        this.ableToCast = false;
    };

    this.animation = undefined;

    // DEPRECATED :: this.animationTime = 10;// NEW ticks are here to be read before function reads.
    this.getAnimationTime = function(owner, map, tx, ty){
        if(this.animation === undefined){
            return 0;
        }
        return this.animation.animationLength(owner, map, FortUtils.getTileX(owner), FortUtils.getTileY(owner), tx, ty);
    };
    this.getAnimationLength = function(){
        if(this.animation === undefined){
            return 0;
        }
        return this.animation.length;
    };
    this.finishAnimation = function(){
        if(this.animation!==undefined){
            this.animation.finishAnimation();
        }
        this.completeCast();
    };
    this.animate = function(owner, map, sx, sy, tx, ty, progress){
        var sf = new keyFrame({x: owner.get("position", "x"), y: owner.get("position", "y"), z: owner.get("position", "z"), rx: 0, ry: 0, rz: 0}, {}, 0);
        if(this.animation !== undefined)
            this.animation.updateAnimation(sf, progress);
        return 10;// return a default thing...
    };
    
    // ALl of these take the current step number asa parameter to get progress of the action.
    this.onCast = function(owner, map, tx, ty){};

    this.completeCast = function(){};

    this.cast = function(owner, map, tx, ty){
        console.log("Attempting action: " + this.name);
        if(this.canCast(owner) === false)
            return false;
        if(FortUtils.inRange(owner, tx, ty, this.castingRange) === false && this.castingRange !== CAST_SELF && this.castingRange !== CAST_ALLY && this.castingRange !== CAST_ENEMY && this.castingRange !== CAST_ANY)
            return false;
        if(this.onCast(owner, map, tx, ty) !== false)
        {
            console.log("placed on cooldown " + this.cooldown + " " + this.name);
            this.currentCooldown = this.cooldown;
            FortUtils.modResource(owner, -this.castingCost);
            //1998
            if(GameData.quest !== undefined && this.name != "Move" && this.name != "Gravity")
            {
                GameData.quest.onCardPlay(owner, this, tx, ty);
            }
            console.log("Action succeeded. Cooldown : " + this.cooldown);
            return true;
        }
    };

    this.canCast = function(hero){
        var backUp = true;
        if(this.currentCooldown > 0)
        {
            backUp = false;
        }else if(this.castingCost > FortUtils.getResource(hero))
            backUp = false;
        else if(this.disabled)
        {
            backUp = false;
        }
        return backUp;
    };

    this.canCastRange = function(hero, map, tx, ty){
        // Called to determine if a tile is able to be cast upon.
        return FortUtils.inRange(hero, tx, ty, this.castingRange);
    };
    
    this.onCooldown = function(){
        return this.currentCooldown > 0;
    };
    
    this.enoughResource = function(hero){
        return FortUtils.getResource(hero) >= this.castingCost;
    };

    this.getTooltip = function(){
        var text = this.name + "    ";
        if(this.disabled === true)
            text += "disabled";
        else
            text += this.currentCooldown+ "Turns";
        text +="|" + this.description;
        return text;
    };
    
    return this;
}

function CardFromList(cardName){
    var cd = Data.retrieve("ASSET_CARDLIST", cardName);
    var card = new Lemonade.funcOverload(CARD_FUNCTION[cd.function], cd.params);

    if(cd.override !== undefined && cd.override !== false){
        card.name = cd.name;
        card.description = cd.description;
        // Override some details about the card, like cooldown and the such.
        if(cd.OVR_castingCost !== undefined){
            card.castingCost = cd.OVR_castingCost;
        }if(cd.OVR_castingTime !== undefined){
            card.castingTime = cd.OVR_castingTime;
        }if(cd.OVR_castSpeed !== undefined){
            card.castSpeed = cd.OVR_castSpeed;
        }if(cd.OVR_cooldown !== undefined){
            card.cooldown = cd.OVR_cooldown;
        }if(cd.OVR_castingRange !== undefined){
            card.castingRange = cd.OVR_castingRange;
        }if(cd.OVR_imageName !== undefined){
            card.imageName = cd.OVR_imageName;
        }if(cd.OVR_discipline !== undefined){
            card.discipline = cd.OVR_discipline;
        }
    }

    return card;
}

CARD_FUNCTION.CardHeroSelect = function(hero, quest){
    var c = new Card();
    c.hero = hero;
    c.quest = quest;
    c.name = Data.retrieve("ASSET_HEROLIST", "heroes."+Data.retrieve("ASSET_HEROLIST", "heroNameLink."+hero)+".name");
    c.description = "Select " + c.name +" as your hero to play as.";

    c.imageName = "content/images/gui/confirm1.png";

    c.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;

    c.castingCost = 0;
    c.castingTime = CAST_INSTANT;
    c.castSpeed = 0;
    c.cooldown = 0;
    c.castingRange = CAST_SELF;

    c.move = false;

    c.onCast = function(owner, map, tx, ty){
        HeroSelected = this.hero;
        QuestSelected = this.quest;

        if(CardSelect.initialized === true && CardSelect.selected.length > 0)
            SelectedCards = CardSelect.selected;

        GameData.quest.onSucceed();
    };

    c.canCastRange = function(hero, map, tx, ty){
        return ((tx === FortUtils.getTileX(hero) && ty === FortUtils.getTileY(hero)));
    };

    return c;
}
CARD_FUNCTION.CardInformation = function(hero, informationName, information, infImage){
    var c = new Card();
    c.hero = hero;
    c.name = hero + " - " + informationName;
    c.description = informationName + " - " + information;

    c.imageName = "content/images/gui/" + infImage;

    c.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;

    c.castingCost = 0;
    c.castingTime = CAST_INSTANT;
    c.castSpeed = 0;
    c.cooldown = 0;
    c.castingRange = 0;

    c.disabled = true;

    c.move = false;

    c.onCast = function(owner, map, tx, ty){
    };

    c.canCastRange = function(hero, map, tx, ty){
        return false;
    };

    return c;
}

CARD_FUNCTION.CardMove = function(mvSpeed){
    var c = new Card();
    c.name = "Move";
    c.description = "Move to another spot on the battlefield.";

    c.imageName = "content/images/gui/card/cmove.png";

    c.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;

    c.castingCost = 0;
    c.castingTime = CAST_INSTANT;
    c.cooldown = 1;
    c.castingRange = 5;

    c.castSpeed = mvSpeed;

    c.move = true;

    c.moveSpaceTime = 100;

    c.getAnimationTime = function(owner, map, tx, ty){
        if(this.animation === undefined){
            this.animation = new SkillAnimation(500, undefined, owner, "");
            this.animation.length = 500;
        }
        return this.animation.animationLength(owner, map, FortUtils.getTileX(owner), FortUtils.getTileY(owner), tx, ty);
    };

    c.onCast = function(owner, map, tx, ty){
        if(MapUtils.canHeroMove(owner, map, tx, ty) === false)
            return false;
        FortUtils.setTileX(owner, tx);
        FortUtils.setTileY(owner, ty);

        if(GameData.quest !== undefined)
            GameData.quest.onMove(owner, tx, ty);
        return true;
    };

    c.canCastRange = function(hero, map, tx, ty){
        return MapUtils.canHeroMove(hero, map, tx, ty) && MapUtils.canSee(hero, map, tx, ty, 1) === true;
    };

    return c;
}

CARD_FUNCTION.CardForfeit = function(){
    var c = new Card();
    c.name = "Forfeit";
    c.description = "Wave the white flag of defeat.|Counts as loss.";
    
    c.imageName = "content/images/gui/card/csurrender.png";
    
    c.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;
    
    c.castingCost = 0;
    c.castingTime = CAST_INSTANT;
    c.cooldown = 20; // 20 turn cooldown.
    c.castingRange = 1;
    
    c.onCast = function(owner, map, tx, ty){
        GameData.wipeTeam(FortUtils.getTeam(owner));

        return true;
    };
    
    return c;
}
function BuildFort(fortFunction){
    var c = new Card();
    c.name = "Build Fort";
    c.description = "Setup a Fort to lead the team.";
    
    c.imageName = "content/images/gui/card/csurrender.png";
    
    c.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;
    
    c.castingCost = 0;
    c.castingTime = CAST_INSTANT;
    c.cooldown = 20; // 20 turn cooldown.
    c.castingRange = 1;

    c.castSpeed = 10;

    c.fortFunc = fortFunction;
    
    c.onCast = function(owner, map, tx, ty){
        if(MapUtils.isWalkable(map, MapUtils.getTile(map, tx, ty)) === false || 
        (MapUtils.getHeroOn(map, tx, ty) !== undefined && MapUtils.getHeroOn(map, tx, ty) !== owner))
            return false;
        var fort = new this.fortFunc(FortUtils.getTeam(owner));
        FortUtils.setTileX(fort, tx);
        FortUtils.setTileY(fort, ty);
        GameData.heroes.push(fort);
        Lemonade.addEntity(fort);
        FortUtils.kill(owner);
        return true;
    };
    
    return c;
}
function ConstructUnit(unitname, desc, unitFunction){
    var c = new Card();
    c.name = unitname;
    c.description = desc;
    
    c.imageName = "content/images/gui/card/cbuildunit.png";
    
    c.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;
    
    c.castingCost = 10;
    c.castingTime = CAST_INSTANT;
    c.cooldown = 2; // 20 turn cooldown.
    c.castingRange = 1;

    c.castSpeed = 10;

    c.fortFunc = unitFunction;
    
    c.onCast = function(owner, map, tx, ty){
        if(MapUtils.isWalkable(map, MapUtils.getTile(map, tx, ty)) === false || 
            MapUtils.getHeroOn(map, tx, ty) !== undefined)
            return false;
        var hero = new this.fortFunc(FortUtils.getTeam(owner));
        FortUtils.setTileX(hero, tx);
        FortUtils.setTileY(hero, ty);
        GameData.heroes.push(hero);
        Lemonade.addEntity(hero);
        return true;
    };
    
    return c;
}

CARD_FUNCTION.CardDeathBreath = function(dam){
    var c = new Card();
    c.name = "Death Breath";
    c.description = "Call upon the spirits to breath cold air.|Deals " + dam + " indirect soul damage.";
    
    c.imageName = "content/images/gui/card/trick/cdeathbreath.png";
    
    c.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;
    
    c.castingCost = 10;
    c.castingTime = CAST_INSTANT;
    c.cooldown = 4;// 1 turn cooldown. Otherwise always active
    c.castingRange = 10;

    c.castSpeed = 11;
    
    c.onCast = function(owner, map, tx, ty){
        //FortUtils.addBuff(owner, new Buff(STAT.MOVESPEED, 2, 10*4));
        var h = MapUtils.getHeroOn(map, tx, ty);
        if(h !== undefined)
        {
            FortUtils.damage(h, owner, dam, c.discipline);
        }else
            return false;
        return true;
    };
    
    return c;
}
CARD_FUNCTION.CardMeleeAttack = function(dam, speed){
    var c = new Card();
    c.name = "Melee Attack";
    c.description = "Swing your weapon at your foe.|Deals " + dam + " direct physical damage.";
    
    c.imageName = "content/images/gui/card/cattack.png";
    
    c.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;
    
    c.castingCost = 5;
    c.castingTime = CAST_INSTANT;
    c.cooldown = 1;// 1 turn cooldown. Otherwise always active
    c.castingRange = 1;

    c.castSpeed = speed;
    
    c.onCast = function(owner, map, tx, ty){
        //FortUtils.addBuff(owner, new Buff(STAT.MOVESPEED, 2, 10*4));
        var h = MapUtils.getHeroOn(map, tx, ty);
        if(h !== undefined)
        {
            FortUtils.damage(h, owner, dam, c.discipline);
        }else
            return false;
        return true;
    };
    
    return c;
}
CARD_FUNCTION.CardRangeAttack = function(dam, speed){
    var c = new Card();
    c.name = "Ranged Attack";
    c.description = "Shoot a sharp projectile at your foe.|Deals " + dam + " direct physical damage.";
    
    c.imageName = "content/images/gui/card/cattackranged.png";

    c.animation = new SkillAnimation(100, undefined, undefined, "content/images/ability/arrow.png");
    c.animation.length = 30;
    
    c.discipline = DISCIPLINE.DISCIPLINE_UNKNOWN;
    
    c.castingCost = 5;
    c.castingTime = CAST_INSTANT;
    c.cooldown = 1;// 1 turn cooldown. Otherwise always active
    c.castingRange = 4;

    c.castSpeed = speed;
    
    c.onCast = function(owner, map, tx, ty){
        //FortUtils.addBuff(owner, new Buff(STAT.MOVESPEED, 2, 10*4));
        var h = MapUtils.getHeroOn(map, tx, ty);
        if(h !== undefined)
        {
            MoveResolution.push(function(){ FortUtils.damage(h, owner, dam, c.discipline); });
        }else
            return false;
        return true;
    };
    
    return c;
}