import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import ErrorBoundary from '../../components/ErrorBoundary.tsx';

describe('ErrorBoundary component', () => {
  it('should render error message when there is an error', async () => {
    const ComponentWithError: React.FC = () => {
      throw new Error('Something bad');
    };
    const screen: RenderResult = render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>,
    );

    expect(
      await screen.findByText(
        /We can’t access your after-visit summary right now/,
      ),
    ).to.exist;
  });

  it('should render children when no error', async () => {
    const ComponentWithoutError: React.FC = () => {
      return <>Child content</>;
    };
    const screen: RenderResult = render(
      <ErrorBoundary>
        <ComponentWithoutError />
      </ErrorBoundary>,
    );

    expect(await screen.findByText(/Child content/)).to.exist;
  });
});