export function setThenNegate<T extends Record<string, any>>(obj: T, property: keyof T, value: boolean): void {
    obj[property] = value as any;
    setTimeout(() => {
        obj[property] = !value as any;
    }, 0);
}
