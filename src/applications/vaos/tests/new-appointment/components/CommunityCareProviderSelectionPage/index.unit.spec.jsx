import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setTypeOfFacility,
} from '../../../mocks/setup';
import { getParentSiteMock } from '../../../mocks/v0';
import {
  mockCommunityCareEligibility,
  mockParentSites,
  mockCCProviderFetch,
} from '../../../mocks/helpers';

import CommunityCareProviderSelectionPage from '../../../../new-appointment/components/CommunityCareProviderSelectionPage';
import { calculateBoundingBox } from '../../../../utils/address';
import { CC_PROVIDERS_DATA } from './cc_providers_data';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCommunityCare: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
      vapContactInfo: {
        residentialAddress: {
          addressLine1: '123 big sky st',
          city: 'Cincinnati',
          stateCode: 'OH',
          zipCode: '45220',
          latitude: 39.1,
          longitude: -84.6,
        },
      },
    },
  },
};
describe('VAOS <CommunityCareProviderSelectionPage>', () => {
  beforeEach(() => {
    mockFetch();
    mockParentSites(
      ['983'],
      [
        {
          id: '983',
          attributes: {
            ...getParentSiteMock().attributes,
            city: 'Bozeman',
            stateAbbrev: 'MT',
            institutionCode: '983',
            rootStationCode: '983',
            parentStationCode: '983',
          },
        },
        {
          id: '983GJ',
          attributes: {
            ...getParentSiteMock().attributes,
            city: 'Belgrade',
            stateAbbrev: 'MT',
            institutionCode: '983GJ',
            rootStationCode: '983',
            parentStationCode: '983GJ',
          },
        },
        {
          id: '983GC',
          attributes: {
            ...getParentSiteMock().attributes,
            institutionCode: '983GC',
            rootStationCode: '983',
            parentStationCode: '983GC',
          },
        },
      ],
    );
    mockCommunityCareEligibility({
      parentSites: ['983', '983GJ', '983GC'],
      supportedSites: ['983', '983GJ'],
      careType: 'PrimaryCare',
    });
    mockCCProviderFetch(
      initialState.user.profile.vapContactInfo.residentialAddress,
      ['208D00000X', '207R00000X', '261QP2300X'],
      calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
    );
  });
  afterEach(() => resetFetch());
  it('should display closest city question when user has multiple supported sites', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    expect((await screen.findAllByRole('radio')).length).to.equal(2);
    expect(screen.getByLabelText('Bozeman, MT')).to.exist;
    expect(screen.getByLabelText('Belgrade, MT')).to.exist;
    expect(screen.baseElement).to.contain.text(
      'Request a Primary care provider. (Optional)',
    );
    expect(screen.baseElement).to.contain.text('Choose a provider');

    // Continue without filling in required fields
    userEvent.click(screen.getByText(/Continue/i));

    expect((await screen.findAllByRole('alert')).length).to.equal(2);
    expect(screen.history.push.called).to.be.false;
  });

  it('should display list of providers when choose a provider clicked', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Trigger provider list loading
    userEvent.click(await screen.findByText(/Choose a provider/i));
    expect(await screen.findByText(/your address on file:/i)).to.exist;

    // Verify provider list count and get load more button
    expect(screen.baseElement).to.contain.text(
      '123 big sky stCincinnati, OH 45220',
    );
    expect(screen.baseElement).to.contain.text(
      'Displaying 1 to 5 of 16 providers',
    );
    expect((await screen.findAllByRole('radio')).length).to.equal(7);

    userEvent.click(await screen.findByText(/\+ 5 more providers/i));
    expect(await screen.findByText(/displaying 1 to 10 of 16 providers/i)).to
      .exist;
    expect((await screen.findAllByRole('radio')).length).to.equal(12);

    userEvent.click(await screen.findByText(/\+ 5 more providers/i));
    expect(await screen.findByText(/displaying 1 to 15 of 16 providers/i)).to
      .exist;
    expect((await screen.findAllByRole('radio')).length).to.equal(17);

    userEvent.click(await screen.findByText(/\+ 1 more providers/i));
    expect(await screen.findByText(/displaying 1 to 16 of 16 providers/i)).to
      .exist;
    expect((await screen.findAllByRole('radio')).length).to.equal(18);

    // Choose Provider
    userEvent.click(await screen.findByText(/AJADI, ADEDIWURA/i));
    userEvent.click(
      await screen.getByRole('button', { name: /choose provider/i }),
    );
    expect(screen.baseElement).to.contain.text(
      'AJADI, ADEDIWURA700 CONSTITUTION AVE NEWASHINGTON, DC 20002-65999349.3 miles',
    );

    // Change Provider
    userEvent.click(
      await screen.findByRole('button', { name: /change provider/i }),
    );
    userEvent.click(await screen.findByText(/LYONS, KRISTYN/i));
    userEvent.click(
      await screen.findByRole('button', { name: /choose provider/i }),
    );

    expect(screen.baseElement).to.contain.text(
      'LYONS, KRISTYN1785 S HAYES STARLINGTON, VA 22202-27149347.1 miles',
    );

    // Cancel Selection (not clearing of a selected provider)
    userEvent.click(
      await screen.findByRole('button', { name: /change provider/i }),
    );
    expect(await screen.findByText(/displaying 1 to 5 of 16 providers/i)).to
      .exist;
    userEvent.click(await screen.findByRole('button', { name: /cancel/i }));
    expect(screen.baseElement).to.contain.text(
      'LYONS, KRISTYN1785 S HAYES STARLINGTON, VA 22202-27149347.1 miles',
    );
  });
  it('should display an error when choose a provider clicked and provider fetch error', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
    mockCCProviderFetch(
      initialState.user.profile.vapContactInfo.residentialAddress,
      ['208D00000X', '207R00000X', '261QP2300X'],
      calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
      true,
    );
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Trigger provider list loading
    userEvent.click(await screen.findByText(/Choose a provider/i));
    expect(
      await screen.findByRole('heading', {
        name: /we’re sorry\. we’ve run into a problem/i,
      }),
    );
    expect(
      await screen.findByText(
        /something went wrong on our end. please try again later./i,
      ),
    );
  });
});
