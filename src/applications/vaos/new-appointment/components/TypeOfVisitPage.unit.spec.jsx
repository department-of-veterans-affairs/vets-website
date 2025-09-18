import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { Route } from 'react-router-dom';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';

import TypeOfVisitPage from './TypeOfVisitPage';

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

    expect(await screen.findByText(/Continue/i)).to.exist;

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /How do you want to attend this appointment\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each clinic
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(3);
    await screen.findByLabelText(/In person/i);
    await screen.findByLabelText(/By phone/i);
    await screen.findByLabelText(/Through VA Video Connect \(telehealth\)/i);
  });

  it('should not submit empty form', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfVisitPage />, {
      store,
    });
    expect(await screen.findByText(/Continue/i)).to.exist;

    // When the user continues
    fireEvent.click(screen.getByText(/Continue/));

    // The user should stay on the page
    expect(screen.history.push.called).to.be.false;
  });

  it('should save type of visit choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfVisitPage} />,
      {
        store,
      },
    );

    // Wait for page to render completely
    expect(await screen.findByText(/Continue/i)).to.exist;

    fireEvent.click(await screen.findByLabelText(/In person/i));
    fireEvent.click(screen.getByText(/Continue/));
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfVisitPage} />, {
      store,
    });

    expect(await screen.findByLabelText(/In person/i)).to.have.attribute(
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

    // Wait for page to render completely
    expect(await screen.findByText(/Continue/i)).to.exist;

    fireEvent.click(await screen.findByLabelText(/In person/i));
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        'contact-information',
      ),
    );
  });
});
