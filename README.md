# Observable notebook to standalone application

Various methods to migrate an
[Observable notebook](https://observablehq.com/@mbostock/psr-b1919-21) to a
standalone webpage.

![Screenshot of a joyplot notebook](./assets/joyplot.png)

## Using ObservableHQ runtime

An Observable notebook can be run as a standalone application using the
[`@observable/runtime` library](https://github.com/observablehq/runtime),
outside of the Observable platform.

The recommended method is to bundle all the modules into a single JavaScript
file, and deploy to now.sh:
[Bundle all modules into a local JavaScript file](./bundle_js_and_deploy)

Other more trivial methods:

- [download and extract tgz from Observable notebook](./default_observable_export/README.md)
  to use the default index.html file provided in the tgz file
- [get JavaScript modules from api.observablehq.com](./request_observable_api/README.md)
  at runtime

## Independent of ObservableHQ runtime

A totally different approach to migrate an Observable notebook to a standalone
application is to rewrite the code from scratch.

See the ["rewrite from scratch" method](./rewrite_from_scratch).

## References

- ["How-To… Embed an Observable Notebook in your CMS"](https://visionscarto.net/observable-jekyll/):
  notebook cells embedded into a Jekyll blog,
- [Downloading and Embedding Notebooks](https://observablehq.com/@observablehq/downloading-and-embedding-notebooks):
  official Observable documentation,
- [zzzev/observable-press: An opinionated way to publish Observable (observablehq.com) notebooks](https://github.com/zzzev/observable-press):
  an untested alternative method.
