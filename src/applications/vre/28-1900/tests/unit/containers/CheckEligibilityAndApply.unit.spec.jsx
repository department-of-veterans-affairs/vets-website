import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import CheckEligibilityAndApply from '../../../containers/CheckEligibilityAndApply';

describe('CheckEligibilityAndApply', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<CheckEligibilityAndApply />);

    expect(getByText('Check your eligibility and apply')).to.exist;
  });
});
