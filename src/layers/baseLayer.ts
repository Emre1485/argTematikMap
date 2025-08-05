import { Tile as TileLayer } from "ol/layer";
import OSM from "ol/source/OSM";

const baseLayer = new TileLayer({
    source: new OSM(),
});

export default baseLayer;
