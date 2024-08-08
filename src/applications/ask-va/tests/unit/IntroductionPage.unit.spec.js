import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import IntroductionPage from '../../containers/IntroductionPage';

import { getData } from '../fixtures/data/mock-form-data';

describe('IntroductionPage', () => {
  xit('should render', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h1', container).textContent).to.eq('Ask VA');

    expect($('va-button', container).outerHTML).to.contain(
      'Sign in or create an account',
    );

    expect($$('h2', container)[1].textContent).to.eq(
      'Only use Ask VA for non-urgent needs',
    );
  });

  xit('should render Your questions when logged in', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h2', container).textContent).to.eq('Your questions');
  });
});
