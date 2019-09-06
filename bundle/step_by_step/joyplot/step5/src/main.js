// Import Observable notebook
import notebook from '@mbostock/psr-b1919-21';

// Import d3
import * as d3 from 'd3';

// Import d3-require
import {require} from 'd3-require';

// Import Observable library
import {Runtime, Inspector, Library} from '@observablehq/runtime';

// Resolve "d3@5" module to current object `d3`
const customResolve = require.alias({'d3@5': d3}).resolve;

// Render selected notebook cells into DOM elements of this page
// Use the custom resolve function to load modules
const runtime = new Runtime(new Library(customResolve));
const main = runtime.module(notebook, name => {
  switch (name) {
    case 'chart':
      // render 'chart' notebook cell into <div id="joyplot"></div>
      return new Inspector(document.querySelector('#joyplot'));
      break;
  }
});
