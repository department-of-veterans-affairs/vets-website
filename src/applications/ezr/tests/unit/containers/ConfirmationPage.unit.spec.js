import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ConfirmationPage from '../../../containers/ConfirmationPage';
import content from '../../../locales/en/content.json';

describe('ezr ConfirmationPage', () => {
  const initState = {
    form: {
      submission: false,
    },
    user: {
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
    it('should render success alert', () => {
      const store = mockStore(initState);
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage />
        </Provider>,
      );
      const selectors = {
        page: container.querySelector('.ezr-confirmation-page'),
        alert: container.querySelector('.ezr-success-message'),
      };
      expect(selectors.page).to.not.be.empty;
      expect(selectors.alert).to.contain.text(content['confirm-page-title']);
    });

    it('should render Veteran’s name from profile', () => {
      const store = mockStore(initState);
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage />
        </Provider>,
      );
      const selector = container.querySelector('.ezr-veteran-fullname');
      expect(selector).to.contain.text('John Marjorie Smith Sr.');
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
        const selector = container.querySelector('.ezr-application-date');
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
        const selector = container.querySelector('.ezr-application-date');
        expect(selector).to.exist;
        expect(selector).to.contain.text('Jan. 1, 2010');
      });
    });
  });
});
