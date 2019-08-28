# Observable notebook to standalone application

This repository provides various methods to migrate an
[Observable](https://observablehq.com/) notebook to a standalone webpage.

The tutorials will show how to migrate a
[simple joyplot notebook](https://observablehq.com/@mbostock/psr-b1919-21):

![Screenshot of a joyplot notebook](./assets/joyplot.png)

Four tutorials are proposed:

- 1. [download and extract tgz from Observable notebook](./1_default_observable_export/README.md)
     to use the default index.html file provided in the tgz file
- 2. [get JavaScript modules from api.observablehq.com](./2_request_observable_api/README.md)
     at runtime
- 3. [bundle JavaScript modules](./3_bundle_js_and_deploy) into a single
     JavaScript file, and deploy to now.sh

Note: you could also try
[zzzev/observable-press: An opinionated way to publish Observable (observablehq.com) notebooks.](https://github.com/zzzev/observable-press)
as an alternative to the methods described above.

References:

- ["How-To… Embed an Observable Notebook in your CMS"](https://visionscarto.net/observable-jekyll/).
- [Downloading and Embedding Notebooks](https://observablehq.com/@observablehq/downloading-and-embedding-notebooks)
- [@observablehq/runtime](https://github.com/observablehq/runtime/blob/master/README.md)
