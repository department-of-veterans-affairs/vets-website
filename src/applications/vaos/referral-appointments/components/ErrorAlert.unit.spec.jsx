import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ErrorAlert from './ErrorAlert';

describe('VAOS Component: ErrorAlert', () => {
  it('should render the error alert with the default body', () => {
    const screen = render(<ErrorAlert />);

    expect(screen.getByTestId('error')).to.exist;
    expect(screen.getByTestId('error-body')).to.exist;
    expect(screen.getByTestId('error-body').textContent).to.equal(
      'Something went wrong on our end. Please try again later.',
    );
  });

  it('should render the error alert with a custom body', () => {
    const screen = render(<ErrorAlert body="I'm a custom error body" />);

    expect(screen.getByTestId('error')).to.exist;
    expect(screen.getByTestId('error-body')).to.exist;
    expect(screen.getByTestId('error-body').textContent).to.equal(
      "I'm a custom error body",
    );
  });

  it('should render the error alert with the find community care office link', () => {
    const screen = render(<ErrorAlert showFindCCFacilityLink />);

    expect(screen.getByTestId('error')).to.exist;
    expect(screen.getByTestId('referral-community-care-office')).to.exist;
  });
});
