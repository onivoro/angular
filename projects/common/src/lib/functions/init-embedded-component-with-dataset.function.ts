import { TApiCredentials } from "../types/api-credentials.type";
import { stylizeWithDataset } from "./stylize-with-dataset.function";

export function initEmbeddedComponentWithDataset(nativeElement: HTMLElement, credentialHandler: (credentials: TApiCredentials) => void) {
    const dataset = nativeElement.dataset;

    const { apiId = '', apiKey = '' } = dataset;

    credentialHandler({ apiId, apiKey });

    stylizeWithDataset(nativeElement);

    return dataset;
}
