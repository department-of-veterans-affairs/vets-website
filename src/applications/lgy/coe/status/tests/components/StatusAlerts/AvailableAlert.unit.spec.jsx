import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { AvailableAlert } from '../../../components/StatusAlerts/AvailableAlert';

const defaultProps = {
  referenceNumber: '18959346',
  requestDate: 1722543158000,
};

describe('AvailableAlert', () => {
  it('should display formatted request date and reference number', () => {
    const { container } = render(<AvailableAlert {...defaultProps} />);
    const alert = $('va-alert', container);
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('success');
    expect(container.textContent).to.include('18959346');
    expect(container.textContent).to.include('August 2, 2024');
  });
});
