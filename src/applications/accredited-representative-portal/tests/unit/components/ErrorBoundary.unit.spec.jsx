import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../../../components/ErrorBoundary';

describe('ErrorBoundary', () => {
  const getErrorBoundary = () =>
    render(
      <BrowserRouter>
        <ErrorBoundary />
      </BrowserRouter>,
    );

  it('renders error message', () => {
    const { getByTestId } = getErrorBoundary();
    expect(getByTestId('error-message')).to.exist;
  });
});
