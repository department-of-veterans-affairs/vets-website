import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import AppContent from '../../components/AppContent';

describe('<AppContent>', () => {
  it('should render children if data available', () => {
    const screen = render(
      <AppContent isDataAvailable>
        <div data-testid="children" />
      </AppContent>,
    );

    expect(screen.queryByTestId('children')).to.exist;
  });

  it('should display error message if data is not available', () => {
    const screen = render(
      <AppContent isDataAvailable={false}>
        <div data-testid="children" />
      </AppContent>,
    );

    const errorMessage = screen.queryByText('able to find information', {
      exact: false,
    });
    expect(errorMessage).to.exist;
    expect(screen.queryByTestId('children')).to.not.exist;
  });

  it('should render loading indicator if feature toggles are not available', () => {
    const screen = render(
      <AppContent featureFlagsLoading>
        <div data-testid="children" />
      </AppContent>,
    );

    expect(screen.getByTestId('feature-flags-loading')).to.exist;
    expect(screen.queryByTestId('children')).to.not.exist;
  });

  it('should render children if feature toggles are available', () => {
    const screen = render(
      <AppContent featureFlagsLoading={false}>
        <div data-testid="children" />
      </AppContent>,
    );

    expect(screen.queryByTestId('feature-flags-loading')).to.not.exist;
    expect(screen.queryByTestId('children')).to.exist;
  });
});
