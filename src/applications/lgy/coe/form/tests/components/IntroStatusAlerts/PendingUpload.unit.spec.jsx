import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { formatDateLong } from 'platform/utilities/date';
import { PendingUpload } from '../../../components/IntroStatusAlerts/PendingUpload';

describe('PendingUpload status alert', () => {
  const defaultProps = {
    referenceNumber: '18959346',
    requestDate: 1722543158000,
  };

  it('renders the reference number and formatted request date', () => {
    const { getByText } = render(<PendingUpload {...defaultProps} />);
    const formattedRequestDate = formatDateLong(defaultProps.requestDate);
    const requestDate = `You requested a COE on ${formattedRequestDate}.`;
    expect(getByText(new RegExp(requestDate))).to.exist;
    const referenceNumber = `Reference Number: ${defaultProps.referenceNumber}`;
    expect(getByText(new RegExp(referenceNumber))).to.exist;
    expect(
      getByText(
        /You’ll need to upload documents in your VA home loan COE page before we can make a decision on your COE./,
      ),
    ).to.exist;
  });

  it('renders link with correct href', () => {
    const { container } = render(<PendingUpload {...defaultProps} />);
    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      '/housing-assistance/home-loans/check-coe-status/',
    );
  });
});
