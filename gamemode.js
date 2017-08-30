Lemonade.include("quest.js");


function GameModeFightSolo(){
    var q = new Quest();
    q.name = "Fight Solo";
    q.description = "Fight to the death. Last man standing.|FIrst Kill wins. |Maximum turns, 20";
    
    q.onTimerTurn = function(){
    };

    q.onDeath = function(deadOne){
        if(GameData.isTeamAlive(temp.enemy) === false)
        {
            q.onSucceed();
        }else if(GameData.isTeamAlive(temp.player) === false)
            q.onFail();
    };
    q.onTimerTick = function(){
        if(GameData.isTeamAlive(temp.enemy) === false)
        {
            q.onSucceed();
        }else if(GameData.isTeamAlive(temp.player) === false)
            q.onFail();
    };

    q.determineSuccess = function(){
        return false;
    };
    
    q.onFail = function(){
        Banner.display(new Banner.BannerObject("Quest Failed!", "You were not the last man standing!", 1000, function(){
            changeMenu(MENU_MAIN);
        }));
    };
    q.onSucceed = function(){
        Banner.display(new Banner.BannerObject("Quest Completed!", "You are the last man standing!", 1000, function(){
            changeMenu(MENU_MAIN);
        }));
    };
    
    return q;
}
