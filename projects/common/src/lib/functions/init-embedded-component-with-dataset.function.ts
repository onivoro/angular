import { TApiCredentials } from "../types/api-credentials.type";
import { stylizeWithDataset } from "./stylize-with-dataset.function";

export function initEmbeddedComponentWithDataset(nativeElement: HTMLElement, credentialHandler: (credentials: TApiCredentials) => void, attributeMap: Record<string, string> = {}) {
    const dataset = nativeElement.dataset;

    const { apiId = '', apiKey = '' } = dataset;

    credentialHandler({ apiId, apiKey });

    stylizeWithDataset(nativeElement);

    const attributes: Record<string, string> = attributeMap || {};

    if (attributeMap) {
        Object.keys(attributeMap).forEach(key => {
            const value = dataset[key];
            if (value) {
                attributes[key] = value;
            }
        });
    }

    return attributes;
}
