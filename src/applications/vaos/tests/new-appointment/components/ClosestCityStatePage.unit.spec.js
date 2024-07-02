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

    // Then the primary header should have focus
    const radioSelector = screen.container.querySelector('va-radio');
    expect(radioSelector).to.exist;
    expect(radioSelector).to.have.attribute(
      'label',
      'What’s the nearest city to you?',
    );

    // And the user should see radio buttons for each city and state
    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(2);
    expect(radioOptions[0]).to.have.attribute('label', 'Bozeman, MT');
    expect(radioOptions[1]).to.have.attribute('label', 'Belgrade, MT');
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

    // Then there should be a validation error
    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByRole('alert')).to.contain.text('Select a city');

    // And the user should stay on the page
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
    const radioSelector = screen.container.querySelector('va-radio');
    const changeEvent = new CustomEvent('selected', {
      detail: { value: '983' },
    });
    radioSelector.__events.vaValueChange(changeEvent);

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
