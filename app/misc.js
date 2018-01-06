var gridOn = true;
var directedOn = true;

var toggleGrid = function (target) {
    if (gridOn) {
        target.css('background', '#7a7a7a');
        gridOn = false;
        $('#content').hide();
    } else {
        target.css('background', 'rgb(6, 218, 94)');
        gridOn = true;
        $('#content').show();
    }
};

var toggleDirected = function (target) {
    if (directedOn) {
        target.css('background', '#7a7a7a');
        directedOn = false;

        for (v of E_shape) {
            for (e of v) {
                e.children[1].setAttribute('visibility', 'hidden');
            }
        }
    } else {
        target.css('background', 'rgb(6, 218, 94)');
        directedOn = true;

        for (v of E_shape) {
            for (e of v) {
                e.children[1].setAttribute('visibility', 'visible');
            }
        }
    }
};

var exportPNG = function () {
    var foreigns = [];
    for (child of svg.children) {
        if (child.getAttribute('class') == 'label') {
            var foreign = child.children[2];
            child.removeChild(foreign);
            foreigns.push(foreign);
        }
    }
    saveSvgAsPng(svg, "diagram.png");
    for (child of svg.children) {
        if (child.getAttribute('class') == 'label') {
            child.appendChild(foreigns.shift());
        }
    }
};

var saveXML = function () {
    turnOffSelectedElementScaler();
    //get svg source.
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.xml';
    a.click();
};

var loadXML = function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.id = 'file';
    input.accept = '.xml';
    input.onchange = function (e) {
        var loadedXML = input.files[0];
        var type = loadedXML.name.split('.')[1];
        if (!type || type != 'xml') {
            alert('Incorrect file format');
            return;
        }

        var reader = new FileReader();
        reader.onload = function () {
            var dataURL = reader.result;
            delete svg;
            var content = $('#content');
            $('#paper').html(dataURL).append(content)
            .find('#box').appendTo($('#paper'));;
            svg = $('svg')[0];
            svg.setAttribute('z-index', -1);
            generateGraphFromXml();
            $('svg').click(function () {
                if (selectedElement != 0 && !mouseOverNode) {
                    turnOffSelectedElementScaler();
                }
            });
        };
        reader.readAsText(loadedXML);
    };
    if (document.createEvent) {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        input.dispatchEvent(evt);
    }
};

var toggleSelfLoop = function(target, e){
    if(e.children[3].getAttribute('visibility') == 'hidden'){
        e.children[3].setAttribute('visibility', 'visible');
        target.css('background', 'rgb(6, 218, 94)');
    }else{
        e.children[3].setAttribute('visibility', 'hidden');
        target.css('background', '#7a7a7a');
    }
};

var toggleTerminal = function(target, e){
    if(e.children[4].getAttribute('visibility') == 'hidden'){
        e.children[4].setAttribute('visibility', 'visible');
        target.css('background', 'rgb(6, 218, 94)');
    }else{
        e.children[4].setAttribute('visibility', 'hidden');
        target.css('background', '#7a7a7a');
    }
};