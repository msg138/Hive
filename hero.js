Lemonade.include("living.js");
Lemonade.include("deck.js");

// Seperate the team files with unit informaation
Lemonade.include("braken.js");

var HeroSelected = undefined;
var QuestSelected = undefined;
var SelectedCards = undefined;

function HeroList(){
    var jj = Data.retrieve("ASSET_HEROLIST", "heroNameLink");
    var rr = [];
    for(var j  in jj){
        rr.push(j);
    }
    return rr;
}

function HeroFromList(heroName, tt){
    console.log(heroName);
    var hd = Data.retrieve("ASSET_HEROLIST", "heroes."+Data.retrieve("ASSET_HEROLIST", "heroNameLink."+heroName));
    var hero = HeroFactory(tt);
    // Remove rectangle as we are adding in an image for the hero.
    if(hd.image !== undefined){
        hero.removeComponent(Lemonade.Components.rectangle);
        hero.addComponent(Lemonade.Components.image);
        hero.set("image", "image", Lemonade.Repository.addImage(hd.image.name, hd.image.file, hd.image.width, hd.image.height));
        if(hd.image.spritesheet > 1){
            hero.get("image", "image").setSpriteSheet(hd.image.height, hd.image.height, hd.image.spritesheet);
            if(hd.image.animation !== undefined){
                hero.addComponent(Lemonade.Components.animation);
                hero.set("animation","speed", hd.image.animation.speed);
                hero.set("animation","maxFrames", hd.image.animation.maxFrames);
            }
        }
    }
    hero.addComponent(Lemonade.Components.tooltip);
    hero.set("tooltip", "information", hd.name);
    
    FortUtils.setName(hero, hd.name);

    FortUtils.setMaxHealth(hero, hd.maxHealth);
    FortUtils.setHealth(hero, hd.maxHealth);
    
    FortUtils.setMaxResource(hero, hd.maxResource);
    FortUtils.setRegenerationSpeed(hero, hd.regenerationSpeed);
    FortUtils.setSpeed(hero, hd.moveSpeed);
    FortUtils.setMoveRange(hero, hd.moveRange);
    
    FortUtils.setDiscipline(hero, DISCIPLINE[hd.discipline]);
    
    for(var i=0;i<hd.default_deck.length;i++){
        DeckUtils.addCard(hero, CardFromList(hd.default_deck[i]));
    }

    hero.set("statbar", "maxVal", FortUtils.getMaxHealth(hero));
    hero.set("statbar", "val", FortUtils.getHealth(hero));

    hero.set("statbar2", "maxVal", FortUtils.getMaxResource(hero));
    hero.set("statbar2", "val", FortUtils.getResource(hero));
    
    return hero;
}

function HeroFactory(tt){
    var hero = new Lemonade.Entity();
    
    hero.addComponent(Lemonade.Components.visible).
        addComponent(Lemonade.Components.collide).
        addComponent(Lemonade.Components.rectangle).
        addComponent(Lemonade.Components.position).
        addComponent(Lemonade.Components.camera).
        addComponent(Lemonade.Components.resource).
        addComponent(Lemonade.Components.caster).
        addComponent(Lemonade.Components.living).
        addComponent(Lemonade.Components.statbar).
        addComponent(Lemonade.Components.statbar2).
        addComponent(Lemonade.Components.selectable);
    
    hero.set("position", "width", GLB_TILE_SIZE);
    hero.set("position", "height", GLB_TILE_SIZE);

    hero.set("statbar", "color", "#ee0000");
    hero.set("statbar", "offsetY", -15);
    hero.set("statbar2", "color", "#cccc00");

    FortUtils.setTeam(hero, tt);
    
    
    return hero;
}
function FortFactory(tt){
    var fort = new Lemonade.Entity();
    
    fort.addComponent(Lemonade.Components.visible).
        addComponent(Lemonade.Components.collide).
        addComponent(Lemonade.Components.rectangle).
        addComponent(Lemonade.Components.position).
        addComponent(Lemonade.Components.camera).
        addComponent(Lemonade.Components.resource).
        addComponent(Lemonade.Components.caster).
        addComponent(Lemonade.Components.living).
        addComponent(Lemonade.Components.statbar).
        addComponent(Lemonade.Components.statbar2).
        addComponent(Lemonade.Components.selectable);
    
    fort.set("position", "width", GLB_TILE_SIZE);
    fort.set("position", "height", GLB_TILE_SIZE);

    fort.set("statbar", "color", "#ee0000");
    fort.set("statbar", "offsetY", -15);
    fort.set("statbar2", "color", "#cccc00");

    FortUtils.setTeam(fort, tt);

    FortUtils.setMaxHealth(fort, 5);
    FortUtils.setHealth(fort, 5);
    
    FortUtils.setMaxResource(fort, 100);
    FortUtils.setRegenerationSpeed(fort, 1);
    FortUtils.setSpeed(fort, 0);
    FortUtils.setMoveRange(fort, 0);

    // Add the default move card.
    DeckUtils.addCard(fort, new CardForfeit());
    
    
    return fort;
}

function TreeTrunk(){
    var hero = HeroFactory();
    
    hero.removeComponent(Lemonade.Components.rectangle);
    hero.addComponent(Lemonade.Components.image);
    hero.set("image", "image", Lemonade.Repository.addImage("treetrunk", "content/images/characters/treetrunk0.png", 32, 32));
    
    hero.addComponent(Lemonade.Components.tooltip);
    hero.set("tooltip", "information", "You hear a sound eminating from the trunk.");
    
    FortUtils.setName(hero, "TreeTrunk");

    FortUtils.setMaxHealth(hero, 5);
    FortUtils.setHealth(hero, 5);
    
    FortUtils.setMaxResource(hero, 100);
    FortUtils.setRegenerationSpeed(hero, 5);
    FortUtils.setSpeed(hero, 0);
    FortUtils.setMoveRange(hero, 0);
    FortUtils.setGravityAffected(hero, false);
    
    FortUtils.setDiscipline(hero, DISCIPLINE_TRICKS);

    hero.set("statbar", "maxVal", FortUtils.getMaxHealth(hero));
    hero.set("statbar", "val", FortUtils.getHealth(hero));

    hero.removeComponent(Lemonade.Components.statbar2);
    hero.removeComponent(Lemonade.Components.caster);

    return hero;
}
function Castle(tt){
    var fort = FortFactory(tt);
    
    fort.removeComponent(Lemonade.Components.rectangle);
    fort.addComponent(Lemonade.Components.image);
    fort.set("image", "image", Lemonade.Repository.addImage("castle", "content/images/map/castle1.png", 32, 32));
    
    fort.addComponent(Lemonade.Components.tooltip);
    fort.set("tooltip", "information", "Castle|Troops assemble within the tiny castle.");
    
    FortUtils.setName(fort, "Castle"+tt);
    
    FortUtils.setDiscipline(fort, DISCIPLINE_TRICKS);

    fort.set("statbar", "maxVal", FortUtils.getMaxHealth(fort));
    fort.set("statbar", "val", FortUtils.getHealth(fort));

    fort.set("statbar2", "maxVal", FortUtils.getMaxResource(fort));
    fort.set("statbar2", "val", FortUtils.getResource(fort));

    return fort;
}