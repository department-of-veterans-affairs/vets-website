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
    status: 'submitted',
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

  describe('subtext based on status', () => {
    it('displays "Request submitted" for submitted status', () => {
      const screen = setup({ ...defaultProps, status: 'submitted' });
      const subtext = screen.getByText(/Request submitted:/);
      expect(subtext).to.exist;
    });

    it('displays "Expected fill date" for in-progress status', () => {
      const screen = setup({ ...defaultProps, status: 'in-progress' });
      const subtext = screen.getByText(/Expected fill date:/);
      expect(subtext).to.exist;
    });

    it('displays "Date shipped" for shipped status', () => {
      const screen = setup({ ...defaultProps, status: 'shipped' });
      const subtext = screen.getByText(/Date shipped:/);
      expect(subtext).to.exist;
    });

    it('defaults to "Request submitted" for unknown status', () => {
      const screen = setup({ ...defaultProps, status: 'unknown' });
      const subtext = screen.getByText(/Request submitted:/);
      expect(subtext).to.exist;
    });
  });

  describe('tracking link for shipped status', () => {
    it('constructs correct UPS tracking URL', () => {
      const screen = setup({
        ...defaultProps,
        status: 'shipped',
        carrier: 'UPS',
        trackingNumber: '1Z2345678901234567',
      });
      const trackingLink = screen.getByText('Get tracking info');
      expect(trackingLink.getAttribute('href')).to.include(
        'ups.com/WebTracking',
      );
      expect(trackingLink.getAttribute('href')).to.include(
        '1Z2345678901234567',
      );
    });

    it('constructs correct USPS tracking URL', () => {
      const screen = setup({
        ...defaultProps,
        status: 'shipped',
        carrier: 'USPS',
        trackingNumber: '9400111899223100001234',
      });
      const trackingLink = screen.getByText('Get tracking info');
      expect(trackingLink.getAttribute('href')).to.include('usps.com');
      expect(trackingLink.getAttribute('href')).to.include(
        '9400111899223100001234',
      );
    });

    it('constructs correct FedEx tracking URL', () => {
      const screen = setup({
        ...defaultProps,
        status: 'shipped',
        carrier: 'FedEx',
        trackingNumber: '123456789012',
      });
      const trackingLink = screen.getByText('Get tracking info');
      expect(trackingLink.getAttribute('href')).to.include('fedex.com');
      expect(trackingLink.getAttribute('href')).to.include('123456789012');
    });

    it('falls back to tracking number as URL for unknown carrier', () => {
      const screen = setup({
        ...defaultProps,
        status: 'shipped',
        carrier: 'UnknownCarrier',
        trackingNumber: 'ABC123',
      });
      const trackingLink = screen.getByText('Get tracking info');
      expect(trackingLink.getAttribute('href')).to.equal('ABC123');
    });
  });
});
