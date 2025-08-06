import React from "react";
import Legend, { LegendItem } from "./Legend";

interface ThematicMenuProps {
    properties: string[];
    selectedProperty: string;
    onPropertyChange: (prop: string) => void;

    baseColor: string;
    onBaseColorChange: (color: string) => void;

    opacity: number;
    onOpacityChange: (opacity: number) => void;

    legendItems: LegendItem[];

    legendStepCount: number;
    onLegendStepCountChange: (count: number) => void;

}

const ThematicMenu: React.FC<ThematicMenuProps> = ({
    properties,
    selectedProperty,
    onPropertyChange,
    baseColor,
    onBaseColorChange,
    opacity,
    onOpacityChange,
    legendItems,
    legendStepCount,
    onLegendStepCountChange

}) => {
    return (
        <div
            style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#fff",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 1000,
                width: 220,
                fontSize: 14,
            }}
        >
            <h4>Tematik Harita Menü</h4>

            <label>
                Alan:
                <select
                    value={selectedProperty}
                    onChange={(e) => onPropertyChange(e.target.value)}
                    style={{ width: "100%", marginTop: 4, marginBottom: 8 }}
                >
                    {properties.map((prop) => (
                        <option key={prop} value={prop}>
                            {prop}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Renk:
                <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => onBaseColorChange(e.target.value)}
                    style={{ width: "100%", marginTop: 4, marginBottom: 8 }}
                />
            </label>

            <label>
                Opaklık: {opacity}%
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={opacity}
                    onChange={(e) => onOpacityChange(Number(e.target.value))}
                    style={{ width: "100%" }}
                />
            </label>
            <label>
                Aralık Sayısı:
                <input
                    type="number"
                    min={1}
                    max={1000}                                      // MAX ARALIK 1000
                    value={legendStepCount}
                    onChange={(e) => onLegendStepCountChange(Number(e.target.value))}
                    style={{ width: "100%", marginTop: 4, marginBottom: 8 }}
                />
            </label>

            <div
                style={{
                    marginTop: 16,
                    maxHeight: legendItems.length > 10 ? 300 : "auto", // dinamik max yükseklik
                    overflowY: legendItems.length > 10 ? "auto" : "visible", // sadece gerekirse scroll
                }}
            >
                <Legend items={legendItems} title="Açıklama" />
            </div>

        </div>
    );
};

export default ThematicMenu;
