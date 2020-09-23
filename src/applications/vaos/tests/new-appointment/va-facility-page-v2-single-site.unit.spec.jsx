import React from 'react';
import { expect } from 'chai';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import VAFacilityPage from '../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
import {
  getParentSiteMock,
  getFacilityMock,
  getVAFacilityMock,
} from '../mocks/v0';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../mocks/setup';
import {
  mockEligibilityFetches,
  mockParentSites,
  mockSupportedFacilities,
  mockFacilityFetch,
} from '../mocks/helpers';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingFlatFacilityPage: true,
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

describe('VAOS integration: VA flat facility page', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show alert when only one facility is supported', async () => {
    const parentSite5digit = {
      id: '983GC',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983GC',
        authoritativeName: 'Some VA facility',
        rootStationCode: '983',
        parentStationCode: '983GC',
      },
    };
    mockParentSites(['983'], [parentSite5digit]);
    const facilities = [
      {
        id: '983GC',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GC',
          city: 'Belgrade',
          stateAbbrev: 'MT',
          authoritativeName: 'Belgrade VA clinic',
          rootStationCode: '983',
          parentStationCode: '983GC',
          requestSupported: true,
        },
      },
    ];
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983GC',
      typeOfCareId: '323',
      data: facilities,
    });
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983GC',
      typeOfCareId: '323',
      limit: true,
      requestPastVisits: true,
    });

    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const {
      baseElement,
      findByText,
      getByText,
      history,
    } = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(baseElement).to.contain.text('Finding locations');
    await findByText(/we found one VA location for you/i);

    expect(baseElement).to.contain.text('Belgrade VA clinic');
    expect(baseElement).to.contain.text('Belgrade, MT');
    expect(getByText(/search for a nearby location/i)).to.have.attribute(
      'href',
      '/find-locations',
    );

    fireEvent.click(await findByText(/Continue/));
    await waitFor(() =>
      expect(history.push.firstCall.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );
  });
});
