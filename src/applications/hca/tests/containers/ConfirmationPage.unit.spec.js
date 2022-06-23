import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ConfirmationPage from '../../containers/ConfirmationPage';

describe('HCA ConfirmationPage', () => {
  const initState = {
    form: {
      submission: false,
      data: {
        veteranFullName: {
          first: 'Jack',
          middle: 'William',
          last: 'Smith',
        },
      },
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        userFullName: {
          first: 'John',
          middle: 'Marjorie',
          last: 'Smith',
          suffix: 'Sr.',
        },
      },
    },
  };
  const middleware = [];
  const mockStore = configureStore(middleware);

  it('should render', () => {
    const store = mockStore(initState);
    const view = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(view.container.querySelector('.hca-confirmation-page')).to.exist;
    expect(
      view.container.querySelector('.schemaform-confirmation-claim-header'),
    ).to.contain.text('Thank you for submitting your application');
    expect(
      view.container.querySelectorAll('.confirmation-guidance-message').length,
    ).to.equal(3);
  });

  it('should render without response properties', () => {
    const store = mockStore(initState);
    const view = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(view.container.querySelector('.hca-claim-list')).to.not.exist;
  });

  it('should render with response properties', () => {
    const mockFormData = {
      submission: {
        response: {
          timestamp: '2010-01-01',
          formSubmissionId: '3702390024',
        },
      },
    };
    const store = mockStore({
      ...initState,
      form: { ...initState.form, ...mockFormData },
    });
    const view = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(view.container.querySelector('.hca-claim-list')).to.exist;
    expect(
      view.container.querySelector('.hca-claim-list > dd'),
    ).to.contain.text('Jan. 1, 2010');
  });

  it('should render veteran’s name from form data', () => {
    const store = mockStore(initState);
    const view = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(
      view.container.querySelector('.hca-veteran-fullname'),
    ).to.contain.text('Jack William Smith');
  });

  it('should render veteran’s name from profile', () => {
    const store = mockStore({
      ...initState,
      user: {
        ...initState.user,
        login: { currentlyLoggedIn: true },
      },
    });
    const view = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(
      view.container.querySelector('.hca-veteran-fullname'),
    ).to.contain.text('John Marjorie Smith Sr.');
  });
});
