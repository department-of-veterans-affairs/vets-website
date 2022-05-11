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
    ).to.contain('pages%2Fscheduling%2Fupcoming');

    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(screen.getByRole('button', { name: /Continue/ })).to.have.attribute(
      'disabled',
    );
  });
});
