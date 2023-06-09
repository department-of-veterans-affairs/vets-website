import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { $ } from '../../../forms-system/src/js/utilities/ui';

import {
  // focusElement,
  waitForRenderThenFocus,
  focusByOrder,
  trapFocus,
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

    waitForRenderThenFocus('input', container, 0);

    await waitFor(() => {
      const h2 = $('h2', container);
      expect(document.activeElement).to.eq(h2);
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
});

describe('trapFocus', () => {
  const NavMenu = () => (
    <div id="main-page">
      <button type="button" id="menu-button">
        Menu
      </button>

      <div id="side-nav">
        <a href="/link-1" id="link-1">
          Link 1
        </a>
        <a href="/link-2" id="link-2">
          Link 2
        </a>
        <a href="/link-3" id="link-3">
          Link 3
        </a>
      </div>
    </div>
  );

  it('should trap focus in a container', async () => {
    const screen = await render(<NavMenu />);
    const { container } = screen;
    const focusableElementsSelector = 'a[href]:not([disabled])';
    trapFocus(container, focusableElementsSelector);

    const focusableElements = container.querySelectorAll(
      focusableElementsSelector,
    );
    document.querySelector('#menu-button').focus();

    focusableElements.forEach(element => {
      userEvent.tab();
      expect(document.activeElement).to.eq(element);
    });

    userEvent.tab();
    expect(document.activeElement).to.eq(document.querySelector('#link-1'));

    userEvent.tab({ shift: true });
    expect(document.activeElement).to.eq(document.querySelector('#link-3'));
  });
});
