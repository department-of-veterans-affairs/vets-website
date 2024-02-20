import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import PlanAheadPage from '../../../covid-19-vaccine/components/PlanAheadPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

const store = createTestStore();

describe('VAOS Page: PlanAheadPage', () => {
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
      'We can only schedule appointments for first vaccine doses online:',
    );
    expect(screen.baseElement).to.contain.text(
      'If you get a vaccine that requires 2 doses, we’ll schedule your second appointment while you’re here for your first dose.',
    );
    expect(screen.baseElement).to.contain.text(
      'If you’re eligible for a booster shot or additional dose, contact your VA health facility.',
    );
    expect(screen.baseElement).to.contain.text(
      'Want to get your vaccine without an appointment?',
    );
    expect(screen.baseElement).to.contain.text(
      'Find out how to get your vaccine at a VA walk-in clinic',
    );
    expect(
      await screen.findByRole('link', {
        name: /Find out how to get your vaccine at a VA walk-in clinic/,
      }),
    ).to.be.ok;
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
        '/new-covid-19-vaccine-appointment/confirm-doses-received',
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
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-appointment',
      ),
    );
  });
});
