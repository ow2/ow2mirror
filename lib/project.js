/**
 * Project class
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , Repository = require('./repository').Repository
  , git = require('./utils/git')
  , context = require('./context')
  , utils = require('./utils/utils');

// The project configuration file
var PROJECT_CONFIG = 'project.json';

// This file is used to list repositories but also to manage their state
// ie we can unactivate mirroring by setting state to off...
var REPOSITORIES_CONFIG = 'repositories.json'

/**
 *
 * @param name, the project name
 * @constructor
 */
var Project = function Project(name) {
  if (!name) {
    throw new Error('name is required');
  }

  this._name = name;
  this._folder = context.getProjectFolder(this._name);

  // repositories array
  this._repositories = this.loadRepositories();
  return this;
}
exports.Project = Project;

/**
 * Load repositories from repositories.json
 *
 * @return {Object}
 */
Project.prototype.loadRepositories = function() {
  var file = this.getRepositoriesConfigFile();
  var result = [];

  if (fs.existsSync(file)) {
    result = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return result;
}

/**
 * Intialize the project : Creates the folder and its configuration files;
 */
Project.prototype.initialize = function() {
  utils.mkdirSyncRecursive(this._folder);
  utils.mkdirSyncRecursive(context.getRepositoriesFolder(this._name));

  var config = {
    name : this._name,
    created_at : new Date().toGMTString()
  };

  fs.writeFileSync(this.getProjectConfigFile(), JSON.stringify(config, null, 2), 'utf8');
  this.writeRepositories([]);
}

/**
 * Create a new repository mirror ie create all the required stuff
 *
 * @param name
 * @param source_url
 * @param cb
 */
Project.prototype.createMirror = function(name, source_url, cb) {
  // TODO : check that the mirror does not already exist!
  var repo = this.initRepository(name, source_url);
  if (!repo) {
    cb(new Error('Can not create repository' + name));
  } else {
    repo.initializeGit(function(err) {
      cb(err);
    });
  }
}

/**
 * Create a new repository in the project
 *
 * @param folder
 * @param name
 * @param source_url
 * @param target_url
 * @return the newly created repository
 */
Project.prototype.initRepository = function(reponame, source_url) {
  var config = {
    name : reponame,
    project : this._name,
    source : source_url,
    destination : '',
    created_at : new Date().toGMTString(),
    active : true
  }
  var repo = new Repository(this._name, config).initialize();
  this.addRepository(config);
  return repo;
}

/**
 * Add repository to repositories configuration file
 *
 * @param reponame
 * @param source_url
 * @param target_url
 */
Project.prototype.addRepository = function(config) {
  // TODO : Check if the repository is not alreay in the list
  this._repositories.push(config);
  this.writeRepositories(this._repositories);
}

/**
 *
 * @param repositories
 */
Project.prototype.writeRepositories = function(repositories) {
  var reposFile = this.getRepositoriesConfigFile();
  fs.writeFileSync(reposFile, JSON.stringify(repositories, null, 2), 'utf8');
}

/**
 * Get the project configuration from its JSON file
 */
Project.prototype.loadConfig = function() {
  return JSON.parse(fs.readFileSync(this.getProjectConfigFile(), 'utf8'));
}

/**
 *
 * @return {*}
 */
Project.prototype.getProjectConfigFile = function() {
  return path.join(this._folder, PROJECT_CONFIG);
}

/**
 *
 * @return {*}
 */
Project.prototype.getRepositoriesConfigFile = function() {
  return path.join(this._folder, REPOSITORIES_CONFIG);
}

/**
 *
 * @return {*}
 */
Project.prototype.loadRepositoriesConfig = function() {
  return JSON.parse(fs.readFileSync(this.getRepositoriesConfigFile(), 'utf8'));
}

/**
 * Load a repository configuration from filesytem
 *
 * @param name
 * @return {*}
 */
Project.prototype.getRepositoryConfig = function(name) {
  //return _.find(this._repositories, function(repo) {
  //  return repo.name === name;
  //});
  return JSON.parse(fs.readFileSync(context.getRepositoryConfigFile(this._name, name), 'utf8'));
}

/**
 * Get all the repositories from the repositories configuration file.
 * List all the files of the current project folder or from the repositories file.
 */
Project.prototype.getActiveRepositoriesName = function() {
  var repos = [];

  _.each(_.where(this._repositories, { active : true}), function(repo) {
    repos.push(repo.name);
  });

  return repos;
}

/**
 *
 * @param name
 * @return {String}
 */
Project.prototype.loadRepository = function(name) {
  return new Repository(this._name, this.getRepositoryConfig(name));
}

/**
 * Mirror the project: Get all the active repositories and call mirror operation for each.
 *
 */
Project.prototype.mirror = function(cb) {
  var self = this;
  _.each(this.getActiveRepositoriesName(), function(name) {
    console.log(self._name + ' : Mirroring repository ' + name)
    var repo = self.loadRepository(name);
    try {
      repo.mirror(function(err) {
        if (cb) cb(err, name);
      });
    } catch (Error) {
      console.log('Error while mirroring...', Error);
    }
  });
}