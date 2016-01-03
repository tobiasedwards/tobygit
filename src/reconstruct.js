var dir = require('./dir');
var fs = require('fs');
var path = require('path');

module.exports = {
  /* Reconstructs a tree at the given path. The callback is given the argument
   * (err).
   */
  reconstructTree: function(tree, treePath, callback) {
    fs.mkdir(treePath, function(err) {
      if (err && err.code !== 'EEXIST') {
        callback(err);
        return;
      }

      this.recursivelyReconstructObjects(treePath, tree.objects, callback);
    }.bind(this));
  },

  /* Reconstructs a blob at the given path. The callback will be given
   * the argument (err).
   */
  reconstructBlob: function(blob, blobPath, callback) {
    fs.open(blobPath, 'w', function(err, fd) {
      if (err) {
        callback(err);
        return;
      }

      fs.write(fd, blob.contents, function(err, written, string) {
        callback(err);
      });
    });
  },

  /* Reconstructs an object (tree or blob) of unknown type. The callback will
   * be given the argument (err).
   */
  reconstructObject: function(objectHash, objectPath, callback) {
    this.loadObject(objectHash, function(err, object) {
      if (err) {
        callback(err);
        return;
      }

      if (object.type === 'tree') {
        this.reconstructTree(object, objectPath, callback);
      } else if (object.type === 'blob') {
        this.reconstructBlob(object, objectPath, callback);
      }
    }.bind(this));
  },

  /* Loads an object with a given hash from the tobygit directory. The callback
   * is given the arguments (err, object).
   */
  loadObject: function(objectHash, callback) {
    var hashPath = path.join(dir.tobygitDirPath(), 'objects', objectHash);
    fs.readFile(hashPath, function(err, data) {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, JSON.parse(data.toString()));
    });
  },

  /* Reconstructs each object in the given objects list. The callback is given
   * the arguments (err).
   */
  recursivelyReconstructObjects: function(treePath, objects, callback) {
    if (objects.length == 0) {
      callback(null);
      return;
    }

    var object = objects[0];
    this.reconstructObject(
      object.hash,
      path.join(treePath, object.name),
      function(err) {

      if (err) {
        callback(err);
        return;
      }

      this.recursivelyReconstructObjects(treePath, objects.slice(1), callback);
    }.bind(this));
  },
};
