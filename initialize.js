Lemonade.include("map.js");
Lemonade.include("living.js");

Lemonade.include("discipline.js");

var GLOBAL_BODYHEAD = 0;
var GLOBAL_BODYARML = 1;
var GLOBAL_BODYARMR = 2;
var GLOBAL_BODYLOWER = 3;
var GLOBAL_BODYLEGL = 4;
var GLOBAL_BODYLEGR = 5;
var GLOBAL_BODYTORSO = 6;

function loadGameComponents() {


    Lemonade.Component.addComponent("name", {
        name: "NIL NAME"
    }, Lemonade.doNothing, SYSTEM_NEVER);

    Lemonade.Component.addComponent("marker", {
        tileX: 0,
        tileY: 0,
        x: 0,
        y: 0,
        cardCast: undefined
    }, Lemonade.doNothing, SYSTEM_NEVER);

    Lemonade.Component.addComponent("caster", {
        deck: [],
        cardToCast: undefined, // The card that this caster will cast at the next turn.
    }, Lemonade.doNothing, SYSTEM_NEVER);

    Lemonade.Component.addComponent("gamescalable", {}, Lemonade.doNothing, SYSTEM_NEVER);
    Lemonade.Component.addComponent("resource", {
        currentValue: 0,
        maxValue: 0,
        regenerationSpeed: 0,
        regenerate: false,
    }, function (e) {
        if (e.get("resource", "regenerate") === true) {
            FortUtils.regenerateResource(e);
            e.set("resource", "regenerate", false);
        }
    }, SYSTEM_LOGIC);
    Lemonade.Component.addComponent("living", { // Not everything is living. This just makes it simpler.
        name: "NIL",
        // Stats
        health: 0,
        maxHealth: 0,

        gravityAffected: true,

        team: 0,

        speed: 0,
        moveRange: 0,

        sightRange: 10,

        buffs: [],

        canBeHealed: true,
        canBeDamaged: true,
        canDie: true,
        canResurrect: true,
        dead: false,
        // Map Positioning
        tileX: 0,
        tileY: 0,

        // Details about living things
        discipline: DISCIPLINE.DISCIPLINE_UNKNOWN,
    }, function (e) {
        // Update if the player can see this entity.j
        if (true) {

            if (FortUtils.isDead(e) === true || (temp.selected === undefined || MapUtils.canSee(temp.selected, temp.map, FortUtils.getTileX(e), FortUtils.getTileY(e)) === false) &&
                FortUtils.getTeam(e) !== temp.player) {
                e.set("tooltip", "visible", false);
                e.set("visible", "isVisible", false);
                // SEt the statbars as well.
                e.set("statbar", "visible", false);
                e.set("statbar2", "visible", false);
            } else if((CardSelect.initialized === true && CardSelect.readOnlyPanelOpen === false) ||
                    CardSelect.initialized === false) {
                e.set("tooltip", "visible", true);
                e.set("visible", "isVisible", true);
                // SEt the statbars as well.
                e.set("statbar", "visible", true);
                e.set("statbar2", "visible", true);
            }
        }

        if (e.hasComponent(Lemonade.Components.statbar))
            e.set("statbar", "val", e.get("living", "health"));
        if (e.hasComponent(Lemonade.Components.statbar2) && e.hasComponent(Lemonade.Components.resource))
            e.set("statbar2", "val", FortUtils.getResource(e));

        if (e.get("living", "health") <= 0 && e.get("living", "canDie") === true) {
            FortUtils.kill(e);
        }

        if (FortUtils.isDead(e) === false) {
            if (e.hasComponent(Lemonade.Components.position) === true && GameTimer.paused === false) {
                e.set("position", "x", FortUtils.getTileX(e) * GLB_TILE_SIZE);
                e.set("position", "y", FortUtils.getTileY(e) * GLB_TILE_SIZE);
            }
        }
    }, SYSTEM_LOGIC);

    Lemonade.Component.addComponent("selectable", {
        selected: false,
        oldColor: undefined
    }, function (e) {
        if (e === undefined)
            return;
        if((CardSelect.initialized === true && CardSelect.readOnlyPanelOpen === true) ||
            GameGui.readOnlyCardPanel === true)
            return;
        if (FortUtils.isDead(e) === true)
            return;
        if (e.get("selectable", "oldColor") === undefined) {
            if (e.hasComponent(Lemonade.Component.statbar) === true)
                e.set("selectable", "oldColor", e.get("statbar", "color"));
        }

        if (Lemonade.mouse.leftPressed === true && (FortUtils.getTeam(e) === temp.player || FortUtils.getTeam(e) === -1)) {
            if (Lemonade.Event.eventExists(EVENT_COLLIDE + 'mouse', e.id, true, true) === true) {
                var x = Lemonade.mouse.x;
                var y = Lemonade.mouse.y;
                e.set("selectable", "selected", true);
                if (e.get("selectable", "oldColor") === undefined)
                    e.set("selectable", "oldColor", e.get("statbar", "color"));
                e.set("statbar", "color", "#ff00ff");


                // deselect other units.
                if (temp.selected !== undefined && temp.selected !== e) {
                    temp.selected.set("selectable", "selected", false);
                    if (temp.selected.get("selectable", "oldColor") === undefined)
                        temp.selected.set("selectable", "oldColor", temp.selected.get("statbar", "color"));
                    temp.selected.set("statbar", "color", temp.selected.get("selectable", "oldColor"));
                }
                temp.selected = e;
            } else {
                e.set("selectable", "selected", false);
                if (e.get("selectable", "oldColor") === undefined)
                    e.set("selectable", "oldColor", e.get("statbar", "color"));
                e.set("statbar", "color", e.get("selectable", "oldColor"));
            }
        }

        if (temp.selected === e) {
            e.set("statbar", "color", "#ff00ff");
        }

        // Apply noticeable changes to a selected unit.
    }, SYSTEM_RENDER);
    // Most relevant to MAP.js
    Lemonade.Component.addComponent("tilemap", {
        tiles: [
            [],
            []
        ],
        unwalkable: [],
        updateCover: true,
        width: 0,
        height: 0,
        updateMap: true,
        spriteSheetName: "NULL",
        spawnPositions: [],
        mapimage: undefined,
        mapcover: undefined
    }, function (entity) {
        if (entity === undefined)
            return;
        if (entity.get("visible", "isVisible") === false || entity.hasComponent(Lemonade.Components.image) === false)
            return;
        if (entity.get("tilemap", "updateMap") === true && Lemonade.loadingScreen === undefined) {
            MapUtils.updateMap(entity);
            MapUtils.updateMapCover(entity);
            return;
        }
        entity.get("tilemap", "mapcover").draw(0 + Lemonade.Camera.getX(), 0 + Lemonade.Camera.getY(), entity.get("tilemap", "width") * GLB_TILE_SIZE,
            entity.get("tilemap", "height") * GLB_TILE_SIZE, 0, Lemonade.Canvas.context, 0);
        if (entity.get("tilemap", "updateCover") === true) {
            MapUtils.updateMapCover(entity);
            entity.get("tilemap", "mapcover").draw(0 + Lemonade.Camera.getX(), 0 + Lemonade.Camera.getY(), entity.get("tilemap", "width") * GLB_TILE_SIZE,
                entity.get("tilemap", "height") * GLB_TILE_SIZE, 0, Lemonade.Canvas.context, 0);
        }
    }, SYSTEM_RENDER);

    Lemonade.Component.addComponent("statbar", {
        val: 0,
        maxVal: 0,
        color: '#ffffff',
        outlineColor: '#000000',
        outline: true,
        outlineWidth: 2,
        visible: true,
        offsetX: 0,
        offsetY: -5,
        width: 100,
        height: 5
    }, function (entity) {
        if (entity.get("statbar", "visible") === false)
            return;

        Lemonade.Canvas.context.save();
        var pos = Lemonade.getEntityPosition(entity);
        pos.x += entity.get("statbar", "offsetX");
        pos.y += entity.get("statbar", "offsetY");
        pos.w = entity.get("statbar", "val") / entity.get("statbar", "maxVal") * entity.get("statbar", "width");
        pos.h = entity.get("statbar", "height");

        if (entity.get("statbar", "outline") === true) {
            Lemonade.Canvas.context.fillStyle = entity.get("statbar", "outlineColor");
            Lemonade.Canvas.context.fillRect(pos.x - entity.get("statbar", "outlineWidth"), pos.y - entity.get("statbar", "outlineWidth"), entity.get("statbar", "width") + 2 * entity.get("statbar", "outlineWidth"), pos.h + 2 * entity.get("statbar", "outlineWidth"));
        }

        Lemonade.Canvas.context.fillStyle = entity.get("statbar", "color");
        Lemonade.Canvas.context.fillRect(pos.x, pos.y, pos.w, pos.h);

        Lemonade.Canvas.context.restore();
    }, SYSTEM_RENDER);
    Lemonade.Component.addComponent("statbar2", {
        val: 0,
        maxVal: 0,
        color: '#ffffff',
        outlineColor: '#000000',
        outline: true,
        outlineWidth: 2,
        visible: true,
        offsetX: 0,
        offsetY: -5,
        width: 100,
        height: 5
    }, function (entity) {
        if (entity.get("statbar2", "visible") === false)
            return;

        Lemonade.Canvas.context.save();
        var pos = Lemonade.getEntityPosition(entity);
        pos.x += entity.get("statbar2", "offsetX");
        pos.y += entity.get("statbar2", "offsetY");
        pos.w = entity.get("statbar2", "val") / entity.get("statbar2", "maxVal") * entity.get("statbar2", "width");
        pos.h = entity.get("statbar2", "height");

        if (entity.get("statbar2", "outline") === true) {
            Lemonade.Canvas.context.fillStyle = entity.get("statbar2", "outlineColor");
            Lemonade.Canvas.context.fillRect(pos.x - entity.get("statbar2", "outlineWidth"), pos.y - entity.get("statbar2", "outlineWidth"), entity.get("statbar2", "width") + 2 * entity.get("statbar2", "outlineWidth"), pos.h + 2 * entity.get("statbar2", "outlineWidth"));
        }

        Lemonade.Canvas.context.fillStyle = entity.get("statbar2", "color");
        Lemonade.Canvas.context.fillRect(pos.x, pos.y, pos.w, pos.h);

        Lemonade.Canvas.context.restore();
    }, SYSTEM_RENDER);

    Lemonade.Component.addComponent("body", {
            torsoImage: undefined,
            lowerImage: undefined,
            legImage: undefined,
            armImage: undefined,
            headImage: undefined,
            anchor: [{
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 0
            }],
            rotation: [0, 0, 0, 0, 0, 0, 0],
            drawFromTop: true
        },
        function (entity) {
            if (entity.get("body", "torsoImage") === undefined || entity.get("body", "lowerImage") === undefined || entity.get("body", "legImage") === undefined ||
                entity.get("body", "armImage") === undefined || entity.get("body", "headImage") === undefined)
                return;
            if (entity.hasComponent("visible") && entity.get("visible", "isVisible") === false)
                return;

            Lemonade.Canvas.context.save();

            var pos = Lemonade.getEntityPosition(entity);
            if (entity.get("body", "drawFromTop") === true) {
                entity.get("body", "armImage").draw(pos.x - entity.get("body", "anchor")[GLOBAL_BODYARML].x, pos.y - entity.get("body", "anchor")[GLOBAL_BODYARML].y, undefined, undefined, undefined, Lemonade.Canvas.context, entity.get("body", "rotation")[GLOBAL_BODYARML]);
                entity.get("body", "armImage").draw(pos.x - entity.get("body", "anchor")[GLOBAL_BODYARMR].x, pos.y - entity.get("body", "anchor")[GLOBAL_BODYARMR].y, undefined, undefined, undefined, Lemonade.Canvas.context, entity.get("body", "rotation")[GLOBAL_BODYARMR]);

                entity.get("body", "legImage").draw(pos.x - entity.get("body", "anchor")[GLOBAL_BODYLEGL].x, pos.y - entity.get("body", "anchor")[GLOBAL_BODYLEGL].y, undefined, undefined, undefined, Lemonade.Canvas.context, entity.get("body", "rotation")[GLOBAL_BODYLEGL]);
                entity.get("body", "legImage").draw(pos.x - entity.get("body", "anchor")[GLOBAL_BODYLEGR].x, pos.y - entity.get("body", "anchor")[GLOBAL_BODYLEGR].y, undefined, undefined, undefined, Lemonade.Canvas.context, entity.get("body", "rotation")[GLOBAL_BODYLEGR]);
                entity.get("body", "lowerImage").draw(pos.x - entity.get("body", "anchor")[GLOBAL_BODYLOWER].x, pos.y - entity.get("body", "anchor")[GLOBAL_BODYLOWER].y, undefined, undefined, undefined, Lemonade.Canvas.context, entity.get("body", "rotation")[GLOBAL_BODYLOWER]);
                entity.get("body", "torsoImage").draw(pos.x, pos.y, undefined, undefined, undefined, Lemonade.Canvas.context, entity.get("body", "rotation")[GLOBAL_BODYTORSO]);


                entity.get("body", "headImage").draw(pos.x - entity.get("body", "anchor")[GLOBAL_BODYHEAD].x, pos.y - entity.get("body", "anchor")[GLOBAL_BODYHEAD].y, undefined, undefined, undefined, Lemonade.Canvas.context, entity.get("body", "rotation")[GLOBAL_BODYHEAD]);
            }

            Lemonade.Canvas.context.restore();
        }, SYSTEM_RENDER);

    Lemonade.Component.addComponent("oposition", {
        x: 0,
        y: 0
    }, Lemonade.doNothing, SYSTEM_NEVER);
}

function loadAssets() {
    {
        var i = Lemonade.Repository.addImage("selection", "content/images/map/availableselection.png", 512, 32);
        i.setSpriteSheet(16, 32, 32);
        i.originX = GLB_TILE_SIZE / 2;
        i.originY = GLB_TILE_SIZE / 2;
    } {
        var i = Lemonade.Repository.addImage("selectioncard", "content/images/map/availableselection1.png", 512, 32);
        i.setSpriteSheet(16, 32, 32);
        i.originX = GLB_TILE_SIZE / 2;
        i.originY = GLB_TILE_SIZE / 2;
    }
    // GUI Stuff
    {
        var i = Lemonade.Repository.addImage("CURSORIMAGE", "content/images/gui/cursor.png", 96, 32);
        i.setSpriteSheet(3, 32, 32);
    } {
        var i = Lemonade.Repository.addImage("GUI_TIMER", "content/images/gui/timer.png", 352, 32);
        i.setSpriteSheet(11, 32, 32);
    } {
        var i = Lemonade.Repository.addImage("BUTTONS1IMAGE", "content/images/gui/buttons1.png", 384, 32);
        i.setSpriteSheet(12, 32, 32);
        i.originX = 16;
        i.originY = 16;
    }{
       
        var i = Lemonade.Repository.addImage("expandcpanel", "content/images/gui/expandcpanel.png", 32, 32);
        i.originX = 32;
        i.originY = 32;
    }{
        var i = Lemonade.Repository.addImage("expandcpanel2", "content/images/gui/expandcpanel2.png", 32, 32);
        i.originX = 32;
        i.originY = 32;
    } {
        var i = Lemonade.Repository.addImage("TITLESCREENIMAGE", "content/images/gui/title0.png", 1000, 600);
        i = Lemonade.Repository.addImage("TITLESCREENIMAGE_1", "content/images/gui/title0-1.png", 1000, 600);
    }
    // Title buttons and the such.
    {
        Lemonade.Repository.addImage("BUTTON_TUTORIAL", "content/images/gui/buttontutorial.png", 114, 14);
        Lemonade.Repository.addImage("BUTTON_QUICKPLAY", "content/images/gui/buttonquickplay.png", 144, 13);
        Lemonade.Repository.addImage("BUTTON_ABOUT", "content/images/gui/buttonabout.png", 137, 14);

        Lemonade.Repository.addImage("PROMPT_HEROSELECT", "content/images/gui/heroselectprompt.png", 640, 400);

        Lemonade.Repository.addImage("SCREEN_COVER", "content/images/gui/coverscreenmessage.png", 640, 400);

        Lemonade.Repository.addImage("GUI_TOPBAR", "content/images/gui/topbar.png", 640, 32);
        
    }
    // Characters
    {
        var i = Lemonade.Repository.addImage("KINGBOSH1", "content/images/characters/kingbosh.png", 200, 200);
        i.originY = 200;
    } {
        var i = Lemonade.Repository.addImage("GUIDECHARACTER", "content/images/characters/guide00.png", 200, 200);
        i.originY = 200;
    }
}