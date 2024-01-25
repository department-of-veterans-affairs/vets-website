import React from 'react';
import { expect } from 'chai';
import { mockFetch } from 'platform/testing/unit/helpers';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setVAFacility,
} from '../../mocks/setup';

import { createMockCheyenneFacilityByVersion } from '../../mocks/data';
import ScheduleCernerPage from '../../../new-appointment/components/ScheduleCernerPage';
import {
  mockEligibilityFetchesByVersion,
  mockFacilityFetchByVersion,
} from '../../mocks/fetch';
import {
  mockSchedulingConfigurations,
  mockVAOSParentSites,
} from '../../mocks/helpers.v2';
import {
  getSchedulingConfigurationMock,
  getV2ClinicMock,
} from '../../mocks/v2';
import { getRealFacilityId } from '../../../utils/appointment';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: true }],
    },
  },
};

describe('VAOS <ScheduleCernerPage>', () => {
  beforeEach(() => mockFetch());
  it.skip('should show Cerner facility information', async () => {
    const facilityData = createMockCheyenneFacilityByVersion({ version: 0 });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983', { facilityData });

    const screen = renderWithStoreAndRouter(<ScheduleCernerPage />, {
      store,
    });

    await screen.findByRole('heading', {
      level: 1,
      name: 'How to schedule',
    });

    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.getByText(/2360 East Pershing Boulevard/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      'Cheyenne, WyomingWY 82001-5356',
    );

    expect(
      screen.getByRole('link', { name: 'My VA Health' }).getAttribute('href'),
    ).to.contain('pages/scheduling/upcoming');

    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(screen.getByRole('button', { name: /Continue/ })).to.have.attribute(
      'disabled',
    );
  });

  describe('when using v2 api', () => {
    it('should show Cerner facility information', async () => {
      const store = createTestStore({
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingFacilitiesServiceV2: true,
        },
        drupalStaticData: {
          vamcEhrData: {
            loading: false,
            data: {
              ehrDataByVhaId: {
                '442': {
                  vhaId: '442',
                  vamcFacilityName: 'Cheyenne VA Medical Center',
                  vamcSystemName: 'VA Cheyenne health care',
                  ehr: 'cerner',
                },
                '552': {
                  vhaId: '552',
                  vamcFacilityName: 'Dayton VA Medical Center',
                  vamcSystemName: 'VA Dayton health care',
                  ehr: 'cerner',
                },
              },
              cernerFacilities: [
                {
                  vhaId: '442',
                  vamcFacilityName: 'Cheyenne VA Medical Center',
                  vamcSystemName: 'VA Cheyenne health care',
                  ehr: 'cerner',
                },
                {
                  vhaId: '552',
                  vamcFacilityName: 'Dayton VA Medical Center',
                  vamcSystemName: 'VA Dayton health care',
                  ehr: 'cerner',
                },
              ],
              vistaFacilities: [],
            },
          },
        },
        user: {
          ...initialState.user,
          profile: {
            ...initialState.user.profile,
            vapContactInfo: {
              residentialAddress: {
                latitude: 39.1362562,
                longitude: -84.6804804,
              },
            },
          },
        },
      });

      const facility = createMockCheyenneFacilityByVersion({ version: 2 });
      const realFacilityId = getRealFacilityId('983');

      mockFacilityFetchByVersion({ facility, version: 2 });
      mockVAOSParentSites(['983'], [facility], true);
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: realFacilityId,
          typeOfCareId: 'primaryCare',
          requestEnabled: true,
        }),
      ]);
      mockEligibilityFetchesByVersion({
        facilityId: realFacilityId,
        typeOfCareId: 'primaryCare',
        directPastVisits: false,
        limit: true,
        clinics: [
          getV2ClinicMock({
            id: '455',
            stationId: realFacilityId,
            serviceName: 'Clinic name',
          }),
        ],
        version: 2,
      });

      // Setup Redux store
      await setTypeOfCare(store, /primary care/i);
      await setVAFacility(store, realFacilityId, { facility });

      const screen = renderWithStoreAndRouter(<ScheduleCernerPage />, {
        store,
      });

      // Make sure Cerner link shows up
      expect(
        screen
          .getByRole('link', { name: /My VA Health/i })
          .getAttribute('href'),
      ).to.contain('pages/scheduling/upcoming');
    });
  });
});
