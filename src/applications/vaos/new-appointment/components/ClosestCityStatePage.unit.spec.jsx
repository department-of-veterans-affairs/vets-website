import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';

import { fireEvent, waitFor } from '@testing-library/dom';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import ClosestCityStatePage from './ClosestCityStatePage';
import {
  renderWithStoreAndRouter,
  setCommunityCareFlow,
} from '../../tests/mocks/setup';

describe('VAOS Page: ClosestCityStatePage', () => {
  beforeEach(() => mockFetch());

  it('should show supported parent sites', async () => {
    // Given the user has two supported parent sites
    const store = await setCommunityCareFlow({
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

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /What’s the nearest city to you\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each city and state
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(2);
    await screen.findByLabelText(/Bozeman, MT/i);
    await screen.findByLabelText(/Belgrade, MT/i);
  });

  it('should not submit without choosing a site', async () => {
    // Given the user has two supported parent sites
    const store = await setCommunityCareFlow({
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

    // When the user continues
    userEvent.click(screen.getByText(/Continue/i));

    // The user should stay on the page
    expect(screen.history.push.called).to.be.false;
  });

  it('should continue to preferences page', async () => {
    // Given the user has two supported parent sites
    const store = await setCommunityCareFlow({
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

    // And the user selected a site
    fireEvent.click(await screen.findByLabelText(/Bozeman, MT/i));

    // When the user continues
    userEvent.click(screen.getByText(/Continue/i));

    // Then preferences page should open
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        'preferred-provider',
      );
    });
  });
});
