import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ConfirmationPage from '../../containers/ConfirmationPage';

describe('hca ConfirmationPage', () => {
  const initState = {
    form: {
      submission: false,
      data: {
        'view:veteranInformation': {
          veteranFullName: {
            first: 'Jack',
            middle: 'William',
            last: 'Smith',
          },
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

  describe('when the page renders', () => {
    it('should render success alert & guidance messages', () => {
      const store = mockStore(initState);
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage />
        </Provider>,
      );
      const selectors = {
        page: container.querySelector('.hca-confirmation-page'),
        alert: container.querySelector('.hca-success-message'),
        messages: container.querySelectorAll('.confirmation-guidance-message'),
      };
      expect(selectors.page).to.not.be.empty;
      expect(selectors.alert).to.contain.text(
        'Thank you for completing your application for health care',
      );
      expect(selectors.messages).to.have.lengthOf(3);
    });
  });

  describe('when the submission is parsed', () => {
    describe('when there is no response data', () => {
      it('should not render the application date container', () => {
        const store = mockStore(initState);
        const { container } = render(
          <Provider store={store}>
            <ConfirmationPage />
          </Provider>,
        );
        const selector = container.querySelector('.hca-application-date');
        expect(selector).to.not.exist;
      });
    });

    describe('when there is response data', () => {
      it('should not render the application date container', () => {
        const formData = {
          submission: {
            response: {
              timestamp: '2010-01-01',
              formSubmissionId: '3702390024',
            },
          },
        };
        const store = mockStore({
          ...initState,
          form: { ...initState.form, ...formData },
        });
        const { container } = render(
          <Provider store={store}>
            <ConfirmationPage />
          </Provider>,
        );
        const selector = container.querySelector('.hca-application-date');
        expect(selector).to.exist;
        expect(selector).to.contain.text('Jan. 1, 2010');
      });
    });
  });

  describe('when the form data is parsed', () => {
    describe('when the user is not logged in', () => {
      it('should render Veteran’s name from form data', () => {
        const store = mockStore(initState);
        const { container } = render(
          <Provider store={store}>
            <ConfirmationPage />
          </Provider>,
        );
        const selector = container.querySelector('.hca-veteran-fullname');
        expect(selector).to.contain.text('Jack William Smith');
      });
    });

    describe('when the user is logged in', () => {
      it('should render Veteran’s name from profile', () => {
        const store = mockStore({
          ...initState,
          user: {
            ...initState.user,
            login: { currentlyLoggedIn: true },
          },
        });
        const { container } = render(
          <Provider store={store}>
            <ConfirmationPage />
          </Provider>,
        );
        const selector = container.querySelector('.hca-veteran-fullname');
        expect(selector).to.contain.text('John Marjorie Smith Sr.');
      });
    });
  });
});
