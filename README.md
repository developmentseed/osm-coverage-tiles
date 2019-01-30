# OSM population tiles

Get the tiles from the urban areas according to OpenStreetMap data.

# Usage

```
osmpt <file.mbtiles> --zoom=15 > output.json
```


#### Arguments:

- `zoom`, It should be the same zoom as the mbtiles.
- `bbox`  We could pass this parameter to reduce the size of evaluation 


# Install

```
$ git clone git@github.com:Rub21/osm-population-tiles.git
$ cd osm-population-tiles/
$ npm link
```