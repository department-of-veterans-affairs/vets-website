import React from 'react';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import ContactDetailSection from '../../../../new-appointment/components/ReviewPage/ContactDetailSection';

describe('VAOS <ContactDetailSection>', () => {
  describe('best time to call', () => {
    let store;
    beforeEach(() => {
      store = createTestStore({
        featureToggles: {
          vaOnlineSchedulingAcheronService: false,
        },
      });
    });

    it('should return single time', async () => {
      const screen = renderWithStoreAndRouter(
        <ContactDetailSection
          data={{
            bestTimeToCall: { morning: true },
          }}
        />,
        store,
      );

      expect(await screen.findByText('Call morning')).to.exist;
    });

    it('should return two times', async () => {
      const screen = renderWithStoreAndRouter(
        <ContactDetailSection
          data={{ bestTimeToCall: { morning: true, afternoon: true } }}
        />,
        store,
      );

      expect(await screen.findByText('Call morning or afternoon')).to.exist;
    });

    it('should return message for all times', async () => {
      const screen = renderWithStoreAndRouter(
        <ContactDetailSection
          data={{
            bestTimeToCall: { morning: true, afternoon: true, evening: true },
          }}
        />,
        store,
      );

      expect(await screen.findByText('Call anytime during the day')).to.exist;
    });
  });

  describe('best time to call - acheron flag is true', () => {
    it('should display best time to call when community care appointment', async () => {
      const store = createTestStore({
        featureToggles: {
          vaOnlineSchedulingAcheronService: true,
        },
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

      expect(await screen.queryByText('Call morning')).to.exist;
    });

    it('should not display best time to call when request schedule', async () => {
      const store = createTestStore({
        featureToggles: {
          vaOnlineSchedulingAcheronService: true,
        },
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

      expect(await screen.queryByText('Call morning')).not.to.exist;
    });

    it('should not display best time to call when direct schedule', async () => {
      const store = createTestStore({
        featureToggles: {
          vaOnlineSchedulingAcheronService: true,
        },
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
