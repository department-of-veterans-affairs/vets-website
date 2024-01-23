import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ErrorBoundary from '../../components/ErrorBoundary';

describe('ErrorBoundary component', () => {
  it('renders an error message when a child throws an error', async () => {
    const Component = () => {
      throw new Error('Error!');
    };

    const { findByText } = render(
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>,
    );

    expect(await findByText(/We can’t access My HealtheVet right now/)).to
      .exist;
  });

  it('renders children when no error', async () => {
    const Component = () => <>Your content, here.</>;

    const { findByText } = render(
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>,
    );

    expect(await findByText(/Your content, here/)).to.exist;
  });
});
