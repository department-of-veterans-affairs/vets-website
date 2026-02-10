import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import Prescription from '../../../components/PrescriptionsInProgress/Prescription';
import reducers from '../../../reducers';

describe('Prescription Component', () => {
  const defaultProps = {
    prescriptionId: 12345,
    prescriptionName: 'Test Medication 100mg',
    lastUpdated: '2025-01-15T10:30:00Z',
  };

  const setup = (props = defaultProps) =>
    renderWithStoreAndRouterV6(<Prescription {...props} />, {
      reducers,
    });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays the prescription name as a link with correct destination', () => {
    const screen = setup();
    const link = screen.getByTestId('prescription-link');
    expect(link).to.exist;
    expect(link.textContent).to.equal(defaultProps.prescriptionName);
    expect(link.getAttribute('href')).to.include(
      `/my-health/medications/${defaultProps.prescriptionId}`,
    );
  });

  it('formats the date subtext correctly', () => {
    const screen = setup();
    const subtext = screen.getByText(
      /Request submitted:\s*January \d{1,2}, 2025\b/,
    );
    expect(subtext).to.exist;
  });
});
