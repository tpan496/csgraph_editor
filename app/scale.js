var scale = function (dx, dy) {
    if (!isNode(selectedElement)) {
        return;
    }
    var radius = selectedElement.getAttribute('radius');
    var diff = Math.sqrt(dx * dx + dy * dy);

    var mutator = selectedElement.children[2];

    // change linker position
    var linker = mutator.children[1];
    var linkerMatrix = getMatrix(linker);
    linkerMatrix[4] = getAbsoluteX(linker) + dx / 2;
    linkerMatrix[5] = getAbsoluteY(linker) + dy / 2;
    newMatrix = matrixToString(linkerMatrix);
    linker.setAttribute('transform', newMatrix);
    updateXY(linker, dx / 2, dy / 2);

    // change circle scale and position
    var circle = selectedElement.children[0];
    // change circle and node position as well
    updateXY(circle, dx / 2, dy / 2);
    updateXY(selectedElement, dx / 2, dy / 2);
    displayXY(selectedElement);

    // change text position
    var text = selectedElement.children[1];
    var textMatrix = getMatrix(text);
    textMatrix[4] = getAbsoluteX(text) + dx / 2;
    textMatrix[5] = getAbsoluteY(text) + dy / 2;
    newMatrix = matrixToString(textMatrix);
    text.setAttribute('transform', newMatrix);
    updateXY(text, dx / 2, dy / 2);

    var circleMatrix = getMatrix(circle);

    // change scaler position
    var scaler = mutator.children[0];

    // check which is current scaler
    var scalerNE = scaler.children[2];
    var scalerSE = scaler.children[0];
    var scalerNW = scaler.children[1];
    var scalerSW = scaler.children[3];
    var scalerId = selectedScaler.getAttribute('id');

    var lineN = scaler.children[4];
    var lineW = scaler.children[5];
    var lineE = scaler.children[6];
    var lineS = scaler.children[7];

    if (scalerId == 'nw') {
        var rate = (getRadius(circle) - dx / 2) / getBaseRadius(circle);

        circleMatrix[0] = rate;
        circleMatrix[3] = rate;
        circleMatrix[4] = getAbsoluteX(circle) + dx / 2;
        circleMatrix[5] = getAbsoluteY(circle) + dy / 2;
        newMatrix = matrixToString(circleMatrix);
        circle.setAttribute('transform', newMatrix);
        updateRadius(circle, -dx / 2);

        var swMatrix = getMatrix(scalerSW);
        swMatrix[4] = getAbsoluteX(scalerSW) + dx;
        scalerSW.setAttribute('transform', matrixToString(swMatrix));
        updateXY(scalerSW, dx, 0);

        var neMatrix = getMatrix(scalerNE);
        neMatrix[5] = getAbsoluteY(scalerNE) + dy;
        scalerNE.setAttribute('transform', matrixToString(neMatrix));
        updateXY(scalerNE, 0, dy);

        var nMatrix = getMatrix(lineN);
        nMatrix[4] = getAbsoluteX(lineN) + dx / 2;
        nMatrix[5] = getAbsoluteY(lineN) + dy;
        nMatrix[0] = rate;
        nMatrix[3] = rate;
        lineN.setAttribute('transform', matrixToString(nMatrix));
        updateXY(lineN, dx / 2, dy);

        var wMatrix = getMatrix(lineW);
        wMatrix[4] = getAbsoluteX(lineW) + dx;
        wMatrix[5] = getAbsoluteY(lineW) + dy / 2;
        wMatrix[0] = rate;
        wMatrix[3] = rate;
        lineW.setAttribute('transform', matrixToString(wMatrix));
        updateXY(lineW, dx, dy / 2);

        var sMatrix = getMatrix(lineS);
        sMatrix[4] = getAbsoluteX(lineS) + dx / 2;
        sMatrix[0] = rate;
        sMatrix[3] = rate;
        lineS.setAttribute('transform', matrixToString(sMatrix));
        updateXY(lineS, dx / 2, 0);

        var eMatrix = getMatrix(lineE);
        eMatrix[5] = getAbsoluteY(lineE) + dy / 2;
        eMatrix[0] = rate;
        eMatrix[3] = rate;
        lineE.setAttribute('transform', matrixToString(eMatrix));
        updateXY(lineE, 0, dy / 2);
    } else if (scalerId == 'ne') {
        var rate = (getRadius(circle) + dx / 2) / getBaseRadius(circle);

        circleMatrix[0] = rate;
        circleMatrix[3] = rate;
        circleMatrix[4] = getAbsoluteX(circle) + dx / 2;
        circleMatrix[5] = getAbsoluteY(circle) + dy / 2;
        newMatrix = matrixToString(circleMatrix);
        circle.setAttribute('transform', newMatrix);
        updateRadius(circle, dx / 2);

        var nwMatrix = getMatrix(scalerNW);
        nwMatrix[5] = getAbsoluteY(scalerNW) + dy;
        scalerNW.setAttribute('transform', matrixToString(nwMatrix));
        updateXY(scalerNW, 0, dy);

        var seMatrix = getMatrix(scalerSE);
        seMatrix[4] = getAbsoluteX(scalerSE) + dx;
        scalerSE.setAttribute('transform', matrixToString(seMatrix));
        updateXY(scalerSE, dx, 0);

        var nMatrix = getMatrix(lineN);
        nMatrix[4] = getAbsoluteX(lineN) + dx / 2;
        nMatrix[5] = getAbsoluteY(lineN) + dy;
        nMatrix[0] = rate;
        nMatrix[3] = rate;
        lineN.setAttribute('transform', matrixToString(nMatrix));
        updateXY(lineN, dx / 2, dy);

        var wMatrix = getMatrix(lineW);
        wMatrix[5] = getAbsoluteY(lineW) + dy / 2;
        wMatrix[0] = rate;
        wMatrix[3] = rate;
        lineW.setAttribute('transform', matrixToString(wMatrix));
        updateXY(lineW, 0, dy / 2);

        var sMatrix = getMatrix(lineS);
        sMatrix[4] = getAbsoluteX(lineS) + dx / 2;
        sMatrix[0] = rate;
        sMatrix[3] = rate;
        lineS.setAttribute('transform', matrixToString(sMatrix));
        updateXY(lineS, dx / 2, 0);

        var eMatrix = getMatrix(lineE);
        eMatrix[4] = getAbsoluteX(lineE) + dx;
        eMatrix[5] = getAbsoluteY(lineE) + dy / 2;
        eMatrix[0] = rate;
        eMatrix[3] = rate;
        lineE.setAttribute('transform', matrixToString(eMatrix));
        updateXY(lineE, dx, dy / 2);
    } else if (scalerId == 'se') {
        var rate = (getRadius(circle) + dx / 2) / getBaseRadius(circle);

        circleMatrix[0] = rate;
        circleMatrix[3] = rate;
        circleMatrix[4] = getAbsoluteX(circle) + dx / 2;
        circleMatrix[5] = getAbsoluteY(circle) + dy / 2;
        newMatrix = matrixToString(circleMatrix);
        circle.setAttribute('transform', newMatrix);
        updateRadius(circle, dx / 2);

        var swMatrix = getMatrix(scalerSW);
        swMatrix[5] = getAbsoluteY(scalerSW) + dy;
        scalerSW.setAttribute('transform', matrixToString(swMatrix));
        updateXY(scalerSW, 0, dy);

        var neMatrix = getMatrix(scalerNE);
        neMatrix[4] = getAbsoluteX(scalerNE) + dx;
        scalerNE.setAttribute('transform', matrixToString(neMatrix));
        updateXY(scalerNE, dx, 0);

        var nMatrix = getMatrix(lineN);
        nMatrix[4] = getAbsoluteX(lineN) + dx / 2;
        nMatrix[0] = rate;
        nMatrix[3] = rate;
        lineN.setAttribute('transform', matrixToString(nMatrix));
        updateXY(lineN, dx / 2, 0);

        var wMatrix = getMatrix(lineW);
        wMatrix[5] = getAbsoluteY(lineW) + dy / 2;
        wMatrix[0] = rate;
        wMatrix[3] = rate;
        lineW.setAttribute('transform', matrixToString(wMatrix));
        updateXY(lineW, 0, dy / 2);

        var sMatrix = getMatrix(lineS);
        sMatrix[4] = getAbsoluteX(lineS) + dx / 2;
        sMatrix[5] = getAbsoluteY(lineS) + dy;
        sMatrix[0] = rate;
        sMatrix[3] = rate;
        lineS.setAttribute('transform', matrixToString(sMatrix));
        updateXY(lineS, dx / 2, dy);

        var eMatrix = getMatrix(lineE);
        eMatrix[4] = getAbsoluteX(lineE) + dx;
        eMatrix[5] = getAbsoluteY(lineE) + dy / 2;
        eMatrix[0] = rate;
        eMatrix[3] = rate;
        lineE.setAttribute('transform', matrixToString(eMatrix));
        updateXY(lineE, dx, dy / 2);
    } else if (scalerId == 'sw') {
        var rate = (getRadius(circle) - dx / 2) / getBaseRadius(circle);

        circleMatrix[0] = rate;
        circleMatrix[3] = rate;
        circleMatrix[4] = getAbsoluteX(circle) + dx / 2;
        circleMatrix[5] = getAbsoluteY(circle) + dy / 2;
        newMatrix = matrixToString(circleMatrix);
        circle.setAttribute('transform', newMatrix);
        updateRadius(circle, -dx / 2);

        var nwMatrix = getMatrix(scalerNW);
        nwMatrix[4] = getAbsoluteX(scalerNW) + dx;
        scalerNW.setAttribute('transform', matrixToString(nwMatrix));
        updateXY(scalerNW, dx, 0);

        var seMatrix = getMatrix(scalerSE);
        seMatrix[5] = getAbsoluteY(scalerSE) + dy;
        scalerSE.setAttribute('transform', matrixToString(seMatrix));
        updateXY(scalerSE, 0, dy);

        var nMatrix = getMatrix(lineN);
        nMatrix[4] = getAbsoluteX(lineN) + dx / 2;
        nMatrix[0] = rate;
        nMatrix[3] = rate;
        lineN.setAttribute('transform', matrixToString(nMatrix));
        updateXY(lineN, dx / 2, 0);

        var wMatrix = getMatrix(lineW);
        wMatrix[4] = getAbsoluteX(lineW) + dx;
        wMatrix[5] = getAbsoluteY(lineW) + dy / 2;
        wMatrix[0] = rate;
        wMatrix[3] = rate;
        lineW.setAttribute('transform', matrixToString(wMatrix));
        updateXY(lineW, dx, dy / 2);

        var sMatrix = getMatrix(lineS);
        sMatrix[4] = getAbsoluteX(lineS) + dx / 2;
        sMatrix[5] = getAbsoluteY(lineS) + dy;
        sMatrix[0] = rate;
        sMatrix[3] = rate;
        lineS.setAttribute('transform', matrixToString(sMatrix));
        updateXY(lineS, dx / 2, dy);

        var eMatrix = getMatrix(lineE);
        eMatrix[5] = getAbsoluteY(lineE) + dy / 2;
        eMatrix[0] = rate;
        eMatrix[3] = rate;
        lineE.setAttribute('transform', matrixToString(eMatrix));
        updateXY(lineE, 0, dy / 2);
    }

    radiusInfo.html(circle.getAttribute('radius'));
};

var scaleTo = function (targetRadius) {
    if (!isNode(selectedElement)) {
        return;
    }
    var mutator = selectedElement.children[2];
    var circle = selectedElement.children[0];
    var circleMatrix = getMatrix(circle);

    // change scaler position
    var scaler = mutator.children[0];

    // check which is current scaler
    var scalerNE = scaler.children[2];
    var scalerSE = scaler.children[0];
    var scalerNW = scaler.children[1];
    var scalerSW = scaler.children[3];

    var lineN = scaler.children[4];
    var lineW = scaler.children[5];
    var lineE = scaler.children[6];
    var lineS = scaler.children[7];

    var dr = parseFloat(targetRadius) - getRadius(circle);
    var rate = parseFloat(targetRadius) / getBaseRadius(circle);

    circleMatrix[0] = rate;
    circleMatrix[3] = rate;
    newMatrix = matrixToString(circleMatrix);
    circle.setAttribute('transform', newMatrix);
    updateRadius(circle, dr);

    var swMatrix = getMatrix(scalerSW);
    swMatrix[4] = getAbsoluteX(scalerSW) - dr;
    swMatrix[5] = getAbsoluteY(scalerSW) + dr;
    scalerSW.setAttribute('transform', matrixToString(swMatrix));
    updateXY(scalerSW, -dr, dr);

    var nwMatrix = getMatrix(scalerNW);
    nwMatrix[4] = getAbsoluteX(scalerNW) - dr;
    nwMatrix[5] = getAbsoluteY(scalerNW) - dr;
    scalerNW.setAttribute('transform', matrixToString(nwMatrix));
    updateXY(scalerNW, -dr, -dr);

    var neMatrix = getMatrix(scalerNE);
    neMatrix[4] = getAbsoluteX(scalerNE) + dr;
    neMatrix[5] = getAbsoluteY(scalerNE) - dr;
    scalerNE.setAttribute('transform', matrixToString(neMatrix));
    updateXY(scalerNE, dr, -dr);

    var seMatrix = getMatrix(scalerSE);
    seMatrix[4] = getAbsoluteX(scalerSE) + dr;
    seMatrix[5] = getAbsoluteY(scalerSE) + dr;
    scalerSE.setAttribute('transform', matrixToString(seMatrix));
    updateXY(scalerSE, dr, dr);

    var nMatrix = getMatrix(lineN);
    nMatrix[5] = getAbsoluteY(lineN) - dr;
    nMatrix[0] = rate;
    nMatrix[3] = rate;
    lineN.setAttribute('transform', matrixToString(nMatrix));
    updateXY(lineN, 0, -dr);

    var wMatrix = getMatrix(lineW);
    wMatrix[4] = getAbsoluteX(lineW) - dr;
    wMatrix[0] = rate;
    wMatrix[3] = rate;
    lineW.setAttribute('transform', matrixToString(wMatrix));
    updateXY(lineW, -dr, 0);

    var sMatrix = getMatrix(lineS);
    sMatrix[5] = getAbsoluteY(lineS) + dr;
    sMatrix[0] = rate;
    sMatrix[3] = rate;
    lineS.setAttribute('transform', matrixToString(sMatrix));
    updateXY(lineS, 0, dr);

    var eMatrix = getMatrix(lineE);
    eMatrix[4] = getAbsoluteX(lineE) + dr;
    eMatrix[0] = rate;
    eMatrix[3] = rate;
    lineE.setAttribute('transform', matrixToString(eMatrix));
    updateXY(lineE, dr, 0);
};