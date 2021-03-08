import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import PlanAheadPage from '../../../project-cheetah/components/PlanAheadPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

describe('VAOS <PlanAheadPage>', () => {
  it('should render intro text, schedule button, and link', async () => {
    const store = createTestStore();

    const screen = renderWithStoreAndRouter(<PlanAheadPage />, {
      store,
    });

    // it should display page heading
    expect(screen.getByText('Plan ahead')).to.be.ok;

    expect(
      screen.getByRole('link', {
        name: /learn more about COVID-19 vaccines at the VA./i,
      }),
    ).to.have.attribute('href', '/health-care/covid-19-vaccine');

    const button = await screen.findByText(/^Start scheduling/);
    userEvent.click(button);

    expect(screen.history.push.called).to.be.true;

    // Expect router to route to screener page
    await waitFor(() => {
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-covid-19-booking/received-dose',
      );
    });
  });
});
