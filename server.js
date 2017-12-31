var express = require('express');
var port = process.env.PORT || 3000;
var app = require('express')();
app.use(express.static('app'));
var httpServer = require('http').createServer(app);

httpServer.listen(port);