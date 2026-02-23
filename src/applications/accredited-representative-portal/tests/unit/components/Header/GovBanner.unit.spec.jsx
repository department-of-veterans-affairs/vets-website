import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import GovBanner from '~/platform/site-wide/representative/components/header/GovBanner';

describe('GovBanner', () => {
  it('renders toggle text on mobile', () => {
    const { getByTestId } = render(<GovBanner />);
    expect(getByTestId('official-govt-site-text').textContent).to.eq(
      'An official website of the United States government.',
    );
  });

  it('renders proper aria tag on click', () => {
    const { getByTestId } = render(<GovBanner />);
    fireEvent.click(getByTestId('official-govt-site-toggle'));
    expect(
      getByTestId('official-govt-site-content').getAttribute('aria-hidden'),
    ).to.eq('false');
  });
});
