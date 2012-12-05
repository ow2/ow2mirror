/**
 * Store reports in mongo
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var init = function(config) {
  _connect(config);
}
exports.init = init;

var success = function(project, repo, message, cb) {
  _store('Mirroring Success', message, cb);
}
exports.success = success;

var failure = function(project, repo, message, cb) {
  _store('Mirroring Failure', message, cb);
}
exports.failure = failure;

var _store = function(title, message, cb) {
  if (cb) cb();
}

var _connect = function(config) {

}