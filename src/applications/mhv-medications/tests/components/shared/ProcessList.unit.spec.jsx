import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ProcessList from '../../../components/shared/ProcessList';
import { refillProcessStepGuide } from '../../../util/processListData';

describe('ProcessList Component using step guide data', () => {
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

  it('renders the correct content for Shipped status', () => {
    const shippedProps = {
      status: 'Shipped',
      trackingList: [
        {
          trackingNumber: '1234567890',
          carrier: 'UPS',
          completeDateTime: '2025-02-24T03:39:11Z',
        },
      ],
      refillSubmitDate: '2025-02-24T03:39:11Z',
      dispensedDate: '2025-02-24T03:39:11Z',
    };

    const screen = renderProcessList(shippedProps);
    const trackingNumber = screen.getByText('Tracking number:');
    expect(trackingNumber).to.exist;
  });

  it('renders the correct content for Active: Submitted status', () => {
    const activeSubmittedData = {
      status: 'Active: Submitted',
      refillSubmitDate: '2025-02-24T03:39:11Z',
    };

    const screen = renderProcessList(activeSubmittedData);
    const checkBackText = screen.getByText('Check back for updates.');
    expect(checkBackText).to.exist;
  });

  it('renders the correct content for Active: Refill in process status', () => {
    const activeRefillData = {
      status: 'Active: Refill in Process',
      refillSubmitDate: '2025-02-24T03:39:11Z',
    };

    const screen = renderProcessList(activeRefillData);
    const headerElement = screen.getByText((_, element) => {
      return (
        element.getAttribute('header') ===
        'We’re processing your refill request'
      );
    });
    expect(headerElement).to.exist;
  });

  it('renders the correct content for Active status', () => {
    const activeData = {
      status: 'Active',
      refillSubmitDate: '2025-02-24T03:39:11Z',
      dispensedDate: '2025-02-24T03:39:11Z',
    };

    const screen = renderProcessList(activeData);
    const headerElement = screen.getByText((_, element) => {
      return (
        element.getAttribute('header') === 'We received your refill request'
      );
    });
    expect(headerElement).to.exist;
  });
});
