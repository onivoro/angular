import { initEmbeddedComponent } from './init-embedded-component.function';

const apiKey = 'apiKey';
const apiId = 'apiId';

const setup = () => {
    const slot = getTestElement();
    const mockCredentialHandler = jest.fn();

    return { slot, mockCredentialHandler };
};

describe('initEmbeddedComponent', () => {
    it('sets the api credentials', () => {
        const { slot, mockCredentialHandler } = setup();
        initEmbeddedComponent(slot, mockCredentialHandler);
        expect(mockCredentialHandler).toHaveBeenCalledWith({ apiId, apiKey });
    });

    it('pulls specified attributes from the element', () => {
        const { slot, mockCredentialHandler } = setup();
        const attributes = initEmbeddedComponent(slot, mockCredentialHandler, { id: '123', accentContrast: 'hotpink', notDefined: 'should not change' });
        expect(attributes).toMatchSnapshot();
    });
});

function getTestElement() {
    const slot = document.createElement('div');
    slot.setAttribute('id', 'ui-answers');
    slot.setAttribute('primary', '#58a4b4');
    slot.setAttribute('accent', '#411910');
    slot.setAttribute('primary-contrast', '#ffffff');
    slot.setAttribute('accent-contrast', '#ffffff');
    slot.setAttribute('api-key', apiKey);
    slot.setAttribute('api-id', apiId);
    return slot;
}