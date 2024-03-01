import { setThenNegate } from "./set-then-negate.function";

export function trueThenFalse<T extends Record<string, any>>(obj: T, property: keyof T): void {
    setThenNegate(obj, property, true);
}
