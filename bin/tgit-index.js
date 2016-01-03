#! /usr/bin/env node

var dir = require('../src/dir')
var index = require('../src/index');
var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');

if (dir.tobygitDirPath() !== null) {
  index.indexTree(dir.projectRootPath(), function(err, tree) {
    index.processObject('root', tree, function(err, processed) {
      var head = {
        type: 'ref',
        tree: processed.hash
      };

      var headPath = path.join(dir.tobygitDirPath(), 'head');

      fs.open(headPath, 'w', function(err, fd) {
        if (err) {
          console.error(err);
          return;
        }

        fs.write(fd, JSON.stringify(head), function(err, written, string) {
          if (err) {
            console.error(err);
            return;
          }

          console.log('indexing complete');
        });
      });
    });
  });
} else {
  console.error('tobygit has not been initialised\ntry running tgit-init');
}
