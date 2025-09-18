import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Route } from 'react-router-dom';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
} from '../../tests/mocks/setup';
import TypeOfAudiologyCarePage from './TypeOfAudiologyCarePage';

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

describe('VAOS Page: TypeOfAudiologyCarePage', () => {
  beforeEach(() => mockFetch());
  it('should show page and validation', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /audiology/i);

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfAudiologyCarePage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Which type of audiology care do you need\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each type of audiology care
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(2);
    await screen.findByLabelText(/Routine hearing exam/i);
    await screen.findByLabelText(/Hearing aid support/i);

    // When the user continues
    fireEvent.click(screen.getByText(/Continue/));

    // The user should stay on the page
    expect(screen.history.push.called).to.be.false;

    // Then there should be a validation error
    expect(await screen.findByText('You must provide a response')).to.exist;

    fireEvent.click(screen.getByText(/Routine hearing exam/));
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        'community-request/',
      ),
    );
  });

  it('should save audiology care choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfAudiologyCarePage} />,
      { store },
    );
    await screen.findByText(/Continue/i);

    fireEvent.click(screen.getByText(/Routine hearing exam/));
    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={TypeOfAudiologyCarePage} />,
      {
        store,
      },
    );

    expect(
      await screen.findByLabelText(/Routine hearing exam/i),
    ).to.have.attribute('checked');
  });
});
