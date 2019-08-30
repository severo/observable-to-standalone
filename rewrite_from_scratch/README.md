# Method: rewrite from scratch

In this method, we copy/paste the cells to functions in your code, and refactor
Observable specific features.

## Comparison with notebook embedding

How does it compares to notebook embedding using Observable runtime?

### Pros

- all the code is available at build time, not at runtime, making it easier to
  understand, version and test (compare to
  [Observable cells-based code](./bundle_js_and_deploy/joyplot/step6/src/notebook/@mbostock/psr-b1919-21.js))
- more freedom to mold the code into your favorite framework

### Cons

- you will need to manage the state, instead of letting the Observable runtime
  do it for you
- related: you must recode the useful Observable feature, like `viewof` or
  `width` for example
- migration is complex and manual

## Understand the dependency graph

Understand the general data flow in your notebook (read
[How Observable Runs](https://observablehq.com/@observablehq/how-observable-runs)
for background). Draw its dependency graph using the
[Notebook Visualizer](https://observablehq.com/@severo/notebook-visualizer-with-from?id=@mbostock/psr-b1919-21):

![Notebook Visualizer on @mbostock/psr-b1919-21](../assets/notebook_visualizer.svg)

Each node corresponds to a notebook cell, and arrows represent a dependency
between cells. They are colored by category:

- ![lightseagreen color](https://placehold.it/12/20b2aa/000000?text=+) Green
  cells correspond to external code imported into the notebook:
  - library imported with `require` (e.g. `d3 = require("d3@5")`): you typically
    will install it in your project with `npm install`, and then import it as an
    ES module
  - imported notebook (e.g. `import { radio } from "@jashkenas/inputs"`): you
    will have to repeat the same process in this notebook, examining its own
    [dependency graph](https://observablehq.com/@severo/notebook-visualizer-with-from?id=@jashkenas/inputs).
- ![gray color](https://placehold.it/12/808080/000000?text=+) Gray cells are
  anonymous (non-named) cells and will generally not be migrated. They often
  contain explanation texts, and no other cell can depend on them, so they
  shouldn't break the code if removed. But, be careful: if your main chart cell
  is not named, you will still want to copy its code.
- ![black color](https://placehold.it/12/1b1e23/000000?text=+)
  <span style="color: black; text-decoration: underline">Black cells</span> are
  the actual notebook code written by the user, and you will want to copy it to
  your project.
- ![mediumpurple color](https://placehold.it/12/9370db/000000?text=+) Purple
  cells are the toughest ones. They correspond to features of Observable that
  will typically be used a lot by a notebook writer (see the
  [Standard Library](https://github.com/observablehq/stdlib)), and their
  migration to a standalone application can be the hardest part of the rewrite
  from scratch, particularly `mutable` and `viewof` cells, since they manage an
  internal state.

## Build and deploy environment

Install the build and deploy environment (see the
["bundle JS and deploy" method](../bundle_js_and_deploy/) for more details).
First install [node.js and npm](https://nodejs.dev/how-to-install-nodejs) and
create a new npm project:

```bash
mkdir joyplot
cd joyplot
npm init
```

Install dev dependencies

```bash
npm install -save-dev rollup@1 rollup-plugin-node-resolve@5 @babel/core@7 \
                    rollup-plugin-babel@4 rollup-plugin-terser@5 now@16
```

Create rollup configuration in [rollup.config.js](./joyplot/rollup.config.js):

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

Add npm scripts, in [package.json](./joyplot/package.json):

```json
"scripts": {
  "build": "rollup -c",
  "deploy": "now",
  "predeploy": "npm run build"
}
```

Create the HTML and JS files:

```bash
mkdir -p public src
touch public/index.html
touch src/main.js
```

Edit [public/index.html](./joyplot/public/index.html):

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

Edit [src/main.js](./joyplot/src/main.1.js):

```js
document.querySelector('#joyplot').innerHTML =
  'Placeholder for the joyplot chart.';
```

Test your configuration is working:

```bash
npm run build
npm run deploy
```

See [src/main.1.js](./joyplot/src/main.1.js).

## ![lightseagreen color](https://placehold.it/12/20b2aa/000000?text=+) Green cells: import libraries

Install the external libraries (green cells):

```bash
npm install --save-dev d3@5
```

Import them in [src/main.js](./joyplot/src/main.js):

```js
import * as d3 from 'd3';
```

## ![gray color](https://placehold.it/12/808080/000000?text=+) Gray cells: nothing to do

Anonymous cells generally contain markdown text, and can be ignored. But if you
need to migrate an anonymous cell, just consider it as a black cell (see below).

## ![black color](https://placehold.it/12/1b1e23/000000?text=+) Black cells: copy/paste code into functions

Copy paste the black cells definitions to src/main.js (in the order you want,
the dependency order will be managed later).

To migrate a cell, put its content inside an async function that takes the
dependencies (incoming arrows in the graph) as arguments. This async function
will return the cell value. For example the cell:

```js
data = d3
  .text(
    'https://gist.githubusercontent.com/borgar/31c1e476b8e92a11d7e9/raw/0fae97dab6830ecee185a63c1cee0008f6778ff6/pulsar.csv'
  )
  .then(data => d3.csvParseRows(data, row => row.map(Number)));
```

becomes

```js
async function _data(d3) {
  return d3
    .text(
      'https://gist.githubusercontent.com/borgar/31c1e476b8e92a11d7e9/raw/0fae97dab6830ecee185a63c1cee0008f6778ff6/pulsar.csv'
    )
    .then(data => d3.csvParseRows(data, row => row.map(Number)));
}
```

and the cell value will then be available as:

```js
const data = await _data(d3);
```

But don't apply this method blindly. Don't use `async` if the cell code is
synchronous:

```js
function _x(d3, data, margin, width) {
  return d3
    .scaleLinear()
    .domain([0, data[0].length - 1])
    .range([margin.left, width - margin.right]);
}
```

Ensure to follow the functional programming paradigm: pass all the dependencies
as arguments without relying on global variables.

See [src/main.2.js](./joyplot/src/main.2.js).

## ![black color](https://placehold.it/12/1b1e23/000000?text=+) Black cells: build data flow

In your main code, instantiate the variables using the cell definitions
functions, and following the dependency graph order: first the cells without
dependencies, until the most dependent ones:

```js
// Data flow
async function main(d3, DOM, width) {
  const height = _height();
  const margin = _margin();
  const overlap = _overlap();
  const data = await _data(d3);
  const x = _x(d3, data, margin, width);
  const y = _y(d3, data, margin, height);
  const z = _z(d3, data, overlap, y);
  const xAxis = _xAxis(height, margin, d3, x, width);
  const area = _area(d3, x, z);
  const line = _line(area);
  const chart = _chart(d3, DOM, width, height, data, y, area, line, xAxis);
}
```

See [src/main.3.js](./joyplot/src/main.3.js).

## ![mediumpurple color](https://placehold.it/12/9370db/000000?text=+) Purple cells: replace Observable code [the hardest part]

In the code above, we still have to provide two variables: `DOM` and `width`,
that correspond to purple cells (Observable-specific code). You will have to
refactor your code to get the expected behavior.

_Note: maybe a generic solution involving
[@observable/stdlib](https://www.npmjs.com/package/@observablehq/stdlib) could
be applied. For now, just refactor._

For example, to replace `width`:

```js
const width = 960; // in the notebook, width came from stdlib. We fix its value
```

and to replace `DOM` in `const svg = d3.select(DOM.svg(width, height));`:

```js
const svg = d3
  .select('svg#joyplot')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', `"0,0,${width},${height}"`);
```

See [src/main.4.js](./joyplot/src/main.4.js).

Finally, see [src/main.js](./joyplot/src/main.js) for a better solution that
manages window resize as in the original notebook. Note that this solution is
more complex, and naturally a notebook writer will opt for using Observable
helpers like `width` in order to prototype quickly.
