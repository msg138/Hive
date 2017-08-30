Lemonade.include("buff.js");

FortUtils = {};

// Living - Are They Dead
FortUtils.isDead = function(e){
    return e.get("living", "dead");
};

FortUtils.kill = function(e){
    FortUtils.move(e, -1, -1);
    if(GameData.inGame() === true){
        GameData.quest.onDeath(e);
    }
    //1998
    if(temp.selected === e)
        temp.selected = undefined;
    return e.set("living", "dead", true);
}

FortUtils.setTeam = function(e, t){
    return e.set("living", "team", t);
};
FortUtils.getTeam = function(e){
    return e.get("living", "team");
};

FortUtils.getSightRange = function(e){
    return e.get("living", "sightRange");
};
FortUtils.setSightRange = function(e, sr){
    return e.set("living", "sightRange", sr);
};

// Living - Can Be Healed
FortUtils.canBeHealed = function(e){
    return e.get("living", "canBeHealed");
};
// Living - Can Be Damaged
FortUtils.canBeDamaged = function(e){
    return e.get("living", "canBeDamaged");
};
// Living - Can Die
FortUtils.canDie = function(e){
    return e.get("living", "canDie");
};

// Living - Gravity
FortUtils.getGravityAffected = function(e){
    return e.get("living", "gravityAffected");
};
FortUtils.setGravityAffected = function(e, ga){
    return e.set("living", "gravityAffected", ga);
};

// Living - Health
FortUtils.setHealth = function(e, h){
    if(e.get("living", "maxHealth") < h)
        h = e.get("living", "maxHealth");
    if(h < 0)
        h = 0;
    return e.set("living", "health", h);
};
FortUtils.modHealth = function(e, dh){
    return FortUtils.setHealth(e, e.get("living", "health") + dh);
};
FortUtils.getHealth = function(e){
    return e.get("living", "health");
};
FortUtils.damage = function(e, damager, damage, damageType){
    if(GameData.inGame() === true){
        if(GameData.quest.onTakeDamage(damager, e, damage, damageType)===false)
            return;
    }
    return FortUtils.modHealth(e, -damage);
};
FortUtils.heal = function(e, healer, healthgain){
    if(GameData.inGame() === true){
        if(GameData.quest.onHeal(healer, e, healthgain)===false)
            return;
    }
    return FortUtils.modHealth(e, healthgain);
};
FortUtils.getCardToCast = function(e){
    return e.get("caster", "cardToCast");
}
// Living - Max Health
FortUtils.getMaxHealth = function(e){
    return e.get("living", "maxHealth");
};
FortUtils.setMaxHealth = function(e, mh){
    if(mh < 0)
        mh = 0;
    return e.set("living", "maxHealth", mh);
};
// Living Name Related functions.
FortUtils.getName = function(e){
    return e.get("living", "name");
};
FortUtils.setName = function(e, nn){
    return e.set("living", "name", nn);
};
// Living - Map Positioning
FortUtils.getTileX = function(e){
    return e.get("living", "tileX");
};
FortUtils.getTileY = function(e){
    return e.get("living", "tileY");
};
// Setters
FortUtils.setTileX = function(e, tx){
    if(tx < 0)
        tx = 0;
    return e.set("living", "tileX", tx);
};
FortUtils.setTileY = function(e, ty){
    if(ty < 0)
        ty = 0;
    return e.set("living", "tileY", ty);
};
FortUtils.move = function(e, tx, ty){
    FortUtils.setTileX(e, tx);
    FortUtils.setTileY(e, ty);
    return ty*tx;
};

FortUtils.inRange = function(e, tx, ty, range){
    return Math.abs(FortUtils.getTileX(e) - tx) + Math.abs(FortUtils.getTileY(e) - ty) <= range;
};
FortUtils.distanceTo = function(e, tx, ty){
    return Math.abs((FortUtils.getTileX(e) - tx)) + Math.abs(FortUtils.getTileY(e) - ty);
    // OLD WAY:return Math.abs((FortUtils.getTileX(e) - tx) - (FortUtils.getTileY(e) - ty));
};

FortUtils.setSpeed = function(e, s){
    if(s < 0)
        s = 0;
    return e.set("living", "speed", s);
};
FortUtils.getSpeed = function(e){
    return e.get("living", "speed");
};

FortUtils.setMoveRange = function(e, mr){
    if(mr < 0)
        mr = 0;
    return e.set("living", "moveRange", mr);
}
FortUtils.getMoveRange = function(e){
    return e.get("living", "moveRange");
}

FortUtils.getDiscipline = function(e){
    return e.get("living", "discipline");
};
FortUtils.setDiscipline = function(e, d){
    return e.set("living", "discipline", d);
};

// Resource Related things
// resource - value
FortUtils.setResource = function(e, r){
    if(r < 0)
        r = 0;
    if(r > FortUtils.getMaxResource(e))
        r = FortUtils.getMaxResource(e);
    return e.set("resource", "currentValue", r);
};
FortUtils.getResource = function(e){
    return e.get("resource", "currentValue");
};
FortUtils.modResource = function(e, dr){
    return FortUtils.setResource(e, FortUtils.getResource(e) + dr);
};
// Max Value
FortUtils.setMaxResource = function(e, mr){
    if(mr < 0)
        mr = 0;
    return e.set("resource", "maxValue", mr);
};
FortUtils.getMaxResource = function(e){
    return e.get("resource", "maxValue");
};
// Regeneration
FortUtils.setRegenerationSpeed = function(e, mr){
    if(mr < 0)
        mr = 0;
    return e.set("resource", "regenerationSpeed", mr);
};
FortUtils.getRegenerationSpeed = function(e){
    return e.get("resource", "regenerationSpeed");
};

// Update Resource COunt
FortUtils.regenerateResource = function(e){
    return FortUtils.modResource(e, FortUtils.getRegenerationSpeed(e));
};

// Buffs
FortUtils.addBuff = function(e, buff){
    e.get("living", "buffs").push(buff);
    BuffUtils.applyBuff(e, buff);
    return e;
};
FortUtils.removeBuff = function(e, buff){
    var bf = e.get("living", "buffs");
    for(var i=0;i<bf.length;i++)
    {
        if(bf[i].stat === buff.stat && buff.amount === -1)
        {
            BuffUtils.removeBuff(e, bf[i]);
            e.get("living", "buffs").splice(i, 1);
        }else if(bf[i].stat === buff.stat && bf[i].amount === buff.amount){
            BuffUtils.removeBuff(e, bf[i]);
            e.get("living", "buffs").splice(i, 1);
        }
    }
};
FortUtils.getBuffs = function(e){
    return e.get("living", "buffs");
};