import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import ConfirmationPage from '../../../containers/ConfirmationPage';

describe('hca ConfirmationPage', () => {
  const getData = ({ submission = {}, loggedIn = false }) => ({
    mockStore: {
      getState: () => ({
        form: {
          submission,
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
            currentlyLoggedIn: loggedIn,
          },
          profile: {
            userFullName: {
              first: 'John',
              middle: 'William',
              last: 'Smith',
              suffix: 'Sr.',
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when the page renders', () => {
    it('should render success alert & guidance messages', () => {
      const { mockStore } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
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

  context('when the submission is parsed', () => {
    context('when there is no response data', () => {
      it('should not render the application date container', () => {
        const { mockStore } = getData({});
        const { container } = render(
          <Provider store={mockStore}>
            <ConfirmationPage />
          </Provider>,
        );
        const selector = container.querySelector('.hca-application-date');
        expect(selector).to.not.exist;
      });
    });

    context('when there is response data', () => {
      it('should not render the application date container', () => {
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
        const selector = container.querySelector('.hca-application-date');
        expect(selector).to.exist;
        expect(selector).to.contain.text('Jan. 1, 2010');
      });
    });
  });

  context('when the form data is parsed', () => {
    context('when the user is not logged in', () => {
      it('should render Veteran’s name from form data', () => {
        const { mockStore } = getData({});
        const { container } = render(
          <Provider store={mockStore}>
            <ConfirmationPage />
          </Provider>,
        );
        const selector = container.querySelector('.hca-veteran-fullname');
        expect(selector).to.contain.text('Jack William Smith');
      });
    });

    context('when the user is logged in', () => {
      it('should render Veteran’s name from profile', () => {
        const { mockStore } = getData({ loggedIn: true });
        const { container } = render(
          <Provider store={mockStore}>
            <ConfirmationPage />
          </Provider>,
        );
        const selector = container.querySelector('.hca-veteran-fullname');
        expect(selector).to.contain.text('John William Smith Sr.');
      });
    });
  });
});
