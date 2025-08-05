import chroma from "chroma-js";
import { ColorStrategy, ThematicData } from "../types";

// Sayısal veriler için renk skalası oluşturur
export function getNumericColorScale(data: ThematicData[], palette?: string[]) {
    const numericValues = data
        .map((item) => Number(item.value))
        .filter((val) => !isNaN(val));

    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);

    const scale = chroma
        .scale(palette || ["#f2f0f7", "#6a51a3"])
        .domain([min, max]);

    return (value: number | string): string => {
        const num = Number(value);
        return isNaN(num) ? "#ccc" : scale(num).hex();
    };
}

// Kategorik veriler(sayısal olmayan veriler) için renk haritası oluşturur
export function getCategoricalColorScale(data: ThematicData[], palette?: string[]) {
    const uniqueCategories = Array.from(
        new Set(data.map((item) => String(item.value)))
    );

    const colors = palette || chroma.scale("Set3").colors(uniqueCategories.length);

    const categoryColorMap: Record<string, string> = {};
    uniqueCategories.forEach((cat, i) => {
        categoryColorMap[cat] = colors[i % colors.length];
    });

    return (value: string | number): string => {
        const key = String(value);
        return categoryColorMap[key] || "#ccc";
    };
}

// Genel renk sağlayıcı: stratejiye göre uygun fonksiyonu döner
export function getColorFunction(
    strategy: ColorStrategy,
    data: ThematicData[],
    palette?: string[]
): (value: string | number) => string {
    return strategy === "categorical"
        ? getCategoricalColorScale(data, palette)
        : getNumericColorScale(data, palette);
}

// HEX rengini RGB nesnesine çevirir
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : { r: 100, g: 100, b: 100 };
}

// Rengi koyulaştırır (ratio: 0–1 arası)
export function interpolateColor(hex: string, ratio: number): string {
    const rgb = hexToRgb(hex);
    // ratio: 0 (min) açık renk, 1 (max) koyu renk olsun
    const darknessFactor = 0.3; // %30 koyuluk örneği

    const r = Math.round(rgb.r * (1 - darknessFactor * ratio));
    const g = Math.round(rgb.g * (1 - darknessFactor * ratio));
    const b = Math.round(rgb.b * (1 - darknessFactor * ratio));

    return `rgb(${r}, ${g}, ${b})`;
}

// 5 parçaya bölünmüş legend item oluşturur
export function generateLegendItems(
    min: number,
    max: number,
    baseColor: string,
    opacity: number = 1
): { label: string; color: string }[] {
    const items = [];
    const steps = 5;
    const range = max - min;
    const stepSize = range / steps;

    for (let i = 0; i < steps; i++) {
        const start = min + i * stepSize;
        const end = min + (i + 1) * stepSize;
        const ratio = (i + 0.5) / steps;

        // Renk hesapla (örneğin koyuluk için interpolateColor)
        const rgbColor = interpolateColor(baseColor, ratio);

        // rgb stringini rgba yap (opacity ile)
        const color = rgbColor.replace(
            /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
            (_match, r, g, b) => `rgba(${r}, ${g}, ${b}, ${opacity})`
        );

        items.push({
            label: `${start.toFixed(0)} - ${end.toFixed(0)}`,
            color,
        });
    }

    return items;
}
