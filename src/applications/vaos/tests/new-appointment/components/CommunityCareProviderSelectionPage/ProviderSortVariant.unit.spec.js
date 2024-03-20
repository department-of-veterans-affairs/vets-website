import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/react';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setClosestCity,
  setTypeOfCare,
  setTypeOfFacility,
} from '../../../mocks/setup';
import {
  mockCCProviderFetch,
  mockCommunityCareEligibility,
  mockGetCurrentPosition,
} from '../../../mocks/helpers';

import CommunityCareProviderSelectionPage from '../../../../new-appointment/components/CommunityCareProviderSelectionPage';
import { calculateBoundingBox } from '../../../../utils/address';
import { CC_PROVIDERS_DATA } from './cc_providers_data';
import { FACILITY_SORT_METHODS } from '../../../../utils/constants';
import { createMockFacilityByVersion } from '../../../mocks/data';
import {
  mockFacilitiesFetchByVersion,
  mockFacilityFetchByVersion,
} from '../../../mocks/fetch';
import { mockSchedulingConfigurations } from '../../../mocks/helpers.v2';
import { getSchedulingConfigurationMock } from '../../../mocks/v2';

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

describe('VAOS Page: CommunityCareProviderSelectionPage', () => {
  beforeEach(() => {
    mockFetch();

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
    mockFacilitiesFetchByVersion({
      children: true,
      ids: ['983'],
      facilities: [
        createMockFacilityByVersion({
          id: '983',
          address: {
            line: [],
            city: 'Belgrade',
          },
          lat: 38.5615,
          long: 122.9988,
        }),
      ],
    });
    mockSchedulingConfigurations(
      [
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'primaryCare',
          requestEnabled: true,
        }),
      ],
      true,
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
    expect(await screen.findByTestId('providersSelect')).to.exist;
    expect(screen.baseElement).to.contain.text('Your home address');

    expect(await screen.findByText(/Displaying 1 to 5 of 16 providers/i)).to.be
      .ok;

    const radioButtons = screen
      .getAllByRole('radio')
      .filter(element => element.name.startsWith('root_communityCareProvider'));
    expect(radioButtons.length).to.equal(5);
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

    const providersSelect = await screen.findByTestId('providersSelect');
    // call VaSelect custom event for onChange handling
    providersSelect.__events.vaSelect({
      detail: { value: FACILITY_SORT_METHODS.distanceFromCurrentLocation },
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

    const providersSelect = await screen.findByTestId('providersSelect');

    // call VaSelect custom event for onChange handling
    providersSelect.__events.vaSelect({
      detail: { value: FACILITY_SORT_METHODS.distanceFromCurrentLocation },
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
    await waitFor(() =>
      expect(screen.getAllByRole('radio').length).to.equal(5),
    );
    const providersSelect = await screen.findByTestId('providersSelect');
    // call VaSelect custom event for onChange handling
    providersSelect.__events.vaSelect({
      detail: { value: FACILITY_SORT_METHODS.distanceFromCurrentLocation },
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
    await waitFor(() => {
      const radioButtons = screen
        .getAllByRole('radio')
        .filter(element =>
          element.name.startsWith('root_communityCareProvider'),
        );

      expect(radioButtons.length).to.equal(1);
    });
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
    const providersSelect = await screen.findByTestId('providersSelect');
    // call VaSelect custom event for onChange handling
    providersSelect.__events.vaSelect({
      detail: { value: '983' },
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

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GJ',
        name: 'Facility that is enabled',
        lat: 39.1362562,
        long: -83.1804804,
        version: 0,
      }),
      version: 0,
    });

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);

    // Belgrade is the 2nd of three options so the expectation is
    // that it should be selected when we get to the CommunityCareProviderSelectionPage.
    await setClosestCity(store, /Belgrade/i);
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

    expect(await screen.findByTestId('providersSelect')).to.exist;

    // Then the select options should default to sort by distance from the first CC enabled facility
    expect(screen.baseElement).not.to.contain.text('Your home address');
    expect(screen.baseElement).to.contain.text('Your current location');
    const providerSelect = await screen.findByTestId('providersSelect');
    expect(providerSelect).to.be.ok;

    const options = within(providerSelect).getAllByRole('option');
    // Facility should be selected
    expect(options[0].value).to.equal(providerSelect.value);
    // Current location should not be selected
    expect(options[1].value).not.to.equal(providerSelect.value);
  });

  it('should defalut to home address when user has a residential address', async () => {
    // Given the CC iteration flag is on
    // And the user has a residential address
    const store = createTestStore({
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: false }],
          vapContactInfo: {
            residentialAddress: {
              addressLine1: 'PSC 808 Box 37',
              city: 'FPO',
              stateCode: 'AE',
              zipCode: '09618',
            },
          },
        },
      },
    });
    const facilityPosition = {
      latitude: 39.1362562,
      longitude: -83.1804804,
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

    // Belgrade is the 2nd of three options so the expectation is
    // that it should be selected when we get to the CommunityCareProviderSelectionPage.
    await setClosestCity(store, /Belgrade/i);

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

    expect(await screen.findByTestId('providersSelect')).to.exist;

    // Then the select options should default to sort by distance from home address
    expect(screen.baseElement).to.contain.text('Your home address');
    expect(screen.baseElement).to.contain.text('Your current location');
  });

  it('should display an error message when lookup fails', async () => {
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
    // And the provider service is not working
    mockCCProviderFetch(
      initialState.user.profile.vapContactInfo.residentialAddress,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
      true,
    );

    // When the user clicks the choose a provider button
    userEvent.click(
      await screen.findByText(/Choose a provider/i, {
        selector: 'button',
      }),
    );
    // Then they should see an error message
    expect(await screen.findByText(/We can’t load provider information/i)).to
      .exist;

    // And still be able to continue
    expect(screen.getByRole('button', { name: /Continue/i })).to.exist;
  });
});
