import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ErrorComponent from '../../../containers/Error';

describe('<Error/> component', () => {
  const errorString = 'This is an error message';
  const errorDisplayed = `Error: ${errorString}`;

  it('renders the error message when error is a string', () => {
    const { getByText } = render(<ErrorComponent error={errorString} />);
    expect(getByText(errorDisplayed)).to.exist;
  });

  it('renders the error message when error is an object', () => {
    const errorObject = new Error(errorString);
    const { getByText } = render(<ErrorComponent error={errorObject} />);
    expect(getByText(errorDisplayed)).to.exist;
  });
});
