
var STAT = {MAXHEALTH: 0,
            MOVESPEED: 1,
            REGENERATIONSPEED: 2,
            };

function Buff(stat, amount, time){
    this.stat = stat;
    this.amount = amount;
    this.time = time;
    
    return this;
}

var BuffUtils = {};

BuffUtils.applyBuff = function(e, buff){
    switch(buff.stat){
        case STAT.MAXHEALTH:
            FortUtils.setMaxHealth(e, FortUtils.getMaxHealth(e) + buff.amount);
            break;
        case STAT.MOVESPEED:
            FortUtils.setMoveSpeed(e, FortUtils.getMoveSpeed(e) + buff.amount);
            break;
        case STAT.REGENERATIONSPEED:
            FortUtils.setRegenerationSpeed(e, FortUtils.getRegenerationSpeed(e) + buff.amount);
            break;
    }
};
BuffUtils.removeBuff = function(e, buff){
    switch(buff.stat){
        case STAT.MAXHEALTH:
            FortUtils.setMaxHealth(e, FortUtils.getMaxHealth(e) - buff.amount);
            break;
        case STAT.MOVESPEED:
            FortUtils.setMoveSpeed(e, FortUtils.getMoveSpeed(e) - buff.amount);
            break;
        case STAT.REGENERATIONSPEED:
            FortUtils.setRegenerationSpeed(e, FortUtils.getRegenerationSpeed(e) - buff.amount);
            break;
    }
};