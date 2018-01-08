/**
 * @author tpan496
 * Script that deals with graph-related manipulations.
 */

var svg;
var V = [];
var E = [];
var E_in = [];
var E_out = [];
var vacantPositions = [];
var E_shape = [];

/**
 * Returns a reusable serial id. If there is no reusable one,
 * return -1.
 */
var getReusableId = function () {
    if (vacantPositions.length > 0) {
        return vacantPositions.pop();
    } else {
        return -1;
    }
};

/**
 * Adds a new graph node(vertex)
 * @param {serial id} v 
 * @param {node object} node 
 */
var addVertex = function (v, node) {
    while (V.length <= v) {
        V.push(-1);
        E.push([]);
        E_in.push([]);
        E_out.push([]);
        E_shape.push([]);
    }
    V[v] = node;
};

/**
 * Adds a new edge
 * @param {out vertex} u 
 * @param {in vertex} v 
 * @param {edge object} line 
 */
var addEdge = function (u, v, line) {
    E[u].push(v);
    E[v].push(u);
    E_shape[u].push(line);
    E_shape[v].push(line);

    E_out[u].push(v);
    E_in[v].push(u);
    console.log([u, v]);
    console.log(E_out);
};

/**
 * Returns all the edges of a vertex
 * @param {vertex} v 
 */
var getEdges = function (v) {
    return E_shape[v];
};

/**
 * Removes a vertex from graph
 * @param {vertex} v 
 */
var deleteVertex = function (v) {
    V[v] = -1;
    var degV = E[v].length;
    for (i = 0; i < degV; i++) {
        var u = E[v][i];
        var degU = E[u].length;
        var outDegU = E_out[u].length;
        var inDegU = E_in[u].length;
        for (j = 0; j < degU; j++) {
            if (E[u][j] == v) {
                E[u].splice(j, 1);
                E_shape[u].splice(j, 1);
                console.log("delete " + v + " from " + u);
                console.log(u + ": " + E[u]);
                break;
            }
        }
        for (j = 0; j < outDegU; j++) {
            if (E_out[u][j] == v) {
                E_out[u].splice(j, 1);
                break;
            }
        }
        for (j = 0; j < inDegU; j++) {
            if (E_in[u][j] == v) {
                E_in[u].splice(j, 1);
                break;
            }
        }
        svg.removeChild(E_shape[v][i]);
    }
    E[v] = [];
    E_shape[v] = [];
    E_out[v] = [];
    E_in[v] = [];
    V[v] = 0;
    vacantPositions.push(v);
};

/**
 * Deletes an edge from the graph
 * @param {out vertex} u 
 * @param {in vertex} v 
 */
var deleteEdge = function (u, v) {
    console.log(E_out);
    var degU = E[u].length;
    var degV = E[v].length;
    for (i = 0; i < degV; i++) {
        if (E[v][i] == u) {
            E[v].splice(i, 1);
            E_shape[v].splice(i, 1);
            break;
        }
    }

    for (i = 0; i < degU; i++) {
        if (E[u][i] == v) {
            E[u].splice(i, 1);
            E_shape[u].splice(i, 1);
            break;
        }
    }

    var outDegU = E_out[u].length;
    var inDegV = E_in[v].length;
    for (i = 0; i < outDegU; i++) {
        if (E_out[u][i] == v) {
            E_out[u].splice(i, 1);
            break;
        }
    }

    for (i = 0; i < inDegV; i++) {
        if (E_in[v][i] == u) {
            E_in[v].splice(i, 1);
            break;
        }
    }

    console.log(E_out);
};

/**
 * Generates a new graph from loaded xml file
 */
var generateGraphFromXml = function () {
    E = [];
    E_out = [];
    E_in = [];
    E_shape = [];
    vacantPositions = [];
    V = [];
    for (child of svg.children) {
        if (isNode(child)) {
            var id = child.getAttribute('id');
            addVertex(id, child);
        }
    }

    var isDirected = true;
    var findEdge = false;
    for (child of svg.children) {
        if (isEdge(child.children[0])) {
            var u = child.children[0].getAttribute('v1');
            var v = child.children[0].getAttribute('v2');
            addEdge(u, v, child);
            if(!findEdge && child.children[1].getAttribute('visibility') == 'hidden'){
                isDirected = false;
            }
            findEdge = true;
        }
    }

    var max = 0;
    for (i = 0; i < V.length; i++) {
        if (V[i] == -1) {
            vacantPositions.push(i);
        } else {
            if (max < i) {
                max = i;
            }
        }
    }
    serialId = max + 1;

    if(isDirected){
        if(!directedOn){
            toggleDirected($('#directed'));
        }
    }else{
        if(directedOn){
            toggleDirected($('#directed'));
        }
    }
};