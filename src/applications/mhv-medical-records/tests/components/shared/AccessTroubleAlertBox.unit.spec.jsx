import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import AccessTroubleAlertBox from '../../../components/shared/AccessTroubleAlertBox';
import { ALERT_TYPE_ERROR } from '../../../util/constants';

describe('AccessTroubleAlertBox', () => {
  const initialState = {
    mr: {
      alerts: {
        alertVisible: true,
        alertList: [
          {
            datestamp: '2022-10-07T19:25:32.832Z',
            isActive: true,
            alertType: ALERT_TYPE_ERROR,
          },
        ],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderInReduxProvider(<AccessTroubleAlertBox />, {
      initialState,
      reducers: reducer,
    });
  });

  it('should display a header message', () => {
    expect(
      screen.findByText('We are having trouble accessing your records', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });

  it('should display a paragraph containing additional info', () => {
    expect(
      screen.findByText(
        'We’re sorry. Something went wrong when we tried to access your records.',
        {
          exact: false,
          selector: 'p',
        },
      ),
    ).to.exist;
  });
});
