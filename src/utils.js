export function colorObjectToString(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
};

export function color888To565(color) {
    return {
        r: color.r & 0b11111000,
        g: color.g & 0b11111100,
        b: color.b & 0b11111000
    };
}

export function equalColors(color1, color2) {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
}
