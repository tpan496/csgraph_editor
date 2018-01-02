var svg;
var V = [];
var E = [];
var vacantPositions = [];
var E_shape = [];

var getReusableId = function () {
    if (vacantPositions.length > 0) {
        return vacantPositions.pop();
    } else {
        return -1;
    }
};

var addVertex = function (v, node) {
    if (v < V.length) {
        V[v] = node;
    } else {
        V.push(node);
        E.push([]);
        E_shape.push([]);
    }
};

var addEdge = function (u, v, line) {
    E[u].push(v);
    E[v].push(u);
    E_shape[u].push(line);
    E_shape[v].push(line);
    console.log([u, v]);
};

var getEdges = function (v) {
    return E_shape[v];
};

var deleteVertex = function (v) {
    V[v] = -1;
    var degV = E[v].length;
    for (i = 0; i < degV; i++) {
        var u = E[v][i];
        var degU = E[u].length;
        for (j = 0; j < degU; j++) {
            if (E[u][j] == v) {
                E[u].splice(j, 1);
                E_shape[u].splice(j, 1);
                console.log("delete "+v+" from "+u);
                console.log(u+": "+E[u]);
                break;
            }
        }
        svg.removeChild(E_shape[v][i]);
    }
    E[v] = [];
    E_shape[v] = [];
    V[v] = 0;
    vacantPositions.push(v);
};