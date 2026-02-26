import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { EligibleAlert } from '../../../components/StatusAlerts/EligibleAlert';

const defaultProps = {
  referenceNumber: '18959346',
};

describe('EligibleAlert', () => {
  it('should display reference number and download text', () => {
    const { container } = render(<EligibleAlert {...defaultProps} />);
    const alert = $('va-alert', container);
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('success');
    expect(container.textContent).to.include('18959346');
    expect(container.textContent).to.include('You can download your COE now');
  });
});
