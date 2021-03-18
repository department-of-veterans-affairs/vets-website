import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import PlanAheadPage from '../../../project-cheetah/components/PlanAheadPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

const store = createTestStore();

describe('VAOS <PlanAheadPage>', () => {
  it('should render intro text, schedule button, and link', async () => {
    const pageTitle = 'COVID-19 vaccine appointment';

    const screen = renderWithStoreAndRouter(<PlanAheadPage />, {
      store,
    });
    // Verify document title
    await waitFor(() => {
      expect(global.document.title).contain(pageTitle);
    });

    // Verify focus element
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    // it should display page content...
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
    const screen = renderWithStoreAndRouter(<PlanAheadPage />, {
      store,
    });

    const button = await screen.findByText(/Continue/i);
    userEvent.click(button);

    expect(screen.history.push.called).to.be.true;
    // Expect router to route to screener page
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-covid-19-vaccine-booking/received-dose',
      ),
    );
  });

  it('should return to the correct page once back button to clicked', async () => {
    const screen = renderWithStoreAndRouter(<PlanAheadPage />, {
      store,
    });

    const button = await screen.findByText(/Back/i);
    userEvent.click(button);

    expect(screen.history.push.called).to.be.true;
    // Expect router to route to screener page
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal('/'),
    );
  });
});
