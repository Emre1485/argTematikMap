import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { fromLonLat } from "ol/proj";
import baseLayer from "../layers/baseLayer";
import { createThematicLayer } from "../layers/thematicLayer";
import ThematicMenu from "./ThematicMenu";
import { generateLegendItems, interpolateColor } from "../utils/colorScale";

interface ThematicMapProps {
    rawMapData: any;
    mapParser: (input: any) => FeatureCollection<Geometry, GeoJsonProperties>;
    dataValueProperty?: string;
    initialOpacity?: number; // 0 - 1 arası
    initialBaseColor?: string;
    opacity?: number;  // isteğe bağlı, 0-1 arası
    baseColor?: string;
}

const ThematicMap: React.FC<ThematicMapProps> = ({
    rawMapData,
    mapParser,
    dataValueProperty = "",
    initialOpacity = 1,
    initialBaseColor = "#6495ED",
}) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<Map | null>(null);
    const thematicLayerRef = useRef<any>(null);

    const [selectedProperty, setSelectedProperty] = useState(dataValueProperty);
    const [availableProperties, setAvailableProperties] = useState<string[]>([]);

    // State olarak baseColor ve opacity tutuyoruz
    const [baseColor, setBaseColor] = useState(initialBaseColor);
    const [opacity, setOpacity] = useState(initialOpacity);

    const [legendItems, setLegendItems] = useState<{ label: string; color: string }[]>([]);

    useEffect(() => {
        if (!rawMapData?.features?.length) return;

        const keys = Object.keys(rawMapData.features[0].properties || {});
        setAvailableProperties(keys);

        if (!selectedProperty && keys.length > 0) {
            setSelectedProperty(keys[0]);
        }
    }, [rawMapData]);

    useEffect(() => {
        if (!mapRef.current || !selectedProperty) return;

        if (!mapInstance.current) {
            mapInstance.current = new Map({
                target: mapRef.current,
                layers: [baseLayer],
                view: new View({
                    center: fromLonLat([32.85, 39.93]),
                    zoom: 8,
                }),
            });
        }

        const featureCollection = mapParser(rawMapData);

        if (!featureCollection || !Array.isArray(featureCollection.features)) {
            console.error("Geçersiz FeatureCollection:", featureCollection);
            return;
        }

        const values = featureCollection.features
            .map((feature) => {
                const val = feature.properties?.[selectedProperty];
                return val !== undefined && val !== null ? Number(val) : NaN;
            })
            .filter((v) => !isNaN(v));

        if (values.length === 0) {
            console.warn("Seçilen özellik için sayısal veri bulunamadı.");
            setLegendItems([]);
            return;
        }

        const min = Math.min(...values);
        const max = Math.max(...values);

        // Legend renklerini baseColor ve range kullanarak üret
        const legend = generateLegendItems(min, max, baseColor, opacity);
        setLegendItems(legend);

        // Tematik renk fonksiyonu - burada baseColor ile koyuluk hesaplanıyor
        const getColor = (val: number) => {
            if (isNaN(val)) return "#ccc";

            // 0-1 arası normalize değer
            const ratio = (val - min) / (max - min || 1);

            // Yüksek değer koyu renk: interpolateColor fonksiyonu kullanılıyor (ters ratio)
            return interpolateColor(baseColor, ratio);
        };

        // Önce varsa katmanı kaldır
        if (thematicLayerRef.current) {
            mapInstance.current.removeLayer(thematicLayerRef.current);
            thematicLayerRef.current = null;
        }

        // Tematik katman oluştur
        thematicLayerRef.current = createThematicLayer({
            featureCollection,
            dataValueProperty: selectedProperty,
            getColor,
            opacity,
        });

        mapInstance.current.addLayer(thematicLayerRef.current);
    }, [rawMapData, selectedProperty, baseColor, opacity, mapParser]);

    return (
        <>
            <ThematicMenu
                properties={availableProperties}
                selectedProperty={selectedProperty}
                onPropertyChange={setSelectedProperty}
                baseColor={baseColor}
                onBaseColorChange={setBaseColor}
                opacity={Math.round(opacity * 100)}
                onOpacityChange={(val) => setOpacity(val / 100)}
                legendItems={legendItems}
            />
            <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
        </>
    );
};

export default ThematicMap;
