import React from 'react';
import { expect } from 'chai';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import VAFacilityPage from '../../containers/VAFacilityPage';
import { getParentSiteMock, getFacilityMock } from '../mocks/v0';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../mocks/setup';
import {
  mockEligibilityFetches,
  mockParentSites,
  mockSupportedFacilities,
} from '../mocks/helpers';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

const parentSite983 = {
  id: '983',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '983',
    authoritativeName: 'Some VA facility',
    rootStationCode: '983',
    parentStationCode: '983',
  },
};

describe('VAOS integration: VA facility page with a single-site user', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show form with single required facility question', async () => {
    mockParentSites(['983'], [parentSite983]);
    const facilities = [
      {
        id: '983',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983',
          city: 'Bozeman',
          stateAbbrev: 'MT',
          authoritativeName: 'Bozeman VA medical center',
          rootStationCode: '983',
          parentStationCode: '983',
          requestSupported: true,
        },
      },
      {
        id: '983GC',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GC',
          rootStationCode: '983',
          parentStationCode: '983',
          requestSupported: true,
        },
      },
    ];
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983',
      typeOfCareId: '323',
      data: facilities,
    });
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(global.document.title).to.equal(
      'Choose a VA location for your appointment | Veterans Affairs',
    );
    expect(screen.baseElement).to.contain.text(
      'Choose a VA location for your appointment',
    );
  });
});
