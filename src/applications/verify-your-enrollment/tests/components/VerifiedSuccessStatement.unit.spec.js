import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import VerifiedSuccessStatement from '../../components/VerifiedSuccessStatement';

describe('<VerifiedSuccessStatement />', () => {
  it('Check for the custom element va-alert', () => {
    const { container } = render(<VerifiedSuccessStatement />);

    const vaAlertElement = container.querySelector('va-alert');
    expect(vaAlertElement).to.exist;
    expect(vaAlertElement.getAttribute('status')).to.equal('success');
  });

  it('Check for the headline slot content', () => {
    const { getByText } = render(<VerifiedSuccessStatement />);

    const headline = getByText(
      'You have successfully verified your enrollment',
    );
    expect(headline).to.exist;
    expect(headline.className).to.include('vads-u-font-size--h2');
    expect(headline.className).to.include('vads-u-font-weight--bold');
  });

  it('Check for the paragraph content', () => {
    const { getByText } = render(<VerifiedSuccessStatement />);

    const paragraph = getByText(/Your verification will be submitted/);
    expect(paragraph).to.exist;
    expect(paragraph.className).to.include('vads-u-margin-top--2');
  });
});
