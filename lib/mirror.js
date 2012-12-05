/**
 * The mirror object. Contains all the stuff to get and manage projects.
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var project = require('./project'),
  context = require('./context')
  , utils = require('./utils/utils')
  , source = require('./source/')
  , fs = require('fs')
  , path = require('path')
  , os = require('os')
  , _ = require('underscore')
  , async = require('async');

// We can (un)activate projects from their active field...
var PROJECTS_CONFIG = 'projects.json';
var WORKSPACE = 'workspace';

/**
 *
 * @constructor
 */
var Mirror = function Mirror() {
  context.init();
  this._config = context.conf;
  this._folder = this._config.path || process.cwd();
  this._workspace = path.join(this._folder, WORKSPACE);

  context.set('root', this._folder).set(WORKSPACE, this._workspace);
  this.projects = this.loadProjects();

  console.log('Mirror is running under', this._workspace);
  console.log('Current Projects', this.projects);
}
exports.Mirror = Mirror;

/**
 * Update all the configuration stuff. It depends on the source configuration...
 */
Mirror.prototype.updateInputs = function(cb) {
  source.update(function() {
    console.log('Sources updated...');
    if (cb) cb();
  });
}

/**
 * Create a new mirror with all the required stuff
 *
 * @param cb
 */
Mirror.prototype.create = function(cb) {
  var self = this;
  this.initialize(function(err) {
    if (err) {
      cb(err);
    } else {
      self.createInputs(function() {
        if (cb) cb(null, self._folder);
      });
    }
  });
}

/**
 *
 * @param cb
 */
Mirror.prototype.createInputs = function(cb) {
  source.initialize(function() {
    console.log('Sources initialized...');
    if (cb) cb();
  });
}

/**
 * Create all the needed config files for a mirror. Called once...
 *
 */
Mirror.prototype.initialize = function(cb) {
  if (this._isInitialized()) {
    if (cb) cb(new Error('Mirror already exists'));
  } else {
    // TODO : check that the home ends with workspace
    utils.mkdirSyncRecursive(this._workspace);
    utils.mkdirSyncRecursive(context.getConfigFolder());

    if (!fs.existsSync(this.getProjectsConfigFile())) {
      this.writeProjects([]);
    }
    if (cb) cb();
  }
}

/**
 *
 * @private
 */
Mirror.prototype._isInitialized = function() {
  return fs.existsSync(this.getProjectsConfigFile());
}

Mirror.prototype.getActiveProjectsName = function() {
  var result = [];

  _.each(_.where(this.projects, { active : true}), function(project) {
    result.push(project.name);
  });

  return result;
}

/**
 * Mirror all the projects... Callback is called for each repository mirror in each project.
 */
Mirror.prototype.mirror = function(cb) {
  var self = this;
  _.each(this.getActiveProjectsName(), function(project) {
    console.log('Mirroring project', project);
    self.mirrorProject(project, function(err, repository) {
      if (cb) cb(err, project, repository);
    });
  });
}

/**
 * Mirror a project. Callback is called for each repository which is mirrored in a project.
 *
 * @param name
 */
Mirror.prototype.mirrorProject = function(name, cb) {
  this.loadProject(name).mirror(function(err, repository) {
    if (cb) cb(err, repository);
  });
}

/**
 * Create a new project from input source (check ./source).
 * Creates all the directories and mirror all.
 */
Mirror.prototype.createProjectFromSource = function(name, cb) {
  var config = source.getProjectConfig(name);
  if (!config) {
    throw new Error('Invalid configuration input for project ' + name);
  }

  var project_name = config.target;
  var repositories = config.repositories;

  console.log('Creating project', project_name);
  var project = this.createProject(project_name);

  _.each(repositories, function(repository) {
    project.createMirror(repository.name, repository.git_url, function(err) {
      // notify caller for the current repository...
      // TODO : event emitter
      cb(err, repository);
    });
  });
  //if (cb) cb(project);
}

/**
 * Creates and return a new project
 *
 * @param name
 * @return the new Project object
 */
Mirror.prototype.createProject = function(name) {
  if (this._projectExists(name)) {
    throw new Error('Project ' + name + ' already exists');
  }

  var newProject = this.loadProject(name);
  newProject.initialize();

  this.projects.push({
    name : name,
    active : true,
    created_at : new Date().toGMTString()
  });
  this.writeProjects(this.projects);

  return newProject;
}

/**
 *
 * @param name
 */
Mirror.prototype.loadProject = function(name) {
  return new project.Project(name);
}

/**
 *
 * @param name
 * @return {*}
 */
Mirror.prototype.getProjectFolder = function(name) {
  return context.getProjectFolder(name);
}

/**
 *
 * @param name
 * @private
 */
Mirror.prototype._projectExists = function(name) {
  var p = _.find(this.projects, function(project){
    console.log(project);
    return project.name === name;
  });
  return p !== undefined;
}

/**
 *
 */
Mirror.prototype.createProjectsConfig = function() {
  var file = this.getProjectsConfigFile();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 *
 */
Mirror.prototype.loadProjects = function() {
  var file = this.getProjectsConfigFile();
  var result = [];

  if (fs.existsSync(file)) {
    result = JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  return result;
}

/**
 *
 * @return {*}
 */
Mirror.prototype.getProjectsConfigFile = function() {
  return path.join(this._workspace, PROJECTS_CONFIG);
}

/**
 *
 * @param projects
 */
Mirror.prototype.writeProjects = function(projects) {
  var file = this.getProjectsConfigFile();
  fs.writeFileSync(file, JSON.stringify(projects, null, 2), 'utf8');
}