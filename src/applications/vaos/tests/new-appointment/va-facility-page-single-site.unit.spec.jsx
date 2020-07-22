import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import VAFacilityPage from '../../containers/VAFacilityPage';
import { fireEvent, waitFor } from '@testing-library/dom';
import { getParentSiteMock, getFacilityMock } from '../mocks/v0';
import { createTestStore, setTypeOfCare } from '../mocks/form';
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

  it('should show only facility question', async () => {
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
          city: 'Belgrade',
          stateAbbrev: 'MT',
          authoritativeName: 'Belgrade VA clinic',
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

    const router = {
      push: sinon.spy(),
    };
    const { findByText, baseElement } = renderInReduxProvider(
      <VAFacilityPage router={router} />,
      {
        store,
      },
    );

    expect(baseElement).to.contain.text('Finding your VA facility');
    await findByText(/appointments are available at the following locations/i);
    expect(baseElement).to.contain.text(
      'Bozeman VA medical center (Bozeman, MT)',
    );
  });

  it('should show alert when only one facility is supported', async () => {
    mockParentSites(['983'], [parentSite983]);
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
      facilityId: '983GC',
      typeOfCareId: '323',
      limit: true,
      requestPastVisits: true,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const router = {
      push: sinon.spy(),
    };
    const { findByText, baseElement, getByText } = renderInReduxProvider(
      <VAFacilityPage router={router} />,
      {
        store,
      },
    );

    expect(baseElement).to.contain.text('Finding your VA facility');
    await findByText(/we found one VA location for you/i);

    expect(baseElement).to.contain.text('Belgrade VA clinic');
    expect(baseElement).to.contain.text('Belgrade, MT');
    expect(getByText(/search for a nearby location/i)).to.have.attribute(
      'href',
      '/find-locations',
    );

    fireEvent.click(await findByText(/Continue/));
    await waitFor(() =>
      expect(router.push.firstCall.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );
  });
  // it('should show eligibility alert for single unsupported facility users', () => {});
  // it('should show past visits eligibility alert', () => {});
  // it('should show request limit eligibility alert', () => {});
  // it('should use appropriate eligibility criteria when choosing different faciliites', () => {});
  // it('should start direct schedule flow when eligible', () => {});
  // it('should start request flow when eligible', () => {});
  // it('should display error message when requests fail', () => {});
  // it('should display previous user choices when returning to page', () => {});
});
