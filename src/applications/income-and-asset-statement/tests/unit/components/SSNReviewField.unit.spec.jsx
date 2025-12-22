import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { SSNReviewField } from '../../../components/SSNReviewField';

describe('<SSNReviewField />', () => {
  it('renders the label text', () => {
    const { getByText } = render(<SSNReviewField last4Digits="1234" />);

    expect(getByText('Last 4 digits of Social Security number')).to.exist;
  });

  it('renders the last four digits of the SSN', () => {
    const { getByText } = render(<SSNReviewField last4Digits="5678" />);

    expect(getByText('5678')).to.exist;
  });

  it('applies Datadog privacy masking attributes', () => {
    const { container } = render(<SSNReviewField last4Digits="9999" />);

    const valueNode = container.querySelector('dd.dd-privacy-hidden');

    expect(valueNode).to.exist;
    expect(valueNode.getAttribute('data-dd-action-name')).to.equal(
      'Last 4 digits of SSN',
    );
  });

  it('renders an empty value when last4Digits is undefined', () => {
    const { container } = render(<SSNReviewField />);

    const valueNode = container.querySelector('dd');
    expect(valueNode.textContent).to.equal('');
  });
});
