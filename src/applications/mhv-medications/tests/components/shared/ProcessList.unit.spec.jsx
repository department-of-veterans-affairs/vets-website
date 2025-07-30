import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ProcessList from '../../../components/shared/ProcessList';
import { refillProcessStepGuide } from '../../../util/processListData';

describe('ProcessList Component', () => {
  const stepGuideProps = options => {
    const {
      prescription,
      showTrackingAlert,
      pharmacyPhone,
      isRefillRunningLate,
    } = options;
    return {
      prescription,
      title: showTrackingAlert
        ? 'Check the status of your next refill'
        : 'Refill request status',
      pharmacyPhone,
      isRefillRunningLate,
    };
  };
  const renderProcessList = (data = refillProcessStepGuide) => {
    return render(<ProcessList stepGuideProps={data} />);
  };

  it('renders without errors', () => {
    const screen = renderProcessList();
    expect(screen);
  });

  it('renders the title correctly', () => {
    const screen = renderProcessList();

    const title = screen.getByText(refillProcessStepGuide.title);
    expect(title).to.exist;
  });

  it('checks if each process step header is rendered', () => {
    const screen = renderProcessList();
    const stepHeaders = [
      'You request a refill',
      'We process your refill request',
      'We ship your refill to you',
    ];

    stepHeaders.forEach(header => {
      const headerElement = screen.getByText((_, element) => {
        return element.getAttribute('header') === header;
      });
      expect(headerElement).to.exist;
    });
  });

  it('check if the content of the 3 steps is rendered', () => {
    const screen = renderProcessList();

    const firstStep = screen.getByText((content, element) => {
      return (
        content.includes(
          'After you request a refill, the prescription status will change to',
        ) &&
        element.querySelector('strong')?.textContent === 'Active: Submitted.'
      );
    });

    const secondStep = screen.getByText((content, element) => {
      return (
        content.includes(
          'When our pharmacy starts processing your request, the status will change to',
        ) &&
        element.querySelector('strong')?.textContent ===
          'Active: Refill in Process.'
      );
    });

    const thirdStep = screen.getByText(
      'Prescriptions usually arrive within 3 to 5 days after shipping. You can find tracking information in your prescription details.',
    );

    expect(firstStep).to.exist;
    expect(secondStep).to.exist;
    expect(thirdStep).to.exist;
  });

  it('renders the correct content when status is Active and there is a completeDateTime value', () => {
    const shippedToday = new Date();
    const options = {
      prescription: {
        prescriptionName: 'testRx',
        refillDate: '2025-02-24T03:39:11Z',
        refillSubmitDate: '2025-02-24T03:39:11Z',
        dispStatus: 'Active',
        trackingList: [
          {
            trackingNumber: '1234567890',
            carrier: 'UPS',
            completeDateTime: shippedToday,
          },
        ],
        rxRfRecords: [],
      },
      showTrackingAlert: true,
      pharmacyPhone: '123-456-7890',
      isRefillRunningLate: false,
    };
    const screen = renderProcessList(stepGuideProps(options));
    const trackingNumber = screen.getByText('Tracking number:');
    expect(trackingNumber).to.exist;
  });

  it('renders the correct content for Active: Submitted status', () => {
    const options = {
      prescription: {
        prescriptionName: 'testRx',
        refillDate: '2025-02-24T03:39:11Z',
        refillSubmitDate: '2025-02-24T12:00:00Z',
        dispStatus: 'Active: Submitted',
        trackingList: [],
      },
      showTrackingAlert: true,
      pharmacyPhone: '123-456-7890',
      isRefillRunningLate: false,
    };

    const screen = renderProcessList(stepGuideProps(options));
    const checkBackText = screen.getByText('Completed on February 24, 2025');
    expect(checkBackText).to.exist;
  });

  it('renders the correct content for Active: Refill in Process status', () => {
    const options = {
      prescription: {
        prescriptionName: 'testRx',
        refillDate: '2025-02-24T03:39:11Z',
        refillSubmitDate: '2025-02-24T03:39:11Z',
        dispStatus: 'Active: Refill in Process',
        trackingList: [],
      },
      showTrackingAlert: true,
      pharmacyPhone: '123-456-7890',
      isRefillRunningLate: false,
    };

    const screen = renderProcessList(stepGuideProps(options));
    const headerElement = screen.getByText((_, element) => {
      return (
        element.getAttribute('header') ===
        'We’re processing your refill request'
      );
    });
    expect(headerElement).to.exist;
  });

  it('renders the correct content for Active status', () => {
    const options = {
      prescription: {
        prescriptionName: 'testRx',
        refillDate: '2025-02-24T03:39:11Z',
        refillSubmitDate: '2025-02-24T03:39:11Z',
        dispStatus: 'Active',
        trackingList: [],
        rxRfRecords: [],
      },
      showTrackingAlert: true,
      pharmacyPhone: '123-456-7890',
      isRefillRunningLate: false,
    };

    const screen = renderProcessList(stepGuideProps(options));
    const headerElement = screen.getByText((_, element) => {
      return (
        element.getAttribute('header') === 'We received your refill request'
      );
    });
    expect(headerElement).to.exist;
  });
});
