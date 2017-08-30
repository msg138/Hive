
Lemonade.include("gamedata.js");

function ServerHandle()
{

    this.handleMessage = function(data){
        console.log("C: "+this.id + " D: ", data);

        var res = data.split(" ");
        if(res.length < 1)
            return;
        switch(res[0])
        {
            case 'LOGIN':
            // This expects that there be a var named serverHandle
            serverHandle.handleLogin(res.slice(1,res.length));
            break;
            case 'CHAT':
            serverHandle.handleChat(data.substr(4));
            break;
            case 'MATCHDATA':
            serverHandle.handleMatchInfo(res.slice(1, res.length));
            break;
            case 'MATCHUPDATE':
            serverHandle.handleMatchUpdate(res.slice(1, res.length));
            break;
            default:
            console.log("Invalid command");
            break;
        }
    };

    this.handleLogin = function(data){
        if(data.length > 0)
        {
            if(data[0] == "SUCCESS")
                loggedIn = true;
            else
                loggedIn = false;
        }
    };

    this.handleChat = function(data){
        temp.chatBox.addText(data);
    };
    this.handleMatchUpdate = function(data){
        if(data[0] == "END")
        {
            alert("OTHER PLAYER HAS LEFT!");
            changeMenu(MENU_MAIN);
            return;
        }
        temp.gameData.serverTime = data[0];
        temp.player.tileX = data[1];
        temp.player.tileY = data[2];
        temp.enemy.tileX = data[3];
        temp.enemy.tileY = data[4];
    };
    this.handleMatchInfo = function(data){
        if(data.length < 3)
        {
            temp.matchData.fail = true;
        }else{
            temp.matchData.opponent = new Valkyrie();
            temp.matchData.opponent.name = data[0];
            temp.matchData.opponent.tileX = data[1];
            temp.matchData.opponent.tileY = data[2];
            temp.matchData.opponent.team = 1;
        }
        temp.matchData.complete = true;
    };
    
    return this;
}