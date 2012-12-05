/**
 *
 * The mirror CLI
 *
 * Copyright(c) 2012 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var argv = require('optimist').argv
  , colors = require('colors')
  , mirror = require('./mirror');

var help = [
  "usage: ow2mirror [options] ",
  "",
  "Starts a ow2mirror client using the specified command-line options",
  "",
  "options:",
  "  --create                Create all the files for a mirror runtime",
  "  --ma                    Mirror ALL!",
  "  --mp PROJECT            Mirror a project which already exists (already created with --project)",
  "  --project PROJECT       Create and mirror a project which is defined in input sources",
  "  --us                    Update the input sources",
  "  -h, --help              You're staring at it!",
  "",
  "    Christophe Hamerling - christophe.hamerling@ow2.org",
  "               ==  http://ow2.org =="
].join('\n');

/**
 * Run the CLI...
 */
exports.run = function() {
  if (argv.h || argv.help) {
    return console.log(help.bold);
  }

  var m = new mirror.Mirror();

  if (argv.create) {
    console.log('Creating a new Mirror...'.green);
    m.create(function(err, home) {
      if (err) {
        console.log('[KO] Error while creating the mirror', err);
      } else {
        console.log('[OK] Mirror has been created at ' + home + ''.green);
      }
      return;
    });
  }

  if (argv.project) {
    console.log('Creating the project ' + argv.project + ''.green);

    // TODO : prompt the user : Create project on the target if needed!

    m.createProjectFromSource(argv.project, function(err, repository) {
      if (err) {
        console.log('[KO] Error while creating repository ' + repository + ''.bold.red);
        console.log(err);
      } else {
        console.log('[OK] Repository mirror has been created ' + repository + ''.green);
      }
    });
  }

  if (argv.mp) {
    console.log('Mirroring project ' + argv.mp + ''.green);
    m.mirrorProject(argv.mp, function(err, repository) {
      if (err) {
        console.log('[KO] Error while mirroring project for repository' + repository + ''.bold.red)
        console.log(err);
      } else {
        console.log('[OK] Project mirror for repository' + repository +''.green);
      }
    });
  }

  if (argv.ma) {
    console.log('Mirroring All!'.green);
    m.mirror(function(err, project, repository) {
      if (err) {
        console.log('[KO] Error while mirroring repository ' + repository + ' in project ' + project + ''.bold.red);
        console.log(err);
      } else {
        console.log('[OK] Mirroring repository ' + repository + ' in project ' + project + ''.green);
      }
    });
  }

  if (argv.us) {
    console.log('Update the input sources...'.green);
    m.updateInputs(function() {
      console.log('[OK] Sources updated!'.green);
      return;
    });
  }
}