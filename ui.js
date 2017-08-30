
var UI_LOAD_DOTS = [".","..","..."];
var UI_LOAD_DEFAULT = UI_LOAD_DOTS;

var UI_DEFAULT_BACK_IMAGE = "content/images/gui/guiback0.png";
var UI_TOOLTIP_USEBACKGROUND = false;
var UI_UI_USEBACKGROUND = false;

function TextInput(inputBoxColor, maxText, mask, defaultValue, fontSize, inputBoxFont, posX, posY, label, useBackGround){

    this.textValue = defaultValue || "";
    this.maskText = mask || false;
    this.maxText = maxText || 64;

    if(useBackGround === undefined)
        useBackGround = true;

    this.mx = 0;
    this.my = 0;
    if(useBackGround === true){
        this.mx = 16;
        this.my = 10;
    }

    this.label = label;

    this.selected = false;

    this.bkEnt = new Lemonade.Entity();
    this.bkEnt.addComponent(Lemonade.Components.visible);
    this.bkEnt.addComponent(Lemonade.Components.rectangle);
    this.bkEnt.addComponent(Lemonade.Components.color);
    this.bkEnt.set("color","red", "#ffffff");
    this.bkEnt.addComponent(Lemonade.Components.position);
    this.bkEnt.set("position", "x", posX || 0);
    this.bkEnt.set("position", "y", posY || 0);
    this.bkEnt.set("position","width", this.maxText * (fontSize || 20));
    this.bkEnt.set("position","height", (fontSize || 20));

    if(this.label !== undefined)
    {
        this.lbEnt = new Lemonade.Entity();
        this.lbEnt.addComponent(Lemonade.Components.visible);
        this.lbEnt.addComponent(Lemonade.Components.collide);

        this.lbEnt.addComponent(Lemonade.Components.label);
        this.lbEnt.set("label", "style", (fontSize || "20") + "px " + (inputBoxFont || "Georgia"));
        this.lbEnt.set("label", "text", this.label);

        this.lbEnt.addComponent(Lemonade.Components.color);
        this.lbEnt.set("color","red", inputBoxColor || "#000000");

        this.lbEnt.addComponent(Lemonade.Components.position);
        this.lbEnt.set("position","width", this.label.length * (fontSize || 20));
        this.lbEnt.set("position","height", (fontSize || 20));
        this.lbEnt.set("position", "x", (posX || 0) - this.lbEnt.get("position", "width") * 0.6);
        this.lbEnt.set("position", "y", posY || 0);
    }

    this.e = new Lemonade.Entity();
    this.e.addComponent(Lemonade.Components.visible);
    this.e.addComponent(Lemonade.Components.collide);

    this.e.addComponent(Lemonade.Components.label);
    this.e.set("label", "style", (fontSize || "20") + "px " + (inputBoxFont || "Georgia"));

    this.e.addComponent(Lemonade.Components.color);
    this.e.set("color","red", inputBoxColor || "#000000");

    this.e.addComponent(Lemonade.Components.update);
    this.e.set("update","update", function(e, d){
        if(d.maskText === false)
            e.set("label","text", d.textValue);
        else if(e.get("label","text").length !== d.textValue.length)
        {
            var t="";
            for(var i=0;i<d.textValue.length;i++)
            {
                t+="O";
            }
            e.set("label","text", t);
        }
        if(Lemonade.mouse.leftPressed === true)
        {
            if(Lemonade.Event.eventExists(EVENT_COLLIDE + 'mouse', e.id, true, true) === true)
            {
                d.selected = true;
            }else
                d.selected = false;
        }

        if(d.selected === true)
        {
            e.set("color","red", "#53A85D");
            d.textValue += Lemonade.keyboard.typed;
            if(d.textValue.length > d.maxText)
                d.textValue = d.textValue.substr(0,d.maxText);

            if(Lemonade.Event.eventExists(EVENT_KEYDOWN + Lemonade.Keyboard.keyCode.backspace, true, false)){
                d.textValue = d.textValue.substr(0,d.textValue.length - 1);
                Lemonade.keyboard.resetKeys();
            }
        }else
            e.set("color","red", "#000000");

    });
    this.e.set("update","data", this);

    this.e.addComponent(Lemonade.Components.position);
    this.e.set("position", "x", posX || 0);
    this.e.set("position", "y", posY || 0);
    this.e.set("position","width", this.maxText * (fontSize || 20));
    this.e.set("position","height", (fontSize || 20));

    this.e.addComponent(Lemonade.Components.border);
    this.e.set("border", "color", "#000000");
    this.e.set("border", "offsetX", -2);
    this.e.set("border", "offsetY", -2);
    this.e.set("border", "width", this.e.get("position","width")+4);
    this.e.set("border", "height", this.e.get("position","height")+4);

    this.setPosition = function(x,y)
    {
        this.e.set("position", "x", x);
        this.e.set("position", "y", y);
        this.bkEnt.set("position", "x", x - this.mx);
        this.bkEnt.set("position", "y", y - this.my);
        if(this.label !== undefined){
            this.lbEnt.set("position", "x", x);
            this.lbEnt.set("position", "y", y);
        }
    };

    this.getEntity = function()
    {
        return this.e;
    };

    this.addEntity = function()
    {
        Lemonade.addEntity(this.bkEnt);
        Lemonade.addEntity(this.e);
        if(this.label !== undefined)
            Lemonade.addEntity(this.lbEnt);
    };

    this.getValue = function()
    {
        return this.textValue;
    };

    if(useBackGround === false)
    {
        this.e.addComponent(Lemonade.Components.border);
        this.e.set("border", "color", "#000000");
        this.e.set("border", "offsetX", -2);
        this.e.set("border", "offsetY", -2);
        this.e.set("border", "width", this.e.get("position","width")+4);
        this.e.set("border", "height", this.e.get("position","height")+4);


        this.bkEnt = new Lemonade.Entity();
        this.bkEnt.addComponent(Lemonade.Components.visible);
        this.bkEnt.addComponent(Lemonade.Components.rectangle);
        this.bkEnt.addComponent(Lemonade.Components.color);
        this.bkEnt.set("color","red", "#ffffff");
        this.bkEnt.addComponent(Lemonade.Components.position);
        this.bkEnt.set("position", "x", posX || 0);
        this.bkEnt.set("position", "y", posY || 0);
        this.bkEnt.set("position","width", this.name.length * (fontSize || 20));
        this.bkEnt.set("position","height", (fontSize || 20));
    }else{
        this.bkEnt = new Lemonade.Entity();
        this.bkEnt.addComponent(Lemonade.Components.visible);
        //this.bkEnt.addComponent(Lemonade.Components.rectangle);
        if(UI_UI_USEBACKGROUND){
            this.bkEnt.addComponent(Lemonade.Components.image);
            this.bkEnt.set("image","image", Lemonade.Repository.addImage(UI_DEFAULT_BACK_IMAGE, UI_DEFAULT_BACK_IMAGE, 32, 32));
        }
        this.bkEnt.addComponent(Lemonade.Components.position);
        this.bkEnt.set("position", "x", posX -this.mx || 0);
        this.bkEnt.set("position", "y", posY -this.my || 0);
        this.bkEnt.set("position","width", this.mx*2 + this.maxText * (fontSize || 20));
        this.bkEnt.set("position","height", 2*this.my + (fontSize || 20));
    }

    return this;
}


function Button(name, func, posX, posY, fontSize, font, color, useBackGround)
{
    this.name = name || "BUTTON";
    this.func = func || function(){};
    this.font = font || "Courier New";
    this.fontSize = fontSize || 20;
    this.color = color || "#000000";
    if(useBackGround === undefined)
        useBackGround = true;

    this.mx = 0;
    this.my = 0;
    if(useBackGround === true){
        this.mx = 16;
        this.my = 10;
    }

    this.e = new Lemonade.Entity();
    this.e.addComponent(Lemonade.Components.visible);
    this.e.addComponent(Lemonade.Components.collide);
    this.e.addComponent(Lemonade.Components.keeporder);

    this.e.addComponent(Lemonade.Components.label);
    this.e.set("label", "style", (fontSize || "20") + "px " + (font || "Courier New"));
    this.e.set("label", "text", name);

    this.e.addComponent(Lemonade.Components.color);
    this.e.set("color","red", color || "#000000");

    this.e.addComponent(Lemonade.Components.update);
    this.e.set("update","update", function(e, d){
        if(Lemonade.mouse.leftPressed === true)
        {
            if(Lemonade.Event.eventExists(EVENT_COLLIDE + 'mouse', e.id, true, true) === true)
            {
                d.func();
                Lemonade.mouse.leftPressed = false;
            }
        }
    });
    this.e.set("update","data", this);

    this.e.addComponent(Lemonade.Components.position);
    this.e.set("position", "x", posX || 0);
    this.e.set("position", "y", posY || 0);
    this.e.set("position","width", this.name.length * 0.6 * (this.fontSize));
    this.e.set("position","height", (fontSize || 20));

    if(useBackGround === false)
    {
        this.e.addComponent(Lemonade.Components.border);
        this.e.set("border", "color", "#000000");
        this.e.set("border", "offsetX", -2);
        this.e.set("border", "offsetY", -2);
        this.e.set("border", "width", this.e.get("position","width")+4);
        this.e.set("border", "height", this.e.get("position","height")+4);


        this.bkEnt = new Lemonade.Entity();
        this.bkEnt.addComponent(Lemonade.Components.visible);
        this.bkEnt.addComponent(Lemonade.Components.rectangle);
        this.bkEnt.addComponent(Lemonade.Components.keeporder);
        this.bkEnt.addComponent(Lemonade.Components.color);
        this.bkEnt.set("color","red", "#ffffff");
        this.bkEnt.addComponent(Lemonade.Components.position);
        this.bkEnt.set("position", "x", posX || 0);
        this.bkEnt.set("position", "y", posY || 0);
        this.bkEnt.set("position","width", this.name.length * (fontSize || 20)*.6);
        this.bkEnt.set("position","height", (fontSize || 20));
    }else{
        this.bkEnt = new Lemonade.Entity();
        this.bkEnt.addComponent(Lemonade.Components.visible);
        //this.bkEnt.addComponent(Lemonade.Components.rectangle);
        if(UI_UI_USEBACKGROUND){
            this.bkEnt.addComponent(Lemonade.Components.image);
            this.bkEnt.set("image","image", Lemonade.Repository.addImage(UI_DEFAULT_BACK_IMAGE, UI_DEFAULT_BACK_IMAGE, 32, 32));
        }
        this.bkEnt.addComponent(Lemonade.Components.position);
        this.bkEnt.set("position", "x", posX -this.mx || 0);
        this.bkEnt.set("position", "y", posY -this.my || 0);
        this.bkEnt.set("position","width", this.mx*2 + this.name.length * (fontSize || 20)*.6);
        this.bkEnt.set("position","height", 2*this.my + (fontSize || 20));
    }

    this.addEntity = function(){
        Lemonade.addEntity(this.bkEnt);
        Lemonade.addEntity(this.e);
    };
    this.removeEntity = function(){
        Lemonade.removeEntity(this.bkEnt.id);
        Lemonade.removeEntity(this.e.id);
    };
    this.bringEntitiesUp = function(){
        Lemonade.bringEntityToFront(this.bkEnt.id);
        Lemonade.bringEntityToFront(this.e.id);
    }
    this.setPosition = function(x, y){
        this.e.set("position", "x", x);
        this.e.set("position", "y", y);
        this.bkEnt.set("position", "x", x - this.mx);
        this.bkEnt.set("position", "y", y - this.my);
    };

    this.getX = function(){
        return this.e.get("position", "x");
    };
    this.getY = function(){
        return this.e.get("position", "y");
    };

    return this;
}
function ImageButton(func, posX, posY, imageName, w, h)
{
    this.name = "BUTTON";
    this.func = func || function(){};

    this.e = new Lemonade.Entity();
    this.e.addComponent(Lemonade.Components.visible);
    this.e.addComponent(Lemonade.Components.collide);
    this.e.addComponent(Lemonade.Components.keeporder);

    this.e.addComponent(Lemonade.Components.update);
    this.e.set("update","update", function(e, d){
        if(Lemonade.mouse.leftPressed === true)
        {
            if(Lemonade.Event.eventExists(EVENT_COLLIDE + 'mouse', e.id, true, true) === true)
            {
                d.func();
                Lemonade.mouse.leftPressed = false;
            }
        }
    });
    this.e.set("update","data", this);

    this.e.addComponent(Lemonade.Components.position);
    this.e.set("position", "x", posX || 0);
    this.e.set("position", "y", posY || 0);
    this.e.set("position","width", w || (this.name.length * 0.6 * (this.fontSize)));
    this.e.set("position","height", h || (20));

    this.e.addComponent(Lemonade.Components.image);
    this.e.set("image","image", Lemonade.Repository.addImage(imageName, imageName, 32, 32));

    this.addEntity = function(){
        Lemonade.addEntity(this.e);
    };
    this.removeEntity = function(){
        Lemonade.removeEntity(this.e.id);
    };
    this.bringEntitiesUp = function(){
        Lemonade.bringEntityToFront(this.e.id);
    }
    this.setPosition = function(x, y){
        this.e.set("position", "x", x);
        this.e.set("position", "y", y);
    };
    this.setSize = function(w, h){
        this.e.set("position","width", w);
        this.e.set("position","height", h);
    }

    this.getX = function(){
        return this.e.get("position", "x");
    };
    this.getY = function(){
        return this.e.get("position", "y");
    };

    return this;
}

function LoadingText(options, loadingType, time, finish){
    if(options.length <= 0)
        return undefined;
        
    this.options = options || [];
    this.loadingType = loadingType || UI_LOAD_DEFAULT;
    this.time = time || 60; // This is the amount of frames.
    this.curLoad = 0;
    this.curOption = 0;
    this.curTime = 0;
    this.enabled = false;
    
    this.finish = finish || "Done";
    
    this.e = new Lemonade.Entity();
    
    this.e.addComponent(Lemonade.Components.visible);
    
    this.e.addComponent(Lemonade.Components.label);
    this.e.set("label", "style", ("20") + "px " + ("Courier New"));
    this.e.set("label", "text", options[0]);
    
    this.e.addComponent(Lemonade.Components.position);
    this.e.set("position", "x", Lemonade.Canvas.canvasWidth/2 - options[0].length / 2 * 0.6);
    this.e.set("position", "y", Lemonade.Canvas.canvasHeight/2 - 10);
    
    this.e.addComponent(Lemonade.Components.update);
    this.e.set("update", "update", function(e, d){
        if(d.enabled === false)
            e.set("label", "text", d.finish);
        if(d.curOption > d.options.length || d.curLoad > d.loadingType.length || d.enabled === false)
            return;
        e.set("label", "text", d.options[d.curOption]+d.loadingType[d.curLoad]);
        
        d.curTime ++;
        if(d.curTime >= d.time)
        {
            d.curLoad++;
            
            if(d.curLoad >= d.loadingType.length)
                d.curLoad = 0;
            if(d.curOption >= d.options.length)
                d.curOption = 0;
            
            d.curTime = 0;
        }
       
    });
    this.e.set("update", "data", this);
    
    this.addEntity = function(){
      Lemonade.addEntity(this.e);
      this.enabled = true;
    };
    
    return this;
}