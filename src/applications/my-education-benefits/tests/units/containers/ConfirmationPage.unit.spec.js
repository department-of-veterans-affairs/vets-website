import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { expect } from 'chai';

import configureStore from 'redux-mock-store';
import responses from '../../../testing/responses';

import ConfirmationPage from '../../../../hca/containers/ConfirmationPage';

describe('Confirmation Page', () => {
  const profile = {
    vapContactInfo: {
      ...responses['GET /meb_api/v0/claimant_info']?.data?.attributes?.claimant,
    },
  };

  const middleware = [];
  const mockStore = configureStore(middleware);

  it('should render logged in users confirmation page', () => {
    const store = mockStore(profile);
    const view = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(view.container.querySelector('.js-test-location')).to.exist;

    return true;
  });
});
