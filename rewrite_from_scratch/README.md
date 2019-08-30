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

## Tutorial

Understand the general data flow in your notebook (read
[How Observable Runs](https://observablehq.com/@observablehq/how-observable-runs)
for background). Draw its dependency graph using the
[Notebook Visualizer](https://observablehq.com/@severo/notebook-visualizer-with-from?id=@mbostock/psr-b1919-21):

![Notebook Visualizer on @mbostock/psr-b1919-21](../assets/notebook_visualizer.svg)

Each node corresponds to a notebook cell, and arrows represent a dependency
between cells. They are colored by category:

- gray cells are anonymous (non-named) cells
- black cells are the actual notebook code written by the user
- green cells are libraries and external notebooks
- purple cells are Observable features, like `mutable`, `viewof` or
  [standard library](https://github.com/observablehq/stdlib) functions

Anonymous cells will generally not be migrated. They often contain explanation
texts, and no other cell can depend on them, so they shouldn't break the code if
removed. But, be careful: if your main chart cell is not named, you will still
want to copy its code.

Black cells are the actual code, and you will want to copy it to your project.

Green cells correspond to external code imported into the notebook:

- if it corresponds to a library imported with `require` (e.g.
  `d3 = require("d3@5")`), you typically will install it in your project with
  `npm install`, and then import it as an ES module
- if it's an imported notebook (e.g.
  `import { radio } from "@jashkenas/inputs"`), you will have to repeat the same
  process in this notebook, examining its own
  [dependency graph](https://observablehq.com/@severo/notebook-visualizer-with-from?id=@jashkenas/inputs).

Purple cells are the toughest ones. They correspond to features of Observable
that will typically be used a lot by a notebook writer, and their migration to a
standalone application can be the hardest part of the rewrite from scratch,
particularly `mutable` and `viewof` cells, since they manage an internal state.
