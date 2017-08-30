
// A star pathfinding attempts.

var Astar = {};

Astar.openlist = [];
Astar.closelist= [];
Astar.path = [];
Astar.currentnode = undefined;

Astar.listContainsNodeOpen = function(list, node){
    for(var i=0;i<list.length;i++)
    {
        if(list[i].x === node.x && list[i].y === node.y)
            return true;
    }
    return false;
};
Astar.listContainsNodeClose = function(list, node){
    for(var i=0;i<list.length;i++)
    {
        if(list[i].x === node.x && list[i].y === node.y && list[i].parent === node.parent)
            return true;
    }
    return false;
};

Astar.getPath = function(sx, sy, tx, ty, map){
    Astar.openlist = [];
    Astar.closelist= [];
    Astar.path = [];
    Astar.currentnode = Astar.createNode(sx, sy, 0, MapUtils.distanceTo(sx, sy, tx, ty));
    Astar.openlist.push(Astar.currentnode);
    Astar.closelist.push(Astar.currentnode);
    Astar.path.push(Astar.currentnode);
    var pathFound = false;
    console.log("Starting astar stuff.");
    while(pathFound === false){
    console.log("Adding to list: current Node: " + Astar.currentnode.x +" , " + Astar.currentnode.y);
        for(var x=-1;x<=1;x++){
            for(var y=-1;y<=1;y++){
                if(MapUtils.isWalkable(map, MapUtils.getTile(map, Astar.currentnode.x + x, Astar.currentnode.y + y)) === false)
                    continue;
                if(x === 0 && y === 0)
                    continue;
                
                    /*/ PRevent adding multiple of the same node to list.
                var ff = false;
                for(var i=0;i<Astar.openlist.length;i++)
                    if(Astar.openlist[i].x === Astar.currentnode.x + x && 
                        Astar.openlist[i].y === Astar.currentnode.y + y)
                        ff = true;
                if(ff === true)
                    continue;*/

                var node = Astar.createNode(Astar.currentnode.x + x, Astar.currentnode.y + y, Astar.currentnode.g+1,
                    MapUtils.distanceTo(Astar.currentnode.x + x, Astar.currentnode.y + y, tx, ty), Astar.currentnode);

                if(Astar.listContainsNodeOpen(Astar.openlist, node) === true || 
                    Astar.listContainsNodeClose(Astar.closelist, node) === true)
                    continue;


                if((x === -1 && y === -1) ||
                    (x === -1 && y === 1) ||
                    (x === 1 && y === -1) ||
                    (x === 1 && y === 1))
                    node.g+=1;
                node.f = node.g + node.h;
                Astar.openlist.push(node);
            }
        }
        console.log("Searching for closest node that is quick..\n\tPossible Nodes:");
        var closenode = undefined;
        for(var i=0;i<Astar.openlist.length;i++)
        {
            if(Astar.openlist[i].parent !== Astar.currentnode)
                continue;
            console.log("\t\t N: " + Astar.openlist[i].x +", " + Astar.openlist[i].y+ " G: "+Astar.openlist[i].g + " H: " + Astar.openlist[i].h);
            if((closenode === undefined || closenode.f > Astar.openlist[i].f || 
                (closenode.f === Astar.openlist[i].f && closenode.h > Astar.openlist[i].h)) 
                && Astar.listContainsNodeClose(Astar.closelist, Astar.openlist[i]) === false)
            {
                closenode = Astar.openlist[i];
            }
        }
        if(closenode === undefined){
            console.log("Node not found.");
            // Did not find a node. go back one. or break with a bad path.
            if(Astar.currentnode.x === sx && Astar.currentnode.y === sy)
            {
                Astar.path = [];
                pathFound - true;
                console.log("Path not found.");
            }else{
                var no = Astar.path.pop();
                //Astar.closelist.push(Astar.currentnode);
                Astar.currentnode = Astar.currentnode.parent;
                console.log("Going to parent.");
            }
        }else{
            console.log("Node found. Adding and continuing." + closenode.x +", "+closenode.y+" F: " + closenode.g + "," +closenode.h);
            Astar.path.push(closenode);
            Astar.currentnode = closenode;
            Astar.closelist.push(closenode);
            if(closenode.x === tx && closenode.y === ty){
                pathFound = true;
                console.log("PATH FOUND!");
            }
        }
    }
    return Astar.path;

};

Astar.createNode = function(x, y, gg, hg, parent){
    return {x: x, y: y, f: gg+hg, g: gg, h: hg, parent: parent};
};

Astar.visual = function(pa){
    for(var i=0;i<pa.length;i++)
    {
        var nh = new RobinHero(temp.player);
        FortUtils.setTileX(nh, pa[i].x);
        FortUtils.setTileY(nh, pa[i].y);
        Lemonade.addEntity(nh);
    }
};