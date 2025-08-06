import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from "ol/style";
import chroma from "chroma-js";

interface CreateThematicLayerParams {
    featureCollection: any;
    dataValueProperty?: string;
    data?: any[];
    matchFunction?: (featureProps: any, dataItem: any) => boolean;
    getColor: (val: number) => string;
    opacity?: number; // 0-1 arası
}

export function createThematicLayer({
    featureCollection,
    dataValueProperty,
    data = [],
    matchFunction,
    getColor,
    opacity = 1,
}: CreateThematicLayerParams) {
    const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(featureCollection, {
            featureProjection: "EPSG:3857",
        }),
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        opacity,
        style: (feature) => {
            let valRaw;
            if (data.length && matchFunction) {
                const matchedItem = data.find((d) =>
                    matchFunction(feature.getProperties() ?? {}, d)
                );
                valRaw = matchedItem ? matchedItem.value : undefined;
            } else if (dataValueProperty) {
                valRaw = feature.get(dataValueProperty);
            }
            const valNum = Number(valRaw);
            const fillColor = getColor(valRaw);

            return new Style({
                fill: new Fill({ color: fillColor }),
                stroke: new Stroke({ color: "#333", width: 1 }),
            });
        },
    });

    return vectorLayer;
}

