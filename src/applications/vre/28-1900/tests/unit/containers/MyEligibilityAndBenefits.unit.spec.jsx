import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MyEligibilityAndBenefits from '../../../containers/MyEligibilityAndBenefits';

describe('CheckEligibilityAndApply', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<MyEligibilityAndBenefits />);

    expect(getByText('Check your eligibility and apply')).to.exist;
  });
});
