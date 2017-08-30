
// A character that can be used to dialog with player.
function Character(name, image, lipPos, sizeMagnify){
    if(image === undefined)
        return undefined;
    this.name = name || "NULL_CHARACTER";
    this.image = image || undefined;
    this.lipPos = lipPos || {x: 0, y: 0};

    this.active = false;
    
    this.goAway = function(){};

    this.e = Lemonade.addEntity(new Lemonade.Entity());
    this.e.addComponent(Lemonade.Components.visible);
    this.e.addComponent(Lemonade.Components.position);
    this.e.set("position", "x", 1080 - this.image.width * sizeMagnify);
    this.e.set("position", "y", 720 - this.image.height* sizeMagnify);
    this.e.set("position", "width", this.image.width* sizeMagnify);
    this.e.set("position", "height", this.image.height* sizeMagnify);
    this.e.addComponent(Lemonade.Components.image);
    this.e.set("image", "image", this.image);
    this.e.addComponent(Lemonade.Components.update);
    this.e.set("update", "update", function(e,d){
        e.set("visible", "isVisible", d.active);
    });
    this.e.set("update", "data", this);
    
    this.b = Lemonade.addEntity(new Lemonade.Entity());
    this.b.addComponent(Lemonade.Components.visible);
    this.b.addComponent(Lemonade.Components.position);
    this.b.set("position", "x", 0);
    this.b.set("position", "y", 520);
    this.b.set("position", "width", Lemonade.Canvas.canvasWidth);
    this.b.set("position", "height", 200);
    this.b.addComponent(Lemonade.Components.rectangle);
    this.b.addComponent(Lemonade.Components.color);
    this.b.set("color", "red", "#ffffff");
    this.b.addComponent(Lemonade.Components.update);
    this.b.set("update", "update", function(e,d){
        e.set("visible", "isVisible", d.active);
    });
    this.b.set("update", "data", this);

    // Dialog Component.
    this.d = Lemonade.addEntity(new Lemonade.Entity());
    this.d.addComponent(Lemonade.Components.visible);
    this.d.addComponent(Lemonade.Components.position);
    this.d.set("position", "x", 0);
    this.d.set("position", "y", 520);
    this.d.set("position", "width", Lemonade.Canvas.canvasWidth-1);//1080 - this.image.width* sizeMagnify);
    this.d.set("position", "height", 200);
    this.d.addComponent(Lemonade.Components.color);
    this.d.set("color", "red", "#000000");
    this.d.addComponent(Lemonade.Components.label);
    this.d.set("label", "style", "40px Courier New");
    this.d.set("label", "fontHeight", 40);
    this.d.set("label", "fontWidth", 40*0.6);
    this.d.set("label", "text", this.name);
    this.d.set("label", "wrap", true);
    this.d.addComponent(Lemonade.Components.update);
    this.d.set("update", "update", function(e, d){
        e.set("visible", "isVisible", d.chatActive);

        if(Lemonade.mouse.leftPressed === true && d.chatActive === true)
        {
            if(d.tosay.length <= 0)
                d.disappear();
            else if(Lemonade.tweenList.tweenExists("TALK"+d.name) === false){
                d.speak(d.tosay);
                Lemonade.mouse.leftPressed = false;
            }else
            {
                Lemonade.tweenList.removeTween("TALK"+d.name, true);
                Lemonade.mouse.leftPressed = false;
            }
        }
    });
    this.d.set("update", "data", this);

    this.chatActive = false;

    this.bringToFront = function(){
        Lemonade.bringEntityToFront(this.e.id);
        Lemonade.bringEntityToFront(this.b.id);
        Lemonade.bringEntityToFront(this.d.id);
    };

    this.appear = function(ticks){
        //1998
        if(GameData.inGame())
            GameTimer.pause();
        
        ticks = ticks || 100;
        this.e.set("position", "x", 1080);
        this.active = true;
        this.chatActive = false;

        Lemonade.bringEntityToFront(this.e);
        Lemonade.bringEntityToFront(this.b);
        Lemonade.bringEntityToFront(this.d);

        Lemonade.tweenList.addTween("APPEAR"+this.name, this.e, ticks, function(o, t){
            o.set("position", "x", Lemonade.Canvas.canvasWidth - t/this.ticks*o.get("position","width"));
        }, function(o){ o.set("position", "x", Lemonade.Canvas.canvasWidth - o.get("position","width")); })
        Lemonade.tweenList.addTween("ACTIVECHAT"+this.name, this, ticks, function(o, t){
        }, function(o){ o.chatActive = true; o.speak(o.tosay); })
    };
    this.disappear = function(ticks){
        ticks = ticks || 100;
        this.active = true;
        this.chatActive = false;

        Lemonade.tweenList.addTween("DAPPEAR"+this.name, this.e, ticks, function(o, t){
            o.set("position", "x", Lemonade.Canvas.canvasWidth -o.get("position", "width") + t/this.ticks*o.get("position","width"));
        }, function(o){ o.set("position", "x", Lemonade.Canvas.canvasWidth); })
        Lemonade.tweenList.addTween("ACTIVECHAT"+this.name, this, ticks, function(o, t){
        }, function(o){ o.active = false; 
        //1998
        if(GameData.inGame())
            GameTimer.start();
         o.goAway();
    });
    };
    this.tosay = [];
    this.speak = function(text, options, ticks){
        if((Lemonade.tweenList.tweenExists("WAITFORAPPEARANCE"+this.name) === true && this.chatActive === false) ||
            Lemonade.tweenList.tweenExists("TALK"+this.name) === true ||
            Lemonade.tweenList.tweenExists("APPEAR"+this.name))
            return;

        ticks = ticks || 100;
        this.tosay = text;
        if(GameData.inGame())
            GameTimer.pause();
        if(this.active == false)
        {
            this.appear(ticks);
        }
        if(this.chatActive === false){
            Lemonade.tweenList.addTween("WAITFORAPPEARANCE"+this.name, this, ticks, function(o, t){}, function(o){ o.speak(o.tosay); });
        }else if(text !== undefined && text.length > 0){
            this.chatActive = true;
            this.bringToFront();
            Lemonade.tweenList.addTween("TALK"+this.name, {o: this, t: text, a: 0}, text[0].length * 5, function(o, t){
                if(GameData.inGame())
                    GameTimer.pause();
                if(o.t.length <= 0)
                    return;
                o.o.d.set("label", "text", o.o.name + "|" + o.t[0].substr(0,o.a));
                if(t%5 == 1)
                    o.a ++;
            }, function(o){ o.o.d.set("label", "text",o.o.name + "|" +  o.t[0]); o.t.splice(0,1); });
        }   
    };

    return this;
}

function KingBosh()
{
    var c = new Character("King Bosh", Lemonade.Repository.getImage("KINGBOSH1"), {x: 0, y: 0}, 3);
    c.d.set("position", "width", 1080 - c.e.get("position", "width") + 200);
    return c;
}