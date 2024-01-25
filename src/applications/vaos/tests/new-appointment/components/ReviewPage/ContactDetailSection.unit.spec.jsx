import React from 'react';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import ContactDetailSection from '../../../../new-appointment/components/ReviewPage/ContactDetailSection';

describe('VAOS <ContactDetailSection>', () => {
  describe('best time to call', () => {
    it('should display best time to call when community care appointment', async () => {
      const store = createTestStore({
        newAppointment: {
          flowType: 'request',
          data: {
            facilityType: 'communityCare',
          },
        },
      });

      const screen = renderWithStoreAndRouter(
        <ContactDetailSection
          data={{
            bestTimeToCall: { morning: true },
          }}
        />,
        { store },
      );

      expect(await screen.queryByText(/Call morning/i)).to.exist;
    });

    it('should not display best time to call when request schedule', async () => {
      const store = createTestStore({
        newAppointment: {
          flowType: 'request',
          data: {
            facilityType: 'vamc',
          },
        },
      });

      const screen = renderWithStoreAndRouter(
        <ContactDetailSection
          data={{
            bestTimeToCall: { morning: true },
          }}
        />,
        { store },
      );

      expect(await screen.queryByText(/Call morning/i)).not.to.exist;
    });

    it('should not display best time to call when direct schedule', async () => {
      const store = createTestStore({
        newAppointment: {
          flowType: 'direct',
          data: {
            facilityType: 'vamc',
          },
        },
      });

      const screen = renderWithStoreAndRouter(
        <ContactDetailSection
          data={{
            bestTimeToCall: { morning: true },
          }}
        />,
        { store },
      );

      expect(await screen.queryByText('Call morning')).not.to.exist;
    });
  });
});
