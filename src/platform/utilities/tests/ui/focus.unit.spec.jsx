import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';

import { $ } from '../../../forms-system/src/js/utilities/ui';

import {
  focusElement,
  waitForRenderThenFocus,
  focusByOrder,
} from '../../ui/focus';

/**
 * focusElement tests are located in
 * src/platform/forms-system/test/js/utilities/ui.unit.spec.js
 */

describe('waitForRenderThenFocus', async () => {
  it('should focus on an input after a render delay', async () => {
    const Page = ({ renderIt }) => (
      <div>{renderIt && <input type="text" />}</div>
    );
    const { rerender, container } = await render(<Page />);

    waitForRenderThenFocus('input', container);
    await rerender(<Page renderIt />);

    await waitFor(() => {
      const input = $('input', container);
      expect(document.activeElement).to.eq(input);
    });
  });
  it('should focus on a nested input (passing a root) after a render delay', async () => {
    const Page = ({ renderIt }) => (
      <div>
        {renderIt && (
          <>
            <input id="input1" type="text" />
            <div id="nested">
              <input id="input2" type="text" />
            </div>
          </>
        )}
      </div>
    );
    const { rerender, container } = await render(<Page />);

    waitForRenderThenFocus('#input2', document.querySelector('#nested'));
    await rerender(<Page renderIt />);

    await waitFor(() => {
      const input = $('#input2', container);
      expect(document.activeElement).to.eq(input);
    });
  });
  it('should focus on default selector (h2) if selector element never appears', async () => {
    const { container } = await render(
      <div>
        <div className="nav-header">
          <h2>Header</h2>
        </div>
      </div>,
    );

    focusElement('body', {}, container);
    waitForRenderThenFocus('input', container, 0);

    await waitFor(() => {
      const h2 = $('h2', container);
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should focus on checkbox inside group', async () => {
    const { container } = await render(
      <div>
        <div id="nested">
          <div id="nested-2">
            <input id="input2" type="text" />
          </div>
        </div>
      </div>,
    );

    waitForRenderThenFocus('#nested-2', container, 250, '#input2');

    await waitFor(() => {
      expect(document.activeElement.id).to.eq('input2');
    });
  });

  it('should immediately focus selector when time interval is zero', async () => {
    const { container } = await render(
      <ul>
        <li>
          <h3 id="first">Header 1</h3>
        </li>
        <li>
          <h3 id="second">Header 2</h3>
        </li>
      </ul>,
    );

    waitForRenderThenFocus('#first', container, 0);
    expect(document.activeElement.id).to.eq('first');
  });

  it('should focus on default selector if not found & when time interval is zero', async () => {
    const { container } = await render(
      <div className="nav-header">
        <h2 id="first">Header 2</h2>
        <h3 id="second">Header 3</h3>
      </div>,
    );

    waitForRenderThenFocus('#third', container, 0);

    await waitFor(() => {
      expect(document.activeElement.id).to.eq('first');
    });
  });

  it('should keep existing focus', async () => {
    const { container } = await render(
      <ul>
        <li>
          <h3 id="first">Header 1</h3>
        </li>
        <li>
          <h3 id="second">Header 2</h3>
        </li>
      </ul>,
    );

    focusElement('#second', {}, container);
    waitForRenderThenFocus('#first', container, 10);

    await waitFor(() => {
      expect(document.activeElement.id).to.eq('second');
    });
  });
});

describe('focusByOrder', () => {
  it('should focus on the first selector, ignoring DOM order', () => {
    const { container } = render(
      <>
        <h1>H1</h1>
        <h2>H2</h2>
      </>,
    );
    focusByOrder('h2, h1', container);
    const h2 = $('h2', container);
    expect(document.activeElement).to.eq(h2);
    expect(h2.tabIndex).to.eq(-1);
  });
  it('should ignore non-existant selector', () => {
    const { container } = render(
      <>
        <h1>H1</h1>
        <h2>H2</h2>
        <h3>H3</h3>
      </>,
    );
    focusByOrder('input, span, #test, h3', container);
    const h3 = $('h3', container);
    expect(document.activeElement).to.eq(h3);
    expect(h3.tabIndex).to.eq(-1);
  });

  it('should focus on element inside shadow root using >>shadow>> delimiter', async () => {
    const { container } = render(<div id="test-container" />);

    const webComponent = document.createElement('va-test-component');
    const shadowRoot = webComponent.attachShadow({ mode: 'open' });
    const h2 = document.createElement('h2');
    shadowRoot.appendChild(h2);
    container.appendChild(webComponent);

    focusByOrder('va-test-component>>shadow>>h2', container);

    await waitFor(() => {
      const shadowH2 = webComponent.shadowRoot.querySelector('h2');
      expect(document.activeElement).to.eq(webComponent);
      expect(shadowRoot.activeElement).to.eq(shadowH2);
    });
  });
});
