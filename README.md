# tobygit
Toby's javascript git implementation.

I had attempted to write an implementation of git using node.js to give myself a deeper understanding of git internals. This is still something I will try to do in the future but currently it's at a bit of a stand still.

## Current Features
### Initialisation: [`tgit-init`](https://github.com/tobiasedwards/tobygit/blob/master/bin/tgit-init.js)
Creates the [`.tgit/`](https://github.com/tobiasedwards/tobygit/tree/master/.tgit) directory in the directory where the command is called.
### Indexing: [`tgit-index`](https://github.com/tobiasedwards/tobygit/blob/master/bin/tgit-index.js)
Indexes all files and directories as blobs and trees and saves these as JSON
objects in the [`.tgit/objects/`](https://github.com/tobiasedwards/tobygit/blob/master/bin/tgit-index.js) directory.
### Reconsturcting: [`tgit-reconstruct`](https://github.com/tobiasedwards/tobygit/blob/master/bin/tgit-reconstruct.js)
Reconstructs the directories and files in the project from the objects saved
in the [`.tgit/objects/`](https://github.com/tobiasedwards/tobygit/blob/master/bin/tgit-index.js) directory.
