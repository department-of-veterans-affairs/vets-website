import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import IDPage from '../../containers/IDPage';

describe('hca IDPage', () => {
  const mockStore = {
    getState: () => ({
      hcaEnrollmentStatus: {
        enrollmentStatus: '',
        isLoading: false,
        isUserInMVI: false,
        loginRequired: false,
        noESRRecordFound: false,
        hasServerError: false,
      },
      user: {
        login: {},
      },
    }),
    subscribe: () => {},
  };

  let view;
  beforeEach(() => {
    view = render(
      <Provider store={mockStore}>
        <IDPage />
      </Provider>,
    );
  });

  it('should render', () => {
    expect(
      view.container.querySelector('[data-testid="form-title"]'),
    ).to.contain.text(
      'We need some information before you can start your application',
    );
    expect(view.container.querySelector('form')).to.exist;
  });

  it('should show button to Sign in to start your application', () => {
    expect(
      view.container.querySelector('[data-testid="idform-login-button"]'),
    ).to.contain.text('Sign in to start your application.');
  });

  it('should show button to Continue to the application', () => {
    expect(
      view.container.querySelector('.idform-submit-button'),
    ).to.contain.text('Continue to the application');
  });
});
