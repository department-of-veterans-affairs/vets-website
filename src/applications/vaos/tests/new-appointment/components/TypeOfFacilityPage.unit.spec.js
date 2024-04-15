import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import TypeOfFacilityPage from '../../../new-appointment/components/TypeOfFacilityPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

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
