
Lemonade.include("action.js");

var GLOBAL_SHOWHEALTHBARS = true;

function LivingThing(image)
{
  this.livingthing = true;// Just a flag, to determine the difference between unit and structure
  
  // Health and maxHealth of the thing
  this.health = 100;
  this.maxHealth = 100;
  
  this.damage = 1;
  this.defense = 1;
  
  this.attackRange = 3; // How many squares away they can hit from.
  
  this.selected = false;
  
  this.team = 0;// 0 is the default player team
  
  this.entity = Lemonade.addEntity(new Lemonade.Entity());
  this.entity.addComponent(Lemonade.Components.visible);
  
  this.entity.addComponent(Lemonade.Components.collide);
  
  this.entity.addComponent(Lemonade.Components.statbar);
  this.entity.set("statbar", "val", this.health);
  this.entity.set("statbar", "maxVal", this.maxHealth);
  this.entity.set("statbar", "color", '#dd0000');
  this.entity.set("statbar", "outlineWidth", 1);
  this.entity.set("statbar", "width", 21);
  this.entity.set("statbar", "height", 3);
  this.entity.set("statbar", "visible", false);
  
  this.entity.addComponent(Lemonade.Components.border);
  this.entity.set("border", "width", 20);
  this.entity.set("border", "visible", false);
  
  this.entity.addComponent(Lemonade.Components.image);
  this.entity.set("image","image", Lemonade.Repository.addImage(image || "image", image || "content/images/mob/mob_knightunit1.png", 16, 16));
  
  this.entity.addComponent(Lemonade.Components.position);
  this.entity.set("position","width",32);
  this.entity.set("position","height", 32);
  
  this.entity.addComponent(Lemonade.Components.update);
  this.entity.set("update","update", function(ent, data){
    ent.set("statbar", "val", data.health);
    
    ent.set("border", "visible", data.selected);
    
    // Queue of actions
    if(data.actions.length > 0)
    {
      data.actions[0].activate(data);
      if(data.actions[0].finished === true)
      {
        data.actions.splice(0,1);
      }
    }
    
    
    // Healthbar visible ornaw
    if(GLOBAL_SHOWHEALTHBARS === true || Lemonade.Event.eventExists(EVENT_COLLIDE+'mouse', ent.id, true, true))
    {
      ent.set("statbar", "visible", true);
    }else
      ent.set("statbar", "visible", false);
  });
  this.entity.set("update","data", this);
  
  // Get the map location in Tiles
  this.getMapLocationT = function(){
    return {x: Math.floor((this.entity.get("oposition", "x")+this.entity.get("position","width")/2) / GLOBAL_TILESIZE), y: Math.floor((this.entity.get("oposition", "y")+this.entity.get("position","height")) / GLOBAL_TILESIZE)};
  };
  
  this.actions = []; // A queue of actions for the livingthing to follow.
  
  this.queueAction = function(action, priority){
    if(priority === 1)
    {
      this.actions.unshift(action);
    }else if(priority === 0)
      this.actions = [action];
    else
      this.actions.push(action);
  };
}
LivingThing.prototype.getHealth = function(){ return this.health; };
LivingThing.prototype.setHealth = function(h){ this.health = h; return this.health; };