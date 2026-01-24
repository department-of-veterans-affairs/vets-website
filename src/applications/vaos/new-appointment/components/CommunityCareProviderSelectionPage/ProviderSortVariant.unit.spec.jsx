import { waitFor } from '@testing-library/dom';
import { cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import CommunityCareProviderSelectionPage from '.';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import { CC_PROVIDERS_DATA } from '../../../tests/mocks/cc_providers_data';
import { mockGetCurrentPosition } from '../../../tests/mocks/mockApis';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setClosestCity,
  setTypeOfCare,
  setTypeOfFacility,
} from '../../../tests/mocks/setup';
import { calculateBoundingBox } from '../../../utils/address';
import { FACILITY_SORT_METHODS } from '../../../utils/constants';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../../../tests/fixtures/MockSchedulingConfigurationResponse';

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

// Use path-only URL for MSW matching (query params handled by MSW internally)
const buildFacilitiesUrl = () => {
  return `${environment.API_URL}/vaos/v2/facilities`;
};

// Use path-only URL for MSW matching (query params handled by MSW internally)
const buildSchedulingConfigurationsUrl = () => {
  return `${environment.API_URL}/vaos/v2/scheduling/configurations`;
};

// Use path-only URL for MSW matching (query params handled by MSW internally)
const buildCCProviderUrl = () => {
  return `${environment.API_URL}/facilities_api/v2/ccp/provider`;
};

const buildFacilityByIdUrl = () => {
  return `${environment.API_URL}/vaos/v2/facilities/:facilityId`;
};

const buildCCEligibilityUrl = serviceType => {
  return `${
    environment.API_URL
  }/vaos/v2/community_care/eligibility/${serviceType}`;
};

const mockFacilitiesApi = ({ response = [], responseCode = 200 }) => {
  const url = buildFacilitiesUrl();
  server.use(
    createGetHandler(
      url,
      () =>
        responseCode === 200
          ? jsonResponse({ data: response })
          : jsonResponse({ errors: [] }, { status: responseCode }),
    ),
  );
};

const mockSchedulingConfigurationsApi = ({ response, responseCode = 200 }) => {
  const url = buildSchedulingConfigurationsUrl();
  server.use(
    createGetHandler(
      url,
      () =>
        responseCode === 200
          ? jsonResponse({ data: response })
          : jsonResponse({ errors: [] }, { status: responseCode }),
    ),
  );
};

const mockCCProviderApi = ({ response = [], responseCode = 200 }) => {
  const url = buildCCProviderUrl();
  server.use(
    createGetHandler(
      url,
      () =>
        responseCode === 200
          ? jsonResponse({ data: response })
          : jsonResponse({ errors: [] }, { status: responseCode }),
    ),
  );
};

const mockCCEligibilityApi = ({
  serviceType,
  eligible = true,
  responseCode = 200,
}) => {
  const url = buildCCEligibilityUrl(serviceType);
  server.use(
    createGetHandler(
      url,
      () =>
        responseCode === 200
          ? jsonResponse({
              data: {
                id: serviceType,
                attributes: {
                  eligible,
                },
              },
            })
          : jsonResponse({ errors: [] }, { status: responseCode }),
    ),
  );
};

const mockFacilityByIdApi = ({ response, responseCode = 200 }) => {
  const url = buildFacilityByIdUrl();
  server.use(
    createGetHandler(url, ({ params }) => {
      const facility =
        response ||
        new MockFacilityResponse({
          id: params.facilityId,
        });
      return responseCode === 200
        ? jsonResponse({ data: facility })
        : jsonResponse({ errors: [] }, { status: responseCode });
    }),
  );
};

describe('VAOS Page: CommunityCareProviderSelectionPage', () => {
  const facility = new MockFacilityResponse({
    id: '983',
    name: 'Facility that is enabled',
  })
    .setLatitude(38.5615)
    .setLongitude(122.9988);

  beforeEach(() => {
    server.resetHandlers();
    mockCCEligibilityApi({ serviceType: 'PrimaryCare' });
    mockCCProviderApi({
      address: initialState.user.profile.vapContactInfo.residentialAddress,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      response: CC_PROVIDERS_DATA,
    });
    mockFacilitiesApi({
      children: true,
      ids: ['983'],
      response: [facility],
    });
    mockFacilityByIdApi({ response: facility });
    mockSchedulingConfigurationsApi({
      isCCEnabled: true,
      response: [
        new MockSchedulingConfigurationResponse({
          facilityId: '983',
          services: [
            new MockServiceConfiguration({
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
        }),
      ],
    });
  });

  afterEach(async () => {
    await cleanup();
  });

  it('should display list of providers when choose a provider clicked', async () => {
    // Given the CC iteration flag is on
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // When the user clicks the choose a provider button
    userEvent.click(
      await screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      ),
    );
    // Then providers should be displayed
    expect(await screen.findByTestId('providersSelect')).to.exist;
    expect(screen.baseElement).to.contain.text('Your home address');

    expect(await screen.findByText(/Displaying 5 of 16 providers/i)).to.be.ok;

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

    mockCCProviderApi({
      address: initialState.user.profile.vapContactInfo.residentialAddress,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      response: CC_PROVIDERS_DATA,
    });

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');

    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // When the user selects to sort providers by distance from current location
    userEvent.click(
      await screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      ),
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

    mockCCProviderApi({
      address: currentPosition,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        currentPosition.latitude,
        currentPosition.longitude,
        60,
      ),
      response: CC_PROVIDERS_DATA,
    });

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');

    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Choose Provider based on home address
    await userEvent.click(
      await screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      ),
    );

    // Wait for providers request to complete
    await waitFor(() => {
      const { requestStatus } = store.getState().newAppointment;
      expect(requestStatus).to.equal('succeeded');
    });

    // When the user selects to sort providers by distance from current location
    // Choose Provider based on current location
    await screen.findByText(/Displaying 5 of /i);

    const providersSelect = await screen.findByTestId('providersSelect');

    // call VaSelect custom event for onChange handling
    providersSelect.__events.vaSelect({
      detail: { value: FACILITY_SORT_METHODS.distanceFromCurrentLocation },
    });

    // Wait for provider list to reload after geolocation
    await screen.findByText(/Displaying 5 of /i);

    await userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    await userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    await userEvent.click(await screen.findByText(/Show 1 more provider$/i));

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

    mockCCProviderApi({
      address: initialState.user.profile.vapContactInfo.residentialAddress,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      response: CC_PROVIDERS_DATA,
    });

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');

    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Choose Provider
    await userEvent.click(
      await screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      ),
    );
    await waitFor(() =>
      expect(screen.queryAllByRole('radio').length).to.equal(5),
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
    mockCCProviderApi({
      address: currentPosition,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        currentPosition.latitude,
        currentPosition.longitude,
        60,
      ), // Only return one provider to distinguish from initial request
      // by residential address
      response: CC_PROVIDERS_DATA.slice(0, 1),
    });
    // When the user attempts to search by current location again
    await userEvent.click(
      screen.getByText(/Retry searching based on current location/i),
    );

    // Wait for current location to be populated in Redux (geolocation succeeded)
    await waitFor(() => {
      const { currentLocation } = store.getState().newAppointment;
      expect(currentLocation?.latitude).to.exist;
    });

    // Wait for providers to be loaded for current location sort method
    await waitFor(() => {
      const { communityCareProviders } = store.getState().newAppointment;
      const currentLocationKey = Object.keys(communityCareProviders).find(key =>
        key.startsWith(FACILITY_SORT_METHODS.distanceFromCurrentLocation),
      );
      expect(currentLocationKey).to.exist;
    });

    // Then providers should be displayed by distance from current location
    // should eventually be one provider
    await waitFor(() => {
      const radioButtons = screen
        .queryAllByRole('radio')
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

    mockCCProviderApi({
      address: facilityPosition,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        facilityPosition.latitude,
        facilityPosition.longitude,
        60,
      ),
      response: CC_PROVIDERS_DATA,
    });

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');

    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Choose Provider based on home address
    await userEvent.click(
      await screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      ),
    );

    // Wait for providers request to complete
    await waitFor(() => {
      const { requestStatus } = store.getState().newAppointment;
      expect(requestStatus).to.equal('succeeded');
    });

    // When the user selects to sort providers by distance from a specific facility
    // Choose Provider based on facility address
    await screen.findByText(/Displaying 5 of /i);
    const providersSelect = await screen.findByTestId('providersSelect');
    // call VaSelect custom event for onChange handling
    providersSelect.__events.vaSelect({
      detail: { value: '983' },
    });

    // Wait for provider list to reload after facility selection
    await screen.findByText(/Displaying 5 of /i);

    await userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    await userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    await userEvent.click(await screen.findByText(/Show 1 more provider$/i));

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

    mockCCProviderApi({
      address: facilityPosition,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        facilityPosition.latitude,
        facilityPosition.longitude,
        60,
      ),
      response: CC_PROVIDERS_DATA,
    });

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');

    // Belgrade is the 2nd of three options so the expectation is
    // that it should be selected when we get to the CommunityCareProviderSelectionPage.
    await setClosestCity(store, 'City 983, WY');
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);
    // When the user tries to choose a provider
    // Trigger provider list loading
    userEvent.click(
      await screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      ),
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

    mockCCProviderApi({
      address: facilityPosition,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        facilityPosition.latitude,
        facilityPosition.longitude,
        60,
      ),
      response: CC_PROVIDERS_DATA,
    });

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');

    // Belgrade is the 2nd of three options so the expectation is
    // that it should be selected when we get to the CommunityCareProviderSelectionPage.
    await setClosestCity(store, 'City 983, WY');

    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // When the user tries to choose a provider
    // Trigger provider list loading
    userEvent.click(
      await screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      ),
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
    await setTypeOfFacility(store, 'Community care facility');
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    // And the provider service is not working
    mockCCProviderApi({
      address: initialState.user.profile.vapContactInfo.residentialAddress,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      response: CC_PROVIDERS_DATA,
      responseCode: 500,
    });
    await screen.findByText(/Continue/i);

    // When the user clicks the choose a provider button
    userEvent.click(
      await screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      ),
    );
    // Then they should see an error message
    expect(await screen.findByText(/We can’t load provider information/i)).to
      .exist;

    // And still be able to continue
    expect(screen.getByRole('button', { name: /Continue/i })).to.exist;
  });
});
