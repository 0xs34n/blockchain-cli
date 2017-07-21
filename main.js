#!/usr/bin/env node
const vorpal = require('vorpal')();
vorpal.use(require('./lib/cli'))
