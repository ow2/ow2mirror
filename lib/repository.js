/**
 * Project class. Handle all the mirror stuff.
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var git = require('./utils/git')
  , utils = require('./utils/utils')
  , context = require('./context')
  , gitclient = require('./client')
  , async = require('async')
  , fs = require('fs')
  , path = require('path');

/**
 *
 * @param project a repository always belongs to a project
 * @param config all the config stuff for the repository
 * @constructor
 */
var Repository = function Repository(project_name, config) {
  if (!config) {
    throw new Error('Config must not be null');
  }
  this._project = project_name;
  this._name = config.name;
  this._config = config;
  return this;
}
exports.Repository = Repository;

/**
 * Create all the file system stuff to work with repository, save config files...
 */
Repository.prototype.initialize = function() {
  fs.writeFileSync(this.getRepositoryConfigFile(), JSON.stringify(this._config, null, 2), 'utf-8');
  return this;
}

/**
 * Initialize a new repository : Create all the required stuff...
 */
Repository.prototype.initializeGit = function(cb) {
  // TODO : Assert that initialize() has been called

  console.log('Mirroring repository :', this._name);
  var self = this;

  this.clone(function(err) {
    if (!err) {
      self.createDestination(function(err) {
        if (err) {
          console.log('Error while initializing repository', self._name);
          cb(err);
        } else {
          console.log('Repository created, lets mirror', self._name);
          self.mirror(function(err) {
            cb(err);
          });
        }
      });
    } else {
     // clone failed, abort!
      console.log('Clone failed', err);
      cb(err);
    }
  });
}

/**
 * Clone the repository to the folder.
 */
Repository.prototype.clone = function(cb) {
  var self = this;

  console.log('Creating mirror of ' + this._config.source + ' into ' + this.getGitRepositoryFolder());
  git.bareClone(this.getGitRepositoryFolder(), this._config.source, function() {
    console.log('Mirror has been created for repository', self._name);
    if (cb) cb();
  })
}

/**
 * Configure the repository in order to be mirrored...
 */
Repository.prototype.configure = function() {
  console.log('Configure the repository for mirroring...');
  if (!this._config.destination) {
    console.log('WARNING : destination is not available in the repository config!');
  }

  git.addRemote(this.getGitRepositoryFolder(), this._config.destination, 'mirror', function() {
    console.log('Git Repository has been configured for mirroring');
  });
}

/**
 * Creates the new destination using the client.
 *
 * @param cb
 */
Repository.prototype.createDestination = function(cb) {
  var self = this;

  var client = gitclient.getClient(context.conf.destination);
  console.log('Creating the destination repository', this._name);
  console.log('In project', this._project);

  client.createRepository(this._project, this._name, 'Mirror of ' + this._name, function(err, res) {
    if (err) {
      console.log('Error while creating repository!', err);
    } else {
      self._config.destination = res.ssh_url;
      self.saveConfig();
      self.configure();
      // TODO : save the config file with the new output remote
    }
    if (cb) cb(err);
  });
}

/**
 * Mirror the repository. Assume that the repository has already been cloned.
 * TODO : Check that all is available before mirror
 *
 */
Repository.prototype.mirror = function(cb) {
  var self = this;

  async.series([
    git.fetch(this.getGitRepositoryFolder(), function() {
      console.log('Repository has been fetched', self._name);
    }),
    git.push(this.getGitRepositoryFolder(), 'mirror', function() {
      console.log('Repository has been pushed to mirror', self._name);
      if (cb) cb();
    })
  ],
    function(err, results){
      cb(err);
    }
  );
}

Repository.prototype.saveConfig = function() {
  fs.writeFileSync(this.getRepositoryConfigFile(), JSON.stringify(this._config, null, 2), 'utf-8');
}

Repository.prototype.getGitRepositoryFolder = function() {
  return context.getGitRepositoryFolder(this._project, this._name);
}

Repository.prototype.getRepositoriesFolder = function() {
  return context.getRepositoriesFolder(this._project);
}

Repository.prototype.getRepositoryConfigFile = function() {
  return context.getRepositoryConfigFile(this._project, this._name);
}