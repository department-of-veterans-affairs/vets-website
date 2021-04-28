import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { UnenrolledVaccineSection } from '../../../unenrolled-vaccine';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingUnenrolledVaccine: true,
  },
};

describe('VAOS unenrolled vaccine <PlanAheadPage>', () => {
  it('should render intro text, schedule button, and link', async () => {
    const store = createTestStore(initialState);
    const pageTitle = 'COVID-19 vaccine appointment';

    const screen = renderWithStoreAndRouter(<UnenrolledVaccineSection />, {
      store,
    });
    // Verify document title
    await waitFor(() => {
      expect(global.document.title).contain(pageTitle);
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: pageTitle,
      }),
    );

    expect(screen.baseElement).to.contain.text(
      'Some COVID-19 vaccines require 2 doses',
    );

    expect(
      screen.getByRole('link', {
        name: /go to our main COVID-19 vaccine at VA page./i,
      }),
    ).to.have.attribute('href', '/health-care/covid-19-vaccine');
  });

  it('should continue to the correct page once continue to clicked', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<UnenrolledVaccineSection />, {
      store,
    });

    const button = await screen.findByText(/Continue/i);
    userEvent.click(button);

    expect(screen.history.push.called).to.be.true;
    // Expect router to route to screener page
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-unenrolled-covid-19-vaccine-booking/confirmation',
      ),
    );
  });

  it('should return to the correct page once back button to clicked', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<UnenrolledVaccineSection />, {
      store,
    });

    const button = await screen.findByText(/Back/i);
    userEvent.click(button);

    // Expect router to route to screener page
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal('/'),
    );
  });
});
