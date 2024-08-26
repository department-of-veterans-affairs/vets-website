import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ErrorMessage from '../../../components/common/ErrorMessage';

describe('ErrorMessage', () => {
  const getErrorMessage = () => render(<ErrorMessage />);

  it('renders error message', () => {
    const { getByTestId } = getErrorMessage();
    expect(getByTestId('error-message')).to.exist;
  });
});
