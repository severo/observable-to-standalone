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

- ![gray color](https://placehold.it/12/808080/000000?text=+) Gray cells are
  anonymous (non-named) cells and will generally not be migrated. They often
  contain explanation texts, and no other cell can depend on them, so they
  shouldn't break the code if removed. But, be careful: if your main chart cell
  is not named, you will still want to copy its code.
- <span style="color: black; text-decoration: underline">Black cells</span> are
  the actual notebook code written by the user, and you will want to copy it to
  your project.
- <span style="color: lightseagreen; text-decoration: underline">Green
  cells</span> correspond to external code imported into the notebook:
  - library imported with `require` (e.g. `d3 = require("d3@5")`): you typically
    will install it in your project with `npm install`, and then import it as an
    ES module
  - imported notebook (e.g. `import { radio } from "@jashkenas/inputs"`): you
    will have to repeat the same process in this notebook, examining its own
    [dependency graph](https://observablehq.com/@severo/notebook-visualizer-with-from?id=@jashkenas/inputs).
- <span style="color: mediumpurple; text-decoration: underline">Purple
  cells</span> are the toughest ones. They correspond to features of Observable
  that will typically be used a lot by a notebook writer (see the
  [Standard Library](https://github.com/observablehq/stdlib)), and their
  migration to a standalone application can be the hardest part of the rewrite
  from scratch, particularly `mutable` and `viewof` cells, since they manage an
  internal state.
