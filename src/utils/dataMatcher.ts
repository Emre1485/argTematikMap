import { ThematicData, MatchFunction } from "../types";

// 1. En basit eşleşme: Feature içindeki bir property ile data.id eşleşir
export function matchByProperty(propertyName: string): MatchFunction {
    return (featureProps, dataItem) => featureProps[propertyName] === dataItem.id;
}


// 2. Tüm feature properties içinde id ile eşleşen bir değer aranır
export const looseMatch: MatchFunction = (feature, dataItem) => {
    return Object.values(feature.properties || {}).some(
        (val) => String(val).toLowerCase() === String(dataItem.id).toLowerCase()
    );
};

// 3. Kendi özel eşleştirme fonksiyonunu yazmak için örnek:
// export const customMatch: MatchFunction = (feature, dataItem) => {
//   return feature.properties?.["kodu"] === dataItem.id;
// };
