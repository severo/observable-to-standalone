# README

This method is a simple way to migrate an
[Observable notebook](https://observablehq.com/@fil/tissots-indicatrix/) to a
standalone webpage.

## Install

Open the [tissot/index.html](./tissot/index.html) file in a browser. It will
display the same map as in the
[Tissot's indicatrix Observable notebook](https://observablehq.com/@fil/tissots-indicatrix).

Alternatively, serve the file from a web server.

## Pros

- simple (does not require knowledge about npm, node.js, ES modules,
  transpilation, or now.sh)
- only one file to manage (index.html)
- allows to render only some cells of the notebook

## Cons

- requires browser
  [compatibility with ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility)
- generates many HTTP requests (41):
  - 3 - Observable notebooks modules (JS):
    [Tissot's indicatrix](https://api.observablehq.com/@fil/tissots-indicatrix.js?v=3)
    and its two dependencies:
    [@fil/base-map](https://api.observablehq.com/@fil/base-map.js?v=3) and
    [@jashkenas/inputs](https://api.observablehq.com/@jashkenas/inputs.js?v=3)
  - 1 - the
    [runtime.js](https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js)
    Observable library (JS)
  - 1 - the
    [110m_land.geojson](https://unpkg.com/visionscarto-world-atlas@0.0.6/world/110m_land.geojson)
    data file (GeoJSON)
  - 23 - technical files
    ([package.json](https://cdn.jsdelivr.net/npm/d3-selection/package.json)) to
    determine the required dependencies
  - 13 - dependencies (JS), mainly D3js modules like
    [d3-geo-projection.min.js](https://cdn.jsdelivr.net/npm/d3-geo-projection@2.7.0/dist/d3-geo-projection.min.js)
- does not work locally (offline) since it depends on requests to
  cdn.jsdeliver.net, api.observablehq.com and unpkg.com
- requires to setup hosting before the webpage to be published online

## How to adapt to another notebook

The steps to adapt the solution to another notebook, say
[Breakout!](https://observablehq.com/@jashkenas/breakout) are:

- determine which cells to include in the webpage. For example: `viewof c` (the
  game), `viewof newgame` (the restart button) and `viewof speed` (the speed
  controller)
- adapt the HTML template, replacing

      ```html
      <title>Tissot's indicatrix</title>
      (...)
      <!-- Title of the page -->
      <h1>Tissot's indicatrix</h1>

      <!-- Empty placeholders -->
      <div id="map"></div>
      <p id="controls"></p>
      ```

  with

      ```html
      <!-- Title of the page -->
      <title>Breakout!</title>
      (...)
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
          case 'display':
            // render 'display' notebook cell into <div id="map"></div>
            return new Inspector(document.querySelector('#map'));
            break;
          case 'viewof p':
            // render 'viewof p' notebook cell into <p id="controls"></p>
            return new Inspector(document.querySelector('#controls'));
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
