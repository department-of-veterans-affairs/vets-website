import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import VAFacilityPage from '../../containers/VAFacilityPage';
import { fireEvent } from '@testing-library/dom';
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
      facilities: [
        { facilityId: '983', isCerner: false },
        { facilityId: '984', isCerner: false },
      ],
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
const parentSite984 = {
  id: '984',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '984',
    authoritativeName: 'Some other VA facility',
    rootStationCode: '984',
    parentStationCode: '984',
  },
};

describe('VAOS integration: VA facility page', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show both site and facility questions for multi-site users', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    const facility = {
      id: '984',
      attributes: {
        ...getFacilityMock().attributes,
        institutionCode: '984',
        city: 'Bozeman',
        stateAbbrev: 'MT',
        authoritativeName: 'Bozeman VA medical center',
        rootStationCode: '984',
        parentStationCode: '984',
        requestSupported: true,
      },
    };
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [facility],
    });
    mockEligibilityFetches({
      siteId: '984',
      facilityId: '984',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const router = {
      push: sinon.spy(),
    };
    const { findByText, getByLabelText, baseElement } = renderInReduxProvider(
      <VAFacilityPage router={router} />,
      {
        store,
      },
    );

    await findByText(/registered at the following VA/i);
    expect(getByLabelText(/some other va facility/i)).to.have.attribute(
      'value',
      'var984',
    );
    expect(getByLabelText(/some va facility/i)).to.have.attribute(
      'value',
      'var983',
    );

    fireEvent.click(getByLabelText(/some other va facility/i));
    expect(baseElement).to.contain.text('Finding locations');
    await findByText(/appointments are available at the following locations/i);
    expect(baseElement).to.contain.text(
      'Bozeman VA medical center (Bozeman, MT)',
    );
  });
  // it('should show past visits eligibility alert', () => {});
  // it('should show request limit eligibility alert', () => {});
  // it('should show unsupported facilities alert', () => {});
  // it('should show correct facility list when changing sites', () => {});
  // it('should use appropriate eligibility criteria when choosing different faciliites', () => {});
  // it('should start direct schedule flow when eligible', () => {});
  // it('should start request flow when eligible', () => {});
  // it('should display error message when requests fail', () => {});
  // it('should display previous user choices when returning to page', () => {});
});
