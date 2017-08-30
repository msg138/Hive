

function Quest(){
    this.flags = {};
    
    this.flags.isSetup = false;
    this.flags.failed = false;
    this.flags.passed = false;
    
    this.npc = undefined;
    
    this.name = "";
    this.description = "";

    this.maxTurns = 20; // 20 is the default max Turns. Can be made to be longer or -1 == Infinite never ending wave style.
    
    this.passedMaxTurns = function(tts){
        tts = tts || GameTimer.getTurns();

        return !(tts < this.maxTurns)  && this.maxTurns !== -1;
    }

    this.scenario = {};
    this.scenario.map = undefined;
    this.scenario.heroes = undefined;
    
    this.step = 0;
    
    this.onSetup = function(){};
    
    this.setup = function(){
        //2016
        this.onSetup();
    };
    
    this.onCardPlay= function(owner, card, tx, ty){
    };
    this.onMove = function(owner, tx, ty){
    };
    this.onCardActivate = function(owner, card, tx, ty){

    };
    this.onTakeDamage = function(dealer, taker, damage, damageType){};
    this.onHeal = function(healer, taker, hg){};// hg = healthGained
    this.onRegenerate = function(owner){};
    this.onTimerTick = function(){};
    this.onTimerSecond = function(){};
    this.onTimerTurn = function(){};

    this.onDeath = function(deadOne){};

    this.updateLogic = function(){
        if(this.passedMaxTurns() === true && GameTimer.paused === false){
            this.failOrNaw();
            GameTimer.pause();
        }
    };
    
    this.onFail = function(){
    };
    
    this.fail = function(){
        this.flags.failed = true;
        this.onFail();
    };
    
    this.determineSuccess = function(){
        // To be overriden
    };

    this.failOrNaw = function(){
        if(this.determineSuccess() === true)
            this.succeed();
        else
            this.fail();
    };

    this.onSucceed = function(){  
    };
    this.succeed = function(){
        this.flags.passed = true;
        this.onSucceed();
    };
    
    return this;
}

function CharacterSelectionQuest(){
    var q = new Quest();
    q.name = "Select Your Champion";
    q.description = "Select your champion by using their first ability";
    q.maxTurns = -1;
    
    q.onTimerTurn = function(){
    };

    q.onDeath = function(deadOne){
    };
    q.onTimerTick = function(){
    };

    q.determineSuccess = function(){
        return false;
    };
    
    q.onFail = function(){
        Banner.display(new Banner.BannerObject("Hero Not Selected", "You did not select anyone. Returning to menu.", 5000, function(){
            changeMenu(MENU_MAIN);
        }));
    };
    q.onSucceed = function(){
        Banner.display(new Banner.BannerObject("Hero Selected", "Game will begin soon", 3000, function(){
            changeMenu(MENU_INGAME);
        }));
    };
    
    return q;
}
