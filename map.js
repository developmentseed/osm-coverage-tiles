'use strict';

const turf = require('@turf/turf');
const _ = require('underscore');
const cover = require('@mapbox/tile-cover');

module.exports = function(tileLayers, tile, writeData, done) {
  const layer = tileLayers.osm.osm;
  let result = turf.bboxPolygon(turf.bbox(tileLayers.osm.osm));
  const objectTypes = global.mapOptions.objectTypes.split(',');
  /**
   * We are going to need polygon for the tiles,if you want to get bbox that are more precise disable the following code
   */
  const centroid = turf.centroid(result);
  const limits = {
    min_zoom: tile[2],
    max_zoom: tile[2]
  };
  const tileGeojson = cover.geojson(centroid.geometry, limits);
  const tileTiles = cover.tiles(centroid.geometry, limits);
  for (let index = 0; index < tileTiles.length; index++) {
    if (_.flatten(tileTiles[index], tile).length === 3) {
      result = tileGeojson.features[index];
      break;
    }
  }

  objectTypes.forEach(type => {
    result.properties[`${type}-area`] = 0;
    result.properties[`${type}-distance`] = 0;
    result.properties[`${type}-point`] = 0;
  });

  for (let i = 0; i < layer.features.length; i++) {
    const feature = layer.features[i];
    const coordinates = feature.geometry.coordinates[0];
    for (let indexObj = 0; indexObj < objectTypes.length; indexObj++) {
      const type = objectTypes[indexObj];
      if (feature.properties[type]) {
        /**
         * Get the area in km2
         */
        if (coordinates.length >= 3 && _.flatten(coordinates[0], coordinates[coordinates.length - 1]).length === 2) {
          result.properties[`${type}-area`] += turf.area(feature) || 0;
        }
        /**
         * Get the points
         */
        if (feature.geometry.type === 'Point') {
          result.properties[`${type}-point`] += 1;
        }
        /**
         * Get the distance in km
         */
        if (feature.geometry.type === 'LineString') {
          result.properties[`${type}-distance`] += distance(feature) || 0;
        } else if (feature.geometry.type === 'MultiLineString') {
          for (let i = 0; i < feature.geometry.coordinates.length; i++) {
            const line = turf.lineString(feature.geometry.coordinates[i]);
            result.properties[`${type}-distance`] += distance(line) || 0;
          }
        }
      }
    }
  }

  // filter the tiles which does not have any distance or area
  const values = _.values(result.properties).filter(v => {
    return v > 0;
  });
  if (values.length > 0) {
    writeData(JSON.stringify(result) + '\n');
  }
  done(null, null);
};

function distance(line) {
  let lineDistance = 0;
  for (let i = 0; i < line.geometry.coordinates.length - 1; i++) {
    const coord1 = line.geometry.coordinates[i];
    const coord2 = line.geometry.coordinates[i + 1];
    const from = turf.point(coord1);
    const to = turf.point(coord2);
    const d = turf.distance(from, to, {
      units: 'kilometers'
    });
    lineDistance += d;
  }
  return lineDistance;
}
