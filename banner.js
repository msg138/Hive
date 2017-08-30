
Banner = {};

Banner.currentDisplay = undefined;

Banner.queue = [];

Banner.defaultDisplayTime = 3000;

Banner.maxFontSize = 36;

Banner.BannerObject = function(msg, submsg, time, onGoAway){
    this.title = msg;
    this.subTitle = submsg;
    this.totalTime = time;
    this.startTime = Lemonade.Timer.getCurrentTime();
    this.onGoAway = onGoAway || function(){};

    this.fs = Banner.calculateLargestFontSize(this.title.length, Lemonade.Canvas.canvasWidth, Banner.maxFontSize);
    this.sfs = Banner.calculateLargestFontSize(this.subTitle.length, Lemonade.Canvas.canvasWidth, this.fs*.75);

    this.to = new Lemonade.Entity();
    this.to.addComponent(Lemonade.Components.visible);
    this.to.addComponent(Lemonade.Components.position);
    this.to.set("position", "width", this.fs * .6 * this.title.length);
    this.to.addComponent(Lemonade.Components.label);
    this.to.set("label", "text", this.title);
    this.to.set("label", "style", this.fs +"px Courier New");

    this.sto = new Lemonade.Entity();
    this.sto.addComponent(Lemonade.Components.visible);
    this.sto.addComponent(Lemonade.Components.position);
    this.sto.set("position", "width", this.sfs*.6*this.subTitle.length);
    this.sto.addComponent(Lemonade.Components.label);
    this.sto.set("label", "text", this.subTitle);
    this.sto.set("label", "style", this.sfs +"px Courier New");

    this.tio = new Lemonade.Entity();
    this.tio.addComponent(Lemonade.Components.visible);
    this.tio.addComponent(Lemonade.Components.position);
    var tttt = Lemonade.Canvas.canvasWidth;
    this.tio.set("position", "width", tttt);
    this.tio.set("position", "height", tttt/640 * 400);
    this.tio.addComponent(Lemonade.Components.image);
    this.tio.set("image", "image", Lemonade.Repository.getImage("SCREEN_COVER"));

    return this;
};

Banner.setPosition = function(bo, y){
    bo.to.set("position", "x", Lemonade.Canvas.canvasWidth/2 - bo.to.get("position", "width")/2);
    bo.to.set("position", "y", y);
    bo.sto.set("position", "x", Lemonade.Canvas.canvasWidth/2 - bo.sto.get("position", "width")/2);
    bo.sto.set("position", "y", y+15 + bo.fs);
    bo.tio.set("position", "x", 0);
    bo.tio.set("position", "y", y-200);
};

Banner.display = function(bo){
    // TODO animate the banner. .. :
    if(Banner.currentDisplay !== undefined){
        Banner.queue.push(bo);
        return;
    } 
    Banner.currentDisplay = bo;
    Banner.setPosition(bo, 200);
    Lemonade.addEntity(bo.tio);
    Lemonade.addEntity(bo.to);
    Lemonade.addEntity(bo.sto);
    Lemonade.disableComponent("tooltip");
    Lemonade.disableComponent("magnify");
    Lemonade.disableComponent("button");
    Lemonade.tweenList.addTweenTimer("BANNER", bo, bo.totalTime || Banner.defaultDisplayTime, function(){}, 
        function(){
            Lemonade.removeEntity(bo.to.id);
            Lemonade.removeEntity(bo.sto.id);
            Lemonade.removeEntity(bo.tio.id);
            bo.onGoAway();
            Banner.currentDisplay = undefined;
            Banner.displayNext();
            Lemonade.enableComponent("tooltip");
            Lemonade.enableComponent("button");
            Lemonade.enableComponent("magnify");
        });
};

Banner.displayNext = function(){
    if(Banner.queue.length > 0)
    {
        Banner.display(Banner.queue[0]);
        Banner.queue.splice(0, 1);
    }
};

Banner.calculateLargestFontSize = function(textLength, canvasSizeWidth, start){
    var fs = start || 120;
    while(.6 * fs * textLength > canvasSizeWidth)
        fs -= 1;
    if(fs <16)
        fs = 16;
    return fs;
};

Banner.reset = function(){
    Banner.queue.splice(0);
    Banner.currentDisplay = undefined;
};