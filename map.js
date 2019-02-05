'use strict';

const turf = require('@turf/turf');
const _ = require('underscore');
const cover = require('@mapbox/tile-cover');

module.exports = function(tileLayers, tile, writeData, done) {
  const layer = tileLayers.osm.osm;
  let buildingArea = 0;
  let highwayDistance = 0;
  let result = turf.bboxPolygon(turf.bbox(tileLayers.osm.osm));
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

  for (let i = 0; i < layer.features.length; i++) {
    const feature = layer.features[i];
    /**
     * Get the area for building in km2
     */
    const coordinates = feature.geometry.coordinates;
    if (
      feature.properties.building &&
      coordinates.length > 4 &&
      _.flatten(coordinates[0], coordinates[coordinates.length - 1]).length == 2
    ) {
      const polygon = turf.lineToPolygon(feature);
      buildingArea += turf.area(polygon);
    }
    /**
     * Get the distance for Highways in km
     */
    if (feature.properties.highway) {
      if (feature.geometry.type === 'LineString') {
        highwayDistance += distance(feature);
      } else if (feature.geometry.type === 'MultiLineString') {
        for (let i = 0; i < feature.geometry.coordinates.length; i++) {
          const line = turf.lineString(feature.geometry.coordinates[i]);
          highwayDistance += distance(line) / 1000;
        }
      }
    }
  }

  if (buildingArea > 0 || highwayDistance > 0) {
    result.properties.area = buildingArea;
    result.properties.distance = highwayDistance;
    result.properties.tile = tile;
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
