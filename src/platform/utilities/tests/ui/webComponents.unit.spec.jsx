import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import {
  VaCheckboxGroup,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { $ } from '../../../forms-system/src/js/utilities/ui';
import {
  waitForShadowRoot,
  isWebComponent,
  isWebComponentReady,
  querySelectorWithShadowRoot,
} from '../../ui/webComponents';

describe('web component basic checkers', async () => {
  it('isWebComponent check', async () => {
    const { container } = await render(
      <div>
        <VaTextInput id="web-component" label="Text input" />
        <input type="text" id="text" />
      </div>,
    );

    expect(isWebComponent('va-text-input')).to.eq(true);
    expect(isWebComponent($('va-text-input', container))).to.eq(true);

    expect(isWebComponent('input')).to.eq(false);
    expect(isWebComponent($('input', container))).to.eq(false);

    expect(isWebComponent(null)).to.eq(false);
    expect(isWebComponent({})).to.eq(false);
  });

  it('isWebComponentReady check', async () => {
    const { container } = await render(
      <div>
        <VaTextInput id="web-component" label="Text input" />
        <input type="text" id="text" />
      </div>,
    );

    const vaTextInput = $('#web-component', container);
    const textInput = $('#text', container);

    // Unfortunately we can't test this in react testing library
    // because web-component shadowRoots don't get populated.
    // We can instead rely on Cypress tests to make sure UI is done properly.
    // We could choose to arbitrarily return true instead if we wanted to
    expect(isWebComponentReady(vaTextInput)).to.eq(false);
    expect(isWebComponentReady(textInput)).to.eq(false);

    expect(isWebComponentReady(null)).to.eq(false);
    expect(isWebComponentReady({})).to.eq(false);
  });

  it('waitForShadowRoot tests', async () => {
    const { container } = await render(
      <div>
        <VaTextInput id="web-component" label="Text input" />
        <input type="text" id="text" />
      </div>,
    );

    await waitFor(async () => {
      const vaTextInput = $('#web-component', container);
      const textInput = $('#text', container);

      // shadowRoot won't be populated in React testing library.
      // Just showing that it will pass tests, despite this.
      let el = await waitForShadowRoot(vaTextInput);
      expect(el.id).to.eq('web-component');
      expect(el.shadowRoot).to.eq(null);

      await waitForShadowRoot(textInput);
      expect(textInput.id).to.eq('text');

      el = await waitForShadowRoot(null);
      expect(el).to.eq(null);

      el = await waitForShadowRoot({});
      expect(el).to.deep.eq({});
    });
  });
});

describe('web component query selector tests', async () => {
  let container;

  beforeEach(async () => {
    const rendered = await render(
      <div>
        <input id="text" type="text" />
        <div id="nested-container">
          <input id="nested-text" type="text" />
          <va-checkbox
            id="nested-checkbox"
            name="group1"
            uswds
            label="Checkbox"
          />
        </div>
        <VaCheckboxGroup id="checkbox-group" label="CheckboxGroup" uswds>
          <span>Description of checkbox group</span>
          <va-checkbox
            id="checkbox-group-checkbox"
            name="group2"
            uswds
            label="Checkbox"
          />
        </VaCheckboxGroup>
      </div>,
    );
    container = rendered.container;
  });

  it('querySelectorWithShadowRoot can select a web component or regular element', async () => {
    await waitFor(async () => {
      let el = await querySelectorWithShadowRoot('#nested-checkbox');
      expect(el.id).to.eq('nested-checkbox');

      el = await querySelectorWithShadowRoot('#text');
      expect(el.id).to.eq('text');
    });
  });

  it('querySelectorWithShadowRoot can specify a root element', async () => {
    await waitFor(async () => {
      let el = await querySelectorWithShadowRoot('#nested-checkbox', container);
      expect(el.id).to.eq('nested-checkbox');

      el = await querySelectorWithShadowRoot(
        '#checkbox-group-checkbox',
        container.querySelector('#checkbox-group'),
      );
      expect(el.id).to.eq('checkbox-group-checkbox');
    });
  });

  it('querySelectorWithShadowRoot can use strings for selector and root', async () => {
    await waitFor(async () => {
      const el = await querySelectorWithShadowRoot(
        '#checkbox-group-checkbox',
        '#checkbox-group',
      );
      expect(el.id).to.eq('checkbox-group-checkbox');
    });
  });

  it('querySelectorWithShadowRoot negative tests', async () => {
    await waitFor(async () => {
      let el = await querySelectorWithShadowRoot(null);
      expect(el).to.eq(null);

      el = await querySelectorWithShadowRoot('#checkbox-group', null);
      expect(el.id).to.eq('checkbox-group');

      el = await querySelectorWithShadowRoot('#not-found', null);
      expect(el).to.eq(null);
    });
  });
});
