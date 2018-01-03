var displayInfo = function (node) {
    clearBoard();
    $('.clickedit').hide();
    elementInfo.html(node.getAttribute('class'));
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
        node.setAttribute('stroke-dasharray', [5,5]);
        node.setAttribute('stroke', 'rgb(0,122,255)');
        node.parentElement.children[1].setAttribute('fill', 'rgb(0,122,255)');
    } else if (node.getAttribute('class') == 'label'){
        textInfo.html(node.children[0].textContent);
        textInfo.parent().show();
        textSizeInfo.html(node.children[0].getAttribute('font-size'));
        textSizeInfo.parent().show();
        return;
    }
    
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
