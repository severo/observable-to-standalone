#! /usr/bin/env node
const request = require('request');
const fs = require('fs');
const fetchAlias = require('../src/fetchAlias.json');
const DIR = './public';

for (const url of Object.keys(fetchAlias)) {
  const filename = `${DIR}/${fetchAlias[url]}`;
  console.warn(`download ${filename} from ${url}`);
  request(url).pipe(fs.createWriteStream(filename));
}
