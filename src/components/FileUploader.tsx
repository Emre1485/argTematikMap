import React from "react";
import { convertToGeoJSON } from "../utils/dataConverter";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

interface FileUploaderProps {
    onGeoJSONReady: (geojson: FeatureCollection<Geometry, GeoJsonProperties>) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onGeoJSONReady }) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const geojson = await convertToGeoJSON(file);

        if (geojson) {
            onGeoJSONReady(geojson);
        } else {
            alert("Desteklenmeyen veya geçersiz dosya.");
        }
    };

    return (
        <div style={{ padding: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Veri Dosyası Yükle: </label>
            <input
                type="file"
                accept=".geojson,.json,.csv,.kml,.zip"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FileUploader;
