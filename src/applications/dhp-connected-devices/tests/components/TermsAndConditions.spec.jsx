import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import { TermsAndConditions } from '../../components/TermsAndConditions';

describe('Terms and Conditions', () => {
  const deviceNoTsAndCs = {
    name: 'Test Vendor',
    key: 'test-vendor',
  };

  const fitbitDevice = {
    name: 'Fitbit',
    key: 'fitbit',
  };

  it('Renders vendor terms and conditions', () => {
    const screen = render(<TermsAndConditions device={fitbitDevice} />);
    expect(screen.getByTestId('fitbit-terms-and-conditions')).to.exist;
    expect(screen.getByTestId('fitbit-terms-and-conditions-content')).to.exist;
    expect(
      screen.getByText('Sign into Fitbit and share your Fitbit data with VA'),
    ).to.exist;
    expect(screen.getByText('View Terms')).to.exist;
  });
  it('Only renders Ts and Cs for device in TermsAndConditionsContentMap', () => {
    const screen = render(<TermsAndConditions device={deviceNoTsAndCs} />);
    expect(screen.getByTestId('test-vendor-terms-and-conditions')).to.not.exist;
    expect(screen.getByTestId('test-vendor-terms-and-conditions-content')).to
      .not.exist;
  });
});
