import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

import ReceivedDoseScreenerPage from '../../../covid-19-vaccine/components/ReceivedDoseScreenerPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: false,
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
describe('VAOS Page: ReceivedDoseScreenerPage ', () => {
  it('should show page', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReceivedDoseScreenerPage />, {
      store,
    });

    await screen.findByLabelText(/yes/i);

    expect(screen.getAllByRole('radio').length).to.equal(2);
  });

  it('should not submit empty form', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReceivedDoseScreenerPage />, {
      store,
    });
    expect(await screen.findByText(/Continue/i)).to.exist;

    fireEvent.click(screen.getByText(/Continue/));

    expect(await screen.findByText('Please select an answer')).to.exist;
    expect(screen.history.push.called).to.not.be.true;
  });

  it('should save screener question choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(<ReceivedDoseScreenerPage />, {
      store,
    });

    expect(await screen.findByLabelText(/yes/i)).to.exist;

    fireEvent.click(await screen.findByLabelText(/yes/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/yes/i).checked).to.be.true;
    });
    await cleanup();

    screen = renderWithStoreAndRouter(<ReceivedDoseScreenerPage />, {
      store,
    });

    expect(await screen.findByLabelText(/yes/i)).to.have.attribute('checked');
  });

  it('should continue to the correct page once choice is made', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReceivedDoseScreenerPage />, {
      store,
    });

    fireEvent.click(await screen.findByLabelText(/no/i));
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-covid-19-vaccine-appointment/choose-facility',
      ),
    );

    fireEvent.click(await screen.findByLabelText(/yes/i));
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-covid-19-vaccine-appointment/contact-facility',
      ),
    );
  });
});
