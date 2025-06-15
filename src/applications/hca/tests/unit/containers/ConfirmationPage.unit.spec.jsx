import { render } from '@testing-library/react';
import { expect } from 'chai';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import React from 'react';
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
  const subject = ({ mockStore }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );
    const selectors = () => ({
      page: container.querySelector('.hca-confirmation-page'),
      alert: container.querySelector('.hca-success-message'),
      summary: container.querySelector('va-summary-box'),
      veteranName: container.querySelector('.hca-veteran-fullname'),
      applicationDate: container.querySelector('.hca-application-date'),
    });
    return { container, selectors };
  };

  it('should render success alert & application summary when the page renders', () => {
    const { mockStore } = getData({});
    const { selectors } = subject({ mockStore });
    const { alert, page, summary } = selectors();
    expect(page).to.not.be.empty;
    expect(summary).to.exist;
    expect(alert).to.exist;
  });

  it('should not render application date container when there is no response data', () => {
    const { mockStore } = getData({});
    const { selectors } = subject({ mockStore });
    const { applicationDate } = selectors();
    expect(applicationDate).to.not.exist;
  });

  it('should render application date container when there is response data', () => {
    const timestamp = utcToZonedTime(1262322000000, 'UTC');
    const { mockStore } = getData({
      submission: {
        response: {
          timestamp,
          formSubmissionId: '3702390024',
        },
      },
    });
    const { selectors } = subject({ mockStore });
    const { applicationDate } = selectors();
    const expectedResult = format(timestamp, 'MMM. d, yyyy');
    expect(applicationDate).to.exist;
    expect(applicationDate).to.contain.text(expectedResult);
  });

  it('should render Veteran’s name from form data when not logged in', () => {
    const { mockStore } = getData({});
    const { selectors } = subject({ mockStore });
    const { veteranName } = selectors();
    expect(veteranName).to.contain.text('Jack William Smith');
  });

  it('should render Veteran’s name from profile data when logged in', () => {
    const { mockStore } = getData({ loggedIn: true });
    const { selectors } = subject({ mockStore });
    const { veteranName } = selectors();
    expect(veteranName).to.contain.text('John William Smith Sr.');
  });
});
