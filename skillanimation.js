Lemonade.include("keyframe.js");

function SkillAnimation(length, kfs, entity, imageName){
    this.length = length || 100;// Amount of ticks the skillanimation will last.
    this.keyFrames = kfs; // Array of keyframes in the animation.

    this.currentTick = 0;

    this.preConstructed = false;
    if(this.keyFrames !== undefined)
        this.preConstructed = true;
    else
        this.keyFrames = [];

    this.entity = entity;
    this.preConstructedEntity = true;
    if(this.entity == undefined){
        this.preConstructedEntity = false;
        this.entity = new Lemonade.Entity();
        this.entity.addComponent(Lemonade.Components.visible).
            addComponent(Lemonade.Components.keeporder);
        this.entity.addComponent(Lemonade.Components.position).
            addComponent(Lemonade.Components.camera);
        this.entity.set("position", "x", 0);
        this.entity.set("position", "y", 0);
        this.entity.set("position", "width", GLB_TILE_SIZE);
        this.entity.set("position", "height", GLB_TILE_SIZE);
        this.entity.addComponent(Lemonade.Components.image);
        this.entity.set("image", "image", Lemonade.Repository.addImage(imageName, imageName, 32, 32));
    }

    this.animationLength = function(owner, map, sx, sy, tx, ty){
        return this.length * MapUtils.distanceTo(sx, sy, tx, ty);
    };
    this.animationFrames = function(){
        return this.keyFrames.length;
    };

    this.deleteKeyFrames = function(){
        this.keyFrames.splice(0, this.keyFrames.length);
        this.keyFrames = [];
        return true;
    };

    this.constructAnimation = function(owner, map, sx, sy, tx, ty){// sx, sy, tx, ty, are tile coordinates. Not pixel coords.
        // This method used to create keyframes for the animation based on targetx and targety. By default, only creates linear path from A to B
        var dx = tx - sx;
        var dy = ty - sy;

        // Calculate rotation angle to the destination.
        var angle = Math.atan2(dy, dx);

        // Delete old keyFrames.
        this.deleteKeyFrames();
        this.addKeyFrame(new keyFrame({x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: angle}, {imageName: KEYFRAME_IMAGE_NONE, sprite: 0}, 0));
        this.addKeyFrame(new keyFrame({x: dx*GLB_TILE_SIZE, y: dy*GLB_TILE_SIZE, z: 0, rx: 0, ry: 0, rz: angle}, {imageName: KEYFRAME_IMAGE_NONE, sprite: 0}, this.length));
        return true;// Success.
    };

    this.startAnimation = function(owner, map, sx, sy, tx, ty){
        if(this.preConstructed === false || this.keyFrames.length <= 0)
            this.constructAnimation(owner, map, sx, sy, tx, ty);
        this.currentTick = 0;
        if(this.preConstructedEntity !== true){
            this.entity.set("position", "x", 0);
            this.entity.set("position", "y", 0);
            Lemonade.addEntity(this.entity);
        }
    };

    this.addKeyFrame = function(kf, index){
        index = index || this.keyFrames.length;
        this.keyFrames.splice(index, 0, kf);
    };

    this.keyFrameIndex = function(){
        for(var i=0;i<this.keyFrames.length;i++){
            if(this.keyFrames[i].framesBetween > this.currentTick){
                if(i <= 0){
                    return 0;
                }
                return i-1;
            }
        }
        return 0;
    }

    this.keyFrameFloor = function(){
        for(var i=0;i<this.keyFrames.length;i++){
            if(this.keyFrames[i].framesBetween > this.currentTick){
                if(i <= 0){
                    return this.keyFrames[0];
                }
                return this.keyFrames[i-1];
            }
        }
        if(this.keyFrames.length > 0)
            return this.keyFrames[0];
        return undefined;
    }
    
    this.updateAnimation = function(startFrame, forceFrame){
        if(this.keyFrames.length > 0){
            Lemonade.bringEntityToFront(this.entity.id);
        }
        this.currentTick ++;
        if(forceFrame !== undefined)
            this.currentTick = forceFrame;
        if(this.currentTick >= this.length){
            this.currentTick = 0;
        }
        
        var KF1 = this.keyFrameFloor();
        var KF2 = KF1;
        var kfp1 = this.keyFrameIndex() + 1;
        if(kfp1 < this.keyFrames.length)
            KF2 = this.keyFrames[kfp1];
        
        var fb = KF2.framesBetween - KF1.framesBetween;
        var currentProgress = KF2.framesBetween - this.currentTick;

        var KFF = keyFrameProgress(KF1, KF2, currentProgress, fb);
        KFF.applyFrame(this.entity, startFrame);
        //alert("FB" + fb + " CP"+currentProgress+" KFF"+JSON.stringify(KFF) + " SF"+JSON.stringify(startFrame));
    };

    this.finishAnimation = function(){
        this.currentTick = 0;
        if(this.preConstructed === false)
            this.deleteKeyFrames();
        if(this.preConstructedEntity === false)
            Lemonade.removeEntity(this.entity.id);
    }
    return this;
}
