import { TApiCredentials } from "../types/api-credentials.type";
import { stylize } from "./stylize.function";
import { kebabCase } from './kebab-case.function';

export function initEmbeddedComponent(nativeElement: HTMLElement, credentialHandler: (credentials: TApiCredentials) => void, attributeMap: Record<string, string> = {}) {
    const apiId = nativeElement.getAttribute('api-id') || '';
    const apiKey = nativeElement.getAttribute('api-key') || '';

    credentialHandler({apiId, apiKey});

    stylize(nativeElement);

    const attributes: Record<string, string> = attributeMap || {};

    if(attributeMap) {
        Object.keys(attributeMap).forEach(key => {
            const kebabCasedAttr = kebabCase(key);
            // todo: check dataset for the kebabCasedAttr name and override the attribute value
            // (not sure if attr or dataset should have precedence... prob dataset)
            const value = nativeElement.getAttribute(kebabCasedAttr);
            if(value) {
                attributes[key] = value;
            }
        });
    }

    return attributes;
}
