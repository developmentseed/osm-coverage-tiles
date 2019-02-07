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
$ git clone git@github.com:Rub21/osm-population-tiles.git
$ cd osm-population-tiles/
$ npm link
```