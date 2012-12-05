/**
 * Notifiers. Will be better to load them using require('./notifier/' + name)...
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var _ = require('underscore');

var notifiers = {};

/**
 * Load all the notifiers defined in the config.
 * Each notifier must have an init(config) method which is called here...
 *
 * @param config
 */
function load(notifiers_cfg) {
  _.each(notifiers_cfg, function(notifier) {
    console.log('Loading notifier', notifier.type);
    try {
    var n = require('./' + notifier.type);
      n.init(notifier.config);
      notifiers[notifier.type] = n;
    } catch(Error) {
      console.log('Warning : ',Error);
    }
  });
}

function getNotifier(type) {
  return notifiers[type];
}

/**
 * Dispatch error to all notifiers
 *
 * @param project
 * @param repo
 * @param message
 */
function error(project, repo, message) {
  _.each(notifiers, function(notifier) {
    notifier.error(project, repo, message, function() {
      console.log('Error Notification sent');
    });
  });
}

/**
 * Dispath successs to all notifiers
 *
 * @param project
 * @param repo
 * @param message
 */
function success(project, repo, message) {
  _.each(notifiers, function(notifier) {
    notifier.success(project, repo, message, function() {
      console.log('Success Notification sent');
    });
  });
}

exports.error = error;
exports.success = success;

exports.notifiers = notifiers;
exports.load = load;
exports.getNotifier = getNotifier;
