import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import LoadCaseDetailsFailedAlert from '../../../components/LoadCaseDetailsFailedAlert';

describe('LoadCaseDetailsFailedAlert', () => {
  it('renders va-alert with error status and visible', () => {
    const { container } = render(<LoadCaseDetailsFailedAlert />);

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');
    expect(alert.hasAttribute('visible')).to.be.true;
  });

  it('renders the body message paragraph', () => {
    const { getByText } = render(<LoadCaseDetailsFailedAlert />);
    expect(getByText(/please wait a few minutes/i)).to.exist;
  });
});
