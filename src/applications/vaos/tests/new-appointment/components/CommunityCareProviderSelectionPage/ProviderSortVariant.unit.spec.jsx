import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';

import { mockFetch } from 'platform/testing/unit/helpers';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setTypeOfFacility,
} from '../../../mocks/setup';
import { getParentSiteMock, getVAFacilityMock } from '../../../mocks/v0';
import {
  mockCCProviderFetch,
  mockCommunityCareEligibility,
  mockFacilityFetch,
  mockGetCurrentPosition,
  mockParentSites,
} from '../../../mocks/helpers';

import CommunityCareProviderSelectionPage from '../../../../new-appointment/components/CommunityCareProviderSelectionPage';
import { calculateBoundingBox } from '../../../../utils/address';
import { CC_PROVIDERS_DATA } from './cc_providers_data';
import { FACILITY_SORT_METHODS } from '../../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCommunityCare: true,
    vaOnlineSchedulingCCIterations: true,
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

describe('VAOS ProviderSortVariant on <CommunityCareProviderSelectionPage>', () => {
  beforeEach(() => {
    mockFetch();
    mockParentSites(
      ['983'],
      [
        {
          id: '983',
          attributes: {
            ...getParentSiteMock({ id: '983' }).attributes,
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
            ...getParentSiteMock({ id: '983GJ' }).attributes,
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
            ...getParentSiteMock({ id: '983GC' }).attributes,
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
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
    );
    mockFacilityFetch(
      'vha_442',
      getVAFacilityMock({ id: '442', lat: 38.5615, long: 122.9988 }),
    );
  });

  it('should display list of providers when choose a provider clicked', async () => {
    // Given the CC iteration flag is on
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // When the user clicks the choose a provider button
    userEvent.click(
      await screen.findByText(/Choose a provider/i, {
        selector: 'button',
      }),
    );
    // Then providers should be displayed
    expect(await screen.findByText(/Show providers closest to/i)).to.exist;
    expect(screen.baseElement).to.contain.text('Your home address');

    expect(await screen.findByText(/Displaying 1 to 5 of 16 providers/i)).to.be
      .ok;
    expect(screen.getAllByRole('radio').length).to.equal(5);
  });

  it('should notify user that the browser is blocked from using current location information', async () => {
    // Given the CC iteration flag is on
    const store = createTestStore(initialState);
    // And the user denies geolocation
    mockGetCurrentPosition({ fail: true });

    mockCCProviderFetch(
      initialState.user.profile.vapContactInfo.residentialAddress,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
    );

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);

    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // When the user selects to sort providers by distance from current location
    userEvent.click(
      await screen.findByText(/Choose a provider/i, {
        selector: 'button',
      }),
    );
    fireEvent.change(await screen.getByLabelText('Show providers closest to'), {
      target: {
        value: FACILITY_SORT_METHODS.distanceFromCurrentLocation,
      },
    });
    // Then an error location alert should be displayed
    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /Your browser is blocked from finding your current location/,
      }),
    ).to.be.ok;

    expect(
      screen.getByText(
        /Make sure your browser’s location feature is turned on./i,
      ),
    ).to.be.ok;
  });

  it('should sort provider addresses by distance from current location in ascending order when current location is selected', async () => {
    // Given the CC iteration flag is on
    const store = createTestStore(initialState);
    const currentPosition = {
      latitude: 37.5615,
      longitude: 121.9988,
      fail: false,
    };

    mockGetCurrentPosition(currentPosition);

    mockCCProviderFetch(
      currentPosition,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        currentPosition.latitude,
        currentPosition.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
    );

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);

    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Choose Provider based on home address
    userEvent.click(
      await screen.findByText(/Choose a provider/i, {
        selector: 'button',
      }),
    );

    // When the user selects to sort providers by distance from current location
    // Choose Provider based on current location
    await screen.findByText(/Displaying 1 to /i);
    fireEvent.change(await screen.getByLabelText('Show providers closest to'), {
      target: {
        value: FACILITY_SORT_METHODS.distanceFromCurrentLocation,
      },
    });
    userEvent.click(await screen.findByText(/more providers$/i));
    userEvent.click(await screen.findByText(/more providers$/i));
    userEvent.click(await screen.findByText(/more providers$/i));

    // Then providers should be displayed in ascending order by distance from current location
    const miles = screen.queryAllByText(/miles$/);
    expect(miles.length).to.equal(16);
    expect(() => {
      for (let i = 0; i < miles.length - 1; i++) {
        if (
          Number.parseFloat(miles[i].textContent) >
          Number.parseFloat(miles[i + 1].textContent)
        )
          throw new Error();
      }
    }).to.not.throw();
  });

  it('should allow user to retry fetching location when it is blocked', async () => {
    // Given the CC iteration flag is on
    const store = createTestStore(initialState);
    // And the user denies geolocation
    mockGetCurrentPosition({ fail: true });

    mockCCProviderFetch(
      initialState.user.profile.vapContactInfo.residentialAddress,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
    );

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);

    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Choose Provider
    userEvent.click(
      await screen.findByText(/Choose a provider/i, {
        selector: 'button',
      }),
    );
    fireEvent.change(await screen.getByLabelText('Show providers closest to'), {
      target: {
        value: FACILITY_SORT_METHODS.distanceFromCurrentLocation,
      },
    });
    // And the error location alert is displayed
    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /Your browser is blocked from finding your current location/,
      }),
    ).to.be.ok;

    expect(
      screen.getByText(
        /Make sure your browser’s location feature is turned on./i,
      ),
    ).to.be.ok;

    const currentPosition = {
      latitude: 37.5615,
      longitude: 121.9988,
      fail: false,
    };

    mockGetCurrentPosition(currentPosition);
    mockCCProviderFetch(
      currentPosition,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        currentPosition.latitude,
        currentPosition.longitude,
        60,
      ), // Only return one provider to distinguish from initial request
      // by residential address
      CC_PROVIDERS_DATA.slice(0, 1),
    );
    // When the user attempts to search by current location again
    userEvent.click(
      screen.getByText(/Retry searching based on current location/i),
    );
    // Then providers should be displayed by distance from current location
    // should eventually be one provider
    await waitFor(() =>
      expect(screen.getAllByRole('radio').length).to.equal(1),
    );
  });

  it('should sort providers by distance from selected facility in ascending order', async () => {
    // Given the CC iteration flag is on
    const store = createTestStore(initialState);
    const facilityPosition = {
      latitude: 38.5615,
      longitude: 122.9988,
      fail: false,
    };

    mockGetCurrentPosition(facilityPosition);

    mockCCProviderFetch(
      facilityPosition,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        facilityPosition.latitude,
        facilityPosition.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
    );

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);

    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Choose Provider based on home address
    userEvent.click(
      await screen.findByText(/Choose a provider/i, {
        selector: 'button',
      }),
    );

    // When the user selects to sort providers by distance from a specific facility
    // Choose Provider based on facility address
    await screen.findByText(/Displaying 1 to /i);
    fireEvent.change(await screen.getByLabelText('Show providers closest to'), {
      target: {
        value: '983',
      },
    });
    userEvent.click(await screen.findByText(/more providers$/i));
    userEvent.click(await screen.findByText(/more providers$/i));
    userEvent.click(await screen.findByText(/more providers$/i));

    const miles = screen.queryAllByText(/miles$/);
    // Then providers should be displayed in ascending order by distance from the chosen facility
    expect(miles.length).to.equal(16);
    expect(() => {
      for (let i = 0; i < miles.length - 1; i++) {
        if (
          Number.parseFloat(miles[i].textContent) >
          Number.parseFloat(miles[i + 1].textContent)
        )
          throw new Error();
      }
    }).to.not.throw();
  });

  it('should default to first ccEnabledSystem if user is missing a residential address', async () => {
    // Given the CC iteration flag is on
    // And the user does not have a residential address
    const store = createTestStore({
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: false }],
          vapContactInfo: {
            residentialAddress: {},
          },
        },
      },
    });
    const facilityPosition = {
      latitude: 38.5615,
      longitude: 122.9988,
      fail: false,
    };

    mockGetCurrentPosition(facilityPosition);

    mockCCProviderFetch(
      facilityPosition,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        facilityPosition.latitude,
        facilityPosition.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
    );
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    // When the user tries to choose a provider
    // Trigger provider list loading
    userEvent.click(
      await screen.findByText(/Choose a provider/i, {
        selector: 'button',
      }),
    );
    expect(await screen.findByText(/Show providers closest to/i)).to.exist;

    // Then the select options should default to sort by distance from the first CC enabled facility
    expect(screen.baseElement).not.to.contain.text('Your home address');
    const selectOptions = await screen.getByLabelText(
      'Show providers closest to',
    );
    expect(selectOptions).to.be.ok;
    // current location should not be selected
    expect(selectOptions[0].selected).to.not.be.ok;
    // first facility should be selected
    expect(selectOptions[1].selected).to.be.ok;
  });
});
