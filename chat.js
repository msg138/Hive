
var CHATTEXT = [];

var CHATLINES = 24;

function addChat(text){
    if(temp.chatBox !== undefined)
    {
        temp.chatBox.addText(text);
    }else
        CHATTEXT.push(text);
}

function ChatBox(hidden)
{
    this.text = CHATTEXT;
    this.hiddenText = this.text;
    this.scroll = 0;

    this.e = Lemonade.addEntity(new Lemonade.Entity());
    this.e.addComponent(Lemonade.Components.visible);
    this.e.addComponent(Lemonade.Components.position);
    this.e.set("position", "x", 1080 - 300);
    this.e.set("position", "width", 300);
    this.e.set("position", "height", CHATLINES*16);
    this.e.addComponent(Lemonade.Components.label);
    this.e.set("label", "style", "16px Courier New");
    this.e.set("label", "fontWidth", 16*0.6);
    this.e.set("label", "fontHeight", 16);
    this.e.set("label", "wrap", true);
    this.e.addComponent(Lemonade.Components.rectangle);
    this.e.set("rectangle", "fill", false);
    this.e.addComponent(Lemonade.Components.update);
    this.e.set("update", "update", function(e, d){
        var t = "";
        for(var i=0;i<d.text.length;i++)
        {
            t = t + "" + d.text[i];
        }
        e.set("label", "text", t);
    });
    this.e.set("update", "data", this);

    this.chatInput = new TextInput("#000000", 20, false, "", 16, "Courier New", 1080-300, CHATLINES*16);
    this.chatInput.addEntity();

    this.chatButton = Lemonade.addEntity(new Lemonade.Entity());
    this.chatButton.addComponent(Lemonade.Components.visible);
    this.chatButton.addComponent(Lemonade.Components.collide);
    this.chatButton.addComponent(Lemonade.Components.image);
    this.chatButton.set("image", "image", Lemonade.Repository.getImage("BUTTONS1IMAGE"));
    this.chatButton.addComponent(Lemonade.Components.position);
    this.chatButton.set("position", "x", 1080-332);
    this.chatButton.set("position", "y", CHATLINES*16-5);
    this.chatButton.set("position", "width", 32);
    this.chatButton.set("position", "height", 32);
    this.chatButton.addComponent(Lemonade.Components.update);
    this.chatButton.set("update", "update", function(e,d){
        if(Lemonade.Event.eventExists(EVENT_COLLIDE + 'mouse', e.id, true, true) === true && Lemonade.mouse.leftPressed === true)
        {
            Lemonade.mouse.leftPressed = false;
            if(d.visible === false){
                d.show(100);
            }else{
                d.hide(100);
            }
            d.visible = !d.visible;
        }

        if(d.hiddenText != d.text.toString() && d.visible === false)
        {
            e.set("image", "sprite", 1);
        }else
            e.set("image", "sprite", 0);
    });
    this.chatButton.set("update", "data", this);

    this.submitChat = new Button("Send", function(){
        socket.send("CHAT "+temp.chatBox.chatInput.textValue);
        temp.chatBox.chatInput.textValue = "";
    }, 1080 - 5*16*0.6, CHATLINES*16, 20, "Courier New", "#000000", false);
    this.submitChat.addEntity();

    this.visible = true;

    this.show = function(ticks){
        Lemonade.tweenList.addTween("SHOWCHAT", this, ticks || 100, function(o,t){
            o.e.set("position", "x", 1080 - t/this.ticks*300);
            o.chatInput.setPosition(1080 - t/this.ticks*300, CHATLINES*16);
            o.submitChat.setPosition(1080 - t/this.ticks*5*16*0.6, CHATLINES*16);
            o.chatButton.set("position", "x", 1080 - 32 - t/this.ticks*300);
        }, function(o){ 
            o.e.set("position", "x", 1080-300);
            o.chatInput.setPosition(1080 -300, CHATLINES*16);
            o.submitChat.setPosition(1080 - 5*16*0.6, CHATLINES*16);
            o.chatButton.set("position", "x", 1080 - 332);
        });
    };
    this.hide = function(ticks){
        this.hiddenText = this.text.toString();
        Lemonade.tweenList.addTween("HIDECHAT", this, ticks || 100, function(o,t){
            o.e.set("position", "x", 1080 - (300-t/this.ticks*300));
            o.chatInput.setPosition(1080 - (300-t/this.ticks*300), CHATLINES*16);
            o.submitChat.setPosition(1080 - (5*16*0.6 - t/this.ticks*5*16*0.6), CHATLINES*16);
            o.chatButton.set("position", "x", 1080 - 32 - (300-t/this.ticks*300));
        }, function(o){
            o.e.set("position", "x", 1080); 
            o.chatInput.setPosition(1100, CHATLINES*16);
            o.submitChat.setPosition(1100, CHATLINES*16); 
            o.chatButton.set("position", "x", 1080-32);
            o.visible = false;
        });
    };
    this.addText = function(text){
        /*for(var i=text.length%31;i<31;i++) // OLD Method for adding blank space to end of line.
            text += " ";*/
        if(text.length%31 > 0)
            text += "|";
        while(this.text.length >= CHATLINES){
            this.text.splice(0, 1);
        }
        this.text.push(text);
        CHATTEXT = this.text;
    };
    
    if(this.text.length <= 0)
        this.addText("Welcome to the chat.");
    
    return this;
}