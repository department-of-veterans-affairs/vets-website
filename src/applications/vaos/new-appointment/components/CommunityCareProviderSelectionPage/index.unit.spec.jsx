import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setClosestCity,
  setCommunityCareFlow,
  setTypeOfCare,
  setTypeOfFacility,
} from '../../../tests/mocks/setup';

import CommunityCareProviderSelectionPage from '.';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../../../tests/fixtures/MockSchedulingConfigurationResponse';
import { CC_PROVIDERS_DATA } from '../../../tests/mocks/cc_providers_data';
import {
  mockCCProviderApi,
  mockFacilitiesApi,
  mockGetCurrentPosition,
  mockSchedulingConfigurationsApi,
  mockV2CommunityCareEligibility,
} from '../../../tests/mocks/mockApis';
import { calculateBoundingBox } from '../../../utils/address';
import { FACILITY_SORT_METHODS, GA_PREFIX } from '../../../utils/constants';

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
  const facility = new MockFacilityResponse({
    id: '983',
    name: 'Facility that is enabled',
  })
    .setLatitude(39.1362562)
    .setLongitude(-83.1804804);

  beforeEach(() => {
    mockFetch();
    mockV2CommunityCareEligibility({
      parentSites: ['983', '983GJ', '983GC'],
      supportedSites: ['983', '983GJ'],
      careType: 'PrimaryCare',
    });
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
  it('should display closest city question when user has multiple supported sites', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Trigger provider list loading
    const chooseProviderButton = await waitFor(() => {
      const button = screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      );
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(chooseProviderButton);
    expect(await screen.findByText(/Displaying 5 of 16 providers/i)).to.be.ok;
    expect(screen.getAllByRole('radio').length).to.equal(5);

    expect(
      global.window.dataLayer.some(
        e => e === `${GA_PREFIX}-community-care-provider-selection-page`,
      ),
    );

    expect(screen.baseElement).to.contain.text('Primary care providers');

    // Continue without filling in required fields
    const continueButton = await screen.findByText(/continue/i);
    await userEvent.click(continueButton);
    await waitFor(() => expect(screen.history.push.called).to.be.true);
    expect(
      global.window.dataLayer.some(
        e => e === `${GA_PREFIX}-continue-without-provider`,
      ),
    );

    // Continue with filling in required fields with provider
    const primaryCareHeading = await screen.findByRole('heading', {
      level: 2,
      name: /Primary care provider/i,
    });
    await userEvent.click(primaryCareHeading);

    const providerLink = await screen.findByText(/OH, JANICE/i);
    await userEvent.click(providerLink);

    const selectProviderButton = await screen.findByText(/Select provider/i);
    await userEvent.click(selectProviderButton);
    expect(
      global.window.dataLayer.some(
        e => e === `${GA_PREFIX}-order-position-provider-selection`,
      ),
    );
    expect(await screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');

    const finalContinueButton = await screen.findByText(/continue/i);
    await userEvent.click(finalContinueButton);
    expect(
      global.window.dataLayer.some(
        e => e === `${GA_PREFIX}-continue-with-provider`,
      ),
    );
    await waitFor(() => expect(screen.history.push.called).to.be.true);
  });

  it('should display list of providers when choose a provider clicked', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Trigger provider list loading
    const chooseProviderButton = await waitFor(() => {
      const button = screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      );
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(chooseProviderButton);

    expect(await screen.findByText(/Displaying 5 of 16 providers/i)).to.be.ok;
    expect(screen.getAllByRole('radio').length).to.equal(5);

    const firstMoreButton = await screen.findByText(/Show 5 more providers/i);
    await userEvent.click(firstMoreButton);
    expect((await screen.findAllByRole('radio')).length).to.equal(10);
    await waitFor(() => {
      expect(document.activeElement.id).to.equal(
        'root_communityCareProvider_6',
      );
    });

    await waitFor(() => {
      expect(document.activeElement.id).to.equal(
        'root_communityCareProvider_6',
      );
    });

    const secondMoreButton = await screen.findByText(/Show 5 more providers/i);
    await userEvent.click(secondMoreButton);
    expect(await screen.findByText(/displaying 15 of 16 providers/i)).to.exist;
    expect((await screen.findAllByRole('radio')).length).to.equal(15);
    await waitFor(() => {
      expect(document.activeElement.id).to.equal(
        'root_communityCareProvider_11',
      );
    });

    const thirdMoreButton = await screen.findByText(/Show 1 more provider/i);
    await userEvent.click(thirdMoreButton);
    expect(await screen.findByText(/displaying 16 of 16 providers/i)).to.exist;
    expect((await screen.findAllByRole('radio')).length).to.equal(16);
    await waitFor(() => {
      expect(document.activeElement.id).to.equal(
        'root_communityCareProvider_16',
      );
    });
    // Choose Provider
    const providerAjadi = await screen.findByText(/AJADI, ADEDIWURA/i);
    await userEvent.click(providerAjadi);

    const selectButton = await screen.findByText(/Select provider/i);
    await userEvent.click(selectButton);
    expect(screen.baseElement).to.contain.text('Preferred provider');
    expect(screen.baseElement).to.contain.text(
      'AJADI, ADEDIWURAWASHINGTON, DC',
    );

    // Change Provider
    const changeProviderButton = await waitFor(() => {
      const button = screen.container.querySelector(
        'va-button[text="Change provider"]',
      );
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(changeProviderButton);

    const providerJanice = await screen.findByText(/OH, JANICE/i);
    await userEvent.click(providerJanice);

    const selectProviderButton2 = await screen.findByText(/Select provider/i);
    await userEvent.click(selectProviderButton2);

    expect(screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');

    // Cancel Selection (not clearing of a selected provider)
    const changeProviderButton2 = await waitFor(() => {
      const button = screen.container.querySelector(
        'va-button[text="Change provider"]',
      );
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(changeProviderButton2);
    expect(await screen.findByText(/displaying 5 of 16 providers/i)).to.exist;
    const cancelButton = await screen.findByText(/cancel/i);
    await userEvent.click(cancelButton);
    expect(screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');
  });

  it('should display Select provider when remove provider clicked', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Choose Provider that is buried 2 clicks deep
    const chooseButton = await waitFor(() => {
      const button = screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      );
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(chooseButton);
    await userEvent.click(await screen.findByText(/more providers$/i));
    await userEvent.click(await screen.findByText(/more providers$/i));
    await userEvent.click(await screen.findByText(/AJADI, ADEDIWURA/i));
    await userEvent.click(
      await screen.getByRole('button', { name: /Select provider/i }),
    );

    // Remove Provider
    const removeButton = await waitFor(() => {
      const button = screen.container.querySelector('va-button[text="Remove"]');
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(removeButton);
    expect(await screen.findByTestId('removeProviderModal')).to.exist;
    await userEvent.click(
      await screen.findByRole('button', { name: /Remove provider/i }),
    );
    expect(
      await waitFor(() =>
        screen.container.querySelector('va-button[text="Choose a provider"]'),
      ),
    ).to.exist;
    expect(screen.baseElement).not.to.contain.text(
      'AJADI, ADEDIWURAWASHINGTON, DC',
    );
  });

  it('should allow remove provider clicked when user has no residential address', async () => {
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

    // Facility 983 is the 2nd of three options so the expectation is
    // that it should be selected when we get to the CommunityCareProviderSelectionPage.
    await setClosestCity(store, 'City 983, WY');
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    // When the user tries to choose a provider
    // Trigger provider list loading
    const chooseButton2 = await waitFor(() => {
      const button = screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      );
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(chooseButton2);

    expect(await screen.findByTestId('providersSelect')).to.exist;

    // Choose Provider
    await userEvent.click(await screen.findByText(/OH, JANICE/i));
    await userEvent.click(
      await screen.getByRole('button', {
        name: /Select provider/i,
      }),
    );
    expect(screen.baseElement).to.contain.text('Preferred provider');
    expect(screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');

    // Remove Provider
    const removeButton2 = await waitFor(() => {
      const button = screen.container.querySelector('va-button[text="Remove"]');
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(removeButton2);
    expect(await screen.findByTestId('removeProviderModal')).to.exist;
    await userEvent.click(
      await screen.findByRole('button', { name: /Remove provider/i }),
    );
    expect(
      await waitFor(() =>
        screen.container.querySelector('va-button[text="Choose a provider"]'),
      ),
    ).to.exist;
  });

  it('should display an error when choose a provider clicked and provider fetch error', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');
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
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Trigger provider list loading
    const chooseButton4 = await waitFor(() => {
      const button = screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      );
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(chooseButton4);
    expect(
      await screen.findByRole('heading', {
        name: /We can’t load provider information/i,
      }),
    );
    expect(
      await screen.findByText(
        /We’re sorry. Something went wrong on our end. To request this appointment, you can:/i,
      ),
    );
  });

  it('should display an alert when no providers are available', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');
    mockCCProviderApi({
      address: initialState.user.profile.vapContactInfo.residentialAddress,
      specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      bbox: calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      response: [],
    });
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Trigger provider list loading
    const chooseButton5 = await waitFor(() => {
      const button = screen.container.querySelector(
        'va-button[text="Choose a provider"]',
      );
      expect(button).to.exist;
      return button;
    });
    await userEvent.click(chooseButton5);
    expect(await screen.findByText(/To request this appointment, you can/i)).to
      .exist;
    expect(
      screen.findByRole('heading', {
        level: 3,
        name: /We .* find any Primary care providers close to you/i,
      }),
    );
    expect(
      await screen.findByRole('link', {
        name: /Find your health facility’s phone number/i,
      }),
    );
  });

  it('should notify user that the browser is blocked from using current location information', async () => {
    const store = createTestStore(initialState);

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
    const chooseButton6 = await waitFor(() =>
      screen.container.querySelector('va-button[text="Choose a provider"]'),
    );
    await userEvent.click(chooseButton6);
    // await waitFor(async () => {
    expect(await screen.findByText(/Displaying 5 of/i)).to.be.ok;
    // });
    const providersSelect = await screen.findByTestId('providersSelect');
    // call VaSelect custom event for onChange handling
    providersSelect.__events.vaSelect({
      detail: { value: FACILITY_SORT_METHODS.distanceFromCurrentLocation },
    });

    await waitFor(async () => {
      expect(
        await screen.findByRole('heading', {
          level: 3,
          name: /Your browser is blocked from finding your current location/,
        }),
      ).to.be.ok;
    });

    expect(
      screen.getByText(
        /Make sure your browser’s location feature is turned on./i,
      ),
    ).to.be.ok;
  });

  it('should sort provider addresses by distance from home address in ascending order', async () => {
    const store = createTestStore(initialState);

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

    // Choose Provider based on home address
    const chooseProviderButton7 = await waitFor(() =>
      screen.container.querySelector('va-button[text="Choose a provider"]'),
    );
    await userEvent.click(chooseProviderButton7);
    await userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    await userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    await userEvent.click(await screen.findByText(/Show 1 more provider$/i));

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

  it('should sort provider addresses by distance from current location in ascending order and display distance from current location when chosen', async () => {
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
    const chooseProviderButton8 = await waitFor(() =>
      screen.container.querySelector('va-button[text="Choose a provider"]'),
    );
    await userEvent.click(chooseProviderButton8);

    // Choose Provider based on current location
    const currentLocButton = await screen.findByText(/your current location$/i);
    await screen.findByText(/Displaying 5 of /i);
    await userEvent.click(currentLocButton);
    await userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    await userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    await userEvent.click(await screen.findByText(/Show 1 more provider$/i));

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

    await userEvent.click(await screen.findByText(/OH, JANICE/i));
    await userEvent.click(
      await screen.findByRole('button', { name: /Select provider/i }),
    );

    expect(screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');
  });

  it('should reset provider selected when type of care changes', async () => {
    const store = createTestStore(initialState);

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
    mockV2CommunityCareEligibility({
      parentSites: ['983', '983GJ', '983GC'],
      supportedSites: ['983', '983GJ'],
      careType: 'Podiatry',
    });

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, 'Community care facility');

    let screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Choose Provider based on home address
    const chooseProviderButton9 = await waitFor(() =>
      screen.container.querySelector('va-button[text="Choose a provider"]'),
    );
    await userEvent.click(chooseProviderButton9);

    await userEvent.click(await screen.findByLabelText(/OH, JANICE/i));
    await userEvent.click(
      await screen.findByRole('button', { name: /Select provider/i }),
    );

    // make sure it saves successfully
    await waitFor(() =>
      screen.container.querySelector('va-button[text="Remove"]'),
    );

    // remove the page and change the type of care
    await cleanup();

    mockCCProviderApi({
      address: initialState.user.profile.vapContactInfo.residentialAddress,
      specialties: [
        '213E00000X',
        '213EG0000X',
        '213EP1101X',
        '213ES0131X',
        '213ES0103X',
      ],
      bbox: calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      response: CC_PROVIDERS_DATA,
    });
    await setTypeOfCare(store, /podiatry/i);

    screen = renderWithStoreAndRouter(<CommunityCareProviderSelectionPage />, {
      store,
    });
    await screen.findByText(/Continue/i);

    // the provider should no longer be set
    expect(
      await waitFor(() =>
        screen.container.querySelector('va-button[text="Choose a provider"]'),
      ),
    ).to.exist;
    expect(screen.queryByText(/OH, JANICE/i)).to.not.exist;
  });

  it('should allow user to retry fetching location when it is blocked', async () => {
    const store = createTestStore(initialState);

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
    const chooseProviderButton10 = await waitFor(() =>
      screen.container.querySelector('va-button[text="Choose a provider"]'),
    );
    await userEvent.click(chooseProviderButton10);
    await waitFor(() =>
      expect(screen.getAllByRole('radio').length).to.equal(5),
    );

    const providersSelect = await screen.findByTestId('providersSelect');
    // call VaSelect custom event for onChange handling
    providersSelect.__events.vaSelect({
      detail: { value: FACILITY_SORT_METHODS.distanceFromCurrentLocation },
    });

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
      ),
      // Only return one provider to distinguish from initial request
      // by residential address
      response: CC_PROVIDERS_DATA.slice(0, 1),
    });

    await userEvent.click(
      screen.getByText(/Retry searching based on current location/i),
    );

    // should eventually be one provder
    await waitFor(() =>
      expect(screen.getAllByRole('radio').length).to.equal(1),
    );
  });

  it('should not display closest city question since iterations toggle is now the default', async () => {
    // Given a user with two supported sites
    // And the CC iterations toggle is on
    // And type of care is selected
    const store = await setCommunityCareFlow({
      parentSites: [
        { id: '983', address: { city: 'Bozeman', state: 'MT' } },
        { id: '984', address: { city: 'Belgrade', state: 'MT' } },
      ],
    });

    // Facility 984 is the 2nd of three options so the expectation is
    // that it should be selected when we get to the CommunityCareProviderSelectionPage.
    await setClosestCity(store, 'Belgrade, MT');

    // When the page is displayed
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Then the heading will display type of provider requested
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Which provider do you prefer/i,
      }),
    ).to.be.ok;

    // And the closest city/state question is not shown
    expect(screen.queryByLabelText('Bozeman, MT')).not.to.exist;
    expect(screen.queryByLabelText('Belgrade, MT')).not.to.exist;
    expect(screen.queryByText(/closest city and state/i)).not.to.exist;
  });
});
