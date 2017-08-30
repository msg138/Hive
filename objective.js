
/**
 * This objective is only for satisfying the terms to complete the battle. 
 * THere are sub objectives which may provide an edge or are required by
 * an objective, by for example, story mode.. etc.
 * 
 */
function Objective(nameDesc, maxPoints, teams, checkWin){
    this.nameDesc = nameDesc || "OBJECTIVE";
    this.maxPoints = maxPoints || 20;
    this.teams = teams || [];
    this.checkWin = checkWin || function(){ if(teams.length <=0) return 0; var t=teams[0]; var tt=teams[1]; if(t.score > tt.score) return t.number; return tt.number; };
    this.win = 0;
    this.e = Lemonade.addEntity(new Lemonade.Entity());
    this.e.addComponent(Lemonade.Components.update);
    this.e.set("update","update", function(e, d){
        for(var i=0;i<d.teams.length;i++)
        {
            if(d.teams[i].score >= d.maxPoints)
            {
                var dwin = d.checkWin();
                    d.win = dwin;
            }
        }
    });
    this.e.set("update", "data", this);


    return this;
}