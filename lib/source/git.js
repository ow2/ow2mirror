/**
 * Git based sources. All the configuration files are directly accessible using the git client.
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var context = require('../context')
  , git = require('../utils/git')
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore');

/**
 * Clone the configuration into the configuration folder
 */
var initialize = function(cb) {
  git.clone(context.getConfigFolder(), context.conf.source.config.repository, function() {
    console.log('Configuration files cloned under', context.getConfigFolder());
    if (cb) cb();
  });
}
exports.initialize = initialize;

/**
 * Update the configuration
 *
 * @param cb
 */
var update = function(cb) {
  git.fetch(context.getConfigFolder() + '/.git', function() {
    console.log('Configuration files updated under', context.getConfigFolder());
    if (cb) cb();
  });
}
exports.update = update;

/**
 * Get project names ie get all JSON files
 *
 * @param cb
 */
var getProjects = function(cb) {
  var files = fs.readdirSync(context.getConfigFolder());
  var projects = [];
  _.each(files, function(file) {
    if (path.extname(file) === '.json') {
      projects.push(path.basename(file, '.json'));
    } else {
    }
  });
  cb(projects);
}
exports.getProjects = getProjects;

/**
 * Load project configuration
 *
 * @param name
 * @param cb
 */
var getProjectConfig = function(name) {
  var file = path.join(context.getConfigFolder(), name + '.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
exports.getProjectConfig = getProjectConfig;