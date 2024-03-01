import { colors } from "../constants/colors.constant";

export function stylize(nativeElement: HTMLElement) {
    const style = document.createElement('style')

    style.innerHTML = [
        `:root {`,
        ...colors.map(color => {
            const value = nativeElement.getAttribute(color) || '';
            return value ? `--${color}: ${value};` : '';
        }),
        `}`
    ].join('');

    document.body.appendChild(style);
}