import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setTypeOfFacility,
} from '../../mocks/setup';
import { getParentSiteMock } from '../../mocks/v0';
import {
  mockCommunityCareEligibility,
  mockParentSites,
} from '../../mocks/helpers';
import { GA_PREFIX } from '../../../utils/constants';

import CommunityCarePreferencesPage from '../../../new-appointment/components/CommunityCarePreferencesPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCommunityCare: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};
describe('VAOS <CommunityCarePreferencesPage>', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());
  it('should render the page with appropriate inputs and prevent submission without required fields', async () => {
    mockParentSites(
      ['983'],
      [
        {
          id: '983',
          attributes: {
            ...getParentSiteMock().attributes,
            institutionCode: '983',
            rootStationCode: '983',
            parentStationCode: '983',
          },
        },
      ],
    );
    mockCommunityCareEligibility({
      parentSites: ['983'],
      supportedSites: ['983'],
      careType: 'PrimaryCare',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
    const screen = renderWithStoreAndRouter(<CommunityCarePreferencesPage />, {
      store,
    });

    await screen.findByText(
      /do you have a preferred VA-approved community care provider for this primary care appointment/i,
    );

    expect(
      global.window.dataLayer.find(
        ev => ev.event === `${GA_PREFIX}-community-care-legacy-provider-page`,
      ),
    ).to.exist;

    expect(screen.getAllByRole('radio').length).to.equal(2);
    expect(screen.getAllByRole('combobox').length).to.equal(1);
    expect(screen.queryAllByRole('textbox').length).to.equal(0);

    // Check provider fields display
    userEvent.click(screen.getByLabelText('Yes'));

    await screen.findByText(/to find your preferred community care provider/i);
    expect(screen.getAllByRole('textbox').length).to.equal(8);
    expect(screen.getAllByRole('combobox').length).to.equal(2);
    expect(
      screen.getByRole('link', { name: /facility locator/i }),
    ).to.have.attribute('href', '/find-locations/?facilityType=cc_provider');
    expect(screen.baseElement).to.contain.text(
      'We’ll try to schedule your appointment',
    );

    // Continue without filling in required fields
    userEvent.click(screen.getByText(/Continue/i));

    expect((await screen.findAllByRole('alert')).length).to.equal(8);
    expect(screen.history.push.called).to.be.false;
  });

  it('should update data and save it after page change', async () => {
    mockParentSites(
      ['983'],
      [
        {
          id: '983',
          attributes: {
            ...getParentSiteMock().attributes,
            institutionCode: '983',
            rootStationCode: '983',
            parentStationCode: '983',
          },
        },
      ],
    );
    mockCommunityCareEligibility({
      parentSites: ['983'],
      supportedSites: ['983'],
      careType: 'PrimaryCare',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
    let screen = renderWithStoreAndRouter(<CommunityCarePreferencesPage />, {
      store,
    });

    await screen.findAllByRole('radio');

    expect(screen.getByRole('heading', { level: 1 })).to.have.text(
      'Tell us your community care preferences',
    );
    expect(screen.getAllByRole('radio').length).to.equal(2);
    expect(screen.getAllByRole('combobox').length).to.equal(1);

    userEvent.selectOptions(screen.getByRole('combobox'), [
      screen.getByText(/English/i),
    ]);
    userEvent.click(screen.getByLabelText(/^No/i));

    await cleanup();
    screen = renderWithStoreAndRouter(<CommunityCarePreferencesPage />, {
      store,
    });

    expect((await screen.findByText(/English/i)).selected).to.be.true;

    // Submit with required fields
    userEvent.click(screen.getByText(/Continue/i));

    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });
  });

  it('should display closest city question when user has multiple supported sites', async () => {
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
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setTypeOfFacility(store, /Community Care/i);
    const screen = renderWithStoreAndRouter(<CommunityCarePreferencesPage />, {
      store,
    });

    expect((await screen.findAllByRole('radio')).length).to.equal(4);
    expect(screen.getByLabelText('Bozeman, MT')).to.exist;
    expect(screen.getByLabelText('Belgrade, MT')).to.exist;

    // Continue without filling in required fields
    userEvent.click(screen.getByText(/Continue/i));

    expect((await screen.findAllByRole('alert')).length).to.equal(3);
    expect(screen.history.push.called).to.be.false;
  });
});
