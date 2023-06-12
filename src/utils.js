import { Tooltip } from 'bootstrap'

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

export function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    return [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
}

export function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function colorTo565Int(color) {
    let high = 0;
    let low  = 0;

    high = color.r & 0b11111000;                 // Primeiros 5 bits são o vermelho
    high |= color.g >> 5;                        // Bits 6 até 8 são os primeiros 3 bits do verde
    low  = (color.g & 0b11111100) << 3;          // Bits 9 até 11 sãos os últimos 3 bits do verde
    low  &= 0b11100000;                          // Zera os bits inutilizados
    low  |= color.b >> 3;                       // Bits 12 até 16 são o azul

    // É necessário inverter os bytes pois a tela funciona em big endian
    return ((low << 8) | high);
}

