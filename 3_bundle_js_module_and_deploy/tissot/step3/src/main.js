// Import Observable notebook
import notebook from '@fil/tissots-indicatrix';

// Import Observable library
import {Runtime, Inspector} from '@observablehq/runtime';

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
