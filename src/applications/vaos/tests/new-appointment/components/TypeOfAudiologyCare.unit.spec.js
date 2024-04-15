import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
} from '../../mocks/setup';

import TypeOfAudiologyCarePage from '../../../new-appointment/components/TypeOfAudiologyCarePage';

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

    expect((await screen.findAllByRole('radio')).length).to.equal(2);
    userEvent.click(screen.getByText(/Continue/));

    expect(await screen.findByText('Please provide a response')).to.exist;
    expect(screen.history.push.called).to.not.be.true;

    userEvent.click(await screen.findByLabelText(/hearing aid/i));
    userEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );
  });

  it('should save audiology care choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfAudiologyCarePage} />,
      { store },
    );

    userEvent.click(await screen.findByLabelText(/routine hearing/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/routine hearing/i).checked).to.be.true;
    });
    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={TypeOfAudiologyCarePage} />,
      {
        store,
      },
    );

    expect(await screen.findByLabelText(/routine hearing/i)).to.have.attribute(
      'checked',
    );
  });
});
