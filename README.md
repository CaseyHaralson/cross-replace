# cross-replace

Drop-in replacement for the npm project `cross-var`.
This project also supports more scenarios and doesn't have the dependency vulnerabilities.

## Overview

When using `npm scripts` to run commands, environment variables are available and can replace specific sections of the scripts.

Not only are regular environment variables available, npm also creates a set of environment variables that are available to the scripts at runtime.

For example:

```bash
> npm run env

... environment variables ...
npm_package_name=cross-replace
npm_package_version=1.0.0
... more environment variables ...
```

You can also add your own parameters when calling a script and this adds to the available environment variables: 

```bash
> npm run example --param1=hello --param2=world

# which will result in the following environment variables:
npm_config_param1=hello
npm_config_param2=world
```

Now you can use any environment variables in your `npm scripts` by referencing them in an OS specific way:

```json
package.json:

{
  "name": "World",
  "scripts": {
    "example-windows-script": "echo Hello %npm_package_name% and %npm_config_param1% %npm_config_param2%",
    "example-linux-script": "echo Hello $npm_package_name and ${npm_config_param1} ${npm_config_param2}"
  }
}
```
```bash
> npm run example-windows-script --param1=hello --param2=world

Hello World and hello world
```

However, as you can see, the syntax for referencing environment variables is different between Windows (`%var%`) and Linux/Mac OS X (`$var or ${var}`).

This is where `cross-replace` comes in.
Its goal is to provide a consistent way to reference environment variables in `npm scripts` across all platforms.

## Usage

You can use either of the OS styles to reference environment variables in your `npm scripts` and `cross-replace` will replace them with the correct value.

### Simple Commands

```json
{
  "version": "1.0.0",
  "config": {
    "port": "1337"
  },
  "scripts": {
    "prebuild": "cross-replace rimraf public/$npm_package_version",
    "build:html": "cross-replace jade --obj data.json src/index.jade --out public/%npm_package_version%/",
    "server:create": "cross-replace http-server public/${npm_package_version} -p %npm_package_config_port%",
    "server:launch": "cross-replace opn http://localhost:$npm_package_config_port"
  }
}
```

### Complex Commands

```json
{
  "version": "1.0.0",
  "scripts": {
    "build:css": "cross-replace \"node-sass src/index.scss | postcss -c .postcssrc.json | cssmin > public/$npm_package_version/index.min.css\"",
    "build:js": "cross-replace \"mustache data.json src/index.mustache.js | uglifyjs > public/$npm_package_version/index.min.js\"",
  }
}
```

## Modifications from `cross-var`

- structured the project on typescript and removed babel which dropped all the dependency vulnerabilities
- included several of the pending pull requests
- fixed some of the issues:
  - doesn't break when environment variables with special characters are used
  - works with more than one variable in the same command
  - works in a folder whose name contains "src"
  - supports the `${}` syntax
- included tests that can run against MacOS, Linux and Windows (these tests run on the CI/CD pipeline)

## Local Development

Install the dependencies, build the project, and link it to the global scope:

```bash
npm install
npm run build
npm link
```

Now this will use your local version of `cross-replace` in your scripts.

### Tests

Run the tests:
  
```bash
npm test
```

#### Known Issue

One of the tests is commented out because I'm not sure what the correct answer is to a cross platform solution.
The problem is with variables that contain special characters, like `&` or `|`.
Each OS responds differently to variables that contain these characters:

```json
{
  "scripts": {
    "example": "cross-replace node -e \"console.log('$npm_config_Notepad++ and %npm_config_Notepad++%')\""
  }
}
```
```bash
> npm run example --Notepad++=hello
```

These are the results:
- MacOS: `++ and hello`
- Linux: `++ and %npm_config_Notepad++%`
- Windows: `hello and hello`
