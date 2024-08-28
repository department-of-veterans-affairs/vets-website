import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import createReduxStore from '../../../../../store';

import WiderThanMobileLogoRow from '../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileLogoRow';
import { TestAppContainer } from '../../../../helpers';

function renderTestApp({ initAction } = {}) {
  const store = createReduxStore();
  if (initAction) store.dispatch(initAction);

  return render(
    <TestAppContainer store={store}>
      <WiderThanMobileLogoRow />
    </TestAppContainer>,
  );
}

describe('WiderThanMobileLogoRow', () => {
  it('renders logo', () => {
    const { getByTestId } = renderTestApp();
    expect(getByTestId('wider-than-mobile-logo-row-logo')).to.exist;
  });

  it('renders contact us link', () => {
    const { getByTestId } = renderTestApp();
    expect(
      getByTestId('wider-than-mobile-logo-row-contact-us-link').textContent,
    ).to.eq('Contact us');
  });

  it('renders sign in link', () => {
    const { getByTestId } = renderTestApp();
    expect(
      getByTestId('user-nav-wider-than-mobile-sign-in-link').textContent,
    ).to.eq('Sign in');
  });
});
