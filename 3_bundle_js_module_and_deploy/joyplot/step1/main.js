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
