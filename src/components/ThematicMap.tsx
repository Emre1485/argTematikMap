import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { fromLonLat } from "ol/proj";
import baseLayer from "../layers/baseLayer";
import { createThematicLayer } from "../layers/thematicLayer";
import { generateLegendItems } from "../utils/colorScale";
import chroma from "chroma-js";

interface ThematicMapProps {
    rawMapData: FeatureCollection<Geometry, GeoJsonProperties>;
    mapParser: (input: any) => FeatureCollection<Geometry, GeoJsonProperties>;
    dataValueProperty: string;
    opacity?: number;
    baseColor?: string;
    setLegendItems?: (items: { label: string; color: string }[]) => void;
    legendStepCount: number;
}

const ThematicMap: React.FC<ThematicMapProps> = ({
    rawMapData,
    mapParser,
    dataValueProperty,
    opacity = 1,
    baseColor = "#fdfb6fff",
    setLegendItems,
    legendStepCount,
}) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<Map | null>(null);
    const thematicLayerRef = useRef<any>(null);

    useEffect(() => {
        if (!rawMapData?.features?.length || !dataValueProperty) return;

        if (!mapInstance.current) {
            mapInstance.current = new Map({
                target: mapRef.current!,
                layers: [baseLayer],
                view: new View({
                    center: fromLonLat([32.85, 39.93]),
                    zoom: 8,
                }),
            });
        }

        const featureCollection = mapParser(rawMapData);
        const rawValues = featureCollection.features.map((f) => f.properties?.[dataValueProperty]);

        // === NUMERIC ===
        const numericValues = rawValues.map((v) => Number(v)).filter((v) => !isNaN(v));
        if (numericValues.length > 0) {
            const min = Math.min(...numericValues);
            const max = Math.max(...numericValues);

            const legend = generateLegendItems(min, max, baseColor, opacity, legendStepCount);
            setLegendItems?.(legend);

            const getColor = (val: number) => {
                if (isNaN(val)) return "#ccc";
                for (const item of legend) {
                    const [startStr, endStr] = item.label.split(" - ");
                    const start = parseFloat(startStr);
                    const end = parseFloat(endStr);
                    if (val >= start && val <= end) return item.color;
                }
                return "#ccc";
            };

            if (thematicLayerRef.current) {
                mapInstance.current.removeLayer(thematicLayerRef.current);
            }

            thematicLayerRef.current = createThematicLayer({
                featureCollection,
                dataValueProperty,
                getColor,
                opacity,
            });

            mapInstance.current.addLayer(thematicLayerRef.current);
            return;
        }

        // === CATEGORICAL ===
        const processedValues = rawValues.map((val) => {
            return val === null || val === undefined || val === "" ? "empty" : String(val);
        });
        const uniqueCategories = Array.from(new Set(processedValues));

        const colorScale = chroma.scale("Set3").colors(uniqueCategories.length);
        const categoryColorMap: Record<string, string> = {};
        uniqueCategories.forEach((cat, i) => {
            categoryColorMap[cat] = chroma(colorScale[i]).alpha(opacity).css();
        });

        const getColor = (val: any) => {
            const key = val === null || val === undefined || val === "" ? "empty" : String(val);
            return categoryColorMap[key] || "#ccc";
        };

        const legend = uniqueCategories.map((cat) => ({
            label: cat === "empty" ? "Veri Yok" : cat,
            color: categoryColorMap[cat],
        }));

        setLegendItems?.(legend);

        if (thematicLayerRef.current) {
            mapInstance.current.removeLayer(thematicLayerRef.current);
        }

        thematicLayerRef.current = createThematicLayer({
            featureCollection,
            dataValueProperty,
            getColor,
            opacity,
        });

        mapInstance.current.addLayer(thematicLayerRef.current);
    }, [
        rawMapData,
        dataValueProperty,
        baseColor,
        opacity,
        mapParser,
        setLegendItems,
        legendStepCount,
    ]);

    return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ThematicMap;
