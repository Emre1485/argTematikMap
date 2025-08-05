import React from "react";

export interface LegendItem {
    label: string;
    color: string;
}

interface LegendProps {
    items: LegendItem[];
    title?: string;
}

const Legend: React.FC<LegendProps> = ({ items, title = "Legend" }) => {
    return (
        <div
            style={{
                backgroundColor: "#fff",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                fontSize: 13,
                width: 180,
                zIndex: 1000,
            }}
        >
            <h4 style={{ marginBottom: 10 }}>{title}</h4>
            {items.map((item, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 6,
                    }}
                >
                    <div
                        style={{
                            width: 24,
                            height: 16,
                            backgroundColor: item.color,
                            border: "1px solid #999",
                            marginRight: 8,
                        }}
                    />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default Legend;
