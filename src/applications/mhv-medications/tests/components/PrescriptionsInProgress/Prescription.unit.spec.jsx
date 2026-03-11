import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import Prescription from '../../../components/PrescriptionsInProgress/Prescription';
import { IN_PROGRESS_MEDS_DISPLAY_TYPES } from '../../../util/constants';
import reducers from '../../../reducers';

describe('Prescription Component', () => {
  const defaultPrescription = {
    prescriptionId: 12345,
    prescriptionName: 'Test Medication 100mg',
    refillSubmitDate: '2025-01-15T10:30:00Z',
    refillDate: '2025-01-20T10:30:00Z',
    trackingList: [],
  };

  const setup = (
    prescription = defaultPrescription,
    displayType = IN_PROGRESS_MEDS_DISPLAY_TYPES.SUBMITTED,
  ) =>
    renderWithStoreAndRouterV6(
      <Prescription prescription={prescription} displayType={displayType} />,
      { reducers },
    );

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays the prescription name as a link with correct destination', () => {
    const screen = setup();
    const link = screen.getByTestId('prescription-link');
    expect(link).to.exist;
    expect(link.textContent).to.equal(defaultPrescription.prescriptionName);
    expect(link.getAttribute('href')).to.include(
      `/prescription/${defaultPrescription.prescriptionId}`,
    );
  });

  it('formats the date subtext correctly', () => {
    const screen = setup();
    const subtext = screen.getByText(
      /Request submitted:\s*January \d{1,2}, 2025\b/,
    );
    expect(subtext).to.exist;
  });

  describe('subtext based on displayType', () => {
    it('displays "Request submitted" for SUBMITTED displayType', () => {
      const screen = setup(
        defaultPrescription,
        IN_PROGRESS_MEDS_DISPLAY_TYPES.SUBMITTED,
      );
      const subtext = screen.getByText(/Request submitted:/);
      expect(subtext).to.exist;
    });

    it('displays "Expected fill date" for IN_PROGRESS displayType', () => {
      const screen = setup(
        defaultPrescription,
        IN_PROGRESS_MEDS_DISPLAY_TYPES.IN_PROGRESS,
      );
      const subtext = screen.getByText(/Expected fill date:/);
      expect(subtext).to.exist;
    });

    it('displays "Date shipped" for SHIPPED displayType', () => {
      const prescription = {
        ...defaultPrescription,
        trackingList: [
          {
            carrier: 'ups',
            trackingNumber: '1Z2345678901234567',
            completeDateTime: '2025-01-18T10:30:00Z',
          },
        ],
      };
      const screen = setup(
        prescription,
        IN_PROGRESS_MEDS_DISPLAY_TYPES.SHIPPED,
      );
      const subtext = screen.getByText(/Date shipped:/);
      expect(subtext).to.exist;
    });

    it('defaults to "Request submitted" for unknown displayType', () => {
      const screen = setup(defaultPrescription, 'unknown');
      const subtext = screen.getByText(/Request submitted:/);
      expect(subtext).to.exist;
    });

    it('displays "None noted" for date when refillSubmitDate is missing for SUBMITTED displayType', () => {
      const prescription = {
        ...defaultPrescription,
        refillSubmitDate: null,
      };
      const screen = setup(
        prescription,
        IN_PROGRESS_MEDS_DISPLAY_TYPES.SUBMITTED,
      );
      const subtext = screen.getByText(/Request submitted:\s*None noted/);
      expect(subtext).to.exist;
    });

    it('displays "None noted" for date when refillDate is missing for IN_PROGRESS displayType', () => {
      const prescription = {
        ...defaultPrescription,
        refillDate: null,
      };
      const screen = setup(
        prescription,
        IN_PROGRESS_MEDS_DISPLAY_TYPES.IN_PROGRESS,
      );
      const subtext = screen.getByText(/Expected fill date:\s*None noted/);
      expect(subtext).to.exist;
    });
  });

  describe('tracking link for shipped displayType', () => {
    it('constructs correct UPS tracking URL', () => {
      const prescription = {
        ...defaultPrescription,
        trackingList: [
          {
            carrier: 'ups',
            trackingNumber: '1Z2345678901234567',
            completeDateTime: '2025-01-18T10:30:00Z',
          },
        ],
      };
      const screen = setup(
        prescription,
        IN_PROGRESS_MEDS_DISPLAY_TYPES.SHIPPED,
      );
      const trackingLink = screen.getByText('Get tracking info');
      expect(trackingLink.getAttribute('href')).to.include(
        'ups.com/WebTracking',
      );
      expect(trackingLink.getAttribute('href')).to.include(
        '1Z2345678901234567',
      );
    });

    it('constructs correct USPS tracking URL', () => {
      const prescription = {
        ...defaultPrescription,
        trackingList: [
          {
            carrier: 'usps',
            trackingNumber: '9400111899223100001234',
            completeDateTime: '2025-01-18T10:30:00Z',
          },
        ],
      };
      const screen = setup(
        prescription,
        IN_PROGRESS_MEDS_DISPLAY_TYPES.SHIPPED,
      );
      const trackingLink = screen.getByText('Get tracking info');
      expect(trackingLink.getAttribute('href')).to.include('usps.com');
      expect(trackingLink.getAttribute('href')).to.include(
        '9400111899223100001234',
      );
    });

    it('constructs correct FedEx tracking URL', () => {
      const prescription = {
        ...defaultPrescription,
        trackingList: [
          {
            carrier: 'fedex',
            trackingNumber: '123456789012',
            completeDateTime: '2025-01-18T10:30:00Z',
          },
        ],
      };
      const screen = setup(
        prescription,
        IN_PROGRESS_MEDS_DISPLAY_TYPES.SHIPPED,
      );
      const trackingLink = screen.getByText('Get tracking info');
      expect(trackingLink.getAttribute('href')).to.include('fedex.com');
      expect(trackingLink.getAttribute('href')).to.include('123456789012');
    });

    it('falls back to tracking number as URL for unknown carrier', () => {
      const prescription = {
        ...defaultPrescription,
        trackingList: [
          {
            carrier: 'UnknownCarrier',
            trackingNumber: 'ABC123',
            completeDateTime: '2025-01-18T10:30:00Z',
          },
        ],
      };
      const screen = setup(
        prescription,
        IN_PROGRESS_MEDS_DISPLAY_TYPES.SHIPPED,
      );
      const trackingLink = screen.getByText('Get tracking info');
      expect(trackingLink.getAttribute('href')).to.equal('ABC123');
    });
  });
});
