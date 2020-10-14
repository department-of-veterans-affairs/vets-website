import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ContactDetailSection from '../../../../new-appointment/components/ReviewPage/ContactDetailSection';

describe('VAOS <ContactDetailSection>', () => {
  describe('best time to call', () => {
    it('should return single time', async () => {
      const screen = render(
        <MemoryRouter>
          <ContactDetailSection
            data={{
              bestTimeToCall: { morning: true },
            }}
          />
        </MemoryRouter>,
      );

      expect(await screen.findByText('Call morning')).to.exist;
    });
    it('should return two times', async () => {
      const screen = render(
        <MemoryRouter>
          <ContactDetailSection
            data={{
              bestTimeToCall: { morning: true, afternoon: true },
            }}
          />
        </MemoryRouter>,
      );

      expect(await screen.findByText('Call morning or afternoon')).to.exist;
    });
    it('should return message for all times', async () => {
      const screen = render(
        <MemoryRouter>
          <ContactDetailSection
            data={{
              bestTimeToCall: { morning: true, afternoon: true, evening: true },
            }}
          />
        </MemoryRouter>,
      );

      expect(await screen.findByText('Call anytime during the day')).to.exist;
    });
  });
});
