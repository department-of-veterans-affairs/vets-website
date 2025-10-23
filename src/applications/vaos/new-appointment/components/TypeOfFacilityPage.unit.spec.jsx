import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import TypeOfFacilityPage from './TypeOfFacilityPage';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingCommunityCare: true,
  },
  user: {
    profile: {
      facilities: [
        { facilityId: '983', isCerner: false },
        { facilityId: '984', isCerner: false },
      ],
    },
  },
};

describe('VAOS Page: TypeOfFacilityPage', () => {
  beforeEach(() => mockFetch());

  it('should show form fields', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfFacilityPage />, {
      store,
    });
    await screen.findByText(/Continue/i);

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Where do you prefer to receive care\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each clinic
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(2);
    await screen.findByLabelText(/VA medical center or clinic/i);
    await screen.findByLabelText(/Community care facility/i);
  });

  it('should show validation', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfFacilityPage />, {
      store,
    });
    await screen.findByText(/Continue/i);

    // When the user continues
    fireEvent.click(await screen.findByText(/Continue/i));

    // The user should stay on the page
    expect(screen.history.push.called).to.be.false;

    await cleanup();
  });

  it('should continue to the correct page based on type choice', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfFacilityPage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    fireEvent.click(await screen.findByLabelText(/Community care facility/i));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        'community-request/',
      ),
    );

    fireEvent.click(
      await screen.findByLabelText(/VA medical center or clinic/i),
    );
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('location'),
    );
  });

  it('should save type of facility choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfFacilityPage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    fireEvent.click(
      await screen.findByLabelText(/VA medical center or clinic/i),
    );
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('location'),
    );
    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={TypeOfFacilityPage} />,
      {
        store,
      },
    );

    expect(
      await screen.findByLabelText(/VA medical center or clinic/i),
    ).to.have.attribute('checked');
  });
});
