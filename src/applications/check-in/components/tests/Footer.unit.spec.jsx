import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Footer from '../Footer';

describe('check-in', () => {
  describe('Footer', () => {
    it('Renders the footer with default props', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: { appointment: { clinicPhone: '555-867-5309' } },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const screen = render(<Footer store={fakeStore} />);

      expect(screen.getByTestId('heading')).to.have.text('Need Help?');
    });
    it('Renders the footer with custom header props', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: { appointment: { clinicPhone: '555-867-5309' } },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const screen = render(
        <Footer store={fakeStore} header="this is a cool thing" />,
      );
      expect(screen.getByTestId('heading')).to.have.text(
        'this is a cool thing',
      );
    });
  });
});
