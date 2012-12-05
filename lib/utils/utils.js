/**
 * Utilities
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var path = require('path')
  , fs = require('fs');

// Node shims for < v0.7
fs.existsSync = fs.existsSync || path.existsSync;

/**
 * Recursively create folders...
 *
 * @param dir
 */
function mkdirSyncRecursive(dir) {
  console.log('mkdir ', dir);

  if (fs.existsSync(dir)) {
    return;
  }

  var baseDir = path.dirname(dir);
  // Base dir exists, no recursion necessary
  if (fs.existsSync(baseDir)) {
    fs.mkdirSync(dir, 0777);
    return;
  }

  // Base dir does not exist, go recursive
  mkdirSyncRecursive(baseDir);

  // Base dir created, can create dir
  fs.mkdirSync(dir, 0777);
};

exports.mkdirSyncRecursive = mkdirSyncRecursive;