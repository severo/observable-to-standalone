// Import Observable library
import {Runtime, Inspector, Library} from '@observablehq/runtime';
import {customResolve} from './customResolve';
import {customFetch} from './customFetch';

// Fetch data locally
fetch = customFetch;

// Load modules locally
const runtime = new Runtime(new Library(customResolve));

// Render selected notebook cells into DOM elements of this page
export function render(notebook) {
  runtime.module(notebook, name => {
    switch (name) {
      case 'chart':
        // render 'chart' notebook cell into <div id="joyplot"></div>
        return new Inspector(document.querySelector('#joyplot'));
        break;
    }
  });
}
