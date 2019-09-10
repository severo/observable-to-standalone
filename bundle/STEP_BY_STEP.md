# Method - Bundle all modules into a local JavaScript file

This method allows to generate fewer requests than the
["requesting Observable API" method](../request_observable_api/README.md), but
is more complicated since it requires to manage more files and concepts.

![Diagram for the "Bundle" method](../../assets/bundle_method.png)

## Pros

- generates fewer HTTP requests (the Observable notebook, the
  [runtime.js](https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js)
  Observable library and all the "dynamic dependencies" are bundled in a
  minified [public/main.min.js](./joyplot/step6/public/main.min.js) JavaScript
  file)
- allows to render only some cells of the notebook
- supports old browser thanks to Babel (does not require browser
  [compatibility with ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility))

## Cons

- complex: requires knowledge about npm, node.js, ES modules, now.sh, rollup,
  babel, terser
- CSV data still must be downloaded from GitHub. Thus, the application cannot
  run offline. See
  [Standalone App Notebook](https://observablehq.com/@fil/standalone-app-notebook)
  for a possible way to load data locally.

## Tutorial

This tutorial will lead to successive versions of the standalone webpage, with
additional features in each step.

### Step 1 - setup a npm package

The first step gives code similar to the
["request Observable API" method](../request_observable_api/README.md), but with
some of the modules retrieved locally (the notebooks).

- Install [node.js and npm](https://nodejs.dev/how-to-install-nodejs)
- Create a new npm project:

  ```bash
  mkdir joyplot
  cd joyplot
  npm init
  ```

  ```
  package name: (joyplot)
  version: (1.0.0)
  description: Standalone version of PSR B1919+21 Observable notebook
  entry point: (index.js)
  test command:
  git repository:
  keywords:
  author:
  license: (ISC)
  About to write to /[...]/joyplot/package.json:

  {
    "name": "joyplot",
    "version": "1.0.0",
    "description": "Standalone version of PSR B1919+21 Observable notebook",
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

  ```bash
  cd joyplot
  mkdir -p src/notebook
  curl -o /tmp/package.tgz https://api.observablehq.com/@mbostock/psr-b1919-21.tgz?v=3
  tar xf /tmp/package.tgz --directory src/notebook
  rm /tmp/package.tgz
  npm install --save-dev src/notebook
  ```

  Note that it's exactly the same as the
  ["default Observable export" method](../default_observable_export/README.md):
  the same .tgz file is downloaded and extracted (in src/notebook/ in that
  case).

  Note that the `npm install --save src/notebook` command has created the
  `node_modules/` directory and the symbolic link
  `node_modules/@mbostock/psr-b1919-21` to `src/noteboook`.

* Install the Observable runtime module:

  ```bash
  npm install --save-dev @observablehq/runtime@4
  ```

* Create the index.html file with the following content:

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <!-- Minimal HTML head elements -->
      <meta charset="utf-8" />
      <title>PSR B1919+21</title>
    </head>
    <body>
      <!-- Title of the page -->
      <h1>PSR B1919+21</h1>

      <!-- Empty placeholders -->
      <div id="joyplot"></div>

      <!-- JavaScript code to fill the empty placeholders with notebook cells
           Note that the script is not vanilla JavaScript but an ES module
           (type="module")
        -->
      <script type="module" src="./main.js"></script>
    </body>
  </html>
  ```

* create the main.js file with the following content:

  ```js
  // Import Observable notebook
  // Note the relative path via ./node_modules - it's not optimal and will
  // be improved in the next steps
  import notebook from './node_modules/@mbostock/psr-b1919-21/@mbostock/psr-b1919-21.js';

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
      case 'chart':
        // render 'chart' notebook cell into <div id="joyplot"></div>
        return new Inspector(document.querySelector('#joyplot'));
        break;
    }
  });
  ```

* serve with:

  ```
  python3 -m http.server
  ```

### Step 2 - bundle JS modules in one file

In step 1, 3 local requests are made for main.js, psr-b1919-21.js and
runtime.js. Moreover, the web server needs to be serving the "technical"
node_modules/ directory, that normally should be reserved for development and
build.

Instead, we will generate a single ES module, concatenating all the modules
using [rollup.js](https://rollupjs.org).

- as this implies a build step, it's better to separate the sources (in a src/
  directory) from the final files (in a public/ directory):

  ```bash
  mkdir public
  mv index.html public/
  mv main.js src/
  ```

- install rollup as a development dependency:

  ```bash
  npm install --save-dev rollup@1
  ```

- install rollup-plugin-node-resolve to tell rollup to search the modules inside
  the node_modules/ directory:

  ```bash
  npm install --save-dev rollup-plugin-node-resolve@5
  ```

- create the rollup.config.js configuration file for rollup:

  ```js
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

  It tells rollup to take the src/main.js file as the source, to find the
  dependencies (`import` statements), and to concatenate them all into
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
  import notebook from '@mbostock/psr-b1919-21';

  // Import Observable library
  import {Runtime, Inspector} from '@observablehq/runtime';
  ```

- build the file:

  ```bash
  npm run build
  ```

- run the server:

  ```bash
  python3 -m http.server --directory public/
  ```

### Step 3 - Bundle dynamically loaded modules

In step 2, the bundled module helps to save three requests, but it doesn't help
with the remaining requests done at runtime to other dependencies (here
d3.min.js). In this step, let's declare these dependencies statically (via
import statements) and embed them into the bundle.

- exploring the [notebook](https://observablehq.com/@mbostock/psr-b1919-21), we
  see that it requires "d3@5". This information is also present in the last cell
  declaration in
  [src/notebook/@mbostock/psr-b1919-21.js](./joyplot/step3/src/notebook/@mbostock/psr-b1919-21.js):

  ```js
  main.variable(observer('d3')).define('d3', ['require'], function(require) {
    return require('d3@5');
  });
  ```

  or analyzing the requests in the browser developer tools.

- install this dependency as a development dependency:

  ```bash
  npm install --save-dev d3@5
  ```

- import it in main.js:

  ```js
  // Import Observable notebook
  import notebook from '@mbostock/psr-b1919-21';

  // Import d3
  import * as d3 from 'd3';
  ```

- now install d3-require. It will be used to override the normal way
  Observable's runtime dynamically gets access to the dependencies:

  ```bash
  npm install --save-dev d3-require@1
  ```

- import d3-require in src/main.js. Also import the `Library` object from
  @observablehq/runtime.

  ```js
  // Import Observable notebook
  import notebook from '@mbostock/psr-b1919-21';

  // Import d3
  import * as d3 from 'd3';

  // Import d3-require
  import {require} from 'd3-require';

  // Import Observable library
  import {Runtime, Inspector, Library} from '@observablehq/runtime';
  ```

- override the resolve function in runtime, when the module to resolve is
  "d3@5", replacing

  ```js
  // Render selected notebook cells into DOM elements of this page
  const runtime = new Runtime();
  ```

  by

  ```js
  // Resolve "d3@5" module to current object `d3`
  // Be careful: the 'd3@5' alias must be *exactly* the same string as in your
  // notebook cell, `d3 = require("d3@5")` in our case. Setting 'd3' or
  // 'd3@5.11.0' would not work
  const customResolve = require.alias({'d3@5': d3}).resolve;

  // Render selected notebook cells into DOM elements of this page
  // Use the custom resolve function to load modules
  const runtime = new Runtime(new Library(customResolve));
  ```

- build and launch with:

  ```bash
  npm run build && python3 -m http.server --directory public
  ```

### Step 4 - support old browsers

As all the required modules have been bundled into one file (public/main.js), we
are able to apply transpilation to it, so that old browsers will be able to run
the JavaScript as well.

- install [babel](https://babeljs.io/) and
  [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel) plugin

  ```bash
  npm install --save-dev @babel/core@7 rollup-plugin-babel@4
  ```

- adapt rollup.config.js:

  ```js
  //...
  import babel from 'rollup-plugin-babel';
  //...
    plugins: [resolve(), babel()],
  //...
  ```

- adapt public/index.html to remove `type="module"`, since the code has been
  transpiled to non-module format

  ```html
  <!-- JavaScript code to fill the empty placeholders with notebook cells -->
  <script src="./main.js"></script>
  ```

- build and launch with:

  ```bash
  npm run build && python3 -m http.server --directory public
  ```

### Step 5 - minimize JavaScript code

Additionally we can minimize the size of the JS bundle:

- install the terser plugin

  ```bash
  npm install --save-dev rollup-plugin-terser@5
  ```

- adapt rollup.config.js:

  ```js
  import {terser} from 'rollup-plugin-terser';
  // ...
      file: `public/main.min.js`, // <-- note we change the name to highlight the minimization step
  // ...
    plugins: [resolve(), babel(), terser()],
  // ...
  ```

- adapt public/index.html to change the JavaScript filename

  ```html
  <script src="./main.min.js"></script>
  ```

- build and launch with:

  ```bash
  rm public/main.js # Obsolete file
  npm run build && python3 -m http.server --directory public
  ```

The file size is 290KB, whereas the original bundle was 589KB and the transpiled
one (with polyfills to support old browsers) was 593KB.

### Step 6 - publish online

In step 5, the final files are made available in the public/ directory, but
there is still a need to configure hosting to publish them online. There are
various solutions to help publish from the cli, let's see one of them:
[now.sh](https://now.sh).

- install "now" as a development dependency:

  ```bash
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

  ```bash
  npm run deploy
  ```

- open the now.sh URL in a browser (for example: https://step6-mzjz1zuzg.now.sh)

The resulting code can be found in [joyplot/](./joyplot/) directory.
