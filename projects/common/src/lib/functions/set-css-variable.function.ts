import { setCssProperty } from "./set-css-property.function";

export function setCssVariable(name: string, value: string, selector = ':root') {
    setCssProperty(`--${name}`, value, selector);
}
