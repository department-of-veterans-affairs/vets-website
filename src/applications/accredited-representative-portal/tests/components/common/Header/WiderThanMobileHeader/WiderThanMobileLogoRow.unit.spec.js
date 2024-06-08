import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import WiderThanMobileLogoRow from '../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileLogoRow';

const mockStore = configureStore([]);

const renderWiderThanMobileLogoRow = (isLoading, profile) => {
  const store = mockStore({
    user: {
      isLoading,
      profile,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <WiderThanMobileLogoRow />
      </MemoryRouter>
    </Provider>,
  );
};

describe('WiderThanMobileLogoRow', () => {
  it('renders the logo with correct attributes', () => {
    const { getByTestId } = renderWiderThanMobileLogoRow(false, null);

    const logoImg = getByTestId('wider-than-mobile-logo-row-logo');
    expect(logoImg.src).to.include('/img/arp-header-logo.png');
    expect(logoImg.alt).to.eq(
      'VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs',
    );
  });

  it('renders the contact us link with correct href', () => {
    const { getByTestId } = renderWiderThanMobileLogoRow(false, null);

    const contactLink = getByTestId(
      'wider-than-mobile-logo-row-contact-us-link',
    );
    expect(contactLink.href).to.eq('https://www.va.gov/contact-us/');
    expect(contactLink.textContent).to.eq('Contact us');
  });

  it('renders UserNav and displays sign-in link when no profile exists', () => {
    const { getByTestId } = renderWiderThanMobileLogoRow(false, null);

    const signInLink = getByTestId('user-nav-wider-than-mobile-sign-in-link');
    expect(signInLink.textContent).to.eq('Sign in');
  });
});
