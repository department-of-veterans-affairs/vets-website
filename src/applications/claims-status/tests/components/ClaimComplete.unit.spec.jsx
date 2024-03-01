import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimComplete from '../../components/ClaimComplete';

describe('<ClaimComplete>', () => {
  it('should render message', () => {
    const date = '2010-09-01';
    const { container, getByText } = render(
      <ClaimComplete completedDate={date} />,
    );
    const paymentsSection = $('.payments-container', container);
    expect(paymentsSection).to.exist;

    const text1 =
      'We mailed you a decision letter. It should arrive within 10 days after the date we decided your claim. It can sometimes take longer.';
    expect(getByText('We decided your claim on September 1, 2010')).to.exist;
    expect(getByText(text1)).to.exist;
  });
});
