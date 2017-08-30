
Lemonade.include("turn.js");

var GameTimer = {};

//Constants
GameTimer.maxTime = 800;// Max amount of seconds to remember.

// Time per turn
GameTimer.interval = 10;// in seconds.
GameTimer.millisecondInterval = 50;

//End


GameTimer.time = 0;
GameTimer.actualTime = 0;

GameTimer.turnCount = 0;

GameTimer.millTime = 0;


GameTimer.loop = undefined;

GameTimer.paused = true;

GameTimer.reset = function(){
    GameTimer.pause();
    GameTimer.time = 0;
    GameTimer.actualTime = 0;
    GameTimer.turnCount = 0;
    GameTimer.millTime = 0;
    if(GameTimer.loop !== undefined){
        clearTimeout(GameTimer.loop);
        GameTimer.loop = undefined;
    }
};

GameTimer.start = function(){
    GameTimer.paused = false;

    if(GameTimer.turnCount <= 0 && GameTimer.actualTime === 0)
    {
        if(GameData.inGame())
        {
            Banner.display(new Banner.BannerObject(GameData.quest.name, GameData.quest.description, 2000, function(){
                GameTimer.startLoop();
            }));
            return;
        }
    }
    
    // Need to restart the loop.
    GameTimer.startLoop();
};
GameTimer.pause = function(){
    GameTimer.paused = true;
};

GameTimer.convertToGameTime = function(t){
    return t * (1000 / GameTimer.millisecondInterval);
};

GameTimer.timerLoop = function(){
    GameTimer.actualTime ++;
    GameTimer.millTime ++;
    //1998
    if(GameData.quest !== undefined)
    {
        GameData.quest.updateLogic();
        GameData.quest.onTimerTick();
    }
    if(GameTimer.actualTime%(1000 / GameTimer.millisecondInterval) === 0){
        GameTimer.time ++;
        GameTimer.actualTime = 0;
        
        //1998
        if(GameData.quest !== undefined)
        {
            GameData.quest.onTimerSecond();
        }
    }
    if(GameTimer.time >= GameTimer.maxTime)
        GameTimer.time -= GameTimer.maxTime;
        
    if(GameTimer.actualTime === 0){
        if(GameTimer.time%(GameTimer.interval) === 0){
            GameTimer.doTurnAction();
        }
    }
    
    if(GameTimer.paused === false)
        GameTimer.loop = setTimeout(GameTimer.timerLoop, GameTimer.millisecondInterval);
};

GameTimer.startLoop = function(){
    GameTimer.paused = false;
    GameTimer.timerLoop();
};

GameTimer.doTurnAction = function(){
    doTurn();
    GameTimer.turnCount ++;
};

GameTimer.getTurns = function(){
    return GameTimer.turnCount || Math.floor(GameTimer.time / GameTimer.interval);
}