#! /usr/bin/env node

var dir = require('../src/dir');

if (dir.tobygitDirPath() === null) {
  dir.createTobygitDir();
  console.log('tobygit initialised');
} else {
  console.log('tobygit directory already exists');
}
