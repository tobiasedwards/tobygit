#! /usr/bin/env node

var dir = require('../src/dir');
var reconstruct = require('../src/reconstruct');
var fs = require('fs');
var path = require('path');

if (dir.tobygitDirPath() !== null) {
  fs.readFile(path.join(dir.tobygitDirPath(), 'head'), function(err, data) {
    var head = JSON.parse(data.toString());

    reconstruct.loadObject(head.tree, function(err, tree) {
      reconstruct.reconstructTree(tree, dir.workingDir(), function(err) {
        if (err) {
          console.error(err);
          return;
        }

        console.log('reconstructing complete');
      });
    });
  });
} else {
  console.error('tobygit has not been initialised');
}
