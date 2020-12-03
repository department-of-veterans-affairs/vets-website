import React from 'react';
import { expect } from 'chai';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { fireEvent, waitFor } from '@testing-library/dom';
import TypeOfFacilityPage from '../../../new-appointment/components/TypeOfFacilityPage';
import { Route } from 'react-router-dom';
import { cleanup } from '@testing-library/react';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
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

describe('VAOS integration: VA facility page with a single-site user', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show page', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfFacilityPage />, {
      store,
    });

    expect((await screen.findAllByRole('radio')).length).to.equal(2);

    expect(screen.baseElement).to.contain.text(
      'Choose where you want to receive your care',
    );
  });

  it('should show validation', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfFacilityPage />, {
      store,
    });

    fireEvent.click(await screen.findByText(/continue »/i));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
  });

  it('should continue to the correct page based on type choice', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfFacilityPage} />,
      {
        store,
      },
    );

    fireEvent.click(await screen.findByLabelText(/Community care/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/Community care/i).checked).to.be.true;
    });
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );

    fireEvent.click(
      await screen.findByLabelText(/VA medical center or clinic/i),
    );
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
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

    fireEvent.click(await screen.findByLabelText(/Community care/i));
    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={TypeOfFacilityPage} />,
      {
        store,
      },
    );

    expect(await screen.findByLabelText(/Community care/i)).to.have.attribute(
      'checked',
    );
  });
});
