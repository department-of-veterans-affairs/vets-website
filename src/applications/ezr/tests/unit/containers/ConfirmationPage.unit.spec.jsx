import React from 'react';
import { expect } from 'chai';
import { utcToZonedTime } from 'date-fns-tz';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import content from '../../../locales/en/content.json';

describe('ezr ConfirmationPage', () => {
  const subject = (response = undefined) => {
    const mockStore = {
      getState: () => ({
        form: {
          data: {
            'view:veteranInformation': {
              veteranFullName: {
                first: 'John',
                middle: 'David',
                last: 'Smith',
              },
              veteranDateOfBirth: '1990-01-01',
              gender: 'M',
            },
          },
          submission: {
            response,
          },
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
    };
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );
    const selectors = () => ({
      page: container.querySelector('.ezr-confirmation-page'),
      screenView: container.querySelector('.ezr-confirmation--screen'),
      printView: container.querySelector('.ezr-confirmation--print'),
      alert: container.querySelector('.ezr-success-message'),
      veteranName: container.querySelector('.ezr-veteran-fullname'),
      applicationDate: container.querySelector('.ezr-submission-date'),
    });
    return { selectors };
  };

  context('when the page renders', () => {
    it('should render success alert', () => {
      const { selectors } = subject();
      const { page, alert } = selectors();
      expect(page).to.not.be.empty;
      expect(alert).to.contain.text(content['confirm-success-title']);
    });

    it("should render Veteran's name from profile", () => {
      const { selectors } = subject();
      const { veteranName } = selectors();
      expect(veteranName).to.contain.text('John David Smith');
    });
  });

  context('when the submission is parsed', () => {
    context('when there is no response data', () => {
      it('should not render the application date container', () => {
        const { selectors } = subject();
        const { applicationDate } = selectors();
        expect(applicationDate).to.not.exist;
      });
    });

    context('when there is response data', () => {
      it('should render the application date container', () => {
        const { selectors } = subject({
          timestamp: utcToZonedTime(1262322000000, 'UTC'),
          formSubmissionId: '3702390024',
        });
        const { applicationDate } = selectors();
        expect(applicationDate).to.exist;
        expect(applicationDate).to.contain.text('Jan. 1, 2010');
      });
    });
  });
});
