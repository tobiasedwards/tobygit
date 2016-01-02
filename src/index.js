var dir = require('./dir');
var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');

module.exports = {
  /* Entries (files, dirs) which are not indexed */
  IGNORED_ENTRIES: [dir.TOBYGIT_DIR, '.git', 'node_modules'],

  /* Indexes a blob (file) and calls the provided callback with
   * the arguments (err, blob).
   */
  indexBlob: function(blobPath, callback) {
    var blob = {type: 'blob'};

    fs.readFile(blobPath, function(err, data) {
      if (err) {
        callback(err, null);
        return;
      }

      blob.contents = data.toString();
      callback(null, blob);
    });
  },

  /* Indexes a tree (directory) and calls the provided callback with the
   * arguments (err, tree).
   */
  indexTree: function(treePath, callback) {
    var tree = {type: 'tree'};

    var entries = fs.readdirSync(treePath);
    this.recursivelyIndexEntries(treePath, null, entries,
      function(err, objects) {

      if (err) {
        callback(err, null);
        return;
      }

      tree.objects = objects;
      callback(null, tree);
    });
  },

  /* Indexes an object to be added to a tree. The provided callback is called
   * with the arguments (err, object).
   */
  indexObject: function(objectPath, callback) {
    var stats = fs.lstatSync(objectPath);
    if (stats.isDirectory()) {
      this.indexTree(objectPath, callback);
    } else if (stats.isFile()) {
      this.indexBlob(objectPath, callback);
    }
  },

  /* Processes an object and calls the provided callback with the arguments
   * (err, processed), where processed is a javascript object that
   * contains metadata about the object.
   */
  processObject: function(name, object, callback) {
    var contents = JSON.stringify(object);
    var hash = sha1(contents);

    var objectFilePath = path.join(dir.tobygitDirPath(), 'objects', hash);
    fs.open(objectFilePath, 'w', function(err, fd) {
      if (err) {
        callback(err, null);
        return;
      }

      fs.write(fd, contents, function(err, written, string) {
        if (err) {
          callback(err, null);
          return;
        }

        var processed = {
          name: name,
          hash: hash
        };

        callback(null, processed);
      });
    });


  },

  /* Recursively indexes each entry in an array of entries and then calls
   * the callback provieded with the arguments (err, object).
   */
  recursivelyIndexEntries: function(basePath, objects, entries, callback) {
    var objects = objects || [];

    // When we have indexed all entries execute the callback
    if (entries.length == 0) {
      callback(null, objects);
      return;
    }

    var entry = entries[0];

    // If the entry is in the ignore array
    if (this.IGNORED_ENTRIES.indexOf(entry) !== -1) {
      this.recursivelyIndexEntries(basePath, objects,
        entries.slice(1), callback);
      return;
    }

    var objectPath = path.join(basePath, entry);
    this.indexObject(objectPath, function(err, object) {
      if (err) {
        callback(err, null);
        return;
      }

      this.processObject(entry, object, function(err, processed) {
        objects.push(processed);
        this.recursivelyIndexEntries(basePath, objects,
          entries.slice(1), callback);
      }.bind(this));
    }.bind(this));
  },
};
