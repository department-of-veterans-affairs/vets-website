import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { trapFocus } from '../util/ui';

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
