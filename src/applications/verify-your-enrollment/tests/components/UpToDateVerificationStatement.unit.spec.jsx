import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import UpToDateVerificationStatement from '../../components/UpToDateVerificationStatement';

describe('<UpToDateVerificationStatement />', () => {
  it('Check for the custom element va-alert and its attributes', () => {
    const { container } = render(<UpToDateVerificationStatement />);

    const vaAlertElement = container.querySelector('va-alert');
    expect(vaAlertElement).to.exist;
    expect(vaAlertElement.classList.contains('vads-u-margin-bottom--1')).to.be
      .true;
    expect(vaAlertElement.getAttribute('status')).to.equal('success');
    expect(vaAlertElement.getAttribute('visible')).to.equal('true');
    expect(vaAlertElement.getAttribute('disable-analytics')).to.equal('false');
    expect(vaAlertElement.getAttribute('full-width')).to.equal('false');
  });

  it('Check for the paragraph content', () => {
    const { getByText } = render(<UpToDateVerificationStatement />);

    const paragraph = getByText(
      /You’re up-to-date with your monthly enrollment verification/,
    );
    expect(paragraph).to.exist;
    expect(paragraph.className).to.include('vads-u-margin-y--0');
  });
});
