# OW2 Git Mirroring

## Notes

- A mirror is composed of several projects. Each project is composed of a list of git repositories to be mirrored.
- A project is mirrored into a github organisation : e do not change the repositories name using this approach.

## Howto

### Manual Steps

The github API does not provides methods to create orgs.
The mirror manager needs to create them by hand and add the user you use to push repository to the organisation.
Note that it can be the same used to create repositories from mirror engine.