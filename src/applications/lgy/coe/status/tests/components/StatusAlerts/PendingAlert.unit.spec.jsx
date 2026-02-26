import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { PendingAlert } from '../../../components/StatusAlerts/PendingAlert';

const defaultProps = {
  referenceNumber: '18959346',
  requestDate: 1722543158000,
};

describe('PendingAlert', () => {
  it('should display reference number and request date', () => {
    const { container } = render(<PendingAlert {...defaultProps} />);
    const alert = $('va-alert', container);
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(container.textContent).to.include('18959346');
    expect(container.textContent).to.include('August 2, 2024');
  });
});
