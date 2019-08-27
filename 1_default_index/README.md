# README

This method is the simplest way to migrate an
[Observable notebook](https://observablehq.com/@fil/tissots-indicatrix/) to a
standalone webpage.

## Install

- Go to the [notebook](https://observablehq.com/@fil/tissots-indicatrix), click
  on "…" and then on "Download tarball")
- Uncompress the tissots-indicatrix.tgz file
- Serve the index.html file with a web server

Using cli:

```
mkdir /tmp/notebook
cd /tmp/notebook
curl -o notebook.tgz https://api.observablehq.com/@fil/tissots-indicatrix.tgz?v=3
tar xf notebook.tgz
python3 -m http.server
```

and open a browser at http://localhost:8000.

## Pros

- very simple, there is nothing to code or install
- some of the resources are served locally:
  - 3 - Observable notebooks modules (JS):
    [Tissot's indicatrix](https://api.observablehq.com/@fil/tissots-indicatrix.js?v=3)
    and its two dependencies:
    [@fil/base-map](https://api.observablehq.com/@fil/base-map.js?v=3) and
    [@jashkenas/inputs](https://api.observablehq.com/@jashkenas/inputs.js?v=3)
  - 1 - the
    [runtime.js](https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js)
    Observable library (JS)
  - 1 - the CSS inspector.css file
- there is no dependence with api.observablehq.com at runtime

## Cons

- requires browser
  [compatibility with ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility)
- generates many HTTP requests (42), and 37 of which are remote:
  - 1 - the
    [110m_land.geojson](https://unpkg.com/visionscarto-world-atlas@0.0.6/world/110m_land.geojson)
    data file (GeoJSON)
  - 23 - technical files
    ([package.json](https://cdn.jsdelivr.net/npm/d3-selection/package.json)) to
    determine the required dependencies
  - 13 - dependencies (JS), mainly D3js modules like
    [d3-geo-projection.min.js](https://cdn.jsdelivr.net/npm/d3-geo-projection@2.7.0/dist/d3-geo-projection.min.js)
- does not work locally (offline) since it depends on requests to
  cdn.jsdeliver.net and unpkg.com
- requires to setup hosting before the webpage to be published online
