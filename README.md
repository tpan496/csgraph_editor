# CS Graph Diagram Editor

Javascript web app for creating mathematical/computer science graph diagrams. Support basic shape manipulations(translation, scaling), edge tracking for graphs, PNG/XML export.
<br />The app is inside 'app' folder, the rest being backend related files.
<br />External libraries: jQuery, [jQueryHotKeys](https://github.com/jeresig/jquery.hotkeys), [saveSvgAsPng](https://github.com/exupero/saveSvgAsPng)
<br />Site: [csgraph.io](https://csgraph.io)
![alt text](screenshot.png)

## Use

Create nodes(vertices)/labels from left-side tool bar. Connect nodes by draggin the centered green button inside the node to targeted node. Once nodes are connected you can move them freely around as the edges would follow their connected vertices. You can also change the detailed paratemers of objects from the right-hand-side information panel.

## Note
Due to transform-origin different implementations in browsers, scaling is not yet supported in Safari. It should work with latest version of Chrome/FireFox/Edge
