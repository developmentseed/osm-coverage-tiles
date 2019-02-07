# OSM road/building coverage by tiles

This is a script to get the road and buildings coverage by tiles using the OpenStreetMap data.

# Usage

```
osmcov <file.mbtiles> --zoom=15 > output.json
```

#### Arguments:

- `zoom`, It should be the same zoom as the mbtiles.
- `bbox`  We could pass this parameter to reduce the size of evaluation.


# Installation

```
$ git clone https://github.com/developmentseed/osm-coverage-tiles.git
$ cd osm-coverage-tiles/
$ npm link
```