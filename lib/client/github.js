/**
 * Github Client implementation
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var config = require('../context')
  , GitHubApi = require("github");

/**
 * @param the config hash with login and password
 *
 * @constructor
 */
var Github = function Github(config) {
  this._config = config;
}
exports.Github = Github;

/**
 * Get a github client
 *
 * @return {GitHubApi}
 */
Github.prototype._getClient = function() {
  var github = new GitHubApi( {
    version: "3.0.0"
  });
  // only basic is supported for now
  github.authenticate({
    type: "basic",
    username: this._config.username,
    password: this._config.password
  });

  return github;
}

/**
 * Create a repository on github
 *
 * @param org
 * @param reponame
 * @param description
 * @param cb
 */
Github.prototype.createRepository = function(project, reponame, description, cb) {
  this._getClient().repos.createFromOrg({
    name : reponame,
    org : project,
    description : description
  }, function(err, res) {
    if (cb) cb(err, res);
  });
}

/**
 * Get all the repositories of an org
 *
 * @param org
 * @param cb
 */
Github.prototype.getRepositories = function(project, cb) {
  //TODO
  if (cb) cb();
}

/**
 * Get all the projects (ie orgs for github)
 *
 * @param cb
 */
Github.prototype.getProjects = function(cb) {
  var client = this._getClient();
  client.user.getOrgs({}, function(err, res) {
    console.log(JSON.stringify(res));
    if (cb) cb(err, res);
  });

}