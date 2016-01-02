# tobygit
Toby's javascript git implementation.

## Current Features
### Initialisation: [`tgit-init`](https://github.com/tobiasedwards/tobygit/blob/master/bin/tgit-init.js)
Creates the [`.tgit/`](https://github.com/tobiasedwards/tobygit/tree/master/.tgit) directory in the directory where the command is called.
### Indexing: [`tgit-index`](https://github.com/tobiasedwards/tobygit/blob/master/bin/tgit-index.js)
Indexes all files and directories as blobs and trees and saves these as JSON
objects in the [`.tgit/objects/`](https://github.com/tobiasedwards/tobygit/tree/master/.tgit/objects) directory.
