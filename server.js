#!/usr/bin/env node
'use strict';
const expressApp = require('express')();
const authMiddleware = require('./src/authenticate');
const paramParser = require('./src/params');
const proxyRequest = require('./src/proxy');
const serverPort = process.env.PORT || 8080;

expressApp.enable('trust proxy');
expressApp.get('/', authMiddleware, paramParser, proxyRequest);
expressApp.get('/favicon.ico', (req, res) => res.status(204).end());
expressApp.listen(serverPort, () => console.log(`Listening on ${serverPort}`));
