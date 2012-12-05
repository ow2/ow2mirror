/**
 * Send IRC message to notify about status
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var init = function(config) {
  _connect(config);
}
exports.init = init;

var success = function(project, repo, message, cb) {
  console.log('Sending IRC success message');
  _send('Mirroring Success', message, cb);
}
exports.success = success;

var failure = function(project, repo, message, cb) {
  console.log('Sending IRC failure message');
  _send('Mirroring Failure', message, cb);
}
exports.failure = failure;

var _send = function(title, message, cb) {
  if (cb) cb();
}

/**
 * Connect to the IRC channel
 */
var _connect = function(config) {

}