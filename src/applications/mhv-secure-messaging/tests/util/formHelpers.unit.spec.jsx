import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { focusOnErrorField } from '../../util/formHelpers';

describe('formHelpers', () => {
  describe('focusOnErrorField', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('should focus on input element in shadowRoot when error attribute is present', async () => {
      const webComponent = document.createElement('div');
      webComponent.setAttribute('error', 'This field has an error');

      const shadowRoot = webComponent.attachShadow({ mode: 'open' });
      const input = document.createElement('input');
      input.id = 'test-input';
      shadowRoot.appendChild(input);

      container.appendChild(webComponent);

      focusOnErrorField();

      await waitFor(() => {
        expect(document.activeElement).to.equal(webComponent);
      });
    });

    it('should focus on textarea element in shadowRoot when error attribute is present', async () => {
      const webComponent = document.createElement('div');
      webComponent.setAttribute('error', 'This field has an error');

      const shadowRoot = webComponent.attachShadow({ mode: 'open' });
      const textarea = document.createElement('textarea');
      textarea.id = 'test-textarea';
      shadowRoot.appendChild(textarea);

      container.appendChild(webComponent);

      focusOnErrorField();

      await waitFor(() => {
        expect(document.activeElement).to.equal(webComponent);
      });
    });

    it('should focus on select element in shadowRoot when no input or textarea is found', async () => {
      const webComponent = document.createElement('div');
      webComponent.setAttribute('error', 'This field has an error');

      const shadowRoot = webComponent.attachShadow({ mode: 'open' });
      const select = document.createElement('select');
      select.id = 'test-select';
      shadowRoot.appendChild(select);

      container.appendChild(webComponent);

      focusOnErrorField();

      await waitFor(() => {
        expect(document.activeElement).to.equal(webComponent);
      });
    });

    it('should focus on va-checkbox input element when present', async () => {
      const webComponent = document.createElement('div');
      webComponent.setAttribute('error', 'This field has an error');

      const vaCheckbox = document.createElement('va-checkbox');
      const checkboxShadowRoot = vaCheckbox.attachShadow({ mode: 'open' });
      const checkboxInput = document.createElement('input');
      checkboxInput.type = 'checkbox';
      checkboxShadowRoot.appendChild(checkboxInput);

      webComponent.appendChild(vaCheckbox);
      container.appendChild(webComponent);

      focusOnErrorField();

      await waitFor(() => {
        // The focus may be on the va-checkbox element itself or the input inside
        const focused = document.activeElement;
        expect(focused === checkboxInput || focused === vaCheckbox).to.equal(
          true,
        );
      });
    });

    it('should focus on direct input element when no shadowRoot is present', async () => {
      const webComponent = document.createElement('div');
      webComponent.setAttribute('error', 'This field has an error');

      const input = document.createElement('input');
      input.id = 'direct-input';
      webComponent.appendChild(input);

      container.appendChild(webComponent);

      focusOnErrorField();

      await waitFor(() => {
        expect(document.activeElement).to.equal(input);
      });
    });

    it('should do nothing when no elements with error attribute are present', async () => {
      const input = document.createElement('input');
      input.id = 'no-error-input';
      container.appendChild(input);

      focusOnErrorField();

      await waitFor(() => {
        expect(document.activeElement).to.not.equal(input);
      });
    });

    it('should do nothing when error attribute is empty string', async () => {
      const webComponent = document.createElement('div');
      webComponent.setAttribute('error', '');

      const input = document.createElement('input');
      webComponent.appendChild(input);
      container.appendChild(webComponent);

      focusOnErrorField();

      await waitFor(() => {
        expect(document.activeElement).to.not.equal(input);
      });
    });

    it('should focus on the first error element when multiple errors exist', async () => {
      const webComponent1 = document.createElement('div');
      webComponent1.setAttribute('error', 'First error');
      const shadowRoot1 = webComponent1.attachShadow({ mode: 'open' });
      const input1 = document.createElement('input');
      input1.id = 'first-input';
      shadowRoot1.appendChild(input1);

      const webComponent2 = document.createElement('div');
      webComponent2.setAttribute('error', 'Second error');
      const shadowRoot2 = webComponent2.attachShadow({ mode: 'open' });
      const input2 = document.createElement('input');
      input2.id = 'second-input';
      shadowRoot2.appendChild(input2);

      container.appendChild(webComponent1);
      container.appendChild(webComponent2);

      focusOnErrorField();

      await waitFor(() => {
        // The focus may be on the first input or its parent webComponent
        const focused = document.activeElement;
        expect(focused === input1 || focused === webComponent1).to.equal(true);
      });
    });
  });
});
