#!/usr/bin/env node --harmony
const vorpal = require('vorpal')();
vorpal.use(require('./lib/cli'))
