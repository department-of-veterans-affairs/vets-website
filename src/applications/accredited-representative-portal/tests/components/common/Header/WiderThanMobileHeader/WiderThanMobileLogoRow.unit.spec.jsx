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
  it('renders the logo with correct attributes', () => {
    const { getByTestId } = renderTestApp();

    const logoImg = getByTestId('wider-than-mobile-logo-row-logo');
    expect(logoImg.src).to.include('/img/arp-header-logo.png');
    expect(logoImg.alt).to.eq(
      'VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs',
    );
  });

  it('renders the contact us link with correct href', () => {
    const { getByTestId } = renderTestApp();

    const contactLink = getByTestId(
      'wider-than-mobile-logo-row-contact-us-link',
    );
    expect(contactLink.href).to.eq('https://www.va.gov/contact-us/');
    expect(contactLink.textContent).to.eq('Contact us');
  });

  it('renders UserNav and displays sign-in link when no profile exists', () => {
    const { getByTestId } = renderTestApp();

    const signInLink = getByTestId('user-nav-wider-than-mobile-sign-in-link');
    expect(signInLink.textContent).to.eq('Sign in');
  });
});
