/**
 * Store failure as issue in github.
 * TODO
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var init = function(config) {
  _connect(config);
}
exports.init = init;

var success = function(project, repo, message, cb) {
}
exports.success = success;

var failure = function(project, repo, message, cb) {
}
exports.failure = failure;

var _connect = function(config) {

}