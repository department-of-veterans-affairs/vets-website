import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

import TypeOfVisitPage from '../../../new-appointment/components/TypeOfVisitPage';

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
describe('VAOS Page: TypeOfVisitPage ', () => {
  beforeEach(() => mockFetch());
  it('should show page', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfVisitPage />, {
      store,
    });

    await screen.findByLabelText(/office visit/i);

    expect(screen.getAllByRole('radio').length).to.equal(3);
  });

  it('should not submit empty form', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfVisitPage />, {
      store,
    });
    expect(await screen.findByText(/Continue/i)).to.exist;

    fireEvent.click(screen.getByText(/Continue/));

    expect(await screen.findByText('Select an option')).to.exist;
    expect(screen.history.push.called).to.not.be.true;
  });

  it('should save type of visit choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfVisitPage} />,
      {
        store,
      },
    );

    expect(await screen.findByLabelText(/Office visit/i)).to.exist;

    fireEvent.click(await screen.findByLabelText(/Office visit/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/Office visit/i).checked).to.be.true;
    });
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfVisitPage} />, {
      store,
    });

    expect(await screen.findByLabelText(/Office visit/i)).to.have.attribute(
      'checked',
    );
  });

  it('should continue to the correct page once type is selected', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfVisitPage} />,
      {
        store,
      },
    );

    fireEvent.click(await screen.findByLabelText(/Office visit/i));
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/contact-info',
      ),
    );
  });
});
