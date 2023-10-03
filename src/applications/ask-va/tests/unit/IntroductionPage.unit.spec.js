import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import IntroductionPage from '../../containers/IntroductionPage';

import { getData } from '../fixtures/data/mock-form-data';

describe('IntroductionPage', () => {
  it('should render', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h1', container).textContent).to.eq('Ask VA');
    expect($$('h2', container)[1].textContent).to.eq(
      'Hello, follow the steps below to apply for ask the va test.',
    );
    expect($('button', container).textContent).to.eq(
      'Sign in to start your application',
    );
  });

  it('should render with user first name', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h2', container).textContent).to.eq(
      'Peter, follow the steps below to apply for ask the va test.',
    );
  });
});
