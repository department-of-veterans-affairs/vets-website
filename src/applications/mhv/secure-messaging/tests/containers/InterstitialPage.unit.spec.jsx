import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import InterstitialPage from '../../containers/InterstitialPage';
import { getByBrokenText } from '../../util/testUtils';

describe('Interstitial page header', () => {
  it('renders without errors', async () => {
    render(<InterstitialPage />);

    expect(
      getByBrokenText(
        'If you’re in crisis or having thoughts of suicide, ',
        document.querySelector('.interstitial-page'),
      ),
    ).to.exist;
    expect(
      document.querySelector('[text="Connect with the Veterans Crisis Line"]'),
    ).to.exist;
  });
});
