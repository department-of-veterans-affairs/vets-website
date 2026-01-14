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
    expect(alert.getAttribute('close-btn-aria-label')).to.equal(
      'Close notification',
    );
  });

  it('renders headline inside va-alert', () => {
    const { container } = render(<LoadCaseDetailsFailedAlert />);

    const headline = container.querySelector('va-alert h2[slot="headline"]');
    expect(headline).to.exist;
    expect(headline.textContent).to.match(/load the case progress right now/i);
  });

  it('renders the body message paragraph', () => {
    const { getByText } = render(<LoadCaseDetailsFailedAlert />);

    const message = getByText(/please wait a few minutes/i);
    expect(message).to.exist;
  });

  it('applies layout classes on outer container', () => {
    const { container } = render(<LoadCaseDetailsFailedAlert />);

    const wrapper = container.querySelector('div');
    expect(wrapper).to.exist;
    expect(wrapper.classList.contains('usa-width-two-thirds')).to.be.true;
    expect(wrapper.classList.contains('vads-u-margin-y--3')).to.be.true;
  });
});
