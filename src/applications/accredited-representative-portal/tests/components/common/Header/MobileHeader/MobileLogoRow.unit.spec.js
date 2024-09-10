import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import MobileLogoRow from '../../../../../components/common/Header/MobileHeader/MobileLogoRow';

const mockStore = configureStore([]);

const renderMobileLogoRow = (isLoading, profile) => {
  const store = mockStore({
    user: {
      isLoading,
      profile,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <MobileLogoRow />
      </MemoryRouter>
    </Provider>,
  );
};

describe('MobileLogoRow', () => {
  it('should render the logo with correct alt text and source', () => {
    const { getByTestId } = renderMobileLogoRow(false, null);
    const logo = getByTestId('mobile-logo-row-logo');
    expect(logo).to.exist;
    expect(logo.alt).to.eq(
      'VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs',
    );
    expect(logo.src).to.include('/img/arp-header-logo.png');
  });

  it('should have a link that navigates to the home page', () => {
    const { getByTestId } = renderMobileLogoRow(false, null);
    const link = getByTestId('mobile-logo-row-logo-link');
    expect(link).to.exist;
  });
});
