import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import AlertBackgroundBox from '../../../components/shared/AlertBackgroundBox';
import { Alerts } from '../../../util/constants';

xdescribe('Alert Backround Box component', () => {
  it('ERROR alert should render without errors', () => {
    const initialState = {
      sm: {
        alerts: {
          alertVisible: true,
          alertList: [
            {
              datestamp: '2022-10-07T19:25:32.832Z',
              isActive: true,
              alertType: 'error',
              header: 'Error',
              content: 'Message was not successfully deleted.',
            },
          ],
        },
      },
    };
    const screen = renderInReduxProvider(
      <AlertBackgroundBox closeable visible />,
      { initialState, reducers: reducer },
    );

    expect(screen.findByText(Alerts.Message.DELETE_MESSAGE_ERROR));
  });
});
