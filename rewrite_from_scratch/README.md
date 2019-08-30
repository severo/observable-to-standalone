# Method: rewrite from scratch

## How does it compares to notebook embedding using Observable runtime ?

### Pros

- the code can be versioned in a traditional way (comparing to the
  [Observable cells-based code](./bundle_js_and_deploy/joyplot/step6/src/notebook/@mbostock/psr-b1919-21.js))
- easier to incorporate into your favorite framework

### Cons

- you need to manage the state, instead of letting the Observable runtime do it
  for you
- related: you cannot make a simple use of Observable features like `viewof`,
  `width` or [inputs elements](https://observablehq.com/@jashkenas/inputs) for
  example
- migration might be a complex and manual process

### Other differences

- the code is available at build time, not at runtime

## Understand the dependency graph

Understand the general data flow in your notebook (read
[How Observable Runs](https://observablehq.com/@observablehq/how-observable-runs)
for background). Draw its dependency graph using the
[Notebook Visualizer](https://observablehq.com/@severo/notebook-visualizer-with-from?id=@mbostock/psr-b1919-21):

![Notebook Visualizer on @mbostock/psr-b1919-21](../assets/notebook_visualizer.svg)

Each node corresponds to a notebook cell, and arrows represent a dependency
between cells. They are colored by category:

- ![gray color](https://placehold.it/12/808080/000000?text=+) Gray cells are
  anonymous (non-named) cells and will generally not be migrated. They often
  contain explanation texts, and no other cell can depend on them, so they
  shouldn't break the code if removed. But, be careful: if your main chart cell
  is not named, you will still want to copy its code.
- ![black color](https://placehold.it/12/1b1e23/000000?text=+)
  <span style="color: black; text-decoration: underline">Black cells</span> are
  the actual notebook code written by the user, and you will want to copy it to
  your project.
- ![lightseagreen color](https://placehold.it/12/20b2aa/000000?text=+) Green
  cells correspond to external code imported into the notebook:
  - library imported with `require` (e.g. `d3 = require("d3@5")`): you typically
    will install it in your project with `npm install`, and then import it as an
    ES module
  - imported notebook (e.g. `import { radio } from "@jashkenas/inputs"`): you
    will have to repeat the same process in this notebook, examining its own
    [dependency graph](https://observablehq.com/@severo/notebook-visualizer-with-from?id=@jashkenas/inputs).
- ![mediumpurple color](https://placehold.it/12/9370db/000000?text=+) Purple
  cells are the toughest ones. They correspond to features of Observable that
  will typically be used a lot by a notebook writer (see the
  [Standard Library](https://github.com/observablehq/stdlib)), and their
  migration to a standalone application can be the hardest part of the rewrite
  from scratch, particularly `mutable` and `viewof` cells, since they manage an
  internal state.

## Async

Observable cells are executed asynchronously. You can think of them as `async`
functions. There is no easy way to know if a cell is really asynchronous, you
will have to look at the code.

## Tutorial

### Build and deploy environment

Install the build and deploy environment (see the
["bundle JS and deploy" method](../bundle_js_and_deploy/) for more details):

- install [node.js and npm](https://nodejs.dev/how-to-install-nodejs)
- create a new npm project:

  ```bash
  mkdir joyplot
  cd joyplot
  npm init
  ```

- install dev dependencies

  ```bash
  npm install -save-dev rollup@1 rollup-plugin-node-resolve@5 @babel/core@7 \
                      rollup-plugin-babel@4 rollup-plugin-terser@5 now@16
  ```

- create rollup configuration in [rollup.config.js](./joyplot/rollup.config.js):

  ```js
  import * as meta from './package.json';
  import resolve from 'rollup-plugin-node-resolve';
  import babel from 'rollup-plugin-babel';
  import {terser} from 'rollup-plugin-terser';

  export default {
    input: 'src/main.js',
    onwarn: function(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      }
      warn(warning);
    },
    output: {
      file: `public/main.min.js`,
      name: '${meta.name}',
      format: 'iife',
      indent: false,
      extend: true,
      banner: `// ${meta.homepage} v${
        meta.version
      } Copyright ${new Date().getFullYear()} ${meta.author.name}`,
    },
    plugins: [resolve(), babel(), terser()],
  };
  ```

- add npm scripts, in [package.json](./joyplot/package.json):

  ```json
  "scripts": {
    "build": "rollup -c",
    "deploy": "now",
    "predeploy": "npm run build"
  }
  ```

- create the HTML and JS files:

  ```bash
  mkdir -p public src
  touch public/index.html
  touch src/main.js
  ```

  - edit [public/index.html](./joyplot/public/index.html):

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

        <!-- JavaScript code to fill the empty placeholders -->
        <script src="./main.min.js"></script>
      </body>
    </html>
    ```

  - edit [src/main.js](./joyplot/src/main.js):

    ```js
    document.querySelector('#joyplot').innerHTML =
      'Placeholder for the joyplot chart.';
    ```

- test your configuration is working:

  ```bash
  npm run build
  npm run deploy
  ```
