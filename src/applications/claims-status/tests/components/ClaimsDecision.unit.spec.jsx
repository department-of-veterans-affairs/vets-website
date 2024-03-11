import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimsDecision from '../../components/ClaimsDecision';

describe('<ClaimsDecision>', () => {
  it('should render message without date sentence', () => {
    const date = null;
    const { container, queryByText } = render(
      <ClaimsDecision completedDate={date} />,
    );
    const nextStepsSection = $('.next-steps-container', container);
    expect(nextStepsSection).to.exist;
    expect(queryByText('We decided your claim on')).not.to.exist;
  });

  it('should render message with date sentence', () => {
    const date = '2010-03-01';
    const { container, queryByText } = render(
      <ClaimsDecision completedDate={date} />,
    );
    const nextStepsSection = $('.next-steps-container', container);
    expect(nextStepsSection).to.exist;
    expect(queryByText('We decided your claim on March 1, 2010')).to.exist;
  });

  it('should render a link to the claim letters page', () => {
    const { container, getByText } = render(
      <ClaimsDecision showClaimLettersLink />,
    );
    const nextStepsSection = $('.next-steps-container', container);
    expect(nextStepsSection).to.exist;
    getByText('Get your claim letters');
  });

  it('should not render a link to the claim letters page', () => {
    const { container, queryByText } = render(<ClaimsDecision />);
    const nextStepsSection = $('.next-steps-container', container);
    expect(nextStepsSection).to.exist;
    expect(queryByText('Get your claim letters')).to.not.exist;
  });
});
