import { setThenNegate } from "./set-then-negate.function";

export function falseThenTrue<T extends Record<string, any>>(obj: T, property: keyof T): void {
    setThenNegate(obj, property, false);
}
