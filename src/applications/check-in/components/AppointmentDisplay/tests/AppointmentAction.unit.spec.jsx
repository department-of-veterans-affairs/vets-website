import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import MockDate from 'mockdate';
import AppointmentAction from '../AppointmentAction';
import i18n from '../../../utils/i18n/i18n';

import { ELIGIBILITY } from '../../../utils/appointment/eligibility';

describe('check-in', () => {
  afterEach(() => {
    MockDate.reset();
  });

  describe('AppointmentAction', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: 'test-token',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          },
        },
      };
      store = mockStore(initState);
    });

    it('should render the check in button for ELIGIBLE appointments status', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.ELIGIBLE,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      expect(action.getByTestId('check-in-button')).to.have.text(
        'Check in now',
      );
    });

    it('should render the check in button for appointments with ELIGIBLE status that expire in more than 10 seconds', () => {
      MockDate.set('2018-01-01T12:14:49-04:00');
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                checkInWindowEnd: '2018-01-01T12:15:00-04:00',
                eligibility: ELIGIBILITY.ELIGIBLE,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      expect(action.getByTestId('check-in-button')).to.have.text(
        'Check in now',
      );
    });
    it('should render the check in button for appointments with ELIGIBLE status in an earlier timezone', () => {
      MockDate.set('2018-01-01T13:25:00-04:00');
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                checkInWindowEnd: '2018-01-01T12:45:00.106-05:00',
                eligibility: ELIGIBILITY.ELIGIBLE,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      expect(action.getByTestId('check-in-button')).to.have.text(
        'Check in now',
      );
    });
  });
});
