import { TApiCredentials } from "../types/api-credentials.type";
import { stylizeWithDataset } from "./stylize-with-dataset.function";

export function initEmbeddedComponentWithDataset(nativeElement: HTMLElement, credentialHandler: (credentials: TApiCredentials) => void, attributeMap = {}) {
    const dataset = nativeElement.dataset;

    const { apiId = '', apiKey = '' } = dataset;

    credentialHandler({ apiId, apiKey });

    stylizeWithDataset(nativeElement);

    Object.entries(dataset).forEach(([key, value]) => (attributeMap as any)[key] = value);

    return attributeMap;
}
