import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FeatureFlagsLoaded from '../../components/FeatureFlagsLoaded';

describe('<FeatureFlagsLoaded />', () => {
  it('should render loading indicator if feature toggles are not available', () => {
    const screen = render(
      <FeatureFlagsLoaded featureFlagsLoading>
        <div data-testid="children" />
      </FeatureFlagsLoaded>,
    );

    expect(screen.getByTestId('feature-flags-loading')).to.exist;
    expect(screen.queryByTestId('children')).to.not.exist;
  });

  it('should render children if feature toggles are available', () => {
    const screen = render(
      <FeatureFlagsLoaded featureFlagsLoading={false}>
        <div data-testid="children" />
      </FeatureFlagsLoaded>,
    );

    expect(screen.queryByTestId('feature-flags-loading')).to.not.exist;
    expect(screen.queryByTestId('children')).to.exist;
  });
});
