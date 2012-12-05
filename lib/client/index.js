/**
 * Git clients
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var Github = require('./github').Github;

/**
 * Get a git-based system client.
 * TODO : Will be per project configuration level and not in the mirror one.
 * @param config, the config.json source or destination client element
 */
function getClient(config) {
  return new Github(config.config);
}

exports.getClient = getClient;