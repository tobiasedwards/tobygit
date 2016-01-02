var fs = require('fs');
var path = require('path');
var process = require('process');

module.exports = {
  /* The name of the tobygit directory */
  TOBYGIT_DIR: '.tgit',

  /* Returns the directory path from which the script was called */
  workingDir: function() {
    return process.cwd();
  },

  /* Returns the path to the nearest tobygit directory.
   * The directories searched are the current working directory and
   * its parents.
   * Null is returned if there is no tobygit directory found.
   */
  tobygitDirPath: function() {
    var current = this.workingDir();

    while (current != '/') {
      if (fs.readdirSync(current).indexOf(this.TOBYGIT_DIR) != -1) {
        // TODO: Handle case if .tgit is a file not a dir
        return path.join(current, this.TOBYGIT_DIR);
      } else {
        current = path.join(current, '..');
      }
    }

    return null;
  },

  /* Returns the current projects root path (or null if not in a project) */
  projectRootPath: function() {
    var tobygitDirPath = this.tobygitDirPath();

    if (tobygitDirPath != null) {
      return path.join(tobygitDirPath, '..');
    }

    return null;
  },

  /* Creates the tobygit directory and appropriate subdirectories
   * in the current working directory.
   */
  createTobygitDir: function() {
    var tobygitDirPath = path.join(this.workingDir(), this.TOBYGIT_DIR)
    fs.mkdirSync(tobygitDirPath);
    fs.mkdirSync(path.join(tobygitDirPath, 'objects'));
  },
};
