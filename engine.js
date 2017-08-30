/**
 * @version 8.13.2017
 */

// warning this replaces console.log. remember to comment out when running on desktop or 
//		when not alert on cnsole logging,
/*/console.log = function(){
	for(var ar in arguments)
		alert(arguments[ar]);
};//*/

var DEBUG_ALL = 100;
var DEBUG_ERROR = 30;
var DEBUG_NOTICE = 40;
var DEBUG_MIN = 10;
var DEBUG_NONE = 0;

var ERROR_FILENOTFOUND = 69;
var ERROR_CANVASERROR = 50;
var ERROR_IMAGELOAD = 15;
var ERROR_SOUNDLOAD = 111;
var ERROR_ASSETLOAD = 132;
var ERROR_GAMEPLAY = 12;
var ERROR_OPENGL = 27;

var ASSET_DEFAULT = 0;
var ASSET_FILE = 1; // More like a file name.
var ASSET_STRING = 2;
var ASSET_NUMBER = 3;
var ASSET_OBJECT = 4;
var ASSET_GENERAL = 5;
var ASSET_JSON_TEXT = 6;
var ASSET_JSON_OBJECT = 7;
var ASSET_JSON = 8;

var FLAG_WIDTH = "WIDTH";
var FLAG_HEIGHT = "HEIGHT";

var DO_NOT_LOAD = "DNL";

var EVENT_COLLIDE = "COLLIDE";
var EVENT_CLICK = "CLICK";
var EVENT_LEFTCLICK = "LEFTCLICK";
var EVENT_RIGHTCLICK = "RIGHTCLICK";
var EVENT_ALWAYS = "ALWAYS";
var EVENT_VALUE = "VALUE";
var EVENT_KEY = "KEY";
var EVENT_KEYDOWN = "KEYDOWN";
var EVENT_KEYPRESS = "KEYPRESS";
var EVENT_KEYUP = "KEYUP";
var EVENT_HOVER = "HOVER";
var EVENT_NOOTHER = "NOOTHER";

var GRAPHICS_CANVAS = "CANVAS";
var GRAPHICS_WEBGL = "WEBGL";
// Unused in the engine.
var GRAPHICS_DOM = "DOM";
// ~~

var SYSTEM_RENDER = "render";
var SYSTEM_LOGIC = "logic";
var SYSTEM_NEVER = "never";

var ANIMATION_TYPE_A = "A";
var ANIMATION_TYPE_B = "B";
var ANIMATION_TYPE_C = "C";
var ANIMATION_TYPE_BC = "BC";
var ANIMATION_TYPE_D = "D";

var DRAWSTYLE_WIREFRAME = "WIRE";
var DRAWSTYLE_SOLID1 = "SOLID1";
var DRAWSTYLE_SOLID2 = "SOLID2";
var DRAWSTYLE_SOLID3 = "SOLID3";

var BACKCULL_CW = "CW";
var BACKCULL_CCW = "CCW";

var SHAPE_LINE = "LINE";
var SHAPE_TRIANGLE = "TRIANGLE";

var GUI_BUTTON = "BUTTON";

var MOUSE_LEFT = 0;
var MOUSE_MIDDLE = 1;
var MOUSE_RIGHT = 2;

var Lemonade = {};

// Global component variables.
Lemonade.CompVar = {};
Lemonade.CompVar.MAGNIFY_ACTIVE = undefined;

Lemonade.loadedAssets = 0;
Lemonade.loadedImages = 0;
Lemonade.loadedSounds = 0;

Lemonade.loadingScreen = undefined;

Lemonade.loadScreen = function (render, update, assetsNeeded, imagesNeeded, soundsNeeded) {
    // proof checking that the variables supplied are objects or arrays
    if (typeof assetsNeeded != "object")
        assetsNeeded = [];
    if (typeof imagesNeeded != "object")
        imagesNeeded = [];
    if (typeof soundsNeeded != "object")
        soundsNeeded = [];

    this.render = render;
    this.update = update;
    this.assetsNeeded = assetsNeeded; // Array of extra assets needed, like file datas and the such.
    this.imagesNeeded = imagesNeeded; // Array of Images that are needed.
    this.soundsNeeded = soundsNeeded; // Array of Sounds that are needed.

    return this;
};

Lemonade.load = function (ls) {
    Lemonade.loadedAssets = 0;
    Lemonade.loadedImages = 0;
    Lemonade.loadedSounds = 0;
    Lemonade.loadingScreen = ls;
};

Lemonade.funcOverload = function(func, params){
    if(params === undefined)
        return func();
    if(params.length<1){
        return func();
    }else if(params.length<2){
        return func(params[0]);
    }else if(params.length<3){
        return func(params[0], params[1]);
    }else if(params.length<4){
        return func(params[0], params[1], params[2]);
    }
    return func();
}

Lemonade.FPS = {
    startTime: 0,
    frameNumber: 0,
    fp: 0,
    capFPS: true,
    maxFPS: 60,
    isDelaying: false,
    updateFPS: function () {
        this.frameNumber++;
        var d = new Date().getTime(),
            currentTime = (d - this.startTime) / 1000,
            result = Math.floor((this.frameNumber / currentTime));
        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        this.fp = result;
    },
    getFPS: function () {
        return this.fp;
    }
};
Lemonade.Timer = {
    curTime: 0,
    timeInc: 5,

    getCurrentTime: function () {
        return this.curTime;
    },

    incTime: function () {
        this.curTime++;
    },
    setTimeIncrement: function (ti) {
        this.timeInc = ti;
        this.curTime = 0;
    },
    resetTime: function () {
        this.curTime = 0;
    }
};

Lemonade.include = function (filename, name) {
    name = name || filename;
    if (document.getElementById("include" + name) === null) {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
        fileref.setAttribute("id", "include" + name);
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref);
    }
};
Lemonade.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

Lemonade.rgbToHex = function (r, g, b) {
    return "#" + Lemonade.componentToHex(r) + Lemonade.componentToHex(g) + Lemonade.componentToHex(b);
};

Lemonade.arrayContains = function (a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
};
Lemonade.arrayIndex = function (a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return i;
        }
    }
    return -1;
};

Lemonade.clone = function (src) {
    function mixin(dest, source, copyFunc) {
        var name, s, i, empty = {};
        for (name in source) {
            s = source[name];
            if (!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))) {
                dest[name] = copyFunc ? copyFunc(s) : s;
            }
        }
        return dest;
    }

    if (!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]") {
        return src;
    }
    if (src.nodeType && "cloneNode" in src) {
        return src.cloneNode(true);
    }
    if (src instanceof Date) {
        return new Date(src.getTime());
    }
    if (src instanceof RegExp) {
        return new RegExp(src);
    }
    var r, i, l;
    if (src instanceof Array) {
        r = [];
        for (i = 0, l = src.length; i < l; ++i) {
            if (i in src) {
                r.push(Lemonade.clone(src[i]));
            }
        }
    } else {
        r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src, Lemonade.clone);

};
Lemonade.include("quadtree.js", "quadtree");

Lemonade.readTextFile = function (file, callback) {
    var allText;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, callback !== undefined);
    rawFile.overrideMimeType("text/plain; charset=x-user-defined");
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                allText = rawFile.responseText;
                if(callback !== undefined)
                    callback(allText);
            }
        }
    };
    rawFile.send(null);
    return allText;
};
Lemonade.getTextFromFile = function(file, callback){
    return Lemonade.readTextFile(file, callback);
}

Lemonade.getDistance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

Lemonade.version = 1.001;

Lemonade.running = true;
Lemonade.autoClear = true;

Lemonade.showCollisionRects = false;
Lemonade.countTouchAsMouse = true;
Lemonade.multiTouch = false;

Lemonade.Collision = {};
Lemonade.Collision.initialize = function () {
    Lemonade.Collision.QuadTree = new QuadTree({
        x: 0,
        y: 0,
        width: Lemonade.Canvas.canvasWidth,
        height: Lemonade.Canvas.canvasHeight
    });
};

Lemonade.Point = function (x, y, z) {
    return {
        x: x || 0,
        y: y || 0,
        z: z || 0
    };
};

Lemonade.initialize = function (w, h, id, autorun, webglEnabled, debugMode) {
    if (webglEnabled === false)
        Lemonade.Canvas.initialize2D(w, h, id);
    else
        Lemonade.Canvas.initialize3D(w, h, id);
    Lemonade.Collision.initialize();
    Lemonade.Debug.setDebugMode(debugMode);
    Lemonade.setListeners();

    Lemonade.loadComponents();

    if (autorun)
        Lemonade.run();
};

var gl; // Used as global object to call opengl related functions.

var ttn = function (num, woh) {
    return Lemonade.Graphics.threed.translateToNormal(num, woh);
};

Lemonade.Graphics = {
    graphicsType: GRAPHICS_CANVAS,

    threed: {
        enabled: false, // Disable 3d by default

        translateFromNormal: function (num, widthOrHeight) // Want to know what we are getting relative to.
        {
            var res = num + 1; // Make the number easier to manage.
            res = res / 2; //TODO change to divide by max height and width ratio.
            if (widthOrHeight === FLAG_WIDTH)
                res = res * Lemonade.Canvas.canvasWidth;
            else
                res = res * Lemonade.Canvas.canvasHeight;
            return res;
        },
        translateToNormal: function (num, widthOrHeight) {
            var res = num;
            if (widthOrHeight === FLAG_WIDTH)
                res = res / Lemonade.Canvas.canvasWidth;
            else
                res = res / Lemonade.Canvas.canvasHeight;
            res = res * 2;
            res -= 1;
            return res;
        },

        buffer: {
            // This assumes that the array is of vertices with 3 coordinates
            get: function (arrayVert, arrayFace) {
                return {
                    v: this.getVertexBuffer(arrayVert),
                    f: this.getFaceBuffer(arrayFace)
                };
            },
            getFaceBuffer: function (arrayFace) {
                var buf = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrayFace), gl.STATIC_DRAW);

                // Not necessary, but becomes useful later on
                buf.itemSize = 1;
                buf.numItems = Math.floor(arrayFace.length / 1);
                return buf;
            },
            getVertexBuffer: function (arrayVert) {
                var buf = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buf);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayVert), gl.STATIC_DRAW);

                // Not necessary, but becomes useful later on
                buf.itemSize = 3;
                buf.numItems = Math.floor(arrayVert.length / 3);
                return buf;
            },
        },

        shader: {
            test_vertex_source: "attribute vec2 position; attribute vec3 color; varying vec3 vColor; void main(void) { gl_Position = vec4(position, 0., 1.); vColor=color; }",
            test_fragment_source: "precision mediump float;varying vec3 vColor;void main(void) {gl_FragColor = vec4(vColor, 1.);}",

            shader_vertex: undefined,
            shader_fragment: undefined,

            shader_program: undefined,

            _color: undefined,
            _position: undefined,
            _uv: undefined,

            test_vertex_source_uv: "attribute vec3 position; uniform mat4 Pmatrix; uniform mat4 Vmatrix; uniform mat4 Mmatrix; attribute vec2 uv; varying vec2 vUV; void main(void) { gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);vUV=uv;}",
            test_fragment_source_uv: "precision mediump float; uniform sampler2D sampler; varying vec2 vUV; void main(void) { gl_FragColor = texture2D(sampler, vec2(vUV.s, vUV.t)); }",

            generate_test_color: function () {
                this.shader_vertex = this.get(this.test_vertex_source, gl.VERTEX_SHADER, "VERTEX");
                this.shader_fragment = this.get(this.test_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");

                this.shader_program = gl.createProgram();
                gl.attachShader(this.shader_program, this.shader_vertex);
                gl.attachShader(this.shader_program, this.shader_fragment);

                gl.linkProgram(this.shader_program);

                this._color = gl.getAttribLocation(this.shader_program, "color");
                this._position = gl.getAttribLocation(this.shader_program, "position");

                gl.enableVertexAttribArray(this._color);
                gl.enableVertexAttribArray(this._position);

                gl.useProgram(this.shader_program);
            },
            generate_test_uv: function () {
                this.shader_vertex = this.get(this.test_vertex_source_uv, gl.VERTEX_SHADER, "VERTEX");
                this.shader_fragment = this.get(this.test_fragment_source_uv, gl.FRAGMENT_SHADER, "FRAGMENT");

                this.shader_program = gl.createProgram();
                gl.attachShader(this.shader_program, this.shader_vertex);
                gl.attachShader(this.shader_program, this.shader_fragment);

                gl.linkProgram(this.shader_program);

                this._position = gl.getAttribLocation(this.shader_program, "position");
                this._uv = gl.getAttribLocation(this.shader_program, "uv");

                gl.enableVertexAttribArray(this._position);
                gl.enableVertexAttribArray(this._uv);

                gl.useProgram(this.shader_program);
            },

            get: function (source, type, typeString) {
                var shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    Lemonade.Error.trigger("Error in " + typeString + " Shader: " + gl.getShaderInfoLog(shader), ERROR_OPENGL);
                    return false;
                }
                return shader;
            },
            bind: function (shader) {

            }
        },

        initializeGL: function () {
            try {
                gl = Lemonade.Canvas.canvasObject.getContext("webgl") || Lemonade.Canvas.canvasObject.getContext("experimental-webgl");
                gl.viewportWidth = Lemonade.Canvas.canvasWidth;
                gl.viewportHeight = Lemonade.Canvas.canvasHeight;

                gl.clearColor(0.3922, 0.5843, 0.9294, 0.0);
                gl.enable(gl.DEPTH_TEST);
            } catch (e) {
                Lemonade.Error.trigger(e, ERROR_OPENGL);
            }
            if (!gl) {
                Lemonade.Error.trigger("Could not initialize webGL", ERROR_OPENGL);
            }
            this.enabled = true;
        },
    },

    changeGraphicsType: function (newType) {
        this.graphicsType = newType;
    },
    prepThreeD: function () {
        this.graphicsType = GRAPHICS_WEBGL;
        // Here we will setup the canvas to use webgl on graphic calls.
        this.threed.initializeGL();
        // Enable the use of threed components.
        this.enabled = true;

        this.threed.shader.generate_test_color();
    },
};

Lemonade.Camera = {
    x: 0,
    y: 0,
    z: 0, // Not used yet.

    getX: function () {
        return this.x;
    },
    getY: function () {
        return this.y;
    },
    getZ: function () {
        return this.z;
    },

    moveX: function (dx) {
        this.x += dx;
        return this.x;
    },
    moveY: function (dy) {
        this.y += dy;
        return this.y;
    },
    moveZ: function (dz) {
        this.z += dz;
        return this.z;
    },

    setX: function (nx) {
        this.x = nx;
        return this.x;
    },
    setY: function (ny) {
        this.y = ny;
        return this.y;
    },
    setZ: function (nz) {
        this.z = nz;
        return this.z;
    },

    move: function (dx, dy, dz) {
        dx = dx || 0;
        dy = dy || 0;
        dz = dz || 0;
        this.moveX(dx);
        this.moveY(dy);
        this.moveZ(dz);
        return true;
    },
};

Lemonade.Canvas = {
    canvasWidth: 0,
    canvasHeight: 0,

    canvasObject: undefined,
    context: undefined,
    xRatio: 1,
    yRatio: 1,

    autoClear: true,
    FPS: 30,
    initialize2D: function (w, h, divName, autoScale) {
        this.initialize(w, h, divName, autoScale);
    },
    initialize3D: function (w, h, divName, autoScale) {
        this.canvasWidth = w || 0;
        this.canvasHeight = h || 0;
        this.divName = divName || "game";
        this.autoScale = autoScale || true;

        this.canvasObject = document.getElementById(this.divName);
        this.realWidth = this.canvasObject.offsetWidth;
        this.realHeight = this.canvasObject.offsetHeight;

        this.xRatio = this.realWidth / this.canvasWidth;
        this.yRatio = this.realHeight / this.canvasHeight;

        this.context = this.canvasObject.getContext('webgl') || this.canvasObject.getContext('experimental-webgl');
        this.mobile = false;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.mobile = true;
        }
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

        Lemonade.Graphics.prepThreeD();

        return this;
    },
    // THe default initializer for 2d
    initialize: function (w, h, divName, autoScale) {
        this.canvasWidth = w || 0;
        this.canvasHeight = h || 0;
        this.divName = divName || "game";
        this.autoScale = autoScale || true;

        this.canvasObject = document.getElementById(this.divName);
        this.realWidth = this.canvasObject.offsetWidth;
        this.realHeight = this.canvasObject.offsetHeight;

        this.xRatio = this.realWidth / this.canvasWidth;
        this.yRatio = this.realHeight / this.canvasHeight;

        this.context = this.canvasObject.getContext('2d');
        this.mobile = false;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.mobile = true;
        }
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
        return this;
    },
};

Lemonade.Debug = {
    DebugMode: DEBUG_NONE,
    log: function (output, importance) {
        importance = importance || DEBUG_NOTICE;
        if (this.debugMode == importance || this.debugMode == DEBUG_ALL || importance == DEBUG_NONE) {
            var debugElement = document.getElementById('debuglog');
            if (debugElement !== null) {
                if (debugElement.innerHTML.length > 2000)
                    debugElement.innerHTML = "";
                debugElement.innerHTML += output + "<br>";
            } else {
                var dl = document.createElement('div');
                dl.id = "debuglog";
                dl.style = 'height:100px;background-color:#ffffff;overflow-y:scroll;';
                document.getElementsByTagName('body')[0].appendChild(dl);
                Lemonade.Debug.log(output, importance);
                return;
            }
            debugElement.scrollTop = debugElement.scrollHeight;
            console.log(output);
        }
        return this;
    },
    setDebugMode: function (newDebugMode) {
        this.debugMode = newDebugMode;
    },
};

Lemonade.Error = {
    errorTriggered: false,
    trigger: function (description, code) {
        Lemonade.Debug.log("ERROR " + code + " - " + description);
        alert("Game Error!\nCode: " + code + "\nDescription:" + description);
        this.errorTriggered = true;
        throw new Error("ERROR " + code + " - " + description);
    },
};

Lemonade.Image = function (iKey, iFile, w, h) {
    this.iKey = iKey;
    this.iFile = iFile;
    this.iImage = new Image();
    if (this.iFile !== DO_NOT_LOAD)
        this.iImage.src = this.iFile;
    this.iImage.crossOrigin = "anonymous";
    this.webglTexture = false;
    var textureHelper = this;
    this.getWebGLTexture = function () {
        return this.webglTexture;
    };
    var ready = false;
    this.iImage.onload = function () {
        Lemonade.loadedAssets++;
        Lemonade.loadedImages++;
        ready = true;
        if (Lemonade.Graphics.threed.enabled === true) {
            var texture = gl.createTexture();
            /* var can = document.createElement('canvas');
              can.width = this.width;
              can.height = this.height;
              
              var ctx = can.getContext('2d');

              textureHelper.draw(0,0,this.width, this.height, 0, ctx, 0);
              var dat = new Image();
              dat.src = can.toDataURL("image/png");
              dat.crossOrigin = "anonymous";
              dat.onload = function(){
                */
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);

            textureHelper.webglTexture = texture;
        }
    };

    this.isSpriteSheet = false;

    this.scale = 1;
    this.scaleX = 1;
    this.scaleY = 1;

    this.curSprite = 0;
    this.maxSprite = 0;
    this.spriteWidth = 0;
    this.spriteHeight = 0;
    this.rotation = 0.0;

    this.animation = false;
    this.animationType = 0;
    this.animationTicks = 0;
    this.animationTickCount = 0;
    this.animationComplete = false;
    this.setSpriteSheet = function (frameAmount, w, h) {
        this.isSpriteSheet = true;
        this.maxSprite = frameAmount;
        this.curSprite = 0;
        this.spriteWidth = w || 32;
        this.spriteHeight = h || 32;
    };

    this.setAnimation = function (frameAmount, w, h, ticks, a, b, c, d, e) {
        this.animation = true;
        this.animationType = a || ANIMATION_TYPE_A;
        this.animationStart = b || 0;
        if (this.animationType == ANIMATION_TYPE_B)
            this.curSprite = this.animationStart;
        else
            this.curSprite = 0;
        this.setSpriteSheet(frameAmount, w, h);
        this.animationMax = c || this.maxSprite;
        this.animationTicks = ticks;
        this.animationTickCount = 0;
    };

    this.resetAnimation = function () {
        this.animationComplete = false;
        this.animationTickCount = 0;
        if (this.animationType == ANIMATION_TYPE_BC)
            this.curSprite = 0;
        else
            this.curSprite = this.animationStart;
    };

    this.width = w;
    this.height = h;

    this.originX = this.width / 2 || -1;
    this.originY = this.height / 2 || -1;

    this.flipHorizontal = false;
    this.flipVertical = false;

    this.x = 0;
    this.y = 0;

    this.animate = function () {};

    this.forceReady = function () {
        ready = true;
        Lemonade.loadedAssets++;
        Lemonade.loadedImages++;
    };

    this.draw = function (x, y, width, height, spriteid, context, rotate) {
        if (ready === false)
            return;
        context = context || Lemonade.Canvas.context;
        rotate = rotate || 0;
        x = x || this.x || 0;
        y = y || this.y || 0;
        spriteid = spriteid || this.curSprite || 0;
        width = width || this.width || 0;
        height = height || this.height || 0;

        // Setup for scaling and rotating
        context.save();
        context.translate(x + this.originX, y + this.originY);
        context.rotate(rotate);
        var scx = 1;
        var scy = 1;
        if (this.flipHorizontal == true)
            scx = -1;
        if (this.flipVertical == true)
            scy = -1;
        context.scale(scx, scy);


        if (!this.isSpriteSheet && !this.animation)
            context.drawImage(this.iImage, -this.originX, -this.originY, width, height);
        else if (this.isSpriteSheet)
            context.drawImage(this.iImage, spriteid * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, -this.originX, -this.originY, width, height);

        if (this.animation && this.animationComplete === false) {
            this.animationTickCount += 1;
            if (this.animationTickCount >= this.animationTicks) {
                this.animationTickCount = 0;
                this.curSprite += 1;
                if (this.curSprite >= this.animationMax && this.animationType != ANIMATION_TYPE_C && this.animationType != ANIMATION_TYPE_D)
                    this.curSprite = this.animationStart;
                else if (this.curSprite > this.animationMax && this.animationType == ANIMATION_TYPE_C) {
                    this.curSprite = this.animationMax;
                    this.animationComplete = true;
                } else if (this.curSprite > this.animationMax && this.animationType == ANIMATION_TYPE_D) {
                    this.curSprite = this.animationStart - 1;
                    this.animationComplete = true;
                }
            }
        }

        var dbtxt = "Image: " + this.iKey + " being drawn.";
        if (this.isSpriteSheet)
            dbtxt += " from a spritesheet.";
        Lemonade.Debug.log(dbtxt, DEBUG_NOTICE);

        context.restore();
    };
};
Lemonade.Sound = function (iKey, iFile, loop, volume) {
    this.iKey = iKey;
    this.iFile = iFile;
    this.iSound = new Audio(this.iFile);
    this.loop = loop;
    this.volume = volume;

    this.tmp = false;

    this.iSound.loop = this.loop;
    this.iSound.load();
    this.play = function () {
        if (this.iSound.currentTime !== 0 && this.iSound.paused === false) {
            var newSound = new Audio(this.iFile);
            newSound.volume = this.volume;
            newSound.loop = false;
            newSound.tmp = true;
            newSound.load();
            newSound.play();
        } else
            this.iSound.play();
    };
    this.pause = function () {
        this.iSound.pause();
    };
    this.stop = function () {
        this.iSound.pause();
        this.iSound.currentTime = 0;
    };
};

Lemonade.Data = {};
Lemonade.Data.retrieve = function(assetName, extension){
    var asset = undefined;
    // TODO allow assetName to be a string for loading as json,
    //  As well as loading an object through this.
    if(Lemonade.isAsset(assetName) == true)
        asset = assetName;
    else if(typeof assetName == "object"){
        asset = {};
        asset.data = assetName;
        asset.type = ASSET_OBJECT;
    }else
        asset = Lemonade.Repository.getAsset(assetName);
    if(asset !== undefined){
        if(asset.type == ASSET_FILE){
            // Use the asset data to load file from localStorage, into an object, then retrieve with extension.
            // TODO use localStorage web api to load a saved file. 
            // TODO allow local files and game files
            // Game files pertain to the game and should remain unchanged. 
        }else if(asset.type == ASSET_OBJECT || asset.type == ASSET_JSON_OBJECT){
            // Use the object to access with extension
            return Lemonade.Data.retrieveWithExtension(asset.data, extension);
        }else if(asset.type == ASSET_STRING){
            // use the string and convert to an object through json.
            var obj = JSON.parse(asset.data);
            asset.data = obj;
            return Lemonade.Data.retrieveWithExtension(asset.data, extenstion);
        }
    }
};

Lemonade.Data.retrieveWithExtension = function(object, extension){
    var extensionArray = [];
    for(var i=0;i<extension.length;i++){
        if(extension[i] == '.'){
            extensionArray.push(extension.substr(0, i));
            extension = extension.substr(i+1, extension.length-1);
            i =0;
        }
    }
    extensionArray.push(extension);
    return Lemonade.Data.recursiveExtension(object, extensionArray);
};
Lemonade.Data.recursiveExtension = function(object, extensionArray){
    if(extensionArray.length > 1){
        return Lemonade.Data.recursiveExtension(object[extensionArray[0]], extensionArray.splice(1, extensionArray.length-1));
    }
    return object[extensionArray[0]];
};
Lemonade.loadAssetFromJSON = function(assetName, fileName){
    Lemonade.readTextFile(fileName, function(t){
        Lemonade.Repository.addAsset(new Lemonade.Asset(assetName,JSON.parse(t), ASSET_JSON_OBJECT), true);
    });
};

Lemonade.Asset = function (assetKey, assetInfo, assetType) {
    this.__asset = true;
    this.aKey = assetKey;
    this.data = assetInfo;
    this.type = assetType || ASSET_DEFAULT;
};
Lemonade.loadAsset = function(assetName, assetInfo, assetType, assetLoadType){
    var newAsset = new Lemonade.Asset(assetName, assetInfo, assetType);
    if(assetLoadType === ASSET_JSON || assetLoadType === ASSET_JSON_TEXT){
        newAsset.data = JSON.parse(assetInfo);
    }else if(assetLoadType === ASSET_FILE){
        newAsset.data = JSON.parse(Lemonade.readTextFile(assetInfo));
    }
    Lemonade.Repository.addAsset(newAsset);
};
Lemonade.isAsset = function(obj){
    return this.__asset !== undefined;
};
Lemonade.Repository = {
    images: new Array(),
    sounds: new Array(),
    assets: new Array(),
    addAsset: function (assetKey, assetInfo, update) {// if assetKey is an object (Assumed to be an asset) then assetInfo becomes the new update variable
        // addAsset can be used to add an object or other asset like a string into the repository.
        update = update || false;
        if(typeof assetKey == "object"){
            var index = this.getAssetIndex(assetKey.aKey);
            if (index !== undefined && assetInfo === true) {
                this.assets[index] = assetKey;
            } else {
                this.assets.push(assetKey);
            }
            return true;
        }else if (assetInfo === undefined) {
            return undefined;
        }
        try {
            var index = this.getAssetIndex(assetKey);
            if (index !== undefined && update === true) {
                this.assets[index].data = assetInfo;
            } else {
                this.assets.push(new Lemonade.Asset(assetKey, assetInfo));
            }
        } catch (e) {
            Lemonade.Error.trigger("Could not add asset: " + imageFile + " <br> Reason: " + err.message, ERROR_ASSETLOAD);
        }
    },
    getAsset: function (assetKey) {
        var l = this.assets.length;
        for (var i = 0; i < l; i++) {
            if (this.assets[i].aKey == assetKey) {
                return this.assets[i];
            }
        }
        Lemonade.Debug.log("No Asset found by key: " + assetKey, DEBUG_NOTICE);
        return undefined;
    },
    getAssetIndex: function (assetKey) {
        var l = this.assets.length;
        for (var i = 0; i < l; i++) {
            if (this.assets[i].aKey == assetKey) {
                return i;
            }
        }
        Lemonade.Debug.log("No Asset found by key: " + assetKey, DEBUG_NOTICE);
        return undefined;
    },
    addImage: function (imageKey, imageFile, w, h) {
        if (imageFile === undefined)
            return new Lemonade.Image(imageKey, undefined, w, h);
        try {
            if (Lemonade.Repository.getImage(imageKey) == undefined) {
                var im = new Lemonade.Image(imageKey, imageFile, w, h);
                this.images.push(im);
                Lemonade.Debug.log("Added image " + imageFile, DEBUG_NOTICE);
                return im;
            }
            Lemonade.loadedAssets++;
            Lemonade.loadedImages++;
            return Lemonade.Repository.getImage(imageKey);
        } catch (err) {
            Lemonade.Error.trigger("Could not add image: " + imageFile + " <br> Reason: " + err.message, ERROR_IMAGELOAD);
        }
        return undefined;
    },
    getImage: function (imageKey) {
        var l = this.images.length;
        for (var i = 0; i < l; i++) {
            if (this.images[i].iKey == imageKey || this.images[i].iFile == imageKey) {
                Lemonade.Debug.log("Image found: " + this.images[i].iKey + ", " + this.images[i].iFile, DEBUG_NOTICE);
                return this.images[i];
            }
        }
        Lemonade.Debug.log("No image found by key: " + imageKey, DEBUG_NOTICE);
        return undefined;
    },
    removeImage: function (imageKey) {
        var l = this.images.length;
        for (var i = 0; i < l; i++) {
            if (this.images[i].iKey == imageKey || this.images[i].iFile == imageKey) {
                Lemonade.Debug.log("Image found: " + this.images[i].iKey + ", " + this.images[i].iFile, DEBUG_NOTICE);
                this.images.splice(i, 1);
                return true;
            }
        }
        Lemonade.Debug.log("No image found by key: " + imageKey, DEBUG_NOTICE);
        return false;
    },
    addSound: function (imageKey, imageFile, w, h) {
        try {
            if (Lemonade.Repository.getImage(imageKey) == undefined) {
                var im = new Lemonade.Image(imageKey, imageFile, w, h);
                this.images.push(im);
                Lemonade.Debug.log("Added image " + imageFile, DEBUG_NOTICE);
                return im;
            }
            return Lemonade.Repository.getImage(imageKey);
        } catch (err) {
            Lemonade.Error.trigger("Could not add image: " + imageFile + " <br> Reason: " + err.message, ERROR_IMAGELOAD);
        }
        return undefined;
    },
    getSound: function (imageKey) {
        var l = this.images.length;
        for (var i = 0; i < l; i++) {
            if (this.images[i].iKey == imageKey || this.images[i].iFile == imageKey) {
                Lemonade.Debug.log("Image found: " + this.images[i].iKey + ", " + this.images[i].iFile, DEBUG_NOTICE);
                return this.images[i];
            }
        }
        Lemonade.Debug.log("No image found by key: " + imageKey, DEBUG_NOTICE);
        return undefined;
    },
    removeSound: function (imageKey) {
        var l = this.images.length;
        for (var i = 0; i < l; i++) {
            if (this.images[i].iKey == imageKey || this.images[i].iFile == imageKey) {
                Lemonade.Debug.log("Image found: " + this.images[i].iKey + ", " + this.images[i].iFile, DEBUG_NOTICE);
                this.images.splice(i, 1);
                return true;
            }
        }
        Lemonade.Debug.log("No image found by key: " + imageKey, DEBUG_NOTICE);
        return false;
    },
};

Lemonade.random = function (min, max) {
    if (min === undefined) {
        min = 0;
        max = 100;
    } else if (max === undefined) {
        max = min;
        min = 0;
    }
    var ret = Math.floor((Math.random() * (max - min)) + min);
    return ret;
};

Lemonade.BubbleSort = function (array) {
    var ret = array;
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length; j++) {
            if (ret[i] > ret[j]) {
                var ij = ret[i];
                var ji = ret[j];
                ret[i] = ji;
                ret[j] = ij;
            }
        }
    }
    return ret;
};

Lemonade.CollisionDetection = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    var a = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    var b = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    a.x = x1;
    a.y = y1;
    a.w = w1;
    a.h = h1;

    b.x = x2;
    b.y = y2;
    b.w = w2;
    b.h = h2;
    if (a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y) {
        return true;
    } else
        return false;
};
Lemonade.Event = {};
Lemonade.Event.events = new Array();
Lemonade.Event.triggerEvent = function (eventName, obj) {
    var event = {
        event: eventName,
        object: obj,
        length: 0
    };
    Lemonade.Event.events.push(event);
    Lemonade.Debug.log("Event triggered: " + eventName + "on object: " + obj, DEBUG_NOTICE);
    return event;
};
Lemonade.Event.clearEvents = function () {
    Lemonade.Event.events.splice(0, Lemonade.Event.events.length);
};
Lemonade.Event.eventExists = function (eventName, obj, eventneed, objneed) {
    objneed = objneed || false;
    eventneed = eventneed || false;

    var whd = false;
    var l = Lemonade.Event.events.length;
    for (var i = 0; i < l; i++) {
        if (Lemonade.Event.events[i].event === eventName || Lemonade.Event.events[i].object === obj) {
            whd = true;
            if (Lemonade.Event.events[i].event != eventName && eventneed === true)
                whd = false;
            if (Lemonade.Event.events[i].object != obj && objneed === true)
                whd = false;
            if (whd == true)
                return whd;
        }
    }
    return whd;
};
Lemonade.Event.getEvent = function (eventName, obj, eventneed, objneed) {
    objneed = objneed || false;
    eventneed = eventneed || false;

    var whd = false;
    var evts = [];
    var l = Lemonade.Event.events.length;
    for (var i = 0; i < l; i++) {
        if (Lemonade.Event.events[i].event === eventName || Lemonade.Event.events[i].object === obj) {
            whd = true;
            if (Lemonade.Event.events[i].event != eventName && eventneed === true)
                whd = false;
            if (Lemonade.Event.events[i].object != obj && objneed === true)
                whd = false;
            if (whd == true)
                evts.push(Lemonade.Event.events[i]);
        }
    }
    if (evts.length == 1)
        return evts[0];
    return evts;
};
Lemonade.Event.getEvents = function (eventName, obj, eventneed, objneed) {
    objneed = objneed || false;
    eventneed = eventneed || false;

    var whd = false;
    var events = [];
    var l = Lemonade.Event.events.length;
    for (var i = 0; i < l; i++) {
        if (Lemonade.Event.events[i].event === eventName || Lemonade.Event.events[i].object === obj) {
            whd = true;
            if (Lemonade.Event.events[i].event != eventName && eventneed === true)
                whd = false;
            if (Lemonade.Event.events[i].object != obj && objneed === true)
                whd = false;
            if (whd == true)
                events.push(Lemonade.Event.events[i]);
        }
    }
    return events;
};
Lemonade.tween = function (key, obj1, ticks, action, complete) {
    this.key = key;
    this.object = obj1;
    this.action = action || function (o, t) {};

    // Specifies if the ticks should be against milliseconds or amount of times loop has run.
    this.timer = false;
    this.startTime = -1; // If negative one, it will be set the first time the tween is run.

    this.timeSinceStart = function () {
        return (Lemonade.Timer.getCurrentTime() - this.startTime) * Lemonade.Timer.timeInc;
    };
    this.timeLeft = function () {
        return this.ticks - this.timeSinceStart();
    };
    this.timeRatio = function () {
        return (this.timeSinceStart() / this.ticks);
    };

    this.ticks = ticks || 1000;
    this.curTicks = 0;
    this.finished = false;

    this.doAction = function () {
        this.action(this.object, this.curTicks);
        this.curTicks += 1;
    };

    this.finish = complete || function (o) {};
    this.complete = function () {
        this.finish(this.object);
        this.finished = true;
    };
};
Lemonade.tweenList = {
    tweens: new Array(),
    addTween: function (key, o1, ti, ac, co) {
        var tw = new Lemonade.tween(key, o1, ti, ac, co);
        this.tweens.push(tw);
        return tw;
    },
    addTweenTimer: function (key, o1, ti, ac, co) {
        var tw = new Lemonade.tween(key, o1, ti, ac, co);
        tw.timer = true;
        tw.startTime = -1;
        this.tweens.push(tw);
        return tw;
    },
    removeTween: function (key, callFinish) {
        callFinish = callFinish || false;
        var l = this.tweens.length;
        for (var i = 0; i < l; i++) {
            if (this.tweens[i].key == key) {
                if (callFinish === true)
                    this.tweens[i].complete();
                this.tweens.splice(i, 1);
                return;
            }
        }
    },
    tweenExists: function (key) {
        var l = this.tweens.length;
        for (var i = 0; i < l; i++) {
            if (this.tweens[i].key == key)
                return true;
        }
        return false;
    },
    getTween: function (key) {
        var l = this.tweens.length;
        for (var i = 0; i < l; i++) {
            if (this.tweens[i].key == key)
                return this.tweens[i];
        }
        return false;
    },
    addPrevTween: function (o) {
        this.tweens.push(o);
    },
};

Lemonade.Keyboard = function () {
    this.typed = "";
    this.key = new Array();
    this.init = function () {
        this.resetKeys();
    };
    this.resetKeys = function () {
        for (var i = 0; i < 100; i++) {
            this.key[i] = false;
        }
        this.typed = "";
    };
    this.updateKeys = function () {
        for (var i = 0; i < 100; i++) {
            if (this.key[i] === true) {
                Lemonade.Event.triggerEvent(EVENT_KEYDOWN + i, "");
            }
        }
    };
    this.onKeyDown = function (e) {
        var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
        e.preventDefault();
        if (this.key[keyCode] !== undefined) {
            //e.preventDefault();
            this.key[keyCode] = true;

            Lemonade.Event.triggerEvent(EVENT_KEYDOWN + keyCode, "");
            if ((keyCode >= 48 && keyCode <= 90) || keyCode == Lemonade.Keyboard.keyCode.space)
                this.typed += String.fromCharCode(keyCode);
            else if (keyCode == Lemonade.Keyboard.keyCode.enter)
                this.typed += "|";
        }
    };
    this.onKeyUp = function (e) {
        var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
        e.preventDefault();
        if (this.key[keyCode] !== undefined) {
            //e.preventDefault();
            this.key[keyCode] = false;
            Lemonade.Event.triggerEvent(EVENT_KEYUP + keyCode, "");
        }
    };
    this.onKeyPress = function (e) {
        var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
        e.preventDefault();
        Lemonade.Event.triggerEvent(EVENT_KEYPRESS + keyCode, "");
    };
};
Lemonade.Touch = function () {
    this.touchPos = [];
    this.touchWidth = 4;
    this.touchHeight = 4;

    this.init = function () {};
    this.onTouchStart = function (e) {
        var touchobj = e.changedTouches;
        var sx = window.scrollX;
        var sy = window.scrollY;
        for (var i = 0; i < touchobj.length; i++)
            this.touchPos.push({
                id: touchobj[i].identifier,
                x: (touchobj[i].clientX - Lemonade.Canvas.canvasObject.offsetLeft) / Lemonade.Canvas.xRatio + sx,
                y: (touchobj[i].clientY - Lemonade.Canvas.canvasObject.offsetTop) / Lemonade.Canvas.yRatio + sy
            });
        Lemonade.mouse.leftPressed = true;
        e.preventDefault();

        Lemonade.Event.triggerEvent("touchstart", "touch");
    };

    this.onTouchMove = function (e) {
        var touchobj = e.changedTouches;
        var sx = window.scrollX;
        var sy = window.scrollY;
        for (var i = 0; i < touchobj.length; i++) {
            for (var j = 0; j < this.touchPos.length; j++) {
                if (this.touchPos[j].id != touchobj[i].identifier)
                    continue;
                this.touchPos[j] = ({
                    id: touchobj[i].identifier,
                    x: (touchobj[i].clientX - Lemonade.Canvas.canvasObject.offsetLeft) / Lemonade.Canvas.xRatio + sx,
                    y: (touchobj[i].clientY - Lemonade.Canvas.canvasObject.offsetTop) / Lemonade.Canvas.yRatio + sy
                });
            }
        }
        e.preventDefault();
    };

    this.onTouchEnd = function (e) {
        if (Lemonade.multiTouch == false)
            this.touchPos.splice(0);
        Lemonade.mouse.leftPressed = false;
    };
};
Lemonade.Mouse = function () {
    this.leftPressed = false;
    this.middlePressed = false;
    this.rightPressed = false;
    this.mouseclick = false;
    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;

    this.wheelx = 0;
    this.wheely = 0;
    this.wheeldx = 0;
    this.wheeldy = 0;

    this.init = function () {
        this.leftPressed = false;
        this.middlePressed = false;
        this.rightPressed = false;
        this.mouseclick = false;
        this.x = 0;
        this.y = 0;
    };
    this.onMouseMove = function (e) {
        if (!e) e = window.event;
        var sx = window.scrollX;
        var sy = window.scrollY;
        this.x = (e.clientX - Lemonade.Canvas.canvasObject.offsetLeft) / Lemonade.Canvas.xRatio + sx;
        this.y = (e.clientY - Lemonade.Canvas.canvasObject.offsetTop) / Lemonade.Canvas.yRatio + sy;
    };

    this.onMouseDown = function (e) {
        if (!e) e = window.event;
        e.preventDefault();
        if (e.button == MOUSE_LEFT)
            this.leftPressed = true;
        else if (e.button == MOUSE_RIGHT)
            this.rightPressed = true;
        else if (e.button == MOUSE_MIDDLE)
            this.middlePressed = true;
        this.mouseclick = true;
    };

    this.onMouseWheel = function (e) {
        if (!e) e = window.event;
        e.preventDefault();

        this.wheelx += e.wheelDeltaX;
        this.wheely += e.wheelDeltaY;
        this.wheeldx = e.wheelDeltaX;
        this.wheeldy = e.wheelDeltaY;
    };

    this.onMouseUp = function (e) {
        if (!e) e = window.event;
        e.preventDefault();
        if (e.button == MOUSE_LEFT)
            this.leftPressed = false;
        else if (e.button == MOUSE_MIDDLE)
            this.middlePressed = false;
        else if (e.button == MOUSE_RIGHT)
            this.rightPressed = false;
        this.mouseclick = false;
    };
};

Lemonade.Keyboard.keyCode = {
    backspace: 8,
    space: 32,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    pausebreak: 19,
    capslock: 20,
    escape: 27,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete_key: 46,
    zero: 48,
    one: 49,
    two: 50,
    three: 51,
    four: 52,
    five: 53,
    six: 54,
    seven: 55,
    eight: 56,
    nine: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90
};

Lemonade.setListeners = function (mouse, keyboard, touch) {
    mouse = mouse || new Lemonade.Mouse();
    keyboard = keyboard || new Lemonade.Keyboard();
    touch = touch || new Lemonade.Touch();

    Lemonade.mouse = mouse;
    Lemonade.keyboard = keyboard;
    Lemonade.touch = touch;
    mouse.init();
    keyboard.init();
    touch.init();
    document.onmousemove = function (e) {
        mouse.onMouseMove(e);
    };
    document.onmousedown = function (e) {
        mouse.onMouseDown(e);
    };
    document.onmouseup = function (e) {
        mouse.onMouseUp(e);
    };
    document.onmousewheel = function (e) {
        mouse.onMouseWheel(e);
    };

    document.onkeydown = function (e) {
        keyboard.onKeyDown(e);
    };
    document.onkeypress = function (e) {
        keyboard.onKeyPress(e);
    };
    document.onkeyup = function (e) {
        keyboard.onKeyUp(e);
    };

    document.ontouchstart = function (e) {
        touch.onTouchStart(e);
    };
    document.ontouchend = function (e) {
        touch.onTouchEnd(e);
    };
    document.ontouchmove = function (e) {
        touch.onTouchMove(e);
    };
};
Lemonade.Behaviour = function (behaviourName, trigger, eventNeeded, objNeeded, action) {
    this.key = behaviourName || "behaviour";
    this.trigger = trigger;
    this.objectNeeded = objNeeded || false;
    this.eventNeeded = eventNeeded || false;
    this.action = action || function (obj) {
        alert("NO ACTION!!!");
    };
};

Lemonade.getEntityPosition = function (entity) {
    var position = {
        x: 0,
        y: 0,
        z: 0,
        w: 0,
        h: 0
    };
    if (entity.hasComponent(Lemonade.Components.position)) {
        position.x = entity.get('position', 'x');
        position.y = entity.get('position', 'y');
        position.z = entity.get('position', 'z');
        position.w = entity.get('position', 'width');
        position.h = entity.get('position', 'height');

        // Move with the camera if it is affected.
        if (entity.hasComponent(Lemonade.Components.camera) && entity.get("camera", "isAffected") === true) {
            position.x += Lemonade.Camera.getX();
            position.y += Lemonade.Camera.getY();
            position.z += Lemonade.Camera.getZ();
        }
    }
    return position;
};

Lemonade.Entity = function Entity() {
    this.id = (+new Date()).toString(16) +
        (Math.random() * 1000000000 | 0).toString(16) +
        Lemonade.Entity.prototype._count;
    Lemonade.Entity.prototype._count++;
    this.components = {};

    return this;
};
Lemonade.Entity.prototype._count = 0;

Lemonade.Entity.prototype.render = function () {};

Lemonade.Entity.prototype.addComponent = function (component) {
    this.components[component.prototype.name] = Lemonade.clone(component);
    return this;
};
Lemonade.Entity.prototype.removeComponent = function (componentName) {
    var name = componentName;
    if (typeof componentName === 'object') {
        name = componentName.prototype.name;
    }
    delete this.components[name];
};
Lemonade.Entity.prototype.hasComponent = function (componentName) {
    var name = componentName;
    if (typeof componentName === 'object')
        name = componentName.prototype.name;
    if (this.components[name])
        return true;
    else
        return false;
};
Lemonade.Entity.prototype.get = function (componentName, variableName) {
    var name = componentName;
    if (typeof componentName === 'object')
        name = componentName.prototype.name;
    if (!this.components[name])
        return undefined;
    else
        return this.components[name][variableName];
};
Lemonade.Entity.prototype.set = function (componentName, variableName, value) {
    var name = componentName;
    if (typeof componentName === 'object')
        name = componentName.prototype.name;
    if (!this.components[name])
        return undefined;
    else {
        this.components[componentName][variableName] = value;
        return value;
    }
};
Lemonade.Collision.getCollisionObject = function (entity) {
    var pos = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        isColliding: false,
        id: " "
    };
    pos.id = entity.id;
    if (entity.hasComponent(Lemonade.Components.position)) {
        pos.x = entity.get('position', 'x');
        pos.y = entity.get('position', 'y');
        pos.width = entity.get('position', 'width');
        pos.height = entity.get('position', 'height');
    }
    if (entity.hasComponent(Lemonade.Components.image) && (pos.width == 0 || pos.height == 0)) {
        pos.width = entity.get('image', 'image').width;
        pos.height = entity.get('image', 'image').height;
    }

    if (entity.hasComponent(Lemonade.Components.camera) && entity.get("camera", "isAffected") === true) {
        pos.x += Lemonade.Camera.getX();
        pos.y += Lemonade.Camera.getY();
    }
    return pos;
};
Lemonade.Entity.prototype.print = function () {
    console.log(JSON.stringify(this, null, 4));
    return this;
};

Lemonade.EntityHandler = {
    entities: new Array(),
};
Lemonade.bringEntityTo = function (id, index) {
    var i = Lemonade.getEntityIndex(id);
    if (i !== -1) {
        var e = Lemonade.removeEntity(id);
        Lemonade.addEntity(e, index);
    }
};
Lemonade.bringEntityToFront = function (id) {
    var i = Lemonade.getEntityIndex(id);
    if (i !== -1) {
        var e = Lemonade.removeEntity(id);
        Lemonade.addEntity(e);
    }
};
Lemonade.bringEntityToBack = function (id) {
    var i = Lemonade.getEntityIndex(id);
    if (i != null) {
        var e = Lemonade.removeEntity(id);
        Lemonade.addEntity(e, 0);
    }
};
Lemonade.addEntity = function (ent, ind) {
    if (ind !== undefined) {
        Lemonade.EntityHandler.entities.splice(ind, 0, ent);
    } else
        Lemonade.EntityHandler.entities.push(ent);
    return ent;
};

Lemonade.removeEntity = function (id) {
    if(Lemonade.CompVar.MAGNIFY_ACTIVE === id)
        Lemonade.CompVar.MAGNIFY_ACTIVE = undefined;
    var i = Lemonade.getEntityIndex(id);
    if (i != -1) {
        var e = Lemonade.getEntity(id);
        Lemonade.EntityHandler.entities.splice(i, 1);
        return e;
    }
    return null;
};

Lemonade.getEntityIndex = function (id) {
    for (var i = 0; i < Lemonade.EntityHandler.entities.length; i++) {
        if (Lemonade.EntityHandler.entities[i] === undefined || Lemonade.EntityHandler.entities[i] === null)
            continue;
        if (Lemonade.EntityHandler.entities[i].id === id) {
            return i;
        }
    }
    return -1;
};

Lemonade.getEntity = function (id) {
    var i = Lemonade.getEntityIndex(id);
    if (i != -1) {
        return Lemonade.EntityHandler.entities[i];
    }
};

Lemonade.Components = {};

// An array of names that are to not be run through
Lemonade.Components_Disabled = [];

Lemonade.isComponentDisabled = function (componentName) {
    return Lemonade.arrayContains(Lemonade.Components_Disabled, componentName);
};
Lemonade.disableComponent = function (componentName) {
    if (Lemonade.arrayContains(Lemonade.Components_Disabled, componentName))
        return;
    else
        Lemonade.Components_Disabled.push(componentName);
};
Lemonade.enableComponent = function (componentName) {
    var ind = Lemonade.arrayIndex(Lemonade.Components_Disabled, componentName);
    if (ind !== -1) {
        Lemonade.Components_Disabled.splice(ind, 1);
    }
};

Lemonade.System = function (componentName, componentProcess, renderOrLogic) {
    this.componentName = componentName;
    this.componentProcess = componentProcess;
    this.renderOrLogic = renderOrLogic;
};

Lemonade.Systems = {
    renderSystems: [],
    logicSystems: [],
    addSystem: function (system) {
        if (system.renderOrLogic === SYSTEM_RENDER) {
            this.renderSystems.push(system);
        } else if (system.renderOrLogic === SYSTEM_LOGIC) {
            this.logicSystems.push(system);
        }
    },
};

Lemonade.Component = {
    addComponent: function (componentName, componentDetails, componentProcess, renderOrLogic, otherMethod) {
        if (Lemonade.Components[componentName] !== undefined)
            return;
        Lemonade.Components[componentName] = componentDetails || {};
        Lemonade.Components[componentName].prototype = {};
        Lemonade.Components[componentName].prototype.name = componentName;
        Lemonade.Systems.addSystem(new Lemonade.System(componentName, componentProcess, renderOrLogic));

        if (otherMethod !== undefined) {
            if (renderOrLogic === SYSTEM_RENDER)
                Lemonade.Systems.addSystem(new Lemonade.System(componentName, otherMethod, SYSTEM_LOGIC));
            else
                Lemonade.Systems.addSystem(new Lemonade.System(componentName, otherMethod, SYSTEM_RENDER));
        }
    }
};

Lemonade.loadComponents = function () {
    Lemonade.Component.addComponent("visible", {
        isVisible: true
    }, Lemonade.render, SYSTEM_RENDER);
    Lemonade.Component.addComponent("keeporder", {
        order: -1, // default to bring the entity to the front. Anything other than -1(less than 0) will be inserted into the appropriate index.
    }, Lemonade.doNothing, SYSTEM_NEVER);
    Lemonade.Component.addComponent("collide", {
        isCollidable: true,
        isColliding: false,
        inQuadTree: false
    }, Lemonade.checkCollision, SYSTEM_LOGIC);
    Lemonade.Component.addComponent("update", {
        update: function (entity, data) {},
        data: undefined
    }, Lemonade.updateEntity, SYSTEM_LOGIC);
    Lemonade.Component.addComponent("render", {
        render: function (entity, data) {},
        data: undefined
    }, Lemonade.renderEntity, SYSTEM_RENDER);
    Lemonade.Component.addComponent("image", {
        image: undefined,
        imagedata: undefined,
        width: 0,
        height: 0,
        flipH: false,
        flipV: false,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        sprite: 0
    }, Lemonade.doNothing, SYSTEM_NEVER);
    Lemonade.Component.addComponent("animation", {
        speed: 0,
        currentFrame: 0,
        maxFrames: 0
    }, Lemonade.animateImage, SYSTEM_LOGIC);
    Lemonade.Component.addComponent("position", {
        x: 0,
        y: 0,
        z: 0,
        width: 0,
        height: 0
    }, Lemonade.doNothing, SYSTEM_NEVER);
    Lemonade.Component.addComponent("camera", {
        isAffected: true
    }, Lemonade.doNothing, SYSTEM_NEVER); // whether the entity should be moved by the camera.
    Lemonade.Component.addComponent("label", {
        text: "",
        baseline: "top",
        style: "20px Courier New",
        wrap: false,
        fontHeight: 0,
        fontWidth: 0
    }, Lemonade.doNothing, SYSTEM_NEVER);
    Lemonade.Component.addComponent("color", {
        red: 255,
        green: 255,
        blue: 255,
        alpha: 1,
        color: 0
    }, Lemonade.doNothing, SYSTEM_NEVER);
    Lemonade.Component.addComponent("rectangle", {
        fill: true
    }, Lemonade.doNothing, SYSTEM_NEVER);
    Lemonade.Component.addComponent("kill", {
        kill: true
    }, Lemonade.doNothing, SYSTEM_NEVER);
    Lemonade.Component.addComponent("button", {
            onClick: function () {}
        },
        function (e) {
            if (Lemonade.Event.eventExists(EVENT_COLLIDE + 'mouse', e.id, true, true) === true && Lemonade.mouse.leftPressed === true) {
                Lemonade.mouse.leftPressed = false;

                e.get("button", "onClick")(e);
            }
        }, SYSTEM_LOGIC);
    Lemonade.Component.addComponent("data", {
            data: {}
        },Lemonade.doNothing, SYSTEM_NEVER);
    Lemonade.Component.addComponent("magnify", {
            oneAtATime: true,
            scale: undefined,
            cr: 0,
            csr: 0,
            cx: 0,
            cy: 0,
            sx: undefined,
            sy: 0,
            sw: 0,
            sh: 0,
            nx: undefined,
            ny: undefined,
            nw: undefined,
            nh: undefined,
            mouseActivate: true,
            progress: 0,
            speed: 1
        },
        function (e) {
            var active = false;
            if (e.get("magnify", "mouseActivate") === true) {
                if (Lemonade.Event.eventExists(EVENT_COLLIDE + 'mouse', e.id, true, true) === true) {
                    if (e.get("magnify", "oneAtATime") === true) {
                        if (Lemonade.CompVar.MAGNIFY_ACTIVE === e.id || Lemonade.CompVar.MAGNIFY_ACTIVE === undefined) {
                            active = true;

                            if (Lemonade.CompVar.MAGNIFY_ACTIVE === undefined && GameTimer.paused === false) {
                                Lemonade.bringEntityToFront(e.id);
                            }

                            Lemonade.CompVar.MAGNIFY_ACTIVE = e.id;
                        }
                    }
                }
            }

            if (active === false && Lemonade.CompVar.MAGNIFY_ACTIVE === e.id)
                Lemonade.CompVar.MAGNIFY_ACTIVE = undefined;

            if (active === true) {
                var pos = Lemonade.getEntityPosition(e);

                if (e.get("magnify", "progress") <= 0) {
                    e.set("magnify", "progress", 0);

                    e.set("magnify", "sx", pos.x);
                    e.set("magnify", "sy", pos.y);
                    e.set("magnify", "sw", pos.w);
                    e.set("magnify", "sh", pos.h);

                    if (e.hasComponent(Lemonade.Components.circle)) {
                        e.set("magnify", "csr", e.get("circle", "radius"));
                        e.set("magnify", "cx", e.get("circle", "offsetX"));
                        e.set("magnify", "cy", e.get("circle", "offsetY"));
                    }
                }
                e.set("position", "x", e.get("magnify", "sx") + (e.get("magnify", "nx") * (e.get("magnify", "progress") / 100.0)));
                e.set("position", "y", e.get("magnify", "sy") + (e.get("magnify", "ny") * (e.get("magnify", "progress") / 100.0)));
                e.set("position", "width", e.get("magnify", "sw") + (e.get("magnify", "nw") * (e.get("magnify", "progress") / 100.0)));
                e.set("position", "height", e.get("magnify", "sh") + (e.get("magnify", "nh") * (e.get("magnify", "progress") / 100.0)));

                if (e.hasComponent(Lemonade.Components.circle)) {
                    e.set("circle", "radius", e.get("magnify", "csr") + (e.get("magnify", "cr") * e.get("magnify", "progress") / 100.0));
                    e.set("circle", "offsetX", e.get("magnify", "cx") - (e.get("magnify", "nx") * e.get("magnify", "progress") / 100.0));
                    e.set("circle", "offsetY", e.get("magnify", "cy") - (e.get("magnify", "ny") * e.get("magnify", "progress") / 100.0));
                }

                e.set("magnify", "progress", e.get("magnify", "progress") + e.get("magnify", "speed"));
                if (e.get("magnify", "progress") > 100)
                    e.set("magnify", "progress", 100);
            } else if (e.get("magnify", "progress") > 0 && e.get("magnify", "sx") !== undefined) {
                e.set("magnify", "progress", e.get("magnify", "progress") - e.get("magnify", "speed"));

                e.set("position", "x", e.get("magnify", "sx") + (e.get("magnify", "nx") * (e.get("magnify", "progress") / 100.0)));
                e.set("position", "y", e.get("magnify", "sy") + (e.get("magnify", "ny") * (e.get("magnify", "progress") / 100.0)));
                e.set("position", "width", e.get("magnify", "sw") + (e.get("magnify", "nw") * (e.get("magnify", "progress") / 100.0)));
                e.set("position", "height", e.get("magnify", "sh") + (e.get("magnify", "nh") * (e.get("magnify", "progress") / 100.0)));

                if (e.hasComponent(Lemonade.Components.circle)) {
                    e.set("circle", "radius", e.get("magnify", "csr") + (e.get("magnify", "cr") * e.get("magnify", "progress") / 100.0));
                    e.set("circle", "offsetX", e.get("magnify", "cx") - (e.get("magnify", "nx") * e.get("magnify", "progress") / 100.0));
                    e.set("circle", "offsetY", e.get("magnify", "cy") - (e.get("magnify", "ny") * e.get("magnify", "progress") / 100.0));
                }
            }
        }, SYSTEM_LOGIC);
    Lemonade.Component.addComponent("cover", {
            opacity: 0.5,
            color: '#000000',
            offsetX: 0,
            offsetY: 0,
            width: 0,
            height: 0,
        },
        function (e) {
            if (e.hasComponent("visible") === false || e.get("visible", "isVisible") === false)
                return;

            var oldFill = Lemonade.Canvas.context.fillStyle;
            var oldAlph = Lemonade.Canvas.context.globalAlpha;

            Lemonade.Canvas.context.fillStyle = e.get("cover", "color");
            Lemonade.Canvas.context.globalAlpha = e.get("cover", "opacity");

            var pos = Lemonade.getEntityPosition(e);
            if (e.hasComponent(Lemonade.Components.circle) === false)
                Lemonade.Canvas.context.fillRect(pos.x + e.get("cover", "offsetX"), pos.y + e.get("cover", "offsetY"), pos.w + e.get("cover", "width"), pos.h + e.get("cover", "height"));
            else {
                Lemonade.Canvas.context.beginPath();
                Lemonade.Canvas.context.arc(pos.x + e.get("circle", "offsetX"), pos.y + e.get("circle", "offsetY"), e.get("circle", "radius"), 0, 2 * Math.PI);
                Lemonade.Canvas.context.closePath();
                Lemonade.Canvas.context.fill();
            }

            Lemonade.Canvas.context.fillStyle = oldFill;
            Lemonade.Canvas.context.globalAlpha = oldAlph;
        }, SYSTEM_RENDER);

    Lemonade.Component.addComponent("border", { // rectangle border
        color: '#00aa00',
        visible: true,
        offsetX: 0,
        offsetY: 0,
        width: 0,
        height: 0
    }, function (entity) {
        if (entity.get("border", "visible") === false)
            return;
        if (entity.hasComponent("visible") === false || entity.get("visible", "isVisible") === false)
            return;

        Lemonade.Canvas.context.save();
        var pos = Lemonade.getEntityPosition(entity);

        if (entity.get("border", "width") !== 0)
            pos.w = entity.get("border", "width");
        if (entity.get("border", "height") !== 0)
            pos.h = entity.get("border", "height");

        pos.x += entity.get("border", "offsetX");
        pos.y += entity.get("border", "offsetY");

        Lemonade.Canvas.context.beginPath();
        Lemonade.Canvas.context.strokeStyle = entity.get("border", "color");
        Lemonade.Canvas.context.lineWidth = "1";
        Lemonade.Canvas.context.rect(pos.x, pos.y, pos.w, pos.h);
        Lemonade.Canvas.context.stroke();
        Lemonade.Canvas.context.closePath();

        Lemonade.Canvas.context.restore();
    }, SYSTEM_RENDER);

    Lemonade.Component.addComponent("circle", {
        color: "#000000",
        radius: 10,
        offsetX: 0,
        offsetY: 0,
        fill: false,
        distance: 2 * Math.PI,
        start: 0
    }, function (entity) {

        if (entity.hasComponent("visible") === false || entity.get("visible", "isVisible") === false)
            return;
        Lemonade.Canvas.context.save();

        var pos = Lemonade.getEntityPosition(entity);

        Lemonade.Canvas.context.beginPath();
        Lemonade.Canvas.context.strokeStyle = entity.get("circle", "color");
        Lemonade.Canvas.context.lineWidth = "1";
        Lemonade.Canvas.context.arc(pos.x + entity.get("circle", "offsetX"), pos.y + entity.get("circle", "offsetY"), entity.get("circle", "radius"), entity.get("circle", "start"), entity.get("circle", "distance"), false);
        Lemonade.Canvas.context.stroke();
        Lemonade.Canvas.context.closePath();

        Lemonade.Canvas.context.restore();
    }, SYSTEM_RENDER);
    // Requires the collision component to operate as intended, must be last component added in the render systems, because it is drawn over everything else.
    Lemonade.Component.addComponent("tooltip", {
        information: "",
        visible: true,
        background: true,
        backgroundColor: "#ffffff",
        fontStyle: "Courier New",
        fontSize: "20",
        x: 0,
        y: 0,
        mouseActivate: true,
        bringToFront: true,
        oldIndex: -1,
    }, function (entity) {
        if (entity.get("tooltip", "visible") === false)
            return;

        if (entity.get("tooltip", "mouseActivate") === true) {
            if (Lemonade.Event.eventExists(EVENT_COLLIDE + 'mouse', entity.id, true, true) === true) {
                var x = Lemonade.mouse.x;
                var y = Lemonade.mouse.y;
                entity.set("tooltip", "x", x - 32);
                entity.set("tooltip", "y", y - 16);
                if (entity.get("tooltip", "bringToFront") === true) {
                    if (entity.get("tooltip", "oldIndex") < 0)
                        entity.set("tooltip", "oldIndex", Lemonade.getEntityIndex(entity.id));
                    Lemonade.bringEntityToFront(entity.id);
                }
            } else {
                if (entity.get("tooltip", "oldIndex") >= 0) {
                    Lemonade.bringEntityTo(entity.id, entity.get("tooltip", "oldIndex"));
                    entity.set("tooltip", "oldIndex", -1);
                }
                return;
            }
        }

        Lemonade.Canvas.context.save();

        var info = [];
        var information = entity.get("tooltip", "information");
        // Splice lines from the information
        var longest = 0;
        for (var i = 0; i < information.length; i++) {
            if (information[i] == '|') {
                if (entity.get("tooltip", "x") + (0.6 * entity.get("tooltip", "fontSize") * i) > 1080) {
                    entity.set("tooltip", "x", 1080 - 0.6 * entity.get("tooltip", "fontSize") * i - 1)
                }
                info.push(information.substr(0, i));
                information = information.slice(i + 1);
                i = 0;
            }
            if (0.6 * entity.get("tooltip", "fontSize") * (i + 1) > longest)
                longest = 0.6 * entity.get("tooltip", "fontSize") * (i + 1);
        }
        if (information.length > 0) {
            if (entity.get("tooltip", "x") + (0.6 * entity.get("tooltip", "fontSize") * information.length) > 1080)
                entity.set("tooltip", "x", 1080 - 0.6 * entity.get("tooltip", "fontSize") * information.length - 1)
            info.push(information.substr(0, information.length));
            if (0.6 * entity.get("tooltip", "fontSize") * information.length > longest)
                longest = 0.6 * entity.get("tooltip", "fontSize") * information.length;
            information = information.slice(information.length);
        }
        if (entity.get("tooltip", "y") + info.length * entity.get("tooltip", "fontSize") > 720)
            entity.set("tooltip", "y", 720 - info.length * entity.get("tooltip", "fontSize"));

        if (entity.get("tooltip", "background") === true) {
            // if(UI_TOOLTIP_USEBACKGROUND === false){
            Lemonade.Canvas.context.fillStyle = entity.get("tooltip", "backgroundColor");
            Lemonade.Canvas.context.fillRect(entity.get("tooltip", "x"), entity.get("tooltip", "y"), longest, info.length * entity.get("tooltip", "fontSize"));
            /*}else{
                if(entity.get("tooltip", "y") + 20 + info.length * entity.get("tooltip", "fontSize") > 720)
                    entity.set("tooltip", "y", 720 - 20 - info.length * entity.get("tooltip", "fontSize"));
                if(entity.get("tooltip", "x") + 20 + (0.6 * entity.get("tooltip", "fontSize") * information.length) > 1080)
                    entity.set("tooltip", "x", 1080- 20 - 0.6 * entity.get("tooltip", "fontSize") * information.length -1)
                Lemonade.Repository.addImage(UI_DEFAULT_BACK_IMAGE, UI_DEFAULT_BACK_IMAGE, 32, 32).draw(
                    entity.get("tooltip", "x") - 20, entity.get("tooltip", "y") - 20,
                    longest + 40,
                    info.length * entity.get("tooltip", "fontSize") + 40
                );
            }*/
        }

        Lemonade.Canvas.context.textBaseline = 'top';
        Lemonade.Canvas.context.font = entity.get("tooltip", "fontSize") + "px " + entity.get("tooltip", "fontStyle");
        Lemonade.Canvas.context.fillStyle = "#000000";
        for (var i = 0; i < info.length; i++) {
            var t = info[i];
            Lemonade.Canvas.context.fillText(t, entity.get("tooltip", "x"), entity.get("tooltip", "y") + i * entity.get("tooltip", "fontSize"));
        }

        Lemonade.Canvas.context.restore();
    }, SYSTEM_RENDER);
};

Lemonade.doNothing = function (entity) {};

Lemonade.animateImage = function (entity) {
    if (entity.hasComponent(Lemonade.Components.image) === true) {
        entity.set("animation", "currentFrame", entity.get("animation", "currentFrame") + entity.get("animation", "speed"));
        if (Math.floor(entity.get("animation", "currentFrame")) >= entity.get("animation", "maxFrames")) {
            entity.set("animation", "currentFrame", 0)
        }
        entity.set("image", "sprite", Math.floor(entity.get("animation", "currentFrame")));
    }
};

Lemonade.updateEntity = function (entity) {
    entity.get("update", "update")(entity, entity.get("update", "data"));
};
Lemonade.renderEntity = function (entity) {
    entity.get("render", "render")(entity, entity.get("render", "data"));
    Lemonade.render(entity);
};

// This is the render function that is called when webgl is in use. Only for 2d objects and components.
Lemonade.render3D = function (entity) {

    var color = {
        r: 255,
        g: 255,
        b: 255,
        a: 255
    };

    var position = Lemonade.getEntityPosition(entity);

    if (entity.hasComponent(Lemonade.Components.color)) {
        color.r = entity.get('color', 'red');
        color.g = entity.get('color', 'green');
        color.b = entity.get('color', 'blue');
        color.a = entity.get('color', 'alpha');
    }
    var vertexArray = [ttn(position.x, FLAG_WIDTH), ttn(position.y, FLAG_HEIGHT),
        ttn(position.x + position.w, FLAG_WIDTH), ttn(position.y, FLAG_HEIGHT),
        ttn(position.x + position.w, FLAG_WIDTH), ttn(position.y + position.h, FLAG_HEIGHT),
        ttn(position.x, FLAG_WIDTH), ttn(position.y + position.h, FLAG_HEIGHT),

        //Now the Colors
        color.r / 255, color.g / 255, color.b / 255,
        color.r / 255, color.g / 255, color.b / 255,
        color.r / 255, color.g / 255, color.b / 255,
        color.r / 255, color.g / 255, color.b / 255
    ];
    var texCoord = [0, 0,
        1, 0,
        1, 1,
        0, 1
    ];
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, Lemonade.Graphics.threed.buffer.getVertexBuffer(vertexArray));
    gl.vertexAttribPointer(Lemonade.Graphics.threed.shader._position, 2, gl.FLOAT, false, 4 * (2), 0);

    if (Lemonade.Graphics.threed.shader._uv !== undefined && entity.hasComponent(Lemonade.Components.image) && entity.get("image", "image") !== undefined) {
        if (entity.get("image", "image").getWebGLTexture() !== false) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, entity.get("image", "image").getWebGLTexture());
        }
    }
    if (Lemonade.Graphics.threed.shader._color !== undefined) {
        gl.vertexAttribPointer(Lemonade.Graphics.threed.shader._color, 3, gl.FLOAT, false, 4 * (3), 4 * (2 * 4));
    }
    if (Lemonade.Graphics.threed.shader._uv !== undefined) {
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(Lemonade.Graphics.threed.shader._uv, 2, gl.FLOAT, false, 4 * (2), 0);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Lemonade.Graphics.threed.buffer.getFaceBuffer([0, 1, 2, 2, 3, 0]));
    gl.drawElements(gl.TRIANGLES, 2 * 3, gl.UNSIGNED_SHORT, 0);
    gl.flush();

    // WORKING ON MAKING THIS WEBGL COMPATIBLE YOU GOT THE KNOWLEDGE TO. SO JUST DO IT

    return undefined;
};

Lemonade.render = function (entity) {
    if (entity.get("visible", "isVisible") === false)
        return;
    if (Lemonade.Graphics.threed.enabled === true) {
        return Lemonade.render3D(entity);
    }
    Lemonade.Canvas.context.save();
    var color = {
        isColor: false,
    };
    var position = Lemonade.getEntityPosition(entity);
    if (entity.hasComponent(Lemonade.Components.color)) {
        color.r = entity.get('color', 'red');
        color.g = entity.get('color', 'green');
        color.b = entity.get('color', 'blue');
        color.a = entity.get('color', 'alpha');
        color.isColor = true;
        if (color.isColor === true) {
            if (typeof color.r == 'string')
                Lemonade.Canvas.context.fillStyle = color.r;
            else
                Lemonade.Canvas.context.fillStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
        } else
            Lemonade.Canvas.context.fillStyle = "#000000";
    }
    if (Lemonade.showCollisionRects === true && entity.hasComponent(Lemonade.Components.collide)) {
        Lemonade.Canvas.context.fillStyle = "#ff0ff0";
        Lemonade.Canvas.context.fillRect(position.x - 1, position.y - 1, position.w + 2, position.h + 2);
    }
    if (entity.hasComponent(Lemonade.Components.image) && entity.get("image", "image") !== undefined) {
        Lemonade.Canvas.context.translate(position.x + entity.get("image", "image").originX, position.y + entity.get("image", "image").originY);
        Lemonade.Canvas.context.rotate(entity.get('image', 'rotation'));
        var scx = 1;
        var scy = 1;
        if (entity.get('image', 'flipH') == true)
            scx = -1;
        if (entity.get('image', 'flipV') == true)
            scy = -1;
        Lemonade.Canvas.context.scale(scx, scy);
        entity.get('image', 'image').draw(-entity.get("image", "image").originX, -entity.get("image", "image").originY, position.w * entity.get('image', 'scale') * entity.get('image', 'scaleX'), position.h * entity.get('image', 'scale') * entity.get('image', 'scaleY'), entity.get('image', 'sprite')); //position.x,position.y,position.w,position.h);
    }
    if (entity.hasComponent(Lemonade.Components.image) && entity.get("image", "imagedata") !== undefined) {
        Lemonade.Canvas.context.translate(position.x + position.w / 2, position.y + position.h / 2);
        Lemonade.Canvas.context.rotate(entity.get('image', 'rotation'));
        var scx = 1;
        var scy = 1;
        if (entity.get('image', 'flipH') == true)
            scx = -1;
        if (entity.get('image', 'flipV') == true)
            scy = -1;
        Lemonade.Canvas.context.scale(scx, scy);
        Lemonade.Canvas.context.putImageData(entity.get("image", "imagedata"), position.x, position.y, 0, 0, position.w * entity.get('image', 'scale') * entity.get('image', 'scaleX'), position.h * entity.get('image', 'scale') * entity.get('image', 'scaleY'));
    }
    if (entity.hasComponent(Lemonade.Components.rectangle)) {
        if (entity.get('rectangle', 'fill') === true)
            Lemonade.Canvas.context.fillRect(position.x, position.y, position.w, position.h);
        else {
            Lemonade.Canvas.context.beginPath();
            Lemonade.Canvas.context.lineWidth = 1;
            Lemonade.Canvas.context.rect(position.x, position.y, position.w, position.h);
            Lemonade.Canvas.context.stroke();
            Lemonade.Canvas.context.closePath();
        }

    }
    if (entity.hasComponent(Lemonade.Components.label)) {
        Lemonade.Canvas.context.textBaseline = entity.get('label', 'baseline');

        Lemonade.Canvas.context.font = entity.get('label', 'style');

        if (entity.get('label', 'wrap') === true && position.w > 0) {
            var info = [];
            var information = entity.get("label", "text");
            // Splice lines from the information
            var longest = 0;
            for (var i = 0; i < information.length; i++) {
                if (information[i] == '|') {
                    info.push(information.substr(0, i));
                    information = information.slice(i + 1);
                    i = 0;
                    continue;
                }
                if (i * .6 * entity.get("label", "fontHeight") > position.w) {
                    info.push(information.substr(0, i));
                    information = information.slice(i);
                    i = 0;
                }
                if (0.6 * entity.get("label", "fontHeight") * (i + 1) > longest)
                    longest = 0.6 * entity.get("label", "fontHeight") * (i + 1);
            }
            if (information.length > 0) {
                info.push(information.substr(0, information.length));
                information = information.slice(information.length);
            }
            /*
                  var info = entity.get('label', 'text');
                  var lines = 0;
                  for(var i=1;i<info.length;i++)
                  {
                    if(i * entity.get('label', 'fontWidth') > position.w || info.substr(i, i+1) == '|')
                    {
                      Lemonade.Canvas.context.fillText(info.substr(0,i-1), position.x, position.y + lines* entity.get('label', 'fontHeight'));
                      info = info.slice(i-1, info.length);
                      lines++;
                      i = 0;
                    }/*else if(info.substr(i,i+1) == '|>')
                    {
                      Lemonade.Canvas.context.fillText(info.substr(0,i), position.x, position.y + lines* entity.get('label', 'fontHeight'));
                      info = info.slice(i+1, info.length);
                      lines++;
                      i = 0;
                    }
                  }*/
            for (var jj = 0; jj < info.length; jj++)
                Lemonade.Canvas.context.fillText(info[jj], position.x, position.y + jj * entity.get('label', 'fontHeight'));
        } else
            Lemonade.Canvas.context.fillText(entity.get('label', 'text'), position.x, position.y);
    }
    Lemonade.Canvas.context.restore();
    for (var i = 0; i < Lemonade.touch.touchPos.length; i++) {
        Lemonade.Canvas.context.fillRect(Lemonade.touch.touchPos[i].x, Lemonade.touch.touchPos[i].y, 32, 32);
    }
};
/*
    the update loop of the engine. Called every frame for logic.
*/
Lemonade.checkCollision = function (entity) {
    var c = Lemonade.Collision.getCollisionObject(entity);
    var items;
    var len;
    var ents = [];
    items = Lemonade.Collision.QuadTree.retrieve(c);
    len = items.length;
    c.isColliding = false;
    for (var j = 0; j < len; j++) {
        var item;
        item = items[j];
        if (c.id == item.id)
            continue;

        //if(c.isColliding === true && item.isColliding === true)
        //continue;

        /*if(!c.isColliding){
          c.isColliding = colliding;
        }
        if(!item.isColliding){
          item.isColliding = colliding;
        }*/
        if (Lemonade.CollisionDetection(c.x, c.y, c.width, c.height, item.x, item.y, item.width, item.height) === true) {
            Lemonade.Event.triggerEvent(EVENT_COLLIDE + c.id, item.id);
            Lemonade.Event.triggerEvent(EVENT_COLLIDE + item.id, c.id);
            item.isColliding = true;
        }
    }
};

// Delta time not used yet.
Lemonade.logicLoop = function (dt) {

    if (Lemonade.loadingScreen !== undefined) {
        var la = 0;
        var li = 0;
        var ls = 0;
        for (var i = 0; i < Lemonade.loadingScreen.imagesNeeded.length; i++) {
            if (Lemonade.Repository.getImage(Lemonade.loadingScreen.imagesNeeded[i]) !== undefined)
                li++;
            else
                break; // Want all the images to be loaded.
        }
        for (var i = 0; i < Lemonade.loadingScreen.soundsNeeded.length; i++) {
            if (Lemonade.Repository.getSound(Lemonade.loadingScreen.soundsNeeded[i]) !== undefined)
                ls++;
            else
                break; // Want all the images to be loaded.
        }
        for (var i = 0; i < Lemonade.loadingScreen.assetsNeeded.length; i++) {
            if (Lemonade.Repository.getAsset(Lemonade.loadingScreen.assetsNeeded[i]) !== undefined)
                la++;
            else
                break; // Want all the images to be loaded.
        }

        Lemonade.loadingScreen.update();
        if (Lemonade.loadingScreen.assetsNeeded.length <= la &&
            Lemonade.loadingScreen.imagesNeeded.length <= li &&
            Lemonade.loadingScreen.soundsNeeded.length <= ls) {
            Lemonade.loadingScreen = undefined;
            Lemonade.loadedAssets = 0;
            Lemonade.loadedImages = 0;
            Lemonade.loadedSounds = 0;
            console.log("Success in loading !!!");
        }
        return;
    }

    Lemonade.Event.clearEvents();
    Lemonade.keyboard.updateKeys();

    Lemonade.Collision.QuadTree.clear();

    Lemonade.Collision.QuadTree.insert({
        isColliding: false,
        id: 'mouse',
        x: Lemonade.mouse.x,
        y: Lemonade.mouse.y,
        width: Lemonade.mouse.width,
        height: Lemonade.mouse.height
    });
    if (Lemonade.countTouchAsMouse == true) {
        for (var i = 0; i < Lemonade.touch.touchPos.length; i++)
            Lemonade.Collision.QuadTree.insert({
                isColliding: false,
                id: 'mouse',
                x: Lemonade.touch.touchPos[i].x,
                y: Lemonade.touch.touchPos[i].y,
                width: Lemonade.touch.touchWidth,
                height: Lemonade.touch.touchHeight
            });
    } else {
        for (var i = 0; i < Lemonade.touch.touchPos.length; i++)
            Lemonade.Collision.QuadTree.insert({
                isColliding: false,
                id: 'touch' + Lemonade.touch.touchPos[i].id,
                x: Lemonade.touch.touchPos[i].x,
                y: Lemonade.touch.touchPos[i].y,
                width: Lemonade.touch.touchWidth,
                height: Lemonade.touch.touchHeight
            });
    }

    for (var j = 0; j < Lemonade.EntityHandler.entities.length; j++) {
        if (Lemonade.EntityHandler.entities[j] === undefined || Lemonade.EntityHandler.entities[j] === null)
            continue;
        if (Lemonade.EntityHandler.entities[j].hasComponent(Lemonade.Components.collide))
            Lemonade.Collision.QuadTree.insert(Lemonade.Collision.getCollisionObject(Lemonade.EntityHandler.entities[j]));
    }
    for (var j = 0; j < Lemonade.EntityHandler.entities.length; j++) {
        if (Lemonade.EntityHandler.entities[j] === undefined || Lemonade.EntityHandler.entities[j] === null)
            continue;
        if (Lemonade.EntityHandler.entities[j].hasComponent(Lemonade.Components.kill)) {
            Lemonade.removeEntity(Lemonade.EntityHandler.entities[j].id);
            j--;
        } else {
            for (var i = 0; i < Lemonade.Systems.logicSystems.length; i++) {
                if (Lemonade.EntityHandler.entities[j] === undefined || Lemonade.EntityHandler.entities[j] === null)
                    break;
                if (Lemonade.isComponentDisabled(Lemonade.Systems.logicSystems[i].componentName) === false && Lemonade.EntityHandler.entities[j].hasComponent(Lemonade.Systems.logicSystems[i].componentName)) {
                    Lemonade.Systems.logicSystems[i].componentProcess(Lemonade.EntityHandler.entities[j]);
                }
            }
        }
    }

    Lemonade.keyboard.typed = "";
};
// Delta time not used yet.
Lemonade.renderLoop = function (dt) {
    Lemonade.FPS.updateFPS();
    if (Lemonade.FPS.isDelaying === true)
        return;

    // If we are using webgl, there is stuff we need to do.
    if (Lemonade.Graphics.threed.enabled === true) {
        gl.viewport(0.0, 0.0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    if (Lemonade.loadingScreen !== undefined) {
        Lemonade.loadingScreen.render();
        return;
    }

    /*for (var j = 0; j < Lemonade.EntityHandler.entities.length; j++) {
        if (Lemonade.EntityHandler.entities[j].hasComponent(Lemonade.Components.keeporder)) {
            var index = Lemonade.EntityHandler.entities[j].get("keeporder", "order");
            if (index >= 0)
                Lemonade.bringEntityTo(Lemonade.EntityHandler.entities[j].id, index);
            else
                Lemonade.bringEntityToFront(Lemonade.EntityHandler.entities[j].id);
            continue;
        }
    }*/
    for (var j = 0; j < Lemonade.EntityHandler.entities.length; j++) {
        for (var i = 0; i < Lemonade.Systems.renderSystems.length; i++) {
            if (Lemonade.EntityHandler.entities[j] === undefined || Lemonade.EntityHandler.entities[j] === null)
                continue;
            if (Lemonade.isComponentDisabled(Lemonade.Systems.renderSystems[i].componentName) === false && Lemonade.EntityHandler.entities[j].hasComponent(Lemonade.Systems.renderSystems[i].componentName))
                Lemonade.Systems.renderSystems[i].componentProcess(Lemonade.EntityHandler.entities[j]);
        }
    }
    loopRender();
};
Lemonade.tweenLoop = function (dt) {
    for (var i = 0; i < Lemonade.tweenList.tweens.length; i++) {
        var tween = Lemonade.tweenList.tweens[i];
        if (tween.timer === true)
            if (tween.startTime <= -1) {
                tween.startTime = Lemonade.Timer.getCurrentTime();
            }
        tween.doAction();
        if ((tween.timer === false && tween.curTicks >= tween.ticks) || (tween.timer === true && tween.ticks / Lemonade.Timer.timeInc <= Lemonade.Timer.getCurrentTime() - tween.startTime)) {
            Lemonade.tweenList.removeTween(tween.key, true);
            i--;
        }
    }
};

var loopRender = function () {};
/*
    The method that starts the gears in the engine.
    Some initialization should be called before this though.
    TODO Make a simplified initialize method for the engine
*/
/* Interval way
Lemonade.run = function() {
  Lemonade.Debug.log("Lemonade Engine V" + Lemonade.version, DEBUG_NOTICE);
  setInterval(function() {
    if (Lemonade.running === false)
      return;
    window.requestAnimationFrame(function() {
      if (Lemonade.autoClear === true && Lemonade.running === true)
        Lemonade.Canvas.context.clearRect(0, 0, Lemonade.Canvas.canvasWidth, Lemonade.Canvas.canvasHeight);
      Lemonade.renderLoop();
    });
    //console.log(Lemonade.Event.events.length);
  }, 1);
  setInterval(function(){
    if(Lemonade.running === false)
      return;
    Lemonade.logicLoop();
    loop();
  }, 1);
  setInterval(function(){
    if(Lemonade.running === false)
      return;
    Lemonade.tweenLoop();
  }, 1);
};*/
/*/ Timeout Way /*/
Lemonade.aa = function () {
    if (Lemonade.running === false)
        return;
    window.requestAnimationFrame(function () {
        if (Lemonade.autoClear === true && Lemonade.running === true && Lemonade.Graphics.threed.enabled === false)
            Lemonade.Canvas.context.clearRect(0, 0, Lemonade.Canvas.canvasWidth, Lemonade.Canvas.canvasHeight);
        Lemonade.renderLoop();
    });
    //console.log(Lemonade.Event.events.length);
    setTimeout(Lemonade.aa, 1);
};
Lemonade.bb = function () {
    if (Lemonade.running === false)
        return;
    Lemonade.logicLoop();
    loop();
    setTimeout(Lemonade.bb, 1);
};
Lemonade.cc = function () {
    if (Lemonade.running === false)
        return;
    Lemonade.tweenLoop();
    setTimeout(Lemonade.cc, 1);
};
Lemonade.dd = function () {
    Lemonade.Timer.incTime();
    setTimeout(Lemonade.dd, Lemonade.Timer.timeInc);
};
Lemonade.run = function () {
    Lemonade.Debug.log("Lemonade Engine V" + Lemonade.version, DEBUG_NOTICE);
    setTimeout(Lemonade.aa, 1);
    setTimeout(Lemonade.bb, 1);
    setTimeout(Lemonade.cc, 1);
    setTimeout(Lemonade.dd, Lemonade.Timer.timeInc);
};