# OSM road/building coverage by tiles

This is a script to get the road and buildings coverage by tiles using the OpenStreetMap data.

![ezgif com-optimize](https://user-images.githubusercontent.com/1152236/54037072-437c7400-418b-11e9-85f7-1f4da4684352.gif)


## Installation

```
$ git clone https://github.com/developmentseed/osm-coverage-tiles.git
$ cd osm-coverage-tiles/
$ npm link
```

## Usage

```
osmcov <file.mbtiles> --zoom=15 > output.json
```

#### Arguments

- `zoom`, It should be the same zoom as the mbtiles.
- `bbox`, We could pass this parameter to reduce the size of evaluation.

## Where to get the Mbtiles?

- We can get the Mbtiles from http://osmlab.github.io/osm-qa-tiles/, at zoom 12.

## Creating our own Mbtiles

For creating the mbtiles is necesary to use [minjur](https://github.com/mapbox/minjur) and [tippecanoe](https://github.com/mapbox/tippecanoe), both tool we could find in [geokit](https://github.com/developmentseed/geokit).

```
$ wget http://download.geofabrik.de/south-america/colombia-latest.osm.bz2
$ docker run --rm -v ${PWD}:/mnt/data developmentseed/geokit:latest minjur colombia-latest.osm.bz2 > colombia.geojson
$ docker run --rm -v ${PWD}:/mnt/data developmentseed/geokit:latest tippecanoe -l osm -n osm-latest -o colombia.mbtiles -z15 -Z15 -psfk colombia.geojson
```

## *Note*

The output of `osmcov` command is a json file, which needs to cover into a geojson file, for it we use the [geokit](https://github.com/developmentseed/geokit).

```
docker run --rm -v ${PWD}:/mnt/data developmentseed/geokit:latest geokit jsonlines2geojson output.json > colombia-tiles.geojsons
```