import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { addDays, subDays, format } from 'date-fns';
import i18n from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import Wrapper from '../Wrapper';

describe('Wrapper component', () => {
  it('renders the passed in page title and child', () => {
    const { getByText, getByTestId } = render(
      <CheckInProvider store={{ app: 'PreCheckIn' }}>
        <Wrapper pageTitle="Test Title" eyebrow="Check-In">
          <p>test body</p>
        </Wrapper>
      </CheckInProvider>,
    );
    expect(getByTestId('header')).to.contain.text('Check-In Test Title');
    expect(getByText('test body')).to.exist;
  });
  it('renders the downtime component', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initState = {
      checkInData: {
        app: 'PreCheckIn',
        form: {
          pages: [],
        },
      },
    };
    const downDowntimeState = {
      scheduledDowntime: {
        globalDowntime: {
          attributes: {
            externalService: 'pcie',
            startTime: format(subDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
            endTime: format(addDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
          },
        },
        isReady: true,
        isPending: false,
        serviceMap: {
          get() {},
        },
        dismissedDowntimeWarnings: [],
      },
    };
    const downTimeStore = mockStore({ ...downDowntimeState, ...initState });
    const { getByText } = render(
      <Provider store={downTimeStore}>
        <I18nextProvider i18n={i18n}>
          <Wrapper pageTitle="Test Title">
            <p>test body</p>
          </Wrapper>
        </I18nextProvider>
      </Provider>,
    );
    expect(getByText('Test Title')).to.exist;
    expect(getByText('This tool is down for maintenance')).to.exist;
  });
});
