import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import createReduxStore from '../../../../../store';

import MobileLogoRow from '../../../../../components/common/Header/MobileHeader/MobileLogoRow';
import { TestAppContainer } from '../../../../helpers';

function renderTestApp({ initAction } = {}) {
  const store = createReduxStore();
  if (initAction) store.dispatch(initAction);

  return render(
    <TestAppContainer store={store}>
      <MobileLogoRow />
    </TestAppContainer>,
  );
}

describe('MobileLogoRow', () => {
  it('should render the logo with correct alt text and source', () => {
    const { getByTestId } = renderTestApp();
    const logo = getByTestId('mobile-logo-row-logo');
    expect(logo).to.exist;
    expect(logo.alt).to.eq(
      'VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs',
    );
    expect(logo.src).to.include('/img/arp-header-logo.png');
  });

  it('should have a link that navigates to the home page', () => {
    const { getByTestId } = renderTestApp();
    const link = getByTestId('mobile-logo-row-logo-link');
    expect(link.href).to.eq('http://localhost/representative');
  });

  it('should render a menu button', () => {
    const { getByTestId } = renderTestApp();
    const button = getByTestId('mobile-logo-row-menu-button');
    expect(button.textContent).to.eq('Menu');
  });

  it('should include an icon inside the menu button', () => {
    const { getByTestId } = renderTestApp();
    const button = getByTestId('mobile-logo-row-menu-button');
    const icon = button.querySelector('va-icon');
    expect(icon).to.exist;
  });
});
