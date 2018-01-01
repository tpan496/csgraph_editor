var V = [];
var E = [];
var E_shape = [];

var addVertex = function(v){
    V.push(v);
    E.push([]);
    E_shape.push([]);
    console.log(v);
};

var addEdge = function(u,v,line){
    E[u].push(v);
    E[v].push(u);
    E_shape[u].push(line);
    E_shape[v].push(line);
    console.log([u,v]);
};

var getEdges = function(v) {
    return E_shape[v];
};