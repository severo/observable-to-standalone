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

1. Understand the general data flow in the notebook. Use the
   [Notebook Visualizer](https://observablehq.com/@severo/notebook-visualizer-with-from):

   ![Notebook Visualizer on @mbostock/psr-b1919-21](../assets/notebook_visualizer.svg)
