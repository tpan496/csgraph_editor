var displayInfo = function (node) {
    clearBoard();
    $('.clickedit').hide();
    if (node.getAttribute('class') == 'node') {
        idInfo.html(node.getAttribute('id'));
        idInfo.parent().show();
        radiusInfo.html(node.children[0].getAttribute('radius'));
        radiusInfo.parent().show();
    } else if (node.getAttribute('class') == 'edge'){
        fromInfo.html(node.getAttribute('v1'));
        fromInfo.parent().show();
        toInfo.html(node.getAttribute('v2'));
        toInfo.parent().show();
    }
    elementInfo.html(node.getAttribute('class'));
    if(node.children[1]){
        if(node.children[1].getAttribute('class') == 'text'){
            textInfo.html(node.children[1].textContent);
            textInfo.parent().show();
            textSizeInfo.html(node.children[1].getAttribute('font-size'));
            textSizeInfo.parent().show();
        }
    }
};

var displayBoard = function () {
    elementInfo.html('none');
    clearBoard();
};

var clearBoard = function() {
    radiusInfo.parent().hide();
    idInfo.parent().hide();
    fromInfo.parent().hide();
    toInfo.parent().hide();
    textInfo.parent().hide();
    textSizeInfo.parent().hide();
};
