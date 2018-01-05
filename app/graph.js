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
    while(V.length <= v){
        V.push(-1);
        E.push([]);
        E_shape.push([]);
    }
    V[v] = node;
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

var deleteEdge = function(u,v){
    var degU = E[u].length;
    var degV = E[v].length;
    for(i=0; i<degU; i++){
        if(E[v][i]==u){
            E[v].splice(i, 1);
            E_shape[v].splice(i,1);
            break;
        }
    }

    for(i=0; i<degV; i++){
        if(E[u][i]==v){
            E[u].splice(i, 1);
            E_shape[u].splice(i,1);
            break;
        }
    }
};

var generateGraphFromXml = function(){
    E = [];
    E_shape = [];
    vacantPositions = [];
    V = [];
    for(child of svg.children){
        if(isNode(child)){
            var id = parseInt(child.getAttribute('id'));
            addVertex(id, child);
            console.log(id);
        }
    }

    for(child of svg.children){
        if(isEdge(child.children[0])){
            var u = parseInt(child.children[0].getAttribute('v1'));
            var v = parseInt(child.children[0].getAttribute('v2'));
            addEdge(u,v,child);
        }
    }

    var max = 0;
    for(i=0; i<V.length; i++){
        if(V[i]==-1){
            console.log(i);
            vacantPositions.push(i);
        }else{
            if(max<i){
                max = i;
            }
            console.log('max: '+i);
        }
    }
    serialId = max+1;
    console.log(serialId);
};