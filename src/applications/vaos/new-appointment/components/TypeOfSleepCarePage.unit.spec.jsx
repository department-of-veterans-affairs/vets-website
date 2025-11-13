import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
} from '../../tests/mocks/setup';

import TypeOfSleepCarePage from './TypeOfSleepCarePage';

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

describe('VAOS Page: TypeOfSleepCarePage', () => {
  beforeEach(() => mockFetch());
  it('should show page and validation', async () => {
    const store = createTestStore(initialState);
    const nextPage = await setTypeOfCare(store, /sleep/i);
    expect(nextPage).to.equal('sleep-care');

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfSleepCarePage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Which type of sleep care do you need\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each type of sleep care
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(2);
    await screen.findByLabelText(
      /Continuous Positive Airway Pressure \(CPAP\)/i,
    );
    await screen.findByLabelText(/Sleep medicine and home sleep testing/i);

    fireEvent.click(screen.getByText(/Continue/));

    // Then there should be a validation error
    expect(await screen.findByText('You must provide a response')).to.exist;
    expect(screen.history.push.called).to.be.false;

    fireEvent.click(
      await screen.findByLabelText(/Sleep medicine and home sleep testing/i),
    );
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('location'),
    );
  });

  it('should save sleep care choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfSleepCarePage} />,
      { store },
    );
    await screen.findByText(/Continue/i);

    fireEvent.click(
      await screen.findByLabelText(/Sleep medicine and home sleep testing/i),
    );
    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={TypeOfSleepCarePage} />,
      {
        store,
      },
    );

    expect(
      await screen.findByLabelText(/Sleep medicine and home sleep testing/i),
    ).to.have.attribute('checked');
  });
});
