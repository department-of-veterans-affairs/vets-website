import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RefillPrescriptions from '../../../components/MedicationsList/RefillPrescriptionsCard';
import reducers from '../../../reducers';

describe('RefillPrescriptionsCard component', () => {
  const setup = () =>
    renderWithStoreAndRouterV6(<RefillPrescriptions />, {
      initialState: {},
      reducers,
    });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays correct content', () => {
    const screen = setup();
    const heading = screen.getByText('Refill prescriptions');
    expect(heading).to.exist;

    const link = screen.getByTestId('prescriptions-nav-link-to-refill');
    expect(link).to.exist;
    expect(link.textContent).to.equal('Start a refill request');
    expect(link.getAttribute('href')).to.include('/refill');
    expect(link.getAttribute('data-dd-action-name')).to.exist;

    const vaCard = screen.container.querySelector('va-card');
    expect(vaCard).to.exist;
  });
});
