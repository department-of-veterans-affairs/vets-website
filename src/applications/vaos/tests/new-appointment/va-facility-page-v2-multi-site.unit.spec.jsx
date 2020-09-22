import React from 'react';
import { expect } from 'chai';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent } from '@testing-library/dom';
import VAFacilityPage from '../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
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

describe('VAOS integration: VA flat facility page', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should display list of facilities with show more button', async () => {
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
          authoritativeName: 'San Diego VA medical center',
          city: 'San Diego',
          stateAbbrev: 'CA',
          rootStationCode: '983',
          parentStationCode: '983',
          requestSupported: true,
        },
      },
      {
        id: '983GD',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GD',
          authoritativeName: 'San Diego VA medical center 2',
          city: 'San Diego',
          stateAbbrev: 'CA',
          rootStationCode: '983',
          parentStationCode: '983',
          requestSupported: true,
        },
      },
      {
        id: '983GE',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GE',
          authoritativeName: 'San Diego VA medical center 3',
          city: 'San Diego',
          stateAbbrev: 'CA',
          rootStationCode: '983',
          parentStationCode: '983',
          requestSupported: true,
        },
      },
      {
        id: '983GF',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GF',
          authoritativeName: 'San Diego VA medical center 4',
          city: 'San Diego',
          stateAbbrev: 'CA',
          rootStationCode: '983',
          parentStationCode: '983',
          requestSupported: true,
        },
      },
      {
        id: '983GG',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GG',
          authoritativeName: 'San Diego VA medical center 5',
          city: 'San Diego',
          stateAbbrev: 'CA',
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

    await screen.findByText(
      /Choose a VA location for your Primary care appointment/i,
    );

    expect(screen.baseElement).to.contain.text(
      'Below is a list of VA locations where you’re registered that offer Primary care appointments',
    );

    // Should contain radio buttons
    expect(screen.baseElement).to.contain.text('Bozeman VA medical center');
    expect(screen.baseElement).to.contain.text('Bozeman, MT');
    expect(screen.baseElement).to.contain.text('San Diego VA medical center');
    expect(screen.baseElement).to.contain.text('San Diego, CA');
    expect(screen.baseElement).not.to.contain.text(
      'San Diego VA medical center 5',
    );
    const moreLocationsBtn = screen.getByText('+ 2 more locations');
    expect(moreLocationsBtn).to.have.tagName('span');
    fireEvent.click(moreLocationsBtn);
    expect(screen.baseElement).to.contain.text('San Diego VA medical center 5');
  });
});
