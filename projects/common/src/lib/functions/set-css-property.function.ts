export function setCssProperty(key: string, value: string, selector = ':root') {
    const r: HTMLElement = document.querySelector(selector) as HTMLElement;
    r.style.setProperty(key, value);
}
