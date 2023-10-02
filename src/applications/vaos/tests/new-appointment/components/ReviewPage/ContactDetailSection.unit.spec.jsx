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
  });

  describe('best time to call - acheron flag is true', () => {

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
