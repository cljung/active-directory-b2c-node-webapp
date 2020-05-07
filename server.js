/*
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
*  See LICENSE in the source repository root for complete license information.
*/

const express = require('express');
const morgan = require('morgan');
const path = require('path');

//initialize express.
const app = express();

// Initialize variables.
var port = 3000; // process.env.PORT || 3000;

// Configure morgan module to log all requests.
app.use(morgan('dev'));

var wwwRoot = 'wwwroot';

process.argv.forEach(function (val, index, array) {
    if ( '--path' == val || '--wwwroot' == val ) {
        wwwRoot = process.argv[index+1];
    }
    if ( '--port' == val || '-p' == val ) {
        port = parseInt(process.argv[index+1]);
    }
  });

console.log('wwwroot: ' + wwwRoot);
// Set the front-end folder to serve public assets.
//app.use(express.static('JavaScriptSPA'))
app.use(express.static(wwwRoot))

// Set up a route for index.html.
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Start the server.
app.listen(port);
console.log('Listening on port ' + port + '...');
