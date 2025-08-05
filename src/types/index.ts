// npm install --save-dev @types/geojson


// Tematik veri formatı
export interface ThematicData {
    id: string | number;          // GeoJSON feature ile eşleşecek değer (ör: "Akyurt")
    value: number | string;       // Tematik olarak görselleştirilecek veri (ör: nüfus)
    [key: string]: any;           // Ek bilgiler için esneklik
}

// GeoJSON ile dış veri eşleştirmek için kullanılan fonksiyon tipi
export type MatchFunction = (
    featureProperties: { [key: string]: any },
    dataItem: ThematicData
) => boolean;


// Renk üretim stratejisi(nümerik olunca tematik 0-255 gidiyor hani, diğer türlerde sabit)
export type ColorStrategy = 'numeric' | 'categorical';

// Ham map verisini GeoJSON FeatureCollection'a dönüştüren fonksiyon tipi
export type MapParser = (input: any) => GeoJSON.FeatureCollection;

// Tematik harita bileşeni için props tipi
export interface ThematicProps {
    rawMapData: any;                             // GeoJSON, KML, Shapefile gibi ham veri
    mapParser: MapParser;                        // Ham veriyi FeatureCollection'a çeviren fonksiyon
    data: ThematicData[];                        // Dış veri (ör: nüfus, yoğunluk vb.)
    matchFunction: MatchFunction;                // Veri eşleştirme fonksiyonu
    colorStrategy?: ColorStrategy;               // Varsayılan: numeric
    colorPalette?: string[];                     // Renk paleti (isteğe bağlı)
}
