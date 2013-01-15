# OW2 Git Mirroring

## Notes

- A mirror is composed of several projects. Each project is composed of a list of git repositories to be mirrored.
- A project is mirrored into a github organisation : e do not change the repositories name using this approach.

## Howto

### Manual Steps

The github API does not provides methods to create orgs.
The mirror manager needs to create them by hand and add the user you use to push repository to the organisation.
Note that it can be the same used to create repositories from mirror engine.

1. Create an organisation where you want to mirror repositories into.
2. Add R+W rights to user who will push to github
3. Create the configuration file for the new project/repository cf XXX
4. Update the server config files according to the configuration file
5. Create the new project on the mirroring server from the command line tool
6. Add cron jobs... 