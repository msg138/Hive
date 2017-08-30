Lemonade.include("map.js");

var GLB_MARKER_OFFSETX = -14;
var GLB_MARKER_OFFSETY = -86;
var GLB_MARKER_SIZE = 96 - 96*0.1;

function MoveMarker(){
    var e = new Lemonade.Entity();
    
    e.addComponent(Lemonade.Components.visible).
        addComponent(Lemonade.Components.position).
        addComponent(Lemonade.Components.camera).
        addComponent(Lemonade.Components.marker).
        addComponent(Lemonade.Components.image);
    
    e.set("image", "image", Lemonade.Repository.addImage("movemarker", "content/images/gui/movemarker1.png", 32, 32));
    
    e.set("visible", "isVisible", false);
    
    e.set("position", "width", GLB_MARKER_SIZE);
    e.set("position", "height", GLB_MARKER_SIZE);
    
    return e;
}

var MarkerUtils = {};

MarkerUtils.setMarker = function(e, markX, markY, mx, my, cardCast){
    e.set("marker", "tileX", markX);
    e.set("marker", "tileY", markY);
    e.set("marker", "x", mx);
    e.set("marker", "y", my);

    e.set("marker", "cardCast", cardCast);
    
    e.set("position", "x", mx + GLB_MARKER_OFFSETX);
    e.set("position", "y", my + GLB_MARKER_OFFSETY);
    
    e.set("visible", "isVisible", true);

    Lemonade.bringEntityToFront(e.id);
    
    return e;
};
MarkerUtils.disableMarker = function(e){
    e.set("visible", "isVisible", false);
};
MarkerUtils.isEnabled = function(e){
    return e.get("visible", "isVisible");
};

MarkerUtils.getTileX = function(e){
    return e.get("marker", "tileX");
};
MarkerUtils.getTileY = function(e){
    return e.get("marker", "tileY");
};

MarkerUtils.getCardCast = function(e){
    return e.get("marker", "cardCast");
}