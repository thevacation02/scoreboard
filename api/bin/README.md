# Scoreboard cli

The `scoreboard` cli is helpful for development and for initial setup of a scoreboard deployment.

This isn't an end-user tool, it's main purpose is to act as an admin tool, particularly during development.

## Setup

You can create a symlink for the `scoreboard` cli to a `bin` in your path or use it directly by specifying the absolute path, for example: `./api/bin/scoreboard`.

**Create a symlink:**

Creating a symlink makes it easy to use.

Use the `ln` command:

```console
ln -s /full/path/to/scoreboard/api/bin/scoreboard ~/bin/scoreboard
```

## Users

### List users

```console
scoreboard users
```

### Destroy a user

```console
scoreboard users destroy --id {user id}
```

### Create an admin user

```console
scoreboard create-admin-user --osm-id {osm id} --full-name {osm username}
```

## Roles

### List roles

```console
scoreboard roles
```

### Create a role

```console
scoreboard roles create --name {role name}
```

### Destroy a role

```console
scoreboard roles destroy --name {role name}
```