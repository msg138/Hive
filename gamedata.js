Lemonade.include("character.js");

var GameData = {};

GameData.heroes = [];

GameData.user = 
{
    name: "NIL_USER",
    lastPlay: "now",
    lastHero: undefined,
    lastDeck: undefined,
};

GameData.flags = {};

GameData.flags.inProgress = false;
GameData.flags.firstTime = false;

GameData.quest = undefined;

GameData.inGame = function(){
    return GameData.quest !== undefined;
};

GameData.destroy = function(){
    GameData.heroes = [];

    GameData.flags = {};
    GameData.flags.inProgress = false;
    GameData.flags.firstTime = false;

    GameData.quest = undefined;

    GameTimer.reset();

};

GameData.wipeTeam = function(tn){
    for(var i=0;i<GameData.heroes.length;i++)
    {
        if(FortUtils.getTeam(GameData.heroes[i]) === tn){
            FortUtils.kill(GameData.heroes[i]);
            continue;
        }
    }
};

GameData.isTeamAlive = function(tn){
    for(var i=0;i<GameData.heroes.length;i++)
    {
        if(FortUtils.getTeam(GameData.heroes[i]) === tn && FortUtils.isDead(GameData.heroes[i]) === false){
            return true;
        }
    }
    return false;
};