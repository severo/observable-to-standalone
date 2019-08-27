// Import Observable notebook
// To get the URL, go to the
// [notebook](https://observablehq.com/@fil/tissots-indicatrix), click on
// "…" and then on "Download code"
import notebook from './node_modules/@fil/tissots-indicatrix/@fil/tissots-indicatrix.js';

// Import Observable library
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
