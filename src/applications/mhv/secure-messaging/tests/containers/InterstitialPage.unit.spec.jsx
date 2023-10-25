import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import InterstitialPage from '../../containers/InterstitialPage';
import { getByBrokenText } from '../../util/testUtils';

describe('Interstitial page header', () => {
  it('renders without errors', async () => {
    const screen = render(<InterstitialPage />);

    expect(
      getByBrokenText(
        'If you’re in crisis or having thoughts of suicide, ',
        document.querySelector('.interstitial-page'),
      ),
    ).to.exist;

    expect(
      screen.getByText('Continue to start message').nextSibling.textContent,
    ).to.contain(
      'If you need help sooner, use one of these urgent communication options:',
    );
    expect(
      document.querySelector(
        'va-button[text="Connect with the Veterans Crisis Line"]',
      ),
    ).to.exist;
  });
});
