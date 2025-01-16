import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ErrorBoundary from '../../../components/ErrorBoundary';

describe('ErrorBoundary', () => {
  const getErrorBoundary = () => render(<ErrorBoundary />);

  it('renders error message', () => {
    const { getByTestId } = getErrorBoundary();
    expect(getByTestId('error-message')).to.exist;
  });
});
