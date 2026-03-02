import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { formatDateLong } from 'platform/utilities/date';
import { Pending } from '../../../components/IntroStatusAlerts/Pending';

describe('Pending status alert', () => {
  const defaultProps = {
    referenceNumber: '18959346',
    requestDate: 1722543158000,
  };

  it('renders the reference number and formatted request date', () => {
    const { getByText } = render(<Pending {...defaultProps} />);
    const formattedRequestDate = formatDateLong(defaultProps.requestDate);
    const requestDate = `You requested a COE on ${formattedRequestDate}.`;
    expect(getByText(new RegExp(requestDate))).to.exist;
    const referenceNumber = `Reference Number: ${defaultProps.referenceNumber}`;
    expect(getByText(new RegExp(referenceNumber))).to.exist;
    expect(
      getByText(
        /You’ll receive an email about your eligibility and how to get your COE if you qualify./,
      ),
    ).to.exist;
  });

  it('renders link with correct href', () => {
    const { container } = render(<Pending {...defaultProps} />);
    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      '/housing-assistance/home-loans/check-coe-status/',
    );
  });
});
