import React, { useState, useCallback } from "react";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import ThematicMap from "./components/ThematicMap";
import ThematicMenu from "./components/ThematicMenu";
import FileUploader from "./components/FileUploader";

function App() {
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [baseColor, setBaseColor] = useState("#6495ED");
  const [opacity, setOpacity] = useState(80);
  const [availableProperties, setAvailableProperties] = useState<string[]>([]);
  const [legendItems, setLegendItems] = useState<{ label: string; color: string }[]>([]);
  const [legendStepCount, setLegendStepCount] = useState<number>(3); // default 3

  const mapParser = useCallback((input: any) => input, []);

  const handleGeoJSONReady = (data: FeatureCollection<Geometry, GeoJsonProperties>) => {
    setGeoData(data);

    // Tüm property adlarını topluyor
    const allProps = data.features.flatMap((f) => Object.keys(f.properties || {}));
    // Tekrar edenleri sil, sadece ilk feature'ın string/number/boolean tipteki alanlarını bırak
    const uniqueProps = Array.from(new Set(allProps)).filter((key) => {
      const sampleVal = data.features[0].properties?.[key];
      return typeof sampleVal === "string" || typeof sampleVal === "number" || typeof sampleVal === "boolean";
    });

    setAvailableProperties(uniqueProps);
    setSelectedProperty(uniqueProps[0]); // otomatik ilk alan seçiliyor
  };

  return (
    <div>
      <FileUploader onGeoJSONReady={handleGeoJSONReady} />

      {!geoData || !selectedProperty ? (
        <div style={{ padding: "10px" }}>Lütfen geçerli bir dosya yükleyin.</div>
      ) : (
        <>
          <ThematicMenu
            properties={availableProperties}
            selectedProperty={selectedProperty}
            onPropertyChange={setSelectedProperty}
            baseColor={baseColor}
            onBaseColorChange={setBaseColor}
            opacity={opacity}
            onOpacityChange={setOpacity}
            legendItems={legendItems}
            legendStepCount={legendStepCount}
            onLegendStepCountChange={setLegendStepCount}
          />

          <ThematicMap
            rawMapData={geoData}
            mapParser={mapParser}
            dataValueProperty={selectedProperty}
            opacity={opacity / 100}
            baseColor={baseColor}
            setLegendItems={setLegendItems}
            legendStepCount={legendStepCount}
          />
        </>
      )}
    </div>
  );
}

export default App;

//---------------------------------------------------------
































// import React, { useState, useEffect, useCallback } from "react";
// import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
// import ThematicMap from "./components/ThematicMap";
// import ThematicMenu from "./components/ThematicMenu";

// function App() {
//   const [geoData, setGeoData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
//   const [selectedProperty, setSelectedProperty] = useState<string>("");
//   const [baseColor, setBaseColor] = useState("#6495ED");
//   const [opacity, setOpacity] = useState(80);
//   const [availableProperties, setAvailableProperties] = useState<string[]>([]);
//   const [legendItems, setLegendItems] = useState<{ label: string; color: string }[]>([]);

//   const [legendStepCount, setLegendStepCount] = useState<number>(3);        // default 3

//   const mapParser = useCallback((input: any) => input, []);

//   useEffect(() => {
//     fetch("/data/export5.geojson")
//       .then((res) => res.json())
//       .then((data: FeatureCollection<Geometry, GeoJsonProperties>) => {
//         setGeoData(data);
//         const allProps = data.features.flatMap((f) => Object.keys(f.properties || {}));
//         const uniqueProps = Array.from(new Set(allProps)).filter((key) =>
//           typeof data.features[0].properties?.[key] === "string" || typeof data.features[0].properties?.[key] === "number" || typeof data.features[0].properties?.[key] === "boolean"     // sayısal / string alanalr dropdownda gösteriliyor
//         );
//         setAvailableProperties(uniqueProps);
//         setSelectedProperty(uniqueProps[0]);
//       })
//       .catch((err) => console.error("GeoJSON fetch error:", err));
//   }, []);

//   if (!geoData || !selectedProperty) return <div>Loading...</div>;

//   return (
//     <div>
//       <ThematicMenu
//         properties={availableProperties}
//         selectedProperty={selectedProperty}
//         onPropertyChange={setSelectedProperty}
//         baseColor={baseColor}
//         onBaseColorChange={setBaseColor}
//         opacity={opacity}
//         onOpacityChange={setOpacity}
//         legendItems={legendItems}
//         legendStepCount={legendStepCount}
//         onLegendStepCountChange={setLegendStepCount}
//       />

//       <ThematicMap
//         rawMapData={geoData}
//         mapParser={mapParser}
//         dataValueProperty={selectedProperty}
//         opacity={opacity / 100}
//         baseColor={baseColor}
//         setLegendItems={setLegendItems}
//         legendStepCount={legendStepCount}
//       />
//     </div>
//   );
// }

// export default App;
