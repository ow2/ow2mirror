/**
 * All the git commands called with system calls.
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

require('shelljs/global');

/**
 * Checks that that git is installed and that the current version supports all our operations
 * TODO
 */
function check() {
  console.log('Check is not implemented');
}
exports.check = check;

/**
 * Bare Clone the git repository into the given folder. A bare clone creates a repository under dir/repo.git
 * @param folder
 * @param url
 * @param cb
 */
function bareClone(dir, url, cb) {
  console.log('Cloning ' + url + ' into ' + dir);
  console.log('Cloning into ', process.cwd());
  var child = exec('git clone --bare --mirror ' + url + ' ' + dir, function(code, output) {
    console.log('Git bare clone is done for ' + url + ' (code '+ code +')', output);
    if (cb) cb();
  });
}
exports.bareClone = bareClone;

/**
 * Clone
 *
 * @param dir
 * @param url
 * @param cb
 */
function clone(dir, url, cb) {
  console.log('Cloning ' + url + ' into ' + dir);
  var child = exec('git clone ' + url + ' ' + dir, function(code, output) {
    console.log('Git clone is done for ' + url + ' (code '+ code +')', output);
    if (cb) cb();
  });
}
exports.clone = clone;

/**
 * git --git-dir=foo/bar/test.git/ remote add mirror2 http://foo/bar/test.git
 * @param folder
 * @param remote_url
 * @param remote_name
 * @param cb
 */
function addRemote(dir, url, name, cb) {
  console.log('Adding remote ' + name + '/' + url + ' to repository at ' + dir);
  var child = exec('git --git-dir=' + dir + ' remote add ' + name + ' ' + url, function (code, output) {
    console.log('Git remote add is done for ' + url + ' (code '+ code +')', output);
    if (cb) cb();
  });
}
exports.addRemote = addRemote;

/**
 * Fetch sources from origin
 * git --git-dir=foo/bar/test.git/ fetch origin
 * @param dir : Where to cd to be in the git repository folder
 * @param cb
 */
function fetch(dir, cb) {
  console.log('Fetch sources from origin', dir);
  var child = exec('git --git-dir=' + dir + ' fetch origin', function(code, output) {
    console.log('Git fetch is done for ' + dir + ' (code '+ code +')', output);
    if (cb) cb();
  });
}
exports.fetch = fetch;

/**
 * Push sources to remote
 *
 * @param dir : Where to cd to be in the git directory
 * @param remote : The remote name
 * @param cb
 */
function push(dir, remote, cb) {
  console.log('Push sources to remote', remote);
  var child = exec('git --git-dir=' + dir + ' push ' + remote + ' master', function(code, output) {
    console.log('Git push is done for ' + remote + ' (code '+ code +')', output);
    if (code !== 0) {
      // error
      // output is the error
      // send it back...
    }
    if (cb) cb();
  });
}
exports.push = push;

/**
 * Init a git repository in the given folder
 *
 * @param dir
 * @param cb
 */
function init(dir, cb) {
  console.log('Init a git dir in', dir);
  var child = exec('git --git-dir=' + dir + ' init', function(code, output) {
    console.log('Git init is done for ' + dir + ' (code '+ code +')', output);
    if (cb) cb();
  });
}
exports.init = init;