// Import Observable notebook
import notebook from '@mbostock/psr-b1919-21';

// Import Observable library
import {Runtime, Inspector} from '@observablehq/runtime';

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
