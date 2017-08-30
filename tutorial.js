Lemonade.include("character.js");
Lemonade.include("quest.js");

function GuideCharacter()
{
    var c = new Character("Wizard Trisbon", Lemonade.Repository.getImage("GUIDECHARACTER"), {x: 0, y: 0}, 3);
    return c;
}

function TutorialQuest2(){
    var q = new Quest();
    q.npc = new GuideCharacter();
    
    q.name = "Getting Started, Part 3";
    q.description = "Finishing lesson.";

    q.npc.speak(["I will do my best to explain other things I find to be important to playing Domain.", "You have a line of sight. Keeps this in mind when moving or aiming at enemies. Just because you can't see them, does not mean they can't see you.", "Try to coordinate your moves so that they work together.", "You could also ask in the chat, or visit the forums to learn more about the game and make suggestions.", "Hope you enjoy playing Domain.", "To complete this quest, kill the Jester."]);

    q.onDeath = function(dead){
        if(dead !== temp.player){
            //1998
            Banner.display(new Banner.BannerObject("Quest Completed!", "Tutorial Quest 3/3 Complete", 2000));
            q.npc.speak(["Enjoy the game!|You will be redirected to the main menu when I go away."]);
            q.npc.goAway = function(){
                changeMenu(MENU_MAIN);
            };
        }
    }

    return q;
}

function TutorialQuest1(){
    var q = new Quest();
    
    q.npc = new GuideCharacter();
    
    q.name = "Getting Started, Part 2";
    q.description = "Basic lesson on Playing Cards.";
    
    q.onCardPlay = function(o, c, x, y)
    {/*
        this.step ++;
        this.npc.speak(["   Awesome, you are getting the hang of things.","   When you play a card it goes on cooldown. These can vary.","   The card you played has 20 second cooldown and increased your move distance.","   Now lets move on to playing more advanced cards."]);
        this.npc.goAway = function(){
            for(var i=0;i<DeckUtils.getDeckFromHero(temp.player).length;i++)
            {
                DeckUtils.getDeckFromHero(temp.player)[i].disabled = false;
            }
            //1998
            GameData.quest = new TutorialQuest0();
            Banner.display(new Banner.BannerObject("Quest Completed!", "Tutorial Quest 2/X Complete", 1000));
        };*/
    };
    q.onTakeDamage = function(d, t, da, dt){
        if(t !== temp.player){
            // COmplete the quest.
            Banner.display(new Banner.BannerObject("Quest Completed!", "Tutorial Quest 2/3 Complete", 2000));
            this.npc.speak(["Great job! Most of the time your opponents will try to destroy you, so it is wise to destroy them first.", "Although there are times when you should focus on a different objective.", "Let's move on."]);
            
            for(var i=0;i<DeckUtils.getDeckFromHero(temp.selected).length;i++)
            {
                DeckUtils.getDeckFromHero(temp.selected)[i].disabled = false;
            }
            this.npc.goAway = function(){
                //1998
                GameData.quest = new TutorialQuest2();
            }
        }
    };
    q.npc.goAway = function(){
        FortUtils.modResource(temp.selected, 100);
    };
    q.npc.speak(["Lets work on attacking. When you hover over an action you can read what it does.", "Most heroes will have actions that deal damage to enemy heroes. Use these to destroy your opponents and win.", "Actions will often have an energy cost to be used. For now I will restock your energy", "Most actions are cast the same. Try moving closer to the Jester and hitting him with an arrow."]);
    
    Banner.display(new Banner.BannerObject("Quest Accepted!", "Tutorial Quest 2, Attacking lesson", 3000));

    for(var i=2;i<DeckUtils.getDeckFromHero(temp.selected).length;i++)
    {
        DeckUtils.getDeckFromHero(temp.selected)[i].disabled = true;
    }
    return q;
}
function TutorialQuest0(){
    var q = new Quest();
    
    q.npc = new GuideCharacter();
    
    q.name = "Getting Started, Part 1";
    q.description = "Basic lesson on Movement Controls.";
    
    q.onMove = function(o, x, y)
    {
        this.step ++;
        this.npc.speak(["Awesome, you are getting the hang of things.","As you could see, actions happen every " + GameTimer.interval + " seconds.","Notice the timer at the top of the screen. This will help you in knowing when to lock in. When the timer hits '0', actions are cast.", "Lets move on."]);
        this.npc.goAway = function(){
            Banner.display(new Banner.BannerObject("Quest Completed!", "Tutorial Quest 1/3 Complete", 2000));
            // This assumes that the player is selected.
            for(var i=0;i<DeckUtils.getDeckFromHero(temp.selected).length;i++)
            {
                DeckUtils.getDeckFromHero(temp.selected)[i].disabled = false;
            }
            //1998
            GameData.quest = new TutorialQuest1();
        };
    };
    q.onCardPlay = function(o, c, x, y)
    {
        this.npc.speak(["You are pushing ahead. Stay focused.","Use the 'Move' card to complete this quest."]);
        this.npc.goAway = function(){
            // Assume that the player is selected.
            temp.selected = GameData.heroes[0];
            for(var i=1;i<DeckUtils.getDeckFromHero(temp.selected).length;i++)
            {
                DeckUtils.getDeckFromHero(temp.selected)[i].disabled = true;
            }
        };
    };   
    
    q.npc.speak(["Welcome To Domain. Allow me to introduce you to the controls of the game. |Click to continue.", "You will notice some circles on the bottom of|the screen.|These are your actions.", "The first action will always move your |character to where you choose, within range|of course.", "To use an action, left click the circle, then|left click a location in the red.", "Some cards do not require a location to be|cast.", "Try casting 'Move' first."]);
    
    Banner.display(new Banner.BannerObject("Quest Accepted!", "Tutorial Quest 1, Movement lesson", 3000));

    temp.selected = GameData.heroes[0];
    // Disable other cards except for the first (Always move)
    for(var i=1;i<DeckUtils.getDeckFromHero(temp.selected).length;i++)
    {
        DeckUtils.getDeckFromHero(temp.selected)[i].disabled = true;
    }
    return q;
}