import React from 'react';
import { expect } from 'chai';
import { Route } from 'react-router-dom';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import set from 'platform/utilities/data/set';

import { fireEvent } from '@testing-library/dom';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage';
import { getParentSiteMock } from '../../../mocks/v0';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import { mockParentSites } from '../../../mocks/helpers';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS integration: VA facility page with a single-site user', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

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
