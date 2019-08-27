# README

This method allows to generate fewer requests than
[requesting Observable](../2_request_observable/README.md) and to deploy online,
but is more complicated since it requires to manage more files and concepts.

## Pros

- generates fewer HTTP requests (3 Observable notebooks modules and the
  [runtime.js](https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js)
  Observable library are bundled in
  [public/main.js](./tissot/step3/public/main.js))
- allows to render only some cells of the notebook
- does not require to setup hosting before the webpage to be published online,
  deploys to now.sh infrastructure

## Cons

- requires browser
  [compatibility with ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility)
- does not work locally (offline) since it depends on requests to
  cdn.jsdeliver.net and unpkg.com, and still generates a lot of HTTP requests
- complex: requires knowledge about npm, node.js, ES modules, now.sh

Note: even if the bundled module could be transpiled with Babel in order to
transform it to "standard" JavaScript supported by old browsers, it would not be
useful at all. Indeed, if the cells of the notebooks require modules or make use
of "modern" JavaScript, the old browsers will break since these cells will be
loaded at runtime and thus will not be transpiled.

## Tutorial

This tutorial will lead to successive versions of the standalone webpage, with
additional features in each step.

### Step 1 - setup a npm package

The first step gives code similar to the
["request Observable method"](../2_request_observale/README.md), but with some
of the modules retrieved locally (the notebooks).

- Install [node.js and npm](https://nodejs.dev/how-to-install-nodejs)
- Create a new npm project:

  ```
  mkdir -p tissot/step1
  cd tissot/step1
  npm init
  ```

  ```
  package name: (tissot)
  version: (1.0.0)
  description: Standalone version of @fil's Tissot indicatrix Observable notebook
  entry point: (index.js)
  test command:
  git repository:
  keywords:
  author:
  license: (ISC)
  About to write to /home/slesage/dev/4_contratos/liris/observable-to-standalone/advanced/tissot/package.json:

  {
    "name": "tissot",
    "version": "1.0.0",
    "description": "Standalone version of @fil's Tissot indicatrix Observable notebook",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC"
  }

  Is this OK? (yes)
  ```

- Install the notebook as a development dependency (the URL is obtained on the
  notebook page, clicking on "…" and then on "Download tarball"):

      ```
      mkdir -p src/tissots-indicatrix
      curl -o /tmp/package.tgz https://api.observablehq.com/@fil/tissots-indicatrix.tgz?v=3
      tar xf /tmp/package.tgz --directory src/tissots-indicatrix
      rm /tmp/package.tgz
      npm install --save src/tissots-indicatrix
      ```

  Note that it's exactly the same as the
  [default index method](../1_default_index/README.md): the same .tgz file is
  downloaded and extracted (in src/tissots-indicatrix/ in that case).

- Install the Observable runtime module:

      ```
      npm install @observablehq/runtime@4
      ```

- Create the index.html file with the following content:

      ```html
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <!-- Minimal HTML head elements -->
          <meta charset="utf-8" />
          <title>Tissot's indicatrix</title>
        </head>
        <body>
          <!-- Title of the page -->
          <h1>Tissot's indicatrix</h1>

          <!-- Empty placeholders -->
          <div id="map"></div>
          <p id="controls"></p>

          <!-- JavaScript code to fill the empty placeholders with notebook cells
               Note that the script is not vanilla JavaScript but an ES module
               (type="module")
            -->
          <script type="module" src="./main.js"></script>
        </body>
      </html>
      ```

- create the main.js file with the following content:

      ```js
      // Import Observable notebook
      // Note the relative path via ./node_modules - it's not optimal and will
      // be improved in the next steps
      import notebook from './node_modules/@fil/tissots-indicatrix/@fil/tissots-indicatrix.js';

      // Import Observable library
      // Same observation
      import {
        Runtime,
        Inspector,
      } from './node_modules/@observablehq/runtime/dist/runtime.js';

      // Render selected notebook cells into DOM elements of this page
      const runtime = new Runtime();
      const main = runtime.module(notebook, name => {
        switch (name) {
          case 'display':
            // render 'display' notebook cell into <div id="map"></div>
            return new Inspector(document.querySelector('#map'));
            break;
          case 'viewof p':
            // render 'viewof p' notebook cell into <p id="controls"></p>
            return new Inspector(document.querySelector('#controls'));
            break;
        }
      });
      ```

- serve with:

      ```
      python3 -m http.server
      ```

Note: the resulting code can be found in [./step1](./step1/) directory.

### Step 2 - bundle JS modules in one file

In step 1, there are 4 local requests for ES modules: tissots-indicatrix.js,
base-maps.js, inputs.js and runtime.js. Moreover, the web server needs to be
serving the "technical" node_modules/ directory, that normally should be
reserved for development and build.

To simplify this, a single ES module will be generated, using
[rollup.js](https://rollupjs.org), concatenating all the modules.

- as this implies a build step, it's better to separate the sources (in a src/
  directory) from the final files (in a public/ directory):

      ```
      mkdir public
      mv index.html public/
      mv main.js src/
      ```

- install rollup as a development dependency:

      ```
      npm install --save-dev rollup@1
      ```

- install rollup-plugin-node-resolve to tell rollup to search the modules inside
  the node_modules/ directory:

      ```
      npm install --save-dev rollup-plugin-node-resolve@5
      ```

- create a configuration file for rollup:

      ```
      editor rollup.config.js
      ```

      ```
      import * as meta from './package.json';
      import resolve from 'rollup-plugin-node-resolve';

      export default {
        input: 'src/main.js',
        onwarn: function(warning, warn) {
          if (warning.code === 'CIRCULAR_DEPENDENCY') {
            return;
          }
          warn(warning);
        },
        output: {
          file: `public/main.js`,
          name: '${meta.name}',
          format: 'iife',
          indent: false,
          extend: true,
          banner: `// ${meta.homepage} v${
            meta.version
          } Copyright ${new Date().getFullYear()} ${meta.author.name}`,
        },
        plugins: [resolve()],
      };
      ```

  It tells rollup to take the src/main.js file as the source, to find all the
  dependencies (`import` statements), and to concatenate all of them in
  public/main.js.

- add the following line in the package.json file to create a npm command that
  builds the public/main.js file:

      ```json
      "scripts": {
        "build": "rollup -c",
        ...
      }
      ```

- adapt the src/main.js file to remove the relative paths
  (rollup-plugin-node-resolve will take care of finding the modules):

      ```js
      // Import Observable notebook
      import notebook from '@fil/tissots-indicatrix';

      // Import Observable library
      import {Runtime, Inspector} from '@observablehq/runtime';
      ```

- build the file:

      ```
      npm run build
      ```

- run the server:

      ```
      python3 -m http.server --directory public/
      ```

Note: the resulting code can be found in [./step2](./step2/) directory.

Note: the bundled module helps to save three requests, but it's not that much
comparing to the more than 30 requests to d3 dependencies. There is no easy
solution to solve this when embedding a notebook, since these dependencies are
not declared statically (via import statements), but are discovered dynamically
when parsing the notebooks and rendering the cells.

### Step 3 - publish online

In step 2, the final files are made available in the public/ directory, but
there is still the need to configure hosting to publish them online. There are
various solutions to help publish from the cli, let's see one of them:
[now.sh](https://now.sh).

- install the now development dependency:

      ```
      npm install --save-dev now@16
      ```

- add a npm script to deploy to the now.sh hosting infrastructure (note the
  `predeploy` script that will run automatically before `deploy`):

      ```json
      "scripts": {
        ...
        "deploy": "now",
        "predeploy": "npm run build",
        ...
      }
      ```

- deploy on now.sh hosting:

      ```
      npm run deploy
      ```

- open the now.sh URL in a browser (for example: https://step3-eq4kmqwto.now.sh)

Note: the resulting code can be found in [./step3](./step3/) directory.
