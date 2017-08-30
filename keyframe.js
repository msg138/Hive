
var KEYFRAME_APPLY_FLOOR = "floorStrict";
var KEYFRAME_APPLY_CEIL = "ceilStrict";
var KEYFRAME_APPLY_ROUND = "round";

// Used to not apply change of image transformation.
var KEYFRAME_IMAGE_NONE = "none";

var GLB_KEYFRAME_APPLICATION = KEYFRAME_APPLY_ROUND;

/**
 * position - x, y, z, rx, ry, rz(RZ applied for 2d rotations.)
 * image - imagename, sprite
 */

var keyFrame = function(position, image, framesBetween){
    this.position = position;
    this.image = image;
    this.framesBetween = framesBetween;
    return this;
};

keyFrame.prototype.applyFrame = function(entity, startFrame){
    if(entity.hasComponent("position")){
        entity.set("position", "x", startFrame.position.x + this.position.x);
        entity.set("position", "y", startFrame.position.y + this.position.y);
        entity.set("position", "z", startFrame.position.z + this.position.z);
    }
    if(entity.hasComponent("image")){
        entity.set("image", "rotation", startFrame.position.rz + this.position.rz);
        if(this.image.imageName != KEYFRAME_IMAGE_NONE)
            entity.set("image", "image", Lemonade.Repository.getImage(this.image.imageName));
        entity.set("image", "sprite", this.image.sprite);
    }
};

function keyFrameProgress(KF1, KF2, progress, maxProgress){
    maxProgress = maxProgress || 100;// default to 100 max.
    progress = progress || 0;// Default to 0;

    var KFD;
    try{
        // Calculate the difference in position from KF1 to KF2;
        var dx, dy, dz, drx, dry, drz, imgObj;
        dx = (KF1.position.x - KF2.position.x);
        dy = (KF1.position.y - KF2.position.y);
        dz = (KF1.position.z - KF2.position.z);

        drx = (KF1.position.rx - KF2.position.rx);
        dry = (KF1.position.ry - KF2.position.ry);
        drz = (KF1.position.rz - KF2.position.rz);

        switch(GLB_KEYFRAME_APPLICATION){
            case KEYFRAME_APPLY_FLOOR:
                imgObj = KF1.image;
                break;
            case KEYFRAME_APPLY_CEIL:
                imgObj = KF2.image;
                break;
            default:
                if(Math.round(progress/maxProgress) > 0)
                    imgObj = KF2.image;
                else
                    imgObj = KF1.image;
                break;
        }

        KFD = new keyFrame({x: dx, y: dy, z: dz, rx: drx, ry:dry, rz: drz}, imgObj, 0);
    }catch(e){
        console.error(e.message);
    }
    if(KFD !== undefined){
        KFD.position.x *= ((progress*1.0)/maxProgress);
        KFD.position.y *= ((progress*1.0)/maxProgress);
        KFD.position.z *= ((progress*1.0)/maxProgress);
        
        KFD.position.rx *= ((progress*1.0)/maxProgress);
        KFD.position.ry *= ((progress*1.0)/maxProgress);
        KFD.position.rz *= ((progress*1.0)/maxProgress);
        
        // Create a final object with the addition of the changes. 
        var KFF = new keyFrame({x: KFD.position.x + KF2.position.x, y: KFD.position.y + KF2.position.y, z: KFD.position.z + KF2.position.z,
            rx: KFD.position.rx + KF2.position.rx, ry: KFD.position.ry + KF2.position.ry, rz: KFD.position.rz + KF2.position.rz}, KFD.image, 0);
        // Return the new Final Key Frame
        return KFF;
    }
    return undefined;
}
