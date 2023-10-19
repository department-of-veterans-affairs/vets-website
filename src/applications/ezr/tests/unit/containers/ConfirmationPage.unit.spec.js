import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import ConfirmationPage from '../../../containers/ConfirmationPage';
import content from '../../../locales/en/content.json';

describe('ezr ConfirmationPage', () => {
  const getData = ({ submission = {} }) => ({
    mockStore: {
      getState: () => ({
        form: {
          submission,
        },
        user: {
          profile: {
            userFullName: {
              first: 'John',
              middle: 'David',
              last: 'Smith',
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when the page renders', () => {
    it('should render success alert', () => {
      const { mockStore } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage />
        </Provider>,
      );
      const selectors = {
        page: container.querySelector('.ezr-confirmation-page'),
        alert: container.querySelector('.ezr-success-message'),
      };
      expect(selectors.page).to.not.be.empty;
      expect(selectors.alert).to.contain.text(content['confirm-success-title']);
    });

    it('should render Veteran’s name from profile', () => {
      const { mockStore } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage />
        </Provider>,
      );
      const selector = container.querySelector('.ezr-veteran-fullname');
      expect(selector).to.contain.text('John David Smith');
    });
  });

  context('when the submission is parsed', () => {
    context('when there is no response data', () => {
      it('should not render the application date container', () => {
        const { mockStore } = getData({});
        const { container } = render(
          <Provider store={mockStore}>
            <ConfirmationPage />
          </Provider>,
        );
        const selector = container.querySelector('.ezr-application-date');
        expect(selector).to.not.exist;
      });
    });

    context('when there is response data', () => {
      it('should render the application date container', () => {
        const { mockStore } = getData({
          submission: {
            response: {
              timestamp: '2010-01-01',
              formSubmissionId: '3702390024',
            },
          },
        });
        const { container } = render(
          <Provider store={mockStore}>
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
