/**
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */
var fs = require('fs')
  , path = require('path');

fs.existsSync = fs.existsSync || path.existsSync;

// Export the configuration loaded from the file system
exports.conf = {};

/**
 * Initialize
 * @return context for chaining
 */
exports.init = function init() {
  // settings are used to store data in context as key/value store
  // use context.get and context.set
  this.settings = {};
  loadConfig();
  return this;
}

/**
 *
 * @param key
 * @param value
 * @return {*} context for chaining
 */
exports.set = function set(key, value) {
  this.settings[key] = value;
  return this;
}

/**
 *
 * @param key
 * @return {*}
 */
exports.get = function get(key) {
  return this.settings[key];
}

exports.getConfigFolder = function() {
  return path.join(this.get('root'), 'config');
}

exports.getProjectFolder = function getProjectFolder(name) {
  return path.join(this.get('workspace'), name);
}

exports.getRepositoryConfigFile = function getRepositoryConfigFile(project, name) {
  return path.join(this.getProjectFolder(project), name + '.json');
}

exports.getRepositoriesFolder = function getRepositoriesFolder(project) {
  return path.join(this.getProjectFolder(project), 'repositories');
}

/**
 * Bare repository...
 *
 * @param project
 * @param name
 * @return {*}
 */
exports.getGitRepositoryFolder = function getGitRepositoryFolder(project, name) {
  return path.join(this.getRepositoriesFolder(project), name + '.git');
}

/**
 * Load the configuration from a file.
 *
 * @param file. Read configuration from this file. If not set, check the MIRROR_CONFIG system env.
 * If not set, read the current directory config.json file.
 *
 * @return config hash. Thishash if cached and can be accessed from the conf variable.
 */
function loadConfig(file) {
  var _configPath = file || process.env.MIRROR_CONFIG;

  if (!_configPath || !fs.existsSync(_configPath)) {
    _configPath = path.join(process.cwd(), 'config.json');
  }
  console.log('Using config file from ', _configPath);

  // TODO : Checks that file exists
  var content = JSON.parse(fs.readFileSync(_configPath, 'utf8'));

  console.log('Config used ', JSON.stringify(content));
  exports.conf = content;
  return exports.conf;
};