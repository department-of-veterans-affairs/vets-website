import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';

import Main from '../containers/Main';

describe('mobile-menu-button', () => {
  describe('Main.jsx', () => {
    it('should show correct expanded/collapsed state when mega menu is open/closed', () => {
      const screen = renderWithStoreAndRouter(<Main />, {
        initialState: { megaMenu: { display: { hidden: true } } },
      });

      const toggleButton = screen.getByRole('button');

      expect(toggleButton.getAttribute('aria-expanded')).to.eq('false');
      expect(screen.queryByText('Close')).to.eq(null);

      userEvent.click(toggleButton);
      expect(toggleButton.getAttribute('aria-expanded')).to.eq('true');
      expect(screen.queryByText('Open')).to.eq(null);

      userEvent.click(toggleButton);
      expect(toggleButton.getAttribute('aria-expanded')).to.eq('false');
      expect(screen.queryByText('Close')).to.eq(null);
    });
  });
});
