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
} from '../../mocks/setup';

import TypeOfSleepCarePage from '../../../new-appointment/components/TypeOfSleepCarePage';

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

describe('VAOS <TypeOfSleepCarePage>', () => {
  beforeEach(() => mockFetch());
  it('should show page and validation', async () => {
    const store = createTestStore(initialState);
    const nextPage = await setTypeOfCare(store, /sleep/i);
    expect(nextPage).to.equal('/new-appointment/choose-sleep-care');

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfSleepCarePage} />,
      {
        store,
      },
    );

    expect((await screen.findAllByRole('radio')).length).to.equal(2);
    fireEvent.click(screen.getByText(/Continue/));

    expect(await screen.findByText('Please provide a response')).to.exist;
    expect(screen.history.push.called).to.not.be.true;

    fireEvent.click(await screen.findByLabelText(/cpap/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/va-facility-2',
      ),
    );
  });

  it('should save sleep care choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfSleepCarePage} />,
      { store },
    );

    fireEvent.click(await screen.findByLabelText(/sleep medicine/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/sleep medicine/i).checked).to.be.true;
    });
    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={TypeOfSleepCarePage} />,
      {
        store,
      },
    );

    expect(await screen.findByLabelText(/sleep medicine/i)).to.have.attribute(
      'checked',
    );
  });
});
