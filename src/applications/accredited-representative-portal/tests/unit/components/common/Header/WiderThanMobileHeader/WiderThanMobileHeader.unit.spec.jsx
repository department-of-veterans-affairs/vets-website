import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import WiderThanMobileLogoRow from '../../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileLogoRow';
import { TestApp } from '../../../../helpers';

function renderTestApp({ initAction } = {}) {
  return render(
    <TestApp initAction={initAction}>
      <WiderThanMobileLogoRow />
    </TestApp>,
  );
}

describe('WiderThanMobileLogoRow', () => {
  it('renders logo', () => {
    const { getByTestId } = renderTestApp();
    expect(getByTestId('wider-than-mobile-logo-row-logo')).to.exist;
  });

  it('renders sign in link', () => {
    const { getByTestId } = renderTestApp();
    expect(
      getByTestId('user-nav-wider-than-mobile-sign-in-link').textContent,
    ).to.eq('Sign in');
  });
});
