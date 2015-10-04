# Team3-Project
- Spencer Sellers

- Kenneth Curtis

- Dave Weathers

- Ben Hunt

- Alan Boggess

# How to build
## Setup
First you'll need npm. NPM is the node.js package manager. We aren't using node (yet...?) but a lot of web tools (like what we're using) are built upon node.  NPM is bundled with node, which can be found at https://nodejs.org/ .  

Once you have NPM, you'll need to install a few things:

`npm install -g grunt`: Grunt runs tasks for us, like compiling the typescript.
(Note:  grunt does not install itself globally by default; you may find it useful to also install grunt's command-line interface by running 'npm install -g grunt-cli'.  See grunt's documentation at http://www.gruntjs.com/, specifically their 'Getting Started' guide.)

`npm install -g bower`: Bower is a client-library package manager. We'll use it to install client stuff.

Both of these commands may or may not require elevated permissions (e.g. sudo on linux).

Now we can install our npm packages. In the project directory, run `npm install`. It could take a bit to install everything the project needs.

Now we have our build libraries, but we're still missing our client libraries. Run `bower install` to install those.

Once everything is installed, we can actually build the app...

## Build

Run `grunt build` to build the app. It'll mostly just convert the typescript to javascript and place it in the right places.

Run `grunt serve` to serve the app on `http://localhost:8000`. It'll even watch the typescript for changes and auto-update the server as it's running!

Compatibility:
This app has been tested with Firefox version 41.0.1.  Other browsers are not yet supported - use at your own risk.  (It known not to work in Google Chrome version 45.0.2454.101.)
