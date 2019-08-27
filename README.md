# Observable notebook to standalone application

This repository provides various methods to migrate an
[Observable](https://observablehq.com/) notebook to a standalone webpage.

- [download and extract tgz from Observable notebook](./1_default_index/README.md)
  to use the default index.html file provided in the tgz file
- [get JavaScript modules from api.observablehq.com](./2_request_observable/README.md)
  at runtime
- [bundle JavaScript modules](./3_bundle_js_module_and_deploy) into a single
  module, and deploy to now.sh
- [rewrite notebook cells to native JavaScript](./4_rewrite_code/README.md) for
  a pure standalone application

Note: you could also try
[zzzev/observable-press: An opinionated way to publish Observable (observablehq.com) notebooks.](https://github.com/zzzev/observable-press)
as an alternative to the methods described above.

References:

- ["How-To… Embed an Observable Notebook in your CMS"](https://visionscarto.net/observable-jekyll/).
- [Downloading and Embedding Notebooks](https://observablehq.com/@observablehq/downloading-and-embedding-notebooks)
- [@observablehq/runtime](https://github.com/observablehq/runtime/blob/master/README.md)
