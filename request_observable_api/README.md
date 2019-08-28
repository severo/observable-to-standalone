# Method 2 - Request Observable API

This method is a simple way to migrate an
[Observable notebook](https://observablehq.com/@mbostock/psr-b1919-21) to a
standalone webpage.

## Install

Open the [joyplot/index.html](./joyplot/index.html) file in a browser. It will
display the same joyplot as in the
[PSR B1919+21 Observable notebook](https://observablehq.com/@mbostock/psr-b1919-21).

Alternatively, serve the file from a web server.

## Pros

- simple (does not require knowledge about npm, node.js, ES modules,
  transpilation, or now.sh)
- only one file to manage (index.html)
- allows to render only some cells of the notebook

## Cons

- requires browser
  [compatibility with ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility)
- no resources are loaded locally (index.html apart), and a lot of HTTP requests
  are generated:
  - the
    [Observable notebook module](https://api.observablehq.com/@mbostock/psr-b1919-21.js?v=3)
  - the
    [runtime.js](https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js)
    Observable library (JS)
  - [package.json](https://cdn.jsdelivr.net/npm/d3@5/package.json), in order to
    locate the actual d3 library file to import
  - the actual
    [d3 library file](https://cdn.jsdelivr.net/npm/d3@5.11.0/dist/d3.min.js)
  - generates an HTTP request to get the data from an external location
  - the
    [pulsar.csv](https://gist.githubusercontent.com/borgar/31c1e476b8e92a11d7e9/raw/0fae97dab6830ecee185a63c1cee0008f6778ff6/pulsar.csv)
    data
- does not work locally (offline) since it depends on requests to
  cdn.jsdeliver.net, api.observablehq.com and to the data file
- requires to setup hosting before the webpage to be published online

## How to adapt to another notebook

The steps to adapt the solution to another notebook, say
[Breakout!](https://observablehq.com/@jashkenas/breakout) are:

- determine which cells to include in the webpage. For example: `viewof c` (the
  game), `viewof newgame` (the restart button) and `viewof speed` (the speed
  controller)
- adapt the HTML template, replacing

  ```html
  <title>PSR B1919+21</title>
  (...)
  <!-- Title of the page -->
  <h1>PSR B1919+21</h1>

  <!-- Empty placeholders -->
  <div id="joyplot"></div>
  ```

  with

  ```html
  <title>Breakout!</title>
  (...)
  <!-- Title of the page -->
  <h1>Breakout!</h1>

  <!-- Empty placeholders -->
  <div id="game"></div>
  <div id="controls">
    <p class="button"></p>
    <p>Speed: <span class="slider"></span></p>
  </div>
  ```

- adapt the JavaScript code, replacing:

  ```javascript
  import notebook from 'https://api.observablehq.com/@fil/tissots-indicatrix.js?v=3';
  (...)
    switch (name) {
      case 'chart':
        // render 'chart' notebook cell into <div id="joyplot"></div>
        return new Inspector(document.querySelector('#joyplot'));
        break;
    }
  ```

  with

  ```javascript
  import notebook from 'https://api.observablehq.com/@jashkenas/breakout.js?v=3';
  (...)
    switch (name) {
      case 'viewof c':
        // render 'viewof c' notebook cell into <div id="game"></div>
        return new Inspector(document.querySelector('#game'));
        break;
      case 'viewof newgame':
        // render 'viewof newgame' notebook cell into <p class="button"></p>
        return new Inspector(document.querySelector('#controls .button'));
        break;
      case 'viewof speed':
        // render 'viewof speed' notebook cell into <span class="slider"></span>
        return new Inspector(document.querySelector('#controls .slider'));
        break;
    }
  ```

- see the result in [breakout/index.html](./breakout/index.html)

See also [tissot/index.html](./tissot/index.html) for a third example.
