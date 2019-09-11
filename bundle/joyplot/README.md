# Standalone joyplot notebook

Local standalone version of the
[joyplot notebook](https://observablehq.com/@mbostock/psr-b1919-21) by Mike
Bostock. See also
[Standalone App Notebook](https://github.com/Fil/SphericalContoursStandalone/).

Basic usage:

- first install

  ```bash
  cd joyplot
  npm run setup
  ```

- run locally

  ```bash
  npm run serve
  ```

- deploy on now.sh (see https://joyplot-65flet8xb.now.sh/):

  ```bash
  npm run deploy
  ```

Advanced usage:

- update the notebook:

  ```
  npm run notebook
  ```

- update the data:

  ```
  npm run data
  ```

- remove the temporary files:

  ```
  npm run clean
  ```
