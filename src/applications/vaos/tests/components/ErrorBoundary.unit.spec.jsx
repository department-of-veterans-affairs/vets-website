import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ErrorBoundary from '../../components/ErrorBoundary';

describe('VAOS <ErrorBoundary>', () => {
  it('should render error message when there is an error', async () => {
    const ComponentWithError = () => {
      throw new Error('Something bad');
    };
    const screen = render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>,
    );

    expect(await screen.findByText(/Something went wrong on our end/)).to.exist;
  });

  it('should render children when no error', async () => {
    const ComponentWithoutError = () => {
      return <>Child content</>;
    };
    const screen = render(
      <ErrorBoundary>
        <ComponentWithoutError />
      </ErrorBoundary>,
    );

    expect(await screen.findByText(/Child content/)).to.exist;
  });
});
