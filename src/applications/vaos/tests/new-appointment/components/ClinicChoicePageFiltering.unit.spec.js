import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setVAFacility,
} from '../../mocks/setup';

import ClinicChoicePage from '../../../new-appointment/components/ClinicChoicePage';
import { getV2ClinicMock } from '../../mocks/v2';
import { createMockCheyenneFacilityByVersion } from '../../mocks/data';
import { mockEligibilityFetchesByVersion } from '../../mocks/fetch';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS Page: ClinicChoicePage - Filtering', () => {
  beforeEach(() => mockFetch());

  // This test needs to be isolated. It fails if run after any other ClinicChoicePage tests.
  it('should show the correct clinic name when filtered to matching', async () => {
    // Given two available clinics
    const clinics = [
      getV2ClinicMock({
        id: '309',
        serviceName: 'Filtered out clinic',
        stationId: '983',
      }),
      getV2ClinicMock({
        id: '308',
        serviceName: 'Green team clinic',
        stationId: '983',
      }),
    ];
    const facilityData = createMockCheyenneFacilityByVersion();
    facilityData.id = '983';

    // And the second clinic matches a past appointment
    mockEligibilityFetchesByVersion({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'amputation',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      matchingClinics: clinics.slice(1),
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /amputation/i);
    await setVAFacility(store, '983', 'amputation', { facilityData });

    // When the page is displayed
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });
    await screen.findByText(/last amputation care appointment/i);

    // Then the page says the last appointment was at the matching clinic
    expect(screen.baseElement).to.contain.text(
      'Your last amputation care appointment was at Green team clinic:',
    );

    // And the user is asked if they want an appt at matching clinic
    expect(screen.baseElement).to.contain.text(
      'Would you like to make an appointment at Green team clinic',
    );
  });
});
