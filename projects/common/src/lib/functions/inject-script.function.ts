export function injectScript(src: string) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.onload = resolve;
        s.onerror = reject;
        s.src = src;
        document.body.appendChild(s);
    });
}