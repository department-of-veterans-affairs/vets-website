/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { Route } from 'react-router-dom';

import { mockFetch } from 'platform/testing/unit/helpers';
import set from 'platform/utilities/data/set';

import { fireEvent } from '@testing-library/dom';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage';
import { getParentSiteMock } from '../../../mocks/v0';
import { getVAOSParentSiteMock } from '../../../mocks/v2';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import { mockParentSites } from '../../../mocks/helpers';
import { mockVAOSParentSites } from '../../../mocks/helpers.v2';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
    show_new_schedule_view_appointments_page: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingVAOSServiceRequests: true,
    show_new_schedule_view_appointments_page: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS <VAFacilityPage> with a single-site user', () => {
  beforeEach(() => mockFetch());

  it('should show single disabled radio button option if Cerner only', async () => {
    const parentSite = {
      id: '983',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983',
        authoritativeName: 'Some VA facility',
        rootStationCode: '983',
        parentStationCode: '983',
      },
    };
    mockParentSites(['983'], [parentSite]);

    const store = createTestStore(
      set(
        'user.profile.facilities',
        [
          {
            facilityId: '983',
            isCerner: true,
          },
        ],
        initialState,
      ),
    );
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(
      <Route component={VAFacilityPage} />,
      {
        store,
      },
    );

    await screen.findByText(/registered at the following VA/i);
    expect(screen.getByLabelText(/some va facility/i)).to.have.attribute(
      'value',
      '983',
    );
    expect(screen.getByLabelText(/some va facility/i)).to.have.attribute(
      'disabled',
    );

    fireEvent.click(await screen.findByText(/Go to My VA Health/));
  });
});

describe('VAOS <VAFacilityPage> with a single-site user with data from VAOS v2 service', () => {
  beforeEach(() => mockFetch());

  it('should show single disabled radio button option if Cerner only', async () => {
    const parentSite = getVAOSParentSiteMock();
    parentSite.id = '983';
    parentSite.attributes = {
      id: '983',
      vista_site: '983',
      name: 'Cheyenne VA Medical Center',
      physical_address: {
        type: 'physical',
        line: ['2360 East Pershing Boulevard'],
        city: 'Cheyenne',
        state: 'WY',
        postal_code: '82001-5356',
      },
    };
    mockVAOSParentSites(['983'], [parentSite]);

    const store = createTestStore(
      set(
        'user.profile.facilities',
        [{ facilityId: '983', isCerner: true }],
        initialStateVAOSService,
      ),
    );
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(
      <Route component={VAFacilityPage} />,
      {
        store,
      },
    );

    await screen.findByText(/registered at the following VA/i);
    expect(
      screen.getByLabelText(/Cheyenne VA Medical Center/i),
    ).to.have.attribute('value', '983');
    expect(
      screen.getByLabelText(/Cheyenne VA Medical Center/i),
    ).to.have.attribute('disabled');

    fireEvent.click(await screen.findByText(/Go to My VA Health/));
  });
});
