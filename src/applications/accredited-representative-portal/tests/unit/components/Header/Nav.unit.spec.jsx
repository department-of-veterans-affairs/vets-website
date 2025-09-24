import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Nav from '../../../../components/Header/Nav';
import { renderTestComponent } from '../../helpers';

const getStore = () =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      accredited_representative_portal_custom_login: true,
    },
  }));
describe('Nav', () => {
  it('should render the mobile logo with correct alt text and source', () => {
    const { getByTestId } = renderTestComponent(
      <Provider store={getStore()}>
        <Nav />
      </Provider>,
    );
    const logo = getByTestId('mobile-logo');
    expect(logo).to.exist;
    expect(logo.alt).to.eq('Veteran Affairs');
    expect(logo.src).to.include('/img/va.svg');
  });

  it('should render the desktop logo with correct alt text and source', () => {
    const { getByTestId } = renderTestComponent(
      <Provider store={getStore()}>
        <Nav />
      </Provider>,
    );
    const logo = getByTestId('desktop-logo');
    expect(logo).to.exist;
    expect(logo.alt).to.eq(
      'VA Accredited Representative Portal, U.S. Department of Veterans Affairs',
    );
    expect(logo.src).to.include('/img/arp-header-logo-dark.svg');
  });

  it('should have a link that navigates to the home page', () => {
    const { getByTestId } = renderTestComponent(
      <Provider store={getStore()}>
        <Nav />
      </Provider>,
    );
    const link = getByTestId('nav-home-link');
    expect(link).to.exist;
  });
});
