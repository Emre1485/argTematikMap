import React, { useState, useEffect } from "react";
import ThematicMap from "./components/ThematicMap";
import ThematicMenu from "./components/ThematicMenu";

function App() {
  const [geoData, setGeoData] = useState<any>(null);

  // Menünün kontrol ettiği state'ler
  const [selectedProperty, setSelectedProperty] = useState("population");
  const [baseColor, setBaseColor] = useState("#6495ED"); // örnek mavi
  const [opacity, setOpacity] = useState(80); // %80

  const [availableProperties, setAvailableProperties] = useState<string[]>([]);
  const [legendItems, setLegendItems] = useState<{ label: string; color: string }[]>([]);

  // GeoJSON verisini yükle
  useEffect(() => {
    fetch("/data/export.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("GeoJSON data:", data);
        setGeoData(data);

        // Özellik isimlerini çıkar
        if (data?.features?.length) {
          const props = data.features[0].properties;
          if (props) {
            setAvailableProperties(Object.keys(props));
          }
        }
      })
      .catch((err) => console.error("GeoJSON fetch hatası:", err));
  }, []);



  if (!geoData) return <div>Loading...</div>;

  return (
    <div>
      <ThematicMenu
        properties={availableProperties}
        selectedProperty={selectedProperty}
        onPropertyChange={setSelectedProperty}
        baseColor={baseColor}
        onBaseColorChange={setBaseColor}
        opacity={opacity}
        onOpacityChange={setOpacity}
        legendItems={legendItems}
      />

      <ThematicMap
        rawMapData={geoData}
        mapParser={(input) => input}
        dataValueProperty={selectedProperty}
        opacity={opacity / 100} // opaklık 0-1 aralığına çevir
        baseColor={baseColor}
      />
    </div>
  );
}

export default App;
