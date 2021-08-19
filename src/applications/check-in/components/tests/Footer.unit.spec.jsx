import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Footer from '../Footer';

describe('check-in', () => {
  describe('Footer', () => {
    it('Renders the footer with default props', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: { appointment: { clinicPhoneNumber: '555-867-5309' } },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const screen = render(<Footer store={fakeStore} />);

      expect(screen.getByTestId('heading')).to.have.text('Need help?');
      expect(screen.getByTestId('message')).to.have.text(
        'Ask a staff member or call us at 555-867-5309.',
      );
    });
    it('Renders the footer with custom header props', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: { appointment: { clinicPhoneNumber: '555-867-5309' } },
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
    it('Renders the footer with custom message props', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: { appointment: { clinicPhoneNumber: '555-867-5309' } },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const screen = render(
        <Footer store={fakeStore} message="this is a cool thing" />,
      );
      expect(screen.getByTestId('message')).to.have.text(
        'this is a cool thing 555-867-5309.',
      );
    });
    it('Renders the footer when no phone number is presented', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: { appointment: { clinicPhoneNumber: '' } },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const screen = render(<Footer store={fakeStore} />);

      expect(screen.getByTestId('heading')).to.have.text('Need help?');
      expect(screen.getByTestId('message')).to.have.text('Ask a staff member.');
    });
  });
});
