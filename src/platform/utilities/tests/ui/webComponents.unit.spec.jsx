import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { $ } from '../../../forms-system/src/js/utilities/ui';
import {
  awaitShadowRoot,
  isWebComponent,
  isWebComponentReady,
} from '../../ui/webComponents';

describe('web component UI tests', async () => {
  it('web component UI tests', async () => {
    const { container } = await render(
      <div>
        <VaTextInput id="web-component" label="Text input" />
        <input type="text" id="text" />
      </div>,
    );

    await waitFor(() => {
      const vaTextInput = $('#web-component', container);
      const textInput = $('#text', container);
      expect(isWebComponent(vaTextInput)).to.eq(true);
      expect(isWebComponent(textInput)).to.eq(false);

      // web component will never be "ready" for unit tests because
      // it does not have shadowRoot, and it won't go through the
      // lifecycle in react testing library to get a shadowRoot
      expect(isWebComponentReady(vaTextInput)).to.eq(false);
      expect(isWebComponentReady(textInput)).to.eq(false);

      let awaitedShadowRoot = false;
      awaitShadowRoot(vaTextInput, () => {
        // This isn't actually waiting for a shadowRoot, because
        // the shadowRoot won't be populated in React testing library.
        // Just showing that it will pass tests, despite this.
        awaitedShadowRoot = true;
      });

      expect(awaitedShadowRoot).to.eq(true);
    });
  });
});
