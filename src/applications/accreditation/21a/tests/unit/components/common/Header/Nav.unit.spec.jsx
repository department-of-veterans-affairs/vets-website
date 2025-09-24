import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import sinon from 'sinon';

import Nav from '../../../../../components/common/Header/Nav';
import * as userSelectors from '../../../../../selectors/user';

const profile = {
  firstName: 'HECTOR',
  lastName: 'ALLEN',
  verified: true,
  signIn: {
    serviceName: 'idme',
  },
};

const rootReducer = combineReducers({
  featureToggles: (state = {}) => state,
  user: (state = {}) => state,
});

const getStore = () =>
  createStore(rootReducer, {
    user: { profile },
  });

describe('Nav', () => {
  let selectUserProfileStub;

  before(() => {
    selectUserProfileStub = sinon
      .stub(userSelectors, 'selectUserProfile')
      .callsFake(() => profile);
  });

  after(() => {
    selectUserProfileStub.restore();
  });

  it('should render the mobile logo with correct alt text and source', () => {
    const { getByTestId } = render(
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
    const { getByTestId } = render(
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
    const { getByTestId } = render(
      <Provider store={getStore()}>
        <Nav />
      </Provider>,
    );

    const link = getByTestId('nav-home-link');
    expect(link).to.exist;
  });
});
