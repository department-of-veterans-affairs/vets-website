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
      expect(component.getByTestId('check-in-message')).to.exist;
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
      expect(component.getByTestId('check-in-message')).to.exist;
    });
    it('Renders HelpBlock for travel-pay page', () => {
      const component = render(
        <CheckInProvider
          store={{ app: 'dayOf' }}
          router={{ currentPage: 'travel-pay' }}
        >
          <Footer isPreCheckIn={false} />
        </CheckInProvider>,
      );
      expect(component.getByTestId('help-block')).to.exist;
      expect(component.getByTestId('for-questions-about-filing')).to.exist;
    });
    it('Renders HelpBlock for travel-vehicle page and travel section', () => {
      const component = render(
        <CheckInProvider
          store={{ app: 'dayOf' }}
          router={{ currentPage: 'travel-vehicle' }}
        >
          <Footer isPreCheckIn={false} />
        </CheckInProvider>,
      );
      expect(component.getByTestId('help-block')).to.exist;
      expect(component.getByTestId('for-questions-about-filing')).to.exist;
    });
    it('Renders HelpBlock for travel-address page and travel section', () => {
      const component = render(
        <CheckInProvider
          store={{ app: 'dayOf' }}
          router={{ currentPage: 'travel-address' }}
        >
          <Footer isPreCheckIn={false} />
        </CheckInProvider>,
      );
      expect(component.getByTestId('help-block')).to.exist;
      expect(component.getByTestId('for-questions-about-filing')).to.exist;
    });
    it('Renders HelpBlock for complete page', () => {
      const component = render(
        <CheckInProvider
          store={{ app: 'dayOf' }}
          router={{ currentPage: 'complete' }}
        >
          <Footer isPreCheckIn={false} />
        </CheckInProvider>,
      );
      expect(component.getByTestId('help-block')).to.exist;
    });
    it('Renders HelpBlock without travel link on non-travel pages', () => {
      const component = render(
        <CheckInProvider
          store={{ app: 'dayOf' }}
          router={{ currentPage: 'contact-information' }}
        >
          <Footer isPreCheckIn={false} />
        </CheckInProvider>,
      );
      expect(component.queryByTestId('for-questions-about-filing')).to.not
        .exist;
    });
  });
});
