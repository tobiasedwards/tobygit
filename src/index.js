var dir = require('./dir');
var fs = require('fs');
var path = require('path');

module.exports = {
  /* Entries (files, dirs) which are not indexed */
  IGNORED_ENTRIES: [dir.TOBYGIT_DIR],

  /* Indexes directory at given path. A callback function which has the
   * paramaters (err, tree) is then called.
   * // TODO: Refactor
   */
  indexDir: function(dirPath, callback) {
    var tree = {
      type: 'tree',
      trees: {},
      blobs: {}
    };

    fs.readdir(dirPath, function(err, entries) {
      if (err) {
        callback(err, null);
        return;
      }

      entries.forEach(function(entry) {
        console.log(this);
        if (this.IGNORED_ENTRIES.indexOf(entry) === -1) {
          entryPath = path.join(dirPath, entry);

          fs.lstat(entryPath, function(err, stats) {
            if (err) {
              callback(err, null);
              return;
            }

            if (stats.isDirectory()) {
              this.indexDir(entryPath, function(err, t) {
                if (err) {
                  callback(err, null);
                  return;
                }

                tree.trees[entry] = t;
              }.bind(this));
            } else if (stats.isFile()) {
              this.indexFile(entryPath, function(err, blob) {
                if (err) {
                  callback(err, null);
                  return;
                }

                this.blobs[entry] = blob;
              }.bind(this));
            }
          }.bind(this));
        }
      }.bind(this));
    });

    callback(null, tree);
  },

  indexBlob: function(blobPath, callback) {
    var blob = {
      type: 'blob',
      name: path.basename(blobPath)
    };

    callback(null, blob);
  }
}

module.exports.indexDir(dir.workingDir(), function(err, tree) {
  if (err) {
    console.error(err);
  } else {
    console.log(tree);
  }
})
