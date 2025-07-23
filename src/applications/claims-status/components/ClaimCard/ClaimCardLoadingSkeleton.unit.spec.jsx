import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ClaimCardLoadingSkeleton from './ClaimCardLoadingSkeleton';

describe('ClaimCardLoadingSkeleton', () => {
  it('should render loading skeleton when isLoading is true', () => {
    const { getByTestId } = render(<ClaimCardLoadingSkeleton />);
    const skeleton = getByTestId('claim-card-loading-skeleton');
    expect(skeleton).to.exist;
    expect(skeleton.getAttribute('aria-busy')).to.equal('true');
    expect(skeleton.querySelectorAll('.loading-skeleton--row').length).to.equal(
      7,
    );
  });

  it('should render empty when isLoading is false', () => {
    const { getByTestId } = render(
      <ClaimCardLoadingSkeleton isLoading={false} />,
    );
    const skeleton = getByTestId('claim-card-loading-skeleton');
    expect(skeleton).to.exist;
    expect(skeleton.getAttribute('aria-busy')).to.equal('false');
    // Check that no skeleton rows are rendered
    expect(skeleton.querySelectorAll('.loading-skeleton--row').length).to.equal(
      0,
    );
  });

  it('should have correct screen reader labels when loading', () => {
    const { getByTestId } = render(<ClaimCardLoadingSkeleton />);
    const srText = getByTestId('claim-card-loading-skeleton-sr-text');
    expect(srText.textContent).to.equal('Loading your claims and appeals…');
  });

  it('should have correct screen reader labels when loaded', () => {
    const { getByTestId } = render(
      <ClaimCardLoadingSkeleton isLoading={false} />,
    );
    const srText = getByTestId('claim-card-loading-skeleton-sr-text');
    expect(srText.textContent).to.equal('Claims and appeals have loaded');
  });
});
