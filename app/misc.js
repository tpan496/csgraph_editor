var gridOn = true;
var directedOn = true;

var toggleGrid = function(target){
    if(gridOn){
        target.css('background', '#7a7a7a');
        gridOn = false;
        $('#content').hide();
    }else{
        target.css('background', 'rgb(6, 218, 94)');
        gridOn = true;
        $('#content').show();
    }
};

var toggleDirected = function(target){
    if(directedOn){
        target.css('background', '#7a7a7a');
        directedOn = false;

        for(v of E_shape){
            for(e of v){
                console.log(e);
                e.children[1].setAttribute('visibility', 'hidden');
            }
        }
    }else{
        target.css('background', 'rgb(6, 218, 94)');
        directedOn = true;

        for(v of E_shape){
            for(e of v){
                e.children[1].setAttribute('visibility', 'visible');
            }
        }
    }
};