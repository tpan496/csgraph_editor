var randomRange = function (min, max) {
    return Math.random() * (max - min) + min;
};

var dist = function (a,b) {
    var dx = a[0]-b[0];
    var dy = a[1]-b[1];
    var mult = 1;
    if(dx>0 && dy>0){
        mult = -1;
    }
    return Math.sqrt(dx*dx+dx*dx) * mult;
};