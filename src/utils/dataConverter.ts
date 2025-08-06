import shp from "shpjs";
import * as toGeoJSON from "@tmcw/togeojson";
import Papa from "papaparse";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export async function convertToGeoJSON(
    file: File
): Promise<FeatureCollection<Geometry, GeoJsonProperties> | null> {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "geojson" || ext === "json") {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.type === "FeatureCollection") return data;
        return null;
    }

    if (ext === "zip") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await shp(arrayBuffer);

        // shapefile birden fazla katman içerirse array dönebilir
        if (Array.isArray(result)) {
            // ilk FeatureCollection'ı al
            return result[0] as FeatureCollection<Geometry, GeoJsonProperties>;
        } else {
            return result as FeatureCollection<Geometry, GeoJsonProperties>;
        }
    }

    if (ext === "kml") {
        const text = await file.text();
        const parser = new DOMParser();
        const kmlDom = parser.parseFromString(text, "text/xml");
        const fc = toGeoJSON.kml(kmlDom);

        // geometry: null olanları ayıkla
        const filteredFeatures = fc.features.filter(
            (f): f is typeof f & { geometry: Geometry } => f.geometry !== null
        );

        return {
            type: "FeatureCollection",
            features: filteredFeatures,
        };
    }

    if (ext === "csv") {
        const text = await file.text();
        const result = Papa.parse(text, { header: true });
        return csvToGeoJSON(result.data as any[]);
    }

    return null;
}

function csvToGeoJSON(data: any[]): FeatureCollection<Geometry, GeoJsonProperties> {
    const features = data
        .filter((row) => row.longitude && row.latitude)
        .map((row) => ({
            type: "Feature" as const, // HATAYI ENGELLER
            geometry: {
                type: "Point" as const,
                coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
            },
            properties: row,
        }));

    return {
        type: "FeatureCollection" as const,
        features,
    };
}
