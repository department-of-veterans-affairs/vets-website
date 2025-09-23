import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MyEligibilityAndBenefits from '../../../containers/MyEligibilityAndBenefits';

describe('MyEligibilityAndBenefits', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<MyEligibilityAndBenefits />);

    expect(getByText('My eligibility and benefits')).to.exist;
  });
});
