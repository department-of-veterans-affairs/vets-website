import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setClosestCity,
  setCommunityCareFlow,
  setTypeOfCare,
  setTypeOfFacility,
} from '../../../mocks/setup';
import {
  mockCCProviderFetch,
  mockSchedulingConfigurations,
  mockV2CommunityCareEligibility,
  mockGetCurrentPosition,
} from '../../../mocks/helpers';

import CommunityCareProviderSelectionPage from '../../../../new-appointment/components/CommunityCareProviderSelectionPage';
import { calculateBoundingBox } from '../../../../utils/address';
import { CC_PROVIDERS_DATA } from './cc_providers_data';
import { FACILITY_SORT_METHODS, GA_PREFIX } from '../../../../utils/constants';
import { mockFacilitiesFetch } from '../../../mocks/fetch';
import { createMockFacility } from '../../../mocks/data';
import { getSchedulingConfigurationMock } from '../../../mocks/mock';

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
    mockV2CommunityCareEligibility({
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
    mockFacilitiesFetch({
      children: true,
      ids: ['983'],
      facilities: [
        createMockFacility({
          id: '983',
          address: {
            line: [],
            city: 'Belgrade',
          },
          lat: 39.1362562,
          long: -83.1804804,
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

    // Trigger provider list loading
    userEvent.click(
      await screen.findByRole('button', { name: /Find a provider/i }),
    );
    expect(await screen.findByText(/Displaying 5 of 16 providers/i)).to.be.ok;
    expect(screen.getAllByRole('radio').length).to.equal(5);

    expect(
      global.window.dataLayer.some(
        e => e === `${GA_PREFIX}-community-care-provider-selection-page`,
      ),
    );

    expect(screen.baseElement).to.contain.text('Primary care providers');

    // Continue without filling in required fields
    userEvent.click(screen.getByText(/Continue/i));
    await waitFor(() => expect(screen.history.push.called).to.be.true);
    expect(
      global.window.dataLayer.some(
        e => e === `${GA_PREFIX}-continue-without-provider`,
      ),
    );

    // Continue with filling in required fields with provider
    userEvent.click(
      await screen.findByRole('heading', {
        level: 2,
        name: /Primary care provider/i,
      }),
    );
    userEvent.click(await screen.findByText(/OH, JANICE/i));
    userEvent.click(
      await screen.getByRole('button', { name: /Select provider/i }),
    );
    expect(
      global.window.dataLayer.some(
        e => e === `${GA_PREFIX}-order-position-provider-selection`,
      ),
    );
    expect(await screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');

    userEvent.click(screen.getByText(/Continue/i));
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
    await setTypeOfFacility(store, /Community Care/i);
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Trigger provider list loading
    userEvent.click(
      await screen.findByRole('button', { name: /Find a provider/i }),
    );

    expect(await screen.findByText(/Displaying 5 of 16 providers/i)).to.be.ok;
    expect(screen.getAllByRole('radio').length).to.equal(5);

    userEvent.click(await screen.findByText(/Show 5 more providers/i));
    expect((await screen.findAllByRole('radio')).length).to.equal(10);
    await waitFor(() => {
      expect(document.activeElement.id).to.equal(
        'root_communityCareProvider_6',
      );
    });

    userEvent.click(await screen.findByText(/Show 5 more providers/i));
    expect(await screen.findByText(/displaying 15 of 16 providers/i)).to.exist;
    expect((await screen.findAllByRole('radio')).length).to.equal(15);
    await waitFor(() => {
      expect(document.activeElement.id).to.equal(
        'root_communityCareProvider_11',
      );
    });

    userEvent.click(await screen.findByText(/Show 1 more provider/i));
    expect(await screen.findByText(/displaying 16 of 16 providers/i)).to.exist;
    expect((await screen.findAllByRole('radio')).length).to.equal(16);
    await waitFor(() => {
      expect(document.activeElement.id).to.equal(
        'root_communityCareProvider_16',
      );
    });
    // Choose Provider
    userEvent.click(await screen.findByText(/AJADI, ADEDIWURA/i));
    userEvent.click(
      await screen.getByRole('button', { name: /Select provider/i }),
    );
    expect(screen.baseElement).to.contain.text('Preferred provider');
    expect(screen.baseElement).to.contain.text(
      'AJADI, ADEDIWURAWASHINGTON, DC',
    );

    // Change Provider
    userEvent.click(
      await screen.findByRole('button', { name: /change provider/i }),
    );
    userEvent.click(await screen.findByText(/OH, JANICE/i));
    userEvent.click(
      await screen.findByRole('button', { name: /Select provider/i }),
    );

    expect(screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');

    // Cancel Selection (not clearing of a selected provider)
    userEvent.click(
      await screen.findByRole('button', { name: /change provider/i }),
    );
    expect(await screen.findByText(/displaying 5 of 16 providers/i)).to.exist;
    userEvent.click(await screen.findByRole('button', { name: /cancel/i }));
    expect(screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');
  });

  it('should display Select provider when remove provider clicked', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Choose Provider that is buried 2 clicks deep
    userEvent.click(
      await screen.findByRole('button', { name: /Find a provider/i }),
    );
    userEvent.click(await screen.findByText(/more providers$/i));
    userEvent.click(await screen.findByText(/more providers$/i));
    userEvent.click(await screen.findByText(/AJADI, ADEDIWURA/i));
    userEvent.click(
      await screen.getByRole('button', { name: /Select provider/i }),
    );

    // Remove Provider
    userEvent.click(await screen.findByRole('button', { name: /remove/i }));
    expect(await screen.findByTestId('removeProviderModal')).to.exist;
    userEvent.click(
      await screen.findByRole('button', { name: /Remove provider/i }),
    );
    expect(await screen.findByRole('button', { name: /Find a provider/i }));
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

    // Facility 983 is the 2nd of three options so the expectation is
    // that it should be selected when we get to the CommunityCareProviderSelectionPage.
    await setClosestCity(store, '983');
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );
    // When the user tries to choose a provider
    // Trigger provider list loading
    userEvent.click(
      await screen.findByText(/Find a provider/i, {
        selector: 'button',
      }),
    );

    expect(await screen.findByTestId('providersSelect')).to.exist;

    // Choose Provider
    userEvent.click(await screen.findByText(/OH, JANICE/i));
    userEvent.click(
      await screen.getByRole('button', {
        name: /Select provider/i,
      }),
    );
    expect(screen.baseElement).to.contain.text('Preferred provider');
    expect(screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');

    // Remove Provider
    userEvent.click(await screen.findByRole('button', { name: /remove/i }));
    expect(await screen.findByTestId('removeProviderModal')).to.exist;
    userEvent.click(
      await screen.findByRole('button', { name: /Remove provider/i }),
    );
    expect(await screen.findByRole('button', { name: /Find a provider/i }));
  });

  it('should display an error when choose a provider clicked and provider fetch error', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
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
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Trigger provider list loading
    userEvent.click(
      await screen.findByRole('button', { name: /Find a provider/i }),
    );
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
    await setTypeOfFacility(store, /Community Care/i);
    mockCCProviderFetch(
      initialState.user.profile.vapContactInfo.residentialAddress,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      [],
    );
    const screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Trigger provider list loading
    userEvent.click(
      await screen.findByRole('button', { name: /Find a provider/i }),
    );
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

    mockCCProviderFetch(
      initialState.user.profile.vapContactInfo.residentialAddress,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
      // true,
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
      await screen.findByRole('button', { name: /Find a provider/i }),
    );
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

    // Choose Provider based on home address
    userEvent.click(
      await screen.findByRole('button', { name: /Find a provider/i }),
    );
    userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    userEvent.click(await screen.findByText(/Show 1 more provider$/i));

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
      await screen.findByRole('button', { name: /Find a provider/i }),
    );

    // Choose Provider based on current location
    const currentLocButton = await screen.findByText(/your current location$/i);
    await screen.findByText(/Displaying 5 of /i);
    userEvent.click(currentLocButton);
    userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    userEvent.click(await screen.findByText(/Show 5 more providers$/i));
    userEvent.click(await screen.findByText(/Show 1 more provider$/i));

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

    userEvent.click(await screen.findByText(/OH, JANICE/i));
    userEvent.click(
      await screen.findByRole('button', { name: /Select provider/i }),
    );

    expect(screen.baseElement).to.contain.text('OH, JANICEANNANDALE, VA');
  });

  it('should reset provider selected when type of care changes', async () => {
    const store = createTestStore(initialState);

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
    mockV2CommunityCareEligibility({
      parentSites: ['983', '983GJ', '983GC'],
      supportedSites: ['983', '983GJ'],
      careType: 'Podiatry',
    });

    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);

    let screen = renderWithStoreAndRouter(
      <CommunityCareProviderSelectionPage />,
      {
        store,
      },
    );

    // Choose Provider based on home address
    userEvent.click(
      await screen.findByRole('button', { name: /Find a provider/i }),
    );

    userEvent.click(await screen.findByLabelText(/OH, JANICE/i));
    userEvent.click(
      await screen.findByRole('button', { name: /Select provider/i }),
    );

    // make sure it saves successfully
    await screen.findByRole('button', { name: /remove/i });

    // remove the page and change the type of care
    await cleanup();

    mockCCProviderFetch(
      initialState.user.profile.vapContactInfo.residentialAddress,
      ['213E00000X', '213EG0000X', '213EP1101X', '213ES0131X', '213ES0103X'],
      calculateBoundingBox(
        initialState.user.profile.vapContactInfo.residentialAddress.latitude,
        initialState.user.profile.vapContactInfo.residentialAddress.longitude,
        60,
      ),
      CC_PROVIDERS_DATA,
    );
    await setTypeOfCare(store, /podiatry/i);

    screen = renderWithStoreAndRouter(<CommunityCareProviderSelectionPage />, {
      store,
    });

    // the provider should no longer be set
    expect(await screen.findByRole('button', { name: /Find a provider/i })).to
      .exist;
    expect(screen.queryByText(/OH, JANICE/i)).to.not.exist;
  });

  it('should allow user to retry fetching location when it is blocked', async () => {
    const store = createTestStore(initialState);

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
      await screen.findByRole('button', { name: /Find a provider/i }),
    );
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
    mockCCProviderFetch(
      currentPosition,
      ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
      calculateBoundingBox(
        currentPosition.latitude,
        currentPosition.longitude,
        60,
      ),
      // Only return one provider to distinguish from initial request
      // by residential address
      CC_PROVIDERS_DATA.slice(0, 1),
    );

    userEvent.click(
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
    await setClosestCity(store, '984');

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
