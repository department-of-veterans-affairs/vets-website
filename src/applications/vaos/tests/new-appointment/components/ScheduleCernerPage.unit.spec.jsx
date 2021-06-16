import React from 'react';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setVAFacility,
} from '../../mocks/setup';

import { getVAFacilityMock } from '../../mocks/v0';
import { mockFetch } from 'platform/testing/unit/helpers';
import ScheduleCernerPage from '../../../new-appointment/components/ScheduleCernerPage';

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
  it('should show Cerner facility information', async () => {
    const facilityData = {
      id: 'vha_442',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
          },
        },
        phone: {
          main: '307-778-7550',
        },
      },
    };

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983', facilityData);

    const screen = renderWithStoreAndRouter(<ScheduleCernerPage />, {
      store,
    });

    await screen.findByRole('heading', {
      level: 1,
      name: 'How to schedule',
    });

    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.getByText(/2360 East Pershing Boulevard/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');

    expect(
      screen.getByRole('link', { name: 'My VA Health' }).getAttribute('href'),
    ).to.contain('pages%2Fscheduling%2Fupcoming');

    expect(screen.baseElement).to.contain.text('307-778-7550');
    expect(screen.getByRole('button', { name: /Continue/ })).to.have.attribute(
      'disabled',
    );
  });
});
