/**
 * Git based sources. All the configuration files are directly accessible using the git client.
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var context = require('../context')
  , git = require('./git');

function initialize(cb) {
  require('./' + context.conf.source.type).initialize(cb);
}
exports.initialize = initialize;

function update(cb) {
  require('./' + context.conf.source.type).update(cb);
}
exports.update = update;

function getProjectConfig(name) {
  return require('./' + context.conf.source.type).getProjectConfig(name);
}
exports.getProjectConfig = getProjectConfig;
