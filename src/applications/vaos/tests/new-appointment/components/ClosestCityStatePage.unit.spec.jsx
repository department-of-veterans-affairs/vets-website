import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import { waitFor } from '@testing-library/dom';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import ClosestCityStatePage from '../../../new-appointment/components/ClosestCityStatePage';
import {
  renderWithStoreAndRouter,
  setCommunityCareFlow,
} from '../../mocks/setup';

describe('VAOS <ClosestCityStatePage>', () => {
  beforeEach(() => mockFetch());

  it('should show supported parent sites', async () => {
    // Given the user has two supported parent sites
    const store = await setCommunityCareFlow({
      toggles: {
        vaOnlineSchedulingFacilitiesServiceV2: true,
      },
      registeredSites: ['983'],
      parentSites: [
        { id: '983', address: { city: 'Bozeman', state: 'MT' } },
        { id: '983GC', address: { city: 'Belgrade', state: 'MT' } },
      ],
      supportedSites: ['983', '983GC'],
    });

    // When the page is displayed
    const screen = renderWithStoreAndRouter(<ClosestCityStatePage />, {
      store,
    });

    // Then the primary header should have focus
    await waitFor(() => {
      const header = screen.getByRole('heading', {
        level: 1,
        name: /What’s the closest city to you?/i,
      });
      expect(document.activeElement).to.equal(header);
    });

    // And the user should see radio buttons for each city and state
    expect(screen.getAllByRole('radio').length).to.equal(2);
    expect(screen.getByRole('radio', { name: /Bozeman, MT/ })).to.be.ok;
    expect(screen.getByRole('radio', { name: /Belgrade, MT/ })).to.be.ok;
  });

  it('should not submit without choosing a site', async () => {
    // Given the user has two supported parent sites
    const store = await setCommunityCareFlow({
      toggles: {
        vaOnlineSchedulingFacilitiesServiceV2: true,
      },
      registeredSites: ['983'],
      parentSites: [
        { id: '983', address: { city: 'Bozeman', state: 'MT' } },
        { id: '983GC', address: { city: 'Belgrade', state: 'MT' } },
      ],
      supportedSites: ['983', '983GC'],
    });

    // And the page is displayed
    const screen = renderWithStoreAndRouter(<ClosestCityStatePage />, {
      store,
    });
    await waitFor(() => {
      expect(screen.getAllByRole('radio').length).to.equal(2);
    });

    // When the user continues
    userEvent.click(screen.getByText(/Continue/i));

    // Then there should be a validation error
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );

    // And the user should stay on the page
    expect(screen.history.push.called).to.be.false;
  });

  it('should continue to preferences page', async () => {
    // Given the user has two supported parent sites
    const store = await setCommunityCareFlow({
      toggles: {
        vaOnlineSchedulingFacilitiesServiceV2: true,
      },
      registeredSites: ['983'],
      parentSites: [
        { id: '983', address: { city: 'Bozeman', state: 'MT' } },
        { id: '983GC', address: { city: 'Belgrade', state: 'MT' } },
      ],
      supportedSites: ['983', '983GC'],
    });

    // And the page is displayed
    const screen = renderWithStoreAndRouter(<ClosestCityStatePage />, {
      store,
    });
    await waitFor(() => {
      expect(screen.getAllByRole('radio').length).to.equal(2);
    });

    // And the user selected a site
    userEvent.click(screen.getByLabelText(/Bozeman, MT/));

    // When the user continues
    userEvent.click(screen.getByText(/Continue/i));

    // Then preferences page should open
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-appointment/community-care-preferences',
      );
    });
  });
});
