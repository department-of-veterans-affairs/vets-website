import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import Footer from '../Footer';

describe('check-in', () => {
  describe('Footer', () => {
    it('Renders day-of check-in footer', () => {
      const component = render(
        <CheckInProvider store={{ app: 'dayOf' }}>
          <Footer isPreCheckIn={false} />
        </CheckInProvider>,
      );
      const heading = component.getByTestId('heading');
      expect(heading).to.exist;
      expect(heading).to.contain.text('Need help?');
      expect(component.getByTestId('day-of-check-in-message')).to.exist;
      expect(component.queryByTestId('pre-check-in-message')).to.not.exist;
      expect(component.queryByTestId('day-of-travel-extra-message')).to.not
        .exist;
    });
    it('Renders extra messages on the day of footer', () => {
      const component = render(
        <CheckInProvider
          store={{ app: 'dayOf' }}
          router={{ currentPage: '/complete' }}
        >
          <Footer isPreCheckIn={false} />
        </CheckInProvider>,
      );
      expect(component.getByTestId('day-of-travel-extra-message')).to.exist;
    });
    it('Renders default pre-check-in footer', () => {
      const component = render(
        <CheckInProvider store={{ app: 'dayOf' }}>
          <Footer isPreCheckIn />
        </CheckInProvider>,
      );
      const heading = component.getByTestId('heading');
      expect(heading).to.exist;
      expect(heading).to.contain.text('Need help?');
      expect(component.queryByTestId('day-of-check-in-message')).to.not.exist;
      expect(component.queryByTestId('intro-extra-message')).to.not.exist;
      expect(component.getByTestId('pre-check-in-message')).to.exist;
    });
    it('Render extra message on the intro page for pre-check-in', () => {
      const component = render(
        <CheckInProvider
          store={{ app: 'preCheckIn' }}
          router={{ currentPage: '/introduction' }}
        >
          <Footer isPreCheckIn />
        </CheckInProvider>,
      );
      expect(component.getByTestId('intro-extra-message')).to.exist;
    });
  });
});
