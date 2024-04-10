import { colors } from "../constants/colors.constant";

export function stylizeWithDataset(nativeElement: HTMLElement) {
    const style = document.createElement('style')
    const dataset = nativeElement.dataset;
    style.innerHTML = [
        `:root {`,
        ...colors.map(color => {
            const name = color.replace('-muted', 'Muted').replace('-contrast', 'Contrast');
            const value = dataset[name] || '';
            return value ? `--${color}: ${value};` : '';
        }),
        `}`
    ].join('');

    document.body.appendChild(style);
}