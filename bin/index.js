#!/usr/bin/env node
require('yargs')
    .commandDir('../commands')
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;
