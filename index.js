#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const tileReduce = require('@mapbox/tile-reduce');
var path = require('path');

tileReduce({
  bbox: argv.bbox,
  zoom: argv.zoom,
  map: path.join(__dirname, '/map.js'),
  sources: [
    {
      name: 'osm',
      mbtiles: argv._[0],
      raw: false
    }
  ],
  mapOptions: {
    objectTypes: argv.types
  }
})
  .on('reduce', function() {})
  .on('end', function() {});
